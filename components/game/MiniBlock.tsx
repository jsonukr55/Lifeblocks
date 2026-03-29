"use client";

import { motion } from "framer-motion";
import { BlockType } from "@/types";

export const TYPE_COLORS: Record<BlockType, string> = {
  health: "from-rose-500 to-pink-600",
  vehicle: "from-blue-500 to-cyan-600",
  property: "from-amber-500 to-yellow-600",
  lifestyle: "from-purple-500 to-violet-600",
  insurance: "from-green-500 to-emerald-600",
  fd: "from-emerald-400 to-teal-500",
  drinking: "from-orange-500 to-red-500",
  liability: "from-red-600 to-rose-700",
  assets: "from-teal-400 to-cyan-500",
};

export const TYPE_BG: Record<BlockType, string> = {
  health: "bg-rose-500",
  vehicle: "bg-blue-500",
  property: "bg-amber-500",
  lifestyle: "bg-purple-500",
  insurance: "bg-green-500",
  fd: "bg-emerald-400",
  drinking: "bg-orange-500",
  liability: "bg-red-600",
  assets: "bg-teal-400",
};

interface Props {
  type: BlockType;
  insured: boolean;
  value?: number;
  isPreview?: boolean;
  animate?: boolean;
}

export default function MiniBlock({
  type,
  insured,
  isPreview = false,
  animate = true,
}: Props) {
  return (
    <motion.div
      className={`
        w-full h-full bg-gradient-to-br ${TYPE_COLORS[type]}
        rounded-[3px] flex items-center justify-center relative overflow-hidden
        ${insured ? "ring-1 ring-white/40" : ""}
        ${isPreview ? "opacity-60" : "opacity-100"}
      `}
      initial={animate && !isPreview ? { scale: 0.5, opacity: 0 } : undefined}
      animate={animate && !isPreview ? { scale: 1, opacity: 1 } : undefined}
      transition={{ type: "spring", stiffness: 500, damping: 25 }}
    >
      {/* Shine overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent pointer-events-none" />

      {/* Insured indicator - small dot */}
      {insured && (
        <div className="w-1.5 h-1.5 rounded-full bg-white/70 shadow-sm z-10" />
      )}
    </motion.div>
  );
}
