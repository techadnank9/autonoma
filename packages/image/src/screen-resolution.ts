/**
 * Conversion function from image to device coordinates and vice versa.
 */

import { type ScreenResolution, getScreenshotConfig, setScreenshotConfig } from "./config";
import type { BoundingBox, Point } from "./geometry";
import type { Screenshot } from "./screenshot";

export function pointToDeviceCoordinates(point: Point, originalResolution: ScreenResolution) {
    const { screenResolution } = getScreenshotConfig();

    // No screen resolution configured, return the point as is
    if (screenResolution == null) return point;

    const scaleX = screenResolution.width / originalResolution.width;
    const scaleY = screenResolution.height / originalResolution.height;
    return { x: point.x * scaleX, y: point.y * scaleY };
}

export function pointToImageCoordinates(point: Point, targetResolution: ScreenResolution) {
    const { screenResolution } = getScreenshotConfig();

    // No screen resolution configured, return the point as is
    if (screenResolution == null) return point;

    const scaleX = targetResolution.width / screenResolution.width;
    const scaleY = targetResolution.height / screenResolution.height;
    return { x: point.x * scaleX, y: point.y * scaleY };
}

export function boundingBoxToDeviceCoordinates(boundingBox: BoundingBox, originalResolution: ScreenResolution) {
    const { screenResolution } = getScreenshotConfig();

    // No screen resolution configured, return the bounding box as is
    if (screenResolution == null) return boundingBox;

    const scaleX = screenResolution.width / originalResolution.width;
    const scaleY = screenResolution.height / originalResolution.height;
    return {
        x: boundingBox.x * scaleX,
        y: boundingBox.y * scaleY,
        width: boundingBox.width * scaleX,
        height: boundingBox.height * scaleY,
    };
}

export function boundingBoxToImageCoordinates(boundingBox: BoundingBox, targetResolution: ScreenResolution) {
    const { screenResolution } = getScreenshotConfig();

    // No screen resolution configured, return the bounding box as is
    if (screenResolution == null) return boundingBox;

    const scaleX = targetResolution.width / screenResolution.width;
    const scaleY = targetResolution.height / screenResolution.height;
    return {
        x: boundingBox.x * scaleX,
        y: boundingBox.y * scaleY,
        width: boundingBox.width * scaleX,
        height: boundingBox.height * scaleY,
    };
}

/**
 * Update screenshot config with actual device resolution from a screenshot.
 * This ensures coordinate scaling uses the correct resolution for cross-device compatibility.
 *
 * @param screenshot - The screenshot to extract resolution from
 */
export async function updateScreenshotConfigWithResolution(screenshot: Screenshot): Promise<void> {
    const resolution = await screenshot.getResolution();
    setScreenshotConfig({ screenResolution: resolution });
}
