"use client";

import { useEffect, useRef } from "react";
import Draw, { Shape } from "../../draw"; 

interface CanvasProps {
  shape: Shape["type"];
  shapes: Shape[];
  onShapeDraw: (shape: Shape) => void;
}

export default function Canvas({ shape, shapes, onShapeDraw }: CanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  useEffect(() => {
    if (!canvasRef.current) return;

    const cleanup = Draw(
      canvasRef.current,
      isDrawing,
      start,
      shape,
      onShapeDraw,
      shapes
    );
    return cleanup;
  }, [shape, shapes, onShapeDraw]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen bg-black"
    />
  );
}
