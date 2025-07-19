// Shape type

export type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number }
  | {
      type: "ellipse";
      centerX: number;
      centerY: number;
      radiusX: number;
      radiusY: number;
    }
  | { type: "triangle"; x1: number; y1: number; x2: number; y2: number }
  | { type: "arrow"; fromX: number; fromY: number; toX: number; toY: number }
  | {
      type: "star";
      centerX: number;
      centerY: number;
      outerRadius: number;
      points: number;
    }
  | { type: "freehand"; points: { x: number; y: number }[] };
