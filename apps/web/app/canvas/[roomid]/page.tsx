"use client";

import { useEffect, useRef } from "react";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Resize canvas and fill background
    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      // Fill black background
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    const handleMouseDown = (event: MouseEvent) => {
      start.current = { x: event.clientX, y: event.clientY };
      isDrawing.current = true;
    };

    const handleMouseMove = (event: MouseEvent) => {
      if (!isDrawing.current) return;

      const currentX = event.clientX;
      const currentY = event.clientY;

      const width = currentX - start.current.x;
      const height = currentY - start.current.y;

      // Cean the canvas
      ctx.fillStyle = "black";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw rectanglee
      ctx.strokeStyle = "white";
      ctx.lineWidth = 2;
      ctx.strokeRect(start.current.x, start.current.y, width, height);
    };

    const handleMouseUp = () => {
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
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen bg-black"
    />
  );
}
