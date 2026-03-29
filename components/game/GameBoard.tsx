"use client";

import { useRef, useState, useCallback } from "react";
import { useDrop } from "react-dnd";
import { AnimatePresence, motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { GRID_ROWS, GRID_COLS, canPlaceBlock, pixelToGrid } from "@/lib/gameEngine";
import { DragItem, Block } from "@/types";
import MiniBlock from "./MiniBlock";
import clsx from "clsx";

interface HoverInfo {
  row: number;
  col: number;
  block: Block;
  valid: boolean;
}

export default function GameBoard() {
  const grid = useGameStore((s) => s.grid);
  const placeBlock = useGameStore((s) => s.placeBlock);

  const [hoverInfo, setHoverInfo] = useState<HoverInfo | null>(null);
  const boardRef = useRef<HTMLDivElement | null>(null);

  const getDropCoords = useCallback(
    (clientX: number, clientY: number, block: Block) => {
      const rect = boardRef.current?.getBoundingClientRect();
      if (!rect) return null;
      return pixelToGrid(clientX, clientY, rect, block.shape);
    },
    []
  );

  const [{ isOver }, dropRef] = useDrop<DragItem, void, { isOver: boolean }>({
    accept: "BLOCK",

    hover: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;
      const coords = getDropCoords(offset.x, offset.y, item.block);
      if (!coords) return;
      const valid = canPlaceBlock(grid, item.block.shape, coords.row, coords.col);
      setHoverInfo({ ...coords, block: item.block, valid });
    },

    drop: (item, monitor) => {
      const offset = monitor.getClientOffset();
      if (!offset) return;
      const coords = getDropCoords(offset.x, offset.y, item.block);
      if (!coords) return;
      placeBlock(item.block, coords.row, coords.col, item.sourceIndex);
      setHoverInfo(null);
    },

    collect: (monitor) => ({ isOver: monitor.isOver() }),
  });

  // Merge boardRef + dropRef
  const setRefs = useCallback(
    (el: HTMLDivElement | null) => {
      boardRef.current = el;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (dropRef as any)(el);
    },
    [dropRef]
  );

  // Pre-compute hover preview cells
  const hoverCells = new Set<string>();
  if (hoverInfo && isOver) {
    hoverInfo.block.shape.forEach((row, r) => {
      row.forEach((val, c) => {
        if (val === 1) {
          hoverCells.add(`${hoverInfo.row + r}-${hoverInfo.col + c}`);
        }
      });
    });
  }

  const isValidHover = hoverInfo?.valid ?? false;

  // Track which rows are being animated (for row clear)
  const [clearingRows] = useState<Set<number>>(new Set());

  return (
    <div
      ref={setRefs}
      className={clsx(
        "game-board relative border-2 rounded-xl overflow-hidden select-none",
        isOver
          ? "border-slate-500 shadow-[0_0_30px_rgba(148,163,184,0.15)]"
          : "border-slate-700/80 shadow-[0_0_20px_rgba(0,0,0,0.5)]",
        "bg-slate-950/90"
      )}
      style={{
        display: "grid",
        gridTemplateColumns: `repeat(${GRID_COLS}, 1fr)`,
        gridTemplateRows: `repeat(${GRID_ROWS}, 1fr)`,
        aspectRatio: `${GRID_COLS}/${GRID_ROWS}`,
        width: "100%",
        touchAction: "none",
      }}
    >
      {/* Grid lines overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-10"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgb(148 163 184) 1px, transparent 1px),
            linear-gradient(to bottom, rgb(148 163 184) 1px, transparent 1px)
          `,
          backgroundSize: `${100 / GRID_COLS}% ${100 / GRID_ROWS}%`,
        }}
      />

      {grid.map((row, rIdx) =>
        row.map((cell, cIdx) => {
          const key = `${rIdx}-${cIdx}`;
          const isHovered = hoverCells.has(key);
          const isClearing = clearingRows.has(rIdx);

          return (
            <div
              key={key}
              className={clsx(
                "relative transition-colors duration-75",
                isHovered && isValidHover && "bg-white/15 ring-1 ring-inset ring-white/30",
                isHovered && !isValidHover && "bg-red-500/20 ring-1 ring-inset ring-red-400/30"
              )}
            >
              <AnimatePresence>
                {cell.blockId && !isClearing && (
                  <motion.div
                    key={cell.blockId + key}
                    className="absolute inset-[1px]"
                    initial={{ scale: 0.6, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 1.2, opacity: 0 }}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  >
                    <MiniBlock
                      type={cell.type!}
                      insured={cell.insured}
                      value={cell.miniBlockValue}
                      animate={false}
                    />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Hover preview cell */}
              {isHovered && isValidHover && hoverInfo && (
                <div className="absolute inset-[1px]">
                  <MiniBlock
                    type={hoverInfo.block.type}
                    insured={hoverInfo.block.insured}
                    isPreview
                    animate={false}
                  />
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
