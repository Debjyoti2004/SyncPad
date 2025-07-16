"use client";

import { useEffect, useRef } from "react";
import Draw from "../../../draw";

export default function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawing = useRef(false);
  const start = useRef({ x: 0, y: 0 });

  useEffect(() => {

    Draw(canvasRef.current!, isDrawing, start);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-screen h-screen bg-black"
    />
  );
}
