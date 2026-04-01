interface Point {
    x: number;
    y: number;
}

export type OverlayPoint = Point & { role: "click" | "drag-start" | "drag-end" };

interface OutputWithPossiblePoints {
    point?: Point;
    startPoint?: Point;
    endPoint?: Point;
}

export function getStepOverlayPoints(output: OutputWithPossiblePoints): Array<OverlayPoint> {
    const points: OverlayPoint[] = [];
    if (output.point != null) points.push({ ...output.point, role: "click" });
    if (output.startPoint != null) points.push({ ...output.startPoint, role: "drag-start" });
    if (output.endPoint != null) points.push({ ...output.endPoint, role: "drag-end" });
    return points;
}
