// main Draw function

"use client";

import { Shape } from "./shapes";
import { renderShapes } from "./render";
import { drawArrow, drawStar } from "./helpers";

let freehandPath: { x: number; y: number }[] | null = null;

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
    renderShapes(ctx, canvas, existingShapes);
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

    renderShapes(ctx, canvas, existingShapes);

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

    renderShapes(ctx, canvas, existingShapes);
    isDrawing.current = false;
  };

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
