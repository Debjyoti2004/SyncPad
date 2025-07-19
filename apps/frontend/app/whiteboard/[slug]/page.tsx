"use client";

import Canvas from "../../components/Canvas";
import { useWhiteboard } from "./useWhiteboard";
import WhiteboardToolbar from "./WhiteboardToolbar";

export default function WhiteboardPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const {
    slug,
    roomId,
    shapes,
    selectedShape,
    setSelectedShape,
    handleShapeDraw,
    handleUndoClick,
    undoInFlight,
    toolButtons,
  } = useWhiteboard({ params });

  return (
    <div className="w-screen h-screen bg-gray-900 text-white">
      <WhiteboardToolbar
        slug={slug}
        roomId={roomId}
        selectedShape={selectedShape}
        setSelectedShape={setSelectedShape}
        shapesLength={shapes.length}
        undoInFlight={undoInFlight}
        handleUndoClick={handleUndoClick}
        toolButtons={toolButtons}
      />

      <Canvas
        shape={selectedShape}
        shapes={shapes}
        onShapeDraw={handleShapeDraw}
      />
    </div>
  );
}
