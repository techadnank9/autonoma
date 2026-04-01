import sharp, { type Sharp } from "sharp";
import { getScreenshotConfig } from "./config";

export type Architecture = "web" | "mobile";

export type Point = {
    x: number;
    y: number;
};

export type BoundingBox = {
    x: number;
    y: number;
    width: number;
    height: number;
};

export function boundingBoxCenter(box: BoundingBox): { x: number; y: number } {
    return { x: box.x + box.width / 2, y: box.y + box.height / 2 };
}

export function boundingBoxContainsPoint(box: BoundingBox, point: { x: number; y: number }): boolean {
    return point.x >= box.x && point.x <= box.x + box.width && point.y >= box.y && point.y <= box.y + box.height;
}

export function boundingBoxContainsBoundingBox(largeBox: BoundingBox, smallBox: BoundingBox): boolean {
    return (
        smallBox.x >= largeBox.x &&
        smallBox.x + smallBox.width <= largeBox.x + largeBox.width &&
        smallBox.y >= largeBox.y &&
        smallBox.y + smallBox.height <= largeBox.y + largeBox.height
    );
}

export class SharpOperationFailedError extends Error {
    constructor(cause: Error) {
        super("Image processing operation failed", { cause });
    }
}

export async function drawBoundingBoxesOnImage(
    source: string,
    boxes: [BoundingBox, ...BoundingBox[]],
    labelled = false,
): Promise<string> {
    const baseImage = sharp(Buffer.from(source, "base64"));
    const resultSharp = await drawBoundingBoxesOnSharpImage(baseImage, boxes, labelled);
    const resultBuffer = await resultSharp.toBuffer();
    return resultBuffer.toString("base64");
}

const LABEL_RADIUS_TOLERANCE = 5;

function getLabelRadiusLimits(): { min: number; max: number } {
    const { architecture = "web" } = getScreenshotConfig();

    return architecture === "web" ? { min: 10, max: 20 } : { min: 20, max: 50 };
}

/**
 * Adjusts a bounding box to ensure its top-right label does not go out of bounds.
 * The function shrinks the box while keeping its center point constant.
 */
function adjustBoxForLabel(
    boundingBox: BoundingBox,
    labelRadius: number,
    { width: imageWidth }: { width: number; height: number },
): BoundingBox {
    let { x, y, width, height } = boundingBox;

    // Calculate the center, which must remain constant
    const centerX = x + width / 2;
    const centerY = y + height / 2;

    // 1. Check and correct for right boundary overflow
    const labelRightmostPoint = x + width + labelRadius;
    const allowedRightBoundary = imageWidth + LABEL_RADIUS_TOLERANCE;

    if (labelRightmostPoint > allowedRightBoundary) {
        const horizontalOverflow = labelRightmostPoint - allowedRightBoundary;
        // To keep the center, the width must be reduced by twice the overflow
        width -= 2 * horizontalOverflow;
        // Recalculate x based on the new width and original center
        x = centerX - width / 2;
    }

    // 2. Check and correct for top boundary overflow
    const labelTopmostPoint = y - labelRadius;
    const allowedTopBoundary = 0 - LABEL_RADIUS_TOLERANCE;

    if (labelTopmostPoint < allowedTopBoundary) {
        const verticalOverflow = allowedTopBoundary - labelTopmostPoint;
        // To keep the center, the height must be reduced by twice the overflow
        height -= 2 * verticalOverflow;
        // Recalculate y based on the new height and original center
        y = centerY - height / 2;
    }

    // Return the adjusted box, ensuring dimensions are not negative
    return {
        x,
        y,
        width: Math.max(0, width),
        height: Math.max(0, height),
    };
}

// An intermediate type to hold a box and its label information together
type LabelledBox = {
    box: BoundingBox;
    label: LabelInfo;
};

/**
 * Iterates through all pairs of labels and resolves significant overlaps.
 * When a collision is found, the box with the smaller area is shrunk to move its label away.
 */
function resolveLabelCollisions(labelledBoxes: LabelledBox[]): LabelledBox[] {
    // A single pass O(n^2) check is sufficient for most UI cases.
    for (let i = 0; i < labelledBoxes.length; i++) {
        for (let j = i + 1; j < labelledBoxes.length; j++) {
            // biome-ignore lint/style/noNonNullAssertion: This is actually safe
            const itemA = labelledBoxes[i]!;
            // biome-ignore lint/style/noNonNullAssertion: This is actually safe
            const itemB = labelledBoxes[j]!;

            const { center: centerA, radius: radiusA } = itemA.label;
            const { center: centerB, radius: radiusB } = itemB.label;

            const dx = centerA.x - centerB.x;
            const dy = centerA.y - centerB.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            // Check if the circles overlap significantly
            const collisionThreshold = radiusA + radiusB - LABEL_RADIUS_TOLERANCE;

            if (distance < collisionThreshold) {
                // Collision detected. Find which box is smaller by area.
                const areaA = itemA.box.width * itemA.box.height;
                const areaB = itemB.box.width * itemB.box.height;

                const smallerItem = areaA <= areaB ? itemA : itemB;
                const largerItem = areaA <= areaB ? itemB : itemA;

                const overlap = collisionThreshold - distance;
                let moveX: number;
                let moveY: number;

                if (distance === 0) {
                    // Case 1: Total overlap. Move the smaller label toward its own box's center.
                    const boxToMove = smallerItem.box;
                    // The vector from the label (top-right) to the box center is (-width/2, +height/2)
                    const directionX = -boxToMove.width / 2;
                    const directionY = boxToMove.height / 2;

                    const magnitude = Math.sqrt(directionX * directionX + directionY * directionY);

                    if (magnitude === 0) {
                        // Fallback for zero-sized boxes: move horizontally.
                        moveX = overlap;
                        moveY = 0;
                    } else {
                        // Normalize the direction vector and apply the overlap distance.
                        moveX = (directionX / magnitude) * overlap;
                        moveY = (directionY / magnitude) * overlap;
                    }
                } else {
                    // Case 2: Partial overlap. Move smaller item's label away from larger one.
                    const directionDx = smallerItem.label.center.x - largerItem.label.center.x;
                    const directionDy = smallerItem.label.center.y - largerItem.label.center.y;
                    moveX = (directionDx / distance) * overlap;
                    moveY = (directionDy / distance) * overlap;
                }

                // Shrink the smaller box symmetrically to displace its label
                const boxToShrink = smallerItem.box;
                const newWidth = boxToShrink.width - 2 * Math.abs(moveX);
                const newHeight = boxToShrink.height - 2 * Math.abs(moveY);
                const centerX = boxToShrink.x + boxToShrink.width / 2;
                const centerY = boxToShrink.y + boxToShrink.height / 2;

                // Update the box properties of the smaller item
                smallerItem.box = {
                    width: Math.max(0, newWidth),
                    height: Math.max(0, newHeight),
                    x: centerX - Math.max(0, newWidth) / 2,
                    y: centerY - Math.max(0, newHeight) / 2,
                };

                // IMPORTANT: The label's position must also be updated
                smallerItem.label.center = {
                    x: smallerItem.box.x + smallerItem.box.width,
                    y: smallerItem.box.y,
                };
            }
        }
    }
    return labelledBoxes;
}

export const boundingBoxColors = [
    "#FF0000",
    "#00FF00",
    "#0000FF",
    "#FFA500",
    "#800080",
    "#008080",
    "#FF69B4",
    "#4B0082",
    "#FF4500",
    "#2E8B57",
    "#DC143C",
    "#4682B4",
] as const;
type BoundingBoxColor = (typeof boundingBoxColors)[number];

function boundingBoxSvg(box: BoundingBox, color: BoundingBoxColor, withFill = false): string {
    const fillColor = withFill ? `${color}1A` : "none";

    return `<rect
      x="${box.x}" y="${box.y}"
      width="${box.width}" height="${box.height}"
      fill="${fillColor}" stroke="${color}" stroke-width="2" />`;
}

type LabelInfo = {
    center: { x: number; y: number };
    radius: number;
    text: string;
    color: BoundingBoxColor;
};

function labelSvg({ center, radius, text, color }: LabelInfo): string {
    // Calculate font size relative to circle size
    const fontSize = radius * 1.25;

    return `<circle
              cx="${center.x}"
              cy="${center.y}"
              r="${radius}"
              fill="white"
              stroke="${color}"
              stroke-width="2"/>
            <text
              x="${center.x}"
              y="${center.y + fontSize / 2.1}"
              font-family="Inter"
              font-size="${fontSize}"
              fill="${color}"
              text-anchor="middle"
              dominant-baseline="middle">
              ${text}
            </text>`;
}

export async function getImageMetadata(image: Sharp): Promise<{ width: number; height: number }> {
    const metadata = await image.metadata();

    const { width, height } = metadata;

    if (width == null || height == null) {
        throw new Error("Failed to retrieve image dimensions. Either width or height is null");
    }

    return { width, height };
}

export async function drawBoundingBoxesOnSharpImage(
    image: Sharp,
    boxes: [BoundingBox, ...BoundingBox[]],
    labelled = false,
): Promise<Sharp> {
    const { width, height } = await getImageMetadata(image);

    if (!labelled) {
        // Original behavior for unlabelled boxes
        const boxesSvgs = boxes.map((box) =>
            // biome-ignore lint/style/noNonNullAssertion: This is actually safe
            boundingBoxSvg(box, boundingBoxColors[0]!, false),
        );

        const svgContent = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${boxesSvgs.join("\n")}</svg>`;

        return image.composite([{ input: Buffer.from(svgContent), blend: "over" }]);
    }

    // --- LOGIC FOR LABELLED BOXES ---

    const { min: MIN_LABEL_RADIUS, max: MAX_LABEL_RADIUS } = getLabelRadiusLimits();

    // 1. Create an intermediate structure with initial label info
    let labelledBoxes: LabelledBox[] = boxes.map((box, index) => {
        const baseRadius = Math.min(box.width, box.height) * 0.15;
        const radius = Math.max(MIN_LABEL_RADIUS, Math.min(MAX_LABEL_RADIUS, baseRadius));
        return {
            box,
            label: {
                center: { x: box.x + box.width, y: box.y },
                radius,
                text: `${index + 1}`,
                // biome-ignore lint/style/noNonNullAssertion: This is actually safe
                color: boundingBoxColors[index % boundingBoxColors.length]!,
            },
        };
    });

    // 2. Adjust all boxes to fit their labels within the image boundaries
    for (const item of labelledBoxes) {
        const adjustedBox = adjustBoxForLabel(item.box, item.label.radius, {
            width,
            height,
        });
        // If the box was adjusted, we must also update the label's center
        item.label.center = {
            x: adjustedBox.x + adjustedBox.width,
            y: adjustedBox.y,
        };
        item.box = adjustedBox;
    }

    // 3. Resolve collisions between labels by shrinking the smaller box
    labelledBoxes = resolveLabelCollisions(labelledBoxes);

    // 4. Generate the final SVG strings from the fully adjusted data
    const labelsSvgs = labelledBoxes.map((item) => labelSvg(item.label));
    const boxesSvgs = labelledBoxes.map((item) => boundingBoxSvg(item.box, item.label.color, true));

    const svgContent = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
${boxesSvgs.join("\n")}
${labelsSvgs.join("\n")}
    </svg>
  `;

    return image.composite([{ input: Buffer.from(svgContent), blend: "over" }]);
}

export async function addTextToImage(screenshot: string, text: string): Promise<string> {
    const baseImage = sharp(Buffer.from(screenshot, "base64"));

    const sharpWithText = await addTextToSharpImage(baseImage, text);

    const buffImage = await sharpWithText.toBuffer();

    return buffImage.toString("base64");
}

export async function addTextToSharpImage(image: Sharp, text: string): Promise<Sharp> {
    const { width, height } = await getImageMetadata(image);

    const svgContent = `
    <svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
        <text
            x="20"
            y="${height - 30}"
            font-family="Arial" font-size="60" fill="red" font-weight="bold">
            ${text}
        </text>
    </svg>
`;

    const svgBuffer = Buffer.from(svgContent);

    return image.composite([{ input: svgBuffer, blend: "over" }]);
}

function getCursorSize(): number {
    const { architecture = "web" } = getScreenshotConfig();

    return architecture === "web" ? 30 : 50;
}

function cursorSvg(point: { x: number; y: number }, opacity = 1): string {
    const cursorSize = getCursorSize();
    return `<g transform="translate(${point.x}, ${point.y})">
<svg xmlns="http://www.w3.org/2000/svg" width="${cursorSize}" height="${cursorSize}" opacity="${opacity}" viewBox="0 0 24 24" fill="magenta" stroke="blue" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-mouse-pointer-icon lucide-mouse-pointer"><path d="M12.586 12.586 19 19"/><path d="M3.688 3.037a.497.497 0 0 0-.651.651l6.5 15.999a.501.501 0 0 0 .947-.062l1.569-6.083a2 2 0 0 1 1.448-1.479l6.124-1.579a.5.5 0 0 0 .063-.947z"/></svg>
</g>`;
}

export async function markPointOnSharpImage(
    image: Sharp,
    point: { x: number; y: number },
    opacity = 1,
): Promise<Sharp> {
    const { width, height } = await getImageMetadata(image);

    const svgContent = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${cursorSvg(point, opacity)}</svg>`;

    const svgBuffer = Buffer.from(svgContent);

    return image.composite([{ input: svgBuffer, blend: "over" }]);
}

function getClickCircleSize(): { outerRadius: number; innerRadius: number } {
    const { architecture = "web" } = getScreenshotConfig();
    return architecture === "web" ? { outerRadius: 20, innerRadius: 5 } : { outerRadius: 35, innerRadius: 8 };
}

function clickCircleSvg(point: { x: number; y: number }): string {
    const { outerRadius, innerRadius } = getClickCircleSize();
    return `<circle cx="${point.x}" cy="${point.y}" r="${outerRadius}" fill="rgba(99, 102, 241, 0.25)" stroke="#6366f1" stroke-width="3"/><circle cx="${point.x}" cy="${point.y}" r="${innerRadius}" fill="#6366f1"/>`;
}

export async function drawClickCircleOnSharpImage(image: Sharp, point: { x: number; y: number }): Promise<Sharp> {
    const { width, height } = await getImageMetadata(image);

    const svgContent = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${clickCircleSvg(point)}</svg>`;
    const svgBuffer = Buffer.from(svgContent);

    return image.composite([{ input: svgBuffer, blend: "over" }]);
}

function dragCircleSvg(point: { x: number; y: number }, color: { fill: string; stroke: string }): string {
    const { outerRadius, innerRadius } = getClickCircleSize();
    const fillAlpha = color.fill;
    return `<circle cx="${point.x}" cy="${point.y}" r="${outerRadius}" fill="${fillAlpha}" stroke="${color.stroke}" stroke-width="3"/><circle cx="${point.x}" cy="${point.y}" r="${innerRadius}" fill="${color.stroke}"/>`;
}

function dragLineSvg(start: { x: number; y: number }, end: { x: number; y: number }): string {
    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const length = Math.sqrt(dx * dx + dy * dy);
    if (length === 0) return "";

    const { architecture = "web" } = getScreenshotConfig();
    const strokeWidth = architecture === "web" ? 3 : 5;

    return `<line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" stroke="rgba(255,255,255,0.7)" stroke-width="${strokeWidth + 2}" stroke-linecap="round"/>
    <line x1="${start.x}" y1="${start.y}" x2="${end.x}" y2="${end.y}" stroke="rgba(156,163,175,0.9)" stroke-width="${strokeWidth}" stroke-dasharray="${architecture === "web" ? "8 5" : "14 8"}" stroke-linecap="round"/>`;
}

export async function drawDragAnnotationOnSharpImage(
    image: Sharp,
    startPoint: { x: number; y: number },
    endPoint: { x: number; y: number },
): Promise<Sharp> {
    const { width, height } = await getImageMetadata(image);

    const greenCircle = dragCircleSvg(startPoint, { fill: "rgba(34, 197, 94, 0.25)", stroke: "#22c55e" });
    const redCircle = dragCircleSvg(endPoint, { fill: "rgba(239, 68, 68, 0.25)", stroke: "#ef4444" });
    const line = dragLineSvg(startPoint, endPoint);

    const svgContent = `<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">${line}${greenCircle}${redCircle}</svg>`;
    const svgBuffer = Buffer.from(svgContent);

    return image.composite([{ input: svgBuffer, blend: "over" }]);
}

export async function cropAroundPointOnSharpImage(
    image: Sharp,
    { x, y }: { x: number; y: number },
    radius: number,
): Promise<Sharp> {
    const { width, height } = await getImageMetadata(image);

    const startX = Math.max(0, Math.floor(x - radius));
    const startY = Math.max(0, Math.floor(y - radius));
    const endX = Math.min(width, Math.ceil(x + radius));
    const endY = Math.min(height, Math.ceil(y + radius));
    const w = Math.max(1, endX - startX);
    const h = Math.max(1, endY - startY);

    return image.extract({ left: startX, top: startY, width: w, height: h });
}
