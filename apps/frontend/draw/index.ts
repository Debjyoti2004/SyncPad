export type Shape =
  | { type: "rect"; x: number; y: number; width: number; height: number }
  | { type: "line"; x1: number; y1: number; x2: number; y2: number }
  | { type: "ellipse"; centerX: number; centerY: number; radiusX: number; radiusY: number }
  | { type: "triangle"; x1: number; y1: number; x2: number; y2: number }
  | { type: "arrow"; fromX: number; fromY: number; toX: number; toY: number }
  | { type: "star"; centerX: number; centerY: number; outerRadius: number; points: number }
  | { type: "freehand"; points: { x: number; y: number }[] };

let freehandPath: { x: number; y: number }[] | null = null;

// Draw Arrow helper
function drawArrow(ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) {
  const headLength = 10;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const angle = Math.atan2(dy, dx);

  ctx.beginPath();
  ctx.moveTo(fromX, fromY);
  ctx.lineTo(toX, toY);
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

// Draw Star helper
function drawStar(ctx: CanvasRenderingContext2D, cx: number, cy: number, spikes: number, outerRadius: number) {
  const step = Math.PI / spikes;
  let rot = (Math.PI / 2) * 3;
  let x = cx;
  let y = cy;
  const innerRadius = outerRadius / 2;

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

// Main Draw Function
export default function Draw(
  canvas: HTMLCanvasElement,
  isDrawing: React.MutableRefObject<boolean>,
  start: React.MutableRefObject<{ x: number; y: number }>,
  selectedShape: Shape["type"],
  onShapeDraw: (shape: Shape) => void,
  shapes: Shape[] = []
) {
  if (!canvas) return;

  const ctx = canvas.getContext("2d")!; 
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
          2 * Math.PI
        );
        ctx.stroke();
        break;
      case "triangle":
        ctx.beginPath();
        ctx.moveTo(start.current.x, start.current.y);
        ctx.lineTo(endX, endY);
        ctx.lineTo(start.current.x - (endX - start.current.x), endY);
        ctx.closePath();
        ctx.stroke();
        break;
      case "arrow":
        drawArrow(ctx, start.current.x, start.current.y, endX, endY);
        break;
      case "star":
        drawStar(ctx, start.current.x, start.current.y, 5, Math.sqrt(width ** 2 + height ** 2));
        break;
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
        newShape = { type: "rect", x: start.current.x, y: start.current.y, width, height };
        break;
      case "line":
        newShape = { type: "line", x1: start.current.x, y1: start.current.y, x2: endX, y2: endY };
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
        newShape = { type: "triangle", x1: start.current.x, y1: start.current.y, x2: endX, y2: endY };
        break;
      case "arrow":
        newShape = { type: "arrow", fromX: start.current.x, fromY: start.current.y, toX: endX, toY: endY };
        break;
      case "star":
        newShape = {
          type: "star",
          centerX: start.current.x,
          centerY: start.current.y,
          outerRadius: Math.sqrt(width ** 2 + height ** 2),
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

  function renderShapes(shapes: Shape[]) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle = "white";
    ctx.lineWidth = 2;

    for (const shape of shapes) {
      switch (shape.type) {
        case "rect":
          ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
          break;
        case "line":
          ctx.beginPath();
          ctx.moveTo(shape.x1, shape.y1);
          ctx.lineTo(shape.x2, shape.y2);
          ctx.stroke();
          break;
        case "ellipse":
          ctx.beginPath();
          ctx.ellipse(shape.centerX, shape.centerY, shape.radiusX, shape.radiusY, 0, 0, 2 * Math.PI);
          ctx.stroke();
          break;
        case "triangle":
          ctx.beginPath();
          ctx.moveTo(shape.x1, shape.y1);
          ctx.lineTo(shape.x2, shape.y2);
          ctx.lineTo(shape.x1 - (shape.x2 - shape.x1), shape.y2);
          ctx.closePath();
          ctx.stroke();
          break;
        case "arrow":
          drawArrow(ctx, shape.fromX, shape.fromY, shape.toX, shape.toY);
          break;
        case "star":
          drawStar(ctx, shape.centerX, shape.centerY, shape.points, shape.outerRadius);
          break;
        case "freehand":
          if (shape.points?.length) {
            ctx.beginPath();
            ctx.moveTo(shape.points[0].x, shape.points[0].y);
            for (let i = 1; i < shape.points.length; i++) {
              ctx.lineTo(shape.points[i].x, shape.points[i].y);
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
