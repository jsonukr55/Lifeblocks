"use client";

import { useDragLayer, XYCoord } from "react-dnd";
import { DragItem } from "@/types";
import { TYPE_COLORS } from "./MiniBlock";

const MINI_SIZE = 30;

export default function DragLayer() {
  const { isDragging, item, currentOffset } = useDragLayer<{
    isDragging: boolean;
    item: DragItem;
    currentOffset: XYCoord | null;
  }>((monitor) => ({
    item: monitor.getItem(),
    currentOffset: monitor.getSourceClientOffset(),
    isDragging: monitor.isDragging(),
  }));

  if (!isDragging || !currentOffset || !item) return null;

  const { x, y } = currentOffset;
  const shapeCols = item.block.shape[0].length;
  const shapeRows = item.block.shape.length;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-[9999]"
      style={{ left: 0, top: 0, width: "100%", height: "100%" }}
    >
      <div
        style={{
          position: "absolute",
          transform: `translate(${x}px, ${y}px)`,
          opacity: 0.9,
          filter: "drop-shadow(0 12px 24px rgba(0,0,0,0.7))",
        }}
      >
        <div
          style={{
            display: "grid",
            gridTemplateColumns: `repeat(${shapeCols}, ${MINI_SIZE}px)`,
            gridTemplateRows: `repeat(${shapeRows}, ${MINI_SIZE}px)`,
            gap: "2px",
          }}
        >
          {item.block.shape.map((row, r) =>
            row.map((val, c) => (
              <div
                key={`${r}-${c}`}
                className={`rounded-sm relative overflow-hidden ${
                  val === 1
                    ? `bg-gradient-to-br ${TYPE_COLORS[item.block.type]}`
                    : "bg-transparent"
                }`}
                style={{ width: MINI_SIZE, height: MINI_SIZE }}
              >
                {val === 1 && (
                  <div className="absolute inset-0 bg-gradient-to-br from-white/30 to-transparent pointer-events-none" />
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
