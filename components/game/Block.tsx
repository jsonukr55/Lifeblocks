"use client";

import { useDrag } from "react-dnd";
import { motion } from "framer-motion";
import { Block as BlockType, DragItem } from "@/types";
import { useGameStore } from "@/store/useGameStore";
import { TYPE_COLORS } from "./MiniBlock";
import { RotateCw } from "lucide-react";

interface Props {
  block: BlockType;
  trayIndex: number;
}

const MINI_SIZE = 26; // px per mini-block in tray

export default function DraggableBlock({ block, trayIndex }: Props) {
  const rotateBlockInTray = useGameStore((s) => s.rotateBlockInTray);
  const insuranceBalance = useGameStore((s) => s.insuranceBalance);
  const canAfford = insuranceBalance >= block.totalCost;

  const [{ isDragging }, dragRef] = useDrag<
    DragItem,
    void,
    { isDragging: boolean }
  >({
    type: "BLOCK",
    item: (): DragItem => ({
      type: "BLOCK",
      block,
      sourceIndex: trayIndex,
    }),
    collect: (monitor) => ({ isDragging: monitor.isDragging() }),
  });

  const shapeRows = block.shape.length;
  const shapeCols = block.shape[0].length;

  return (
    <motion.div
      className="relative flex flex-col items-center gap-1"
      whileHover={{ scale: 1.05 }}
      style={{ opacity: isDragging ? 0.25 : 1 }}
    >
      {/* Rotate button */}
      <button
        className="absolute -top-2 -right-2 z-10 w-6 h-6 bg-slate-700 hover:bg-slate-600
                   rounded-full flex items-center justify-center border border-slate-600
                   shadow-md transition-colors active:scale-95"
        onClick={(e) => {
          e.stopPropagation();
          rotateBlockInTray(trayIndex);
        }}
        title="Rotate block"
      >
        <RotateCw className="w-3 h-3 text-slate-300" />
      </button>

      {/* Block shape grid */}
      <div
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={dragRef as any}
        className="cursor-grab active:cursor-grabbing select-none"
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${shapeCols}, ${MINI_SIZE}px)`,
          gridTemplateRows: `repeat(${shapeRows}, ${MINI_SIZE}px)`,
          gap: "2px",
        }}
      >
        {block.shape.map((row, r) =>
          row.map((val, c) => (
            <div
              key={`${r}-${c}`}
              className={`rounded-[3px] relative overflow-hidden ${
                val === 1
                  ? `bg-gradient-to-br ${TYPE_COLORS[block.type]}`
                  : "bg-transparent"
              }`}
            >
              {val === 1 && (
                <div className="absolute inset-0 bg-gradient-to-br from-white/25 to-transparent pointer-events-none" />
              )}
            </div>
          ))
        )}
      </div>

      {/* Cost + risk badge */}
      <div className="flex items-center gap-1 mt-0.5">
        <span className={`text-[10px] font-semibold ${canAfford ? "text-slate-300" : "text-orange-400"}`}>
          ₹{block.totalCost >= 1000 ? `${(block.totalCost / 1000).toFixed(0)}k` : block.totalCost}
        </span>
        {!canAfford && (
          <span className="text-[9px] text-orange-400 font-bold">⚠️</span>
        )}
        {canAfford && (
          <span
            className={`text-[9px] px-1 rounded-full font-medium ${
              block.riskLevel === "high"
                ? "bg-red-500/20 text-red-400"
                : block.riskLevel === "medium"
                ? "bg-amber-500/20 text-amber-400"
                : "bg-green-500/20 text-green-400"
            }`}
          >
            {block.riskLevel}
          </span>
        )}
      </div>
    </motion.div>
  );
}
