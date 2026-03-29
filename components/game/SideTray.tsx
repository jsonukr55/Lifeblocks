"use client";

import { useGameStore } from "@/store/useGameStore";
import DraggableBlock from "./Block";
import { getTemplateForType } from "@/lib/blockGenerator";

export default function SideTray() {
  const trayBlocks = useGameStore((s) => s.trayBlocks);

  return (
    <div className="flex flex-col gap-2 p-2 sm:p-3 bg-slate-900/80 rounded-xl border border-slate-700/80 w-[100px] sm:w-[120px] flex-shrink-0 backdrop-blur-sm overflow-y-auto" style={{ maxHeight: "calc(100dvh - 120px)" }}>
      <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest text-center">
        Next
      </h3>

      <div className="flex flex-col gap-3 items-center">
        {trayBlocks.map((block, i) => {
          const template = getTemplateForType(block.type);
          return (
            <div key={block.id} className="flex flex-col items-center gap-0.5">
              <div className="text-base leading-none">
                {template?.emoji ?? "📦"}
              </div>
              <DraggableBlock block={block} trayIndex={i} />
              <div className="text-[9px] text-slate-500 capitalize font-medium">
                {block.label}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-1 pt-2 border-t border-slate-700/50">
        <p className="text-[9px] text-slate-600 text-center leading-tight">
          Drag to board · Tap ↻ to rotate
        </p>
      </div>
    </div>
  );
}
