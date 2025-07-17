"use client";

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

let freehandPath: { x: number; y: number }[] | null = null;

// helpers
function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number
) {
  const headLength = 10;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  );
  ctx.moveTo(toX, toY);
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  );
  ctx.stroke();
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  spikes: number,
  outerRadius: number
) {
  const innerRadius = outerRadius / 2;
  const step = Math.PI / spikes;
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;

  ctx.beginPath();
  ctx.moveTo(cx, cy - outerRadius);

  for (let i = 0; i < spikes; i++) {
    x = cx + Math.cos(rot) * outerRadius;
    y = cy + Math.sin(rot) * outerRadius;
    ctx.lineTo(x, y);
    rot += step;

    x = cx + Math.cos(rot) * innerRadius;
    y = cy + Math.sin(rot) * innerRadius;
    ctx.lineTo(x, y);
    rot += step;
  }

  ctx.lineTo(cx, cy - outerRadius);
  ctx.closePath();
  ctx.stroke();
}

// main 
export default function Draw(
  canvas: HTMLCanvasElement,
  isDrawing: React.MutableRefObject<boolean>,
  start: React.MutableRefObject<{ x: number; y: number }>,
  selectedShape: Shape["type"],
  onShapeDraw: (shape: Shape) => void,
  shapes: Shape[] = []
) {
  if (!canvas) return () => {};
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};

  let existingShapes: Shape[] = [...shapes];

  const resizeCanvas = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    renderShapes(existingShapes);
  };
  resizeCanvas();
  window.addEventListener("resize", resizeCanvas);

  const handleMouseDown = (event: MouseEvent) => {
    start.current = { x: event.clientX, y: event.clientY };
    isDrawing.current = true;
    if (selectedShape === "freehand") {
      freehandPath = [{ x: event.clientX, y: event.clientY }];
    }
  };

  const handleMouseMove = (event: MouseEvent) => {
    if (!isDrawing.current) return;
    const endX = event.clientX;
    const endY = event.clientY;
    const width = endX - start.current.x;
    const height = endY - start.current.y;

    renderShapes(existingShapes);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    switch (selectedShape) {
      case "rect":
        ctx.strokeRect(start.current.x, start.current.y, width, height);
        break;
      case "line":
        ctx.beginPath();
        ctx.moveTo(start.current.x, start.current.y);
        ctx.lineTo(endX, endY);
        ctx.stroke();
        break;
      case "ellipse":
        ctx.beginPath();
        ctx.ellipse(
          start.current.x + width / 2,
          start.current.y + height / 2,
          Math.abs(width / 2),
          Math.abs(height / 2),
          0,
          0,
          Math.PI * 2
        );
        ctx.stroke();
        break;
      case "triangle": {
        const x1 = start.current.x;
        const y1 = start.current.y;
        const x2 = endX;
        const y2 = endY;
        const x3 = x1 - (x2 - x1);
        const y3 = y2;
        ctx.beginPath();
        ctx.moveTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(x3, y3);
        ctx.closePath();
        ctx.stroke();
        break;
      }
      case "arrow":
        drawArrow(ctx, start.current.x, start.current.y, endX, endY);
        break;
      case "star": {
        const r = Math.sqrt(width * width + height * height);
        drawStar(ctx, start.current.x, start.current.y, 5, r);
        break;
      }
      case "freehand":
        if (freehandPath) {
          freehandPath.push({ x: endX, y: endY });
          ctx.beginPath();
          ctx.moveTo(freehandPath[0].x, freehandPath[0].y);
          for (let i = 1; i < freehandPath.length; i++) {
            ctx.lineTo(freehandPath[i].x, freehandPath[i].y);
          }
          ctx.stroke();
        }
        break;
    }
  };

  const handleMouseUp = (event: MouseEvent) => {
    if (!isDrawing.current) return;
    const endX = event.clientX;
    const endY = event.clientY;
    const width = endX - start.current.x;
    const height = endY - start.current.y;

    let newShape: Shape | null = null;
    switch (selectedShape) {
      case "rect":
        newShape = {
          type: "rect",
          x: start.current.x,
          y: start.current.y,
          width,
          height,
        };
        break;
      case "line":
        newShape = {
          type: "line",
          x1: start.current.x,
          y1: start.current.y,
          x2: endX,
          y2: endY,
        };
        break;
      case "ellipse":
        newShape = {
          type: "ellipse",
          centerX: start.current.x + width / 2,
          centerY: start.current.y + height / 2,
          radiusX: Math.abs(width / 2),
          radiusY: Math.abs(height / 2),
        };
        break;
      case "triangle":
        newShape = {
          type: "triangle",
          x1: start.current.x,
          y1: start.current.y,
          x2: endX,
          y2: endY,
        };
        break;
      case "arrow":
        newShape = {
          type: "arrow",
          fromX: start.current.x,
          fromY: start.current.y,
          toX: endX,
          toY: endY,
        };
        break;
      case "star":
        newShape = {
          type: "star",
          centerX: start.current.x,
          centerY: start.current.y,
          outerRadius: Math.sqrt(width * width + height * height),
          points: 5,
        };
        break;
      case "freehand":
        if (freehandPath) {
          newShape = { type: "freehand", points: [...freehandPath] };
          freehandPath = null;
        }
        break;
    }

    if (newShape) {
      existingShapes.push(newShape);
      onShapeDraw(newShape);
    }

    renderShapes(existingShapes);
    isDrawing.current = false;
  };

  function renderShapes(list: Shape[]) {
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    for (const s of list) {
      switch (s.type) {
        case "rect":
          ctx.strokeRect(s.x, s.y, s.width, s.height);
          break;
        case "line":
          ctx.beginPath();
          ctx.moveTo(s.x1, s.y1);
          ctx.lineTo(s.x2, s.y2);
          ctx.stroke();
          break;
        case "ellipse":
          ctx.beginPath();
          ctx.ellipse(
            s.centerX,
            s.centerY,
            s.radiusX,
            s.radiusY,
            0,
            0,
            Math.PI * 2
          );
          ctx.stroke();
          break;
        case "triangle": {
          const x3 = s.x1 - (s.x2 - s.x1);
          const y3 = s.y2;
          ctx.beginPath();
          ctx.moveTo(s.x1, s.y1);
          ctx.lineTo(s.x2, s.y2);
          ctx.lineTo(x3, y3);
          ctx.closePath();
          ctx.stroke();
          break;
        }
        case "arrow":
          drawArrow(ctx, s.fromX, s.fromY, s.toX, s.toY);
          break;
        case "star":
          drawStar(ctx, s.centerX, s.centerY, s.points, s.outerRadius);
          break;
        case "freehand":
          if (s.points?.length) {
            ctx.beginPath();
            ctx.moveTo(s.points[0].x, s.points[0].y);
            for (let i = 1; i < s.points.length; i++) {
              ctx.lineTo(s.points[i].x, s.points[i].y);
            }
            ctx.stroke();
          }
          break;
      }
    }
  }

  canvas.addEventListener("mousedown", handleMouseDown);
  window.addEventListener("mousemove", handleMouseMove);
  window.addEventListener("mouseup", handleMouseUp);

  return () => {
    window.removeEventListener("resize", resizeCanvas);
    canvas.removeEventListener("mousedown", handleMouseDown);
    window.removeEventListener("mousemove", handleMouseMove);
    window.removeEventListener("mouseup", handleMouseUp);
  };
}
