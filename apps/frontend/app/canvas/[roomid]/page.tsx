"use client";

import { useEffect, useRef, useState } from "react";
import Draw from "../../../draw";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  const [shape, setShape] = useState<
    | "rect"
    | "line"
    | "ellipse"
    | "triangle"
    | "arrow"
    | "star"
    | "freehand"
  >("rect");

  useEffect(() => {
    const cleanup = Draw(canvasRef.current!, isDrawing, start, shape);
    return cleanup;
  }, [shape]);

  const shapes = [
    "rect",
    "line",
    "ellipse",
    "triangle",
    "arrow",
    "star",
    "freehand",
  ] as const;

  return (
    <>
      <div className="absolute z-10 p-4 flex gap-2">
        {shapes.map((s) => (
          <button
            key={s}
            onClick={() => setShape(s)}
            className={`px-4 py-2 rounded ${
              shape === s ? "bg-yellow-400 text-black" : "bg-white text-black"
            }`}
          >
            {s.charAt(0).toUpperCase() + s.slice(1)}
          </button>
        ))}
      </div>

      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-screen h-screen bg-black"
      />
    </>
  );
}