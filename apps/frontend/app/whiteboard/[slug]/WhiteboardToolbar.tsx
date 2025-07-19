"use client";

import React, { useState } from "react";
import {
  Copy,
  RotateCcw,
  Square,
  Minus,
  Circle,
  Star,
  Pen,
  Triangle,
  ArrowRight,
  Check,
} from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import type { Shape } from "../../../draw/shapes";

interface ToolbarProps {
  slug: string;
  roomId: string | null;
  selectedShape: Shape["type"];
  setSelectedShape: (t: Shape["type"]) => void;
  shapesLength: number;
  undoInFlight: boolean;
  handleUndoClick: () => void;
  toolButtons: readonly Shape["type"][];
}

export default function WhiteboardToolbar({
  slug,
  roomId,
  selectedShape,
  setSelectedShape,
  shapesLength,
  undoInFlight,
  handleUndoClick,
  toolButtons,
}: ToolbarProps) {
  const [copying, setCopying] = useState(false);

  const handleCopySlug = async () => {
    setCopying(true);
    try {
      await navigator.clipboard.writeText(slug);
      toast.success("Room code copied!");
    } catch (error) {
      toast.error("Failed to copy code");
    }
    setTimeout(() => setCopying(false), 1000);
  };

  const icons: Record<Shape["type"], React.ReactNode> = {
    rect: <Square size={20} strokeWidth={2} />,
    line: <Minus size={20} strokeWidth={2} />,
    ellipse: <Circle size={20} strokeWidth={2} />,
    triangle: <Triangle size={20} strokeWidth={2} />,
    arrow: <ArrowRight size={20} strokeWidth={2} />,
    star: <Star size={20} strokeWidth={2} />,
    freehand: <Pen size={20} strokeWidth={2} />,
  };

  const toolLabels: Record<Shape["type"], string> = {
    rect: "Rectangle",
    line: "Line",
    ellipse: "Circle",
    triangle: "Triangle",
    arrow: "Arrow",
    star: "Star",
    freehand: "Draw",
  };

  return (
    <>
      <div 
        className="fixed top-4 left-4 right-4 flex justify-center pointer-events-none"
        style={{ 
          zIndex: 9999, 
          position: 'fixed',
          top: '16px',
          left: '16px', 
          right: '16px'
        }}
      >
        <div 
          className="flex items-center text-white rounded-2xl shadow-2xl border border-white/10 pointer-events-auto relative overflow-x-auto"
          style={{
            background: 'rgba(15, 23, 42, 0.95)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            padding: '8px 12px',
            gap: '6px',
            minHeight: '48px',
            maxWidth: '100%',
            width: 'fit-content',
            margin: '0 auto'
          }}
        >
          
          {toolButtons.map((type) => (
            <button
              key={type}
              onClick={() => setSelectedShape(type)}
              className={`group relative rounded-xl transition-all duration-200 flex items-center justify-center flex-shrink-0 ${
                selectedShape === type
                  ? "text-white shadow-lg"
                  : "text-gray-300 hover:text-white"
              }`}
              title={toolLabels[type]}
              style={{
                width: '40px',
                height: '40px',
                background: selectedShape === type 
                  ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                  : 'transparent'
              }}
            >
              <div className="relative z-10" style={{ transform: 'scale(0.9)' }}>
                {icons[type]}
              </div>
            </button>
          ))}

          <div 
            style={{
              background: 'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.3), transparent)',
              width: '1px',
              height: '24px',
              margin: '0 8px',
              flexShrink: 0
            }}
          />

          <button
            onClick={handleCopySlug}
            disabled={copying}
            className="group relative rounded-xl transition-all duration-300 text-gray-300 hover:text-white disabled:opacity-50 flex-shrink-0"
            title="Copy Room Code"
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div className="relative z-10" style={{ transform: 'scale(0.9)' }}>
              {copying ? <Check size={20} strokeWidth={2} /> : <Copy size={20} strokeWidth={2} />}
            </div>
          </button>

          <button
            onClick={handleUndoClick}
            disabled={!roomId || !shapesLength || undoInFlight}
            className={`group relative rounded-xl transition-all duration-300 flex-shrink-0 ${
              !roomId || !shapesLength || undoInFlight
                ? "text-gray-500 cursor-not-allowed opacity-50"
                : "text-gray-300 hover:text-white"
            }`}
            title="Undo Last Action"
            style={{
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <div className="relative z-10" style={{ transform: 'scale(0.9)' }}>
              <RotateCcw 
                size={20} 
                strokeWidth={2} 
                className={undoInFlight ? 'animate-spin' : ''}
              />
            </div>
          </button>
        </div>
      </div>

      <Toaster 
        position="top-right" 
        reverseOrder={false}
        toastOptions={{
          style: {
            background: 'rgba(15, 23, 42, 0.95)',
            color: 'white',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '12px',
            fontSize: '14px',
          },
        }}
      />
    </>
  );
}