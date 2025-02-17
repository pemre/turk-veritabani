"use client";

// Generic DraggableSlider Component
// Props:
// - children: the content to be displayed inside the sliding panel
// - initialHeight: the default panel height (default is 400px)
// - minHeight: the minimum allowed height (default is 200px)
// - maxHeight: the maximum allowed height (default is 800px)
// - persistKey: (optional) a localStorage key to save/retrieve the height

import { useEffect, useRef, useState } from "react";

function DraggableSlider({
                           children,
                           initialHeight = 400,
                           minHeight = 200,
                           maxHeight = 800,
                           persistKey = null,
                         }) {
  const containerRef = useRef(null);

  // Start with initialHeight; we update it later on client mount.
  const [height, setHeight] = useState(initialHeight);
  const [isDragging, setIsDragging] = useState(false);

  // Read from localStorage once the component mounts.
  // This is to prevent Next.js build error: "localStorage not defined"
  useEffect(() => {
    if (persistKey && typeof window !== "undefined") {
      const stored = localStorage.getItem(persistKey);
      if (stored) {
        setHeight(parseInt(stored, 10));
      }
    }
  }, [persistKey]);

  // Persist height to localStorage when it changes and dragging stops.
  useEffect(() => {
    if (!isDragging && persistKey && typeof window !== "undefined") {
      localStorage.setItem(persistKey, height);
    }
  }, [height, isDragging, persistKey]);

  // Update the cursor when dragging.
  useEffect(() => {
    document.body.style.cursor = isDragging ? "grabbing" : "default";
    return () => {
      document.body.style.cursor = "default";
    };
  }, [isDragging]);

  const onMouseDown = (e) => {
    e.preventDefault();
    setIsDragging(true);
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
  };

  const onMouseMove = (e) => {
    if (containerRef.current) {
      const containerTop = containerRef.current.getBoundingClientRect().top;
      const newHeight = e.clientY - containerTop;
      const clampedHeight = Math.min(Math.max(newHeight, minHeight), maxHeight);
      setHeight(clampedHeight);
    }
  };

  const onMouseUp = () => {
    setIsDragging(false);
    document.removeEventListener("mousemove", onMouseMove);
    document.removeEventListener("mouseup", onMouseUp);
  };

  return (
    <div ref={containerRef}>
      {/* Content area whose height is controlled by dragging */}
      <div
        style={{
          height: `${height}px`,
          overflow: "auto",
          transition: isDragging ? "none" : "height 0.2s ease-out",
        }}
      >
        {typeof children === "function" ? children(height) : children}
      </div>
      {/* Draggable slider handle */}
      <div
        onMouseDown={onMouseDown}
        className={`${
          isDragging ? "cursor-grabbing" : "cursor-row-resize"
        } relative h-2 bg-gray-400 rounded-b flex items-center justify-center hover:bg-gray-300`}
      >
        <div className="w-6 h-1 bg-gray-600 rounded"></div>
      </div>
    </div>
  );
}

export default DraggableSlider;
