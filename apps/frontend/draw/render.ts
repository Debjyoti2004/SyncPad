// renderShapes

import { Shape } from "./shapes";
import { drawArrow, drawStar } from "./helpers";

export function renderShapes(
  ctx: CanvasRenderingContext2D,
  canvas: HTMLCanvasElement,
  list: Shape[]
) {
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
