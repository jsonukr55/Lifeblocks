"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { Star, Zap } from "lucide-react";

export default function ScorePanel() {
  const score = useGameStore((s) => s.score);
  const combo = useGameStore((s) => s.combo);
  const rowsCleared = useGameStore((s) => s.rowsCleared);

  return (
    <div className="flex items-center gap-2 flex-shrink-0">
      {/* Score */}
      <div className="bg-slate-900/90 rounded-xl px-3 py-1.5 border border-slate-700/80 backdrop-blur-sm">
        <div className="flex items-center gap-1 mb-0.5">
          <Star className="w-2.5 h-2.5 text-amber-400" />
          <span className="text-[9px] font-medium text-slate-500 uppercase tracking-wider">
            Score
          </span>
        </div>
        <motion.div
          key={score}
          initial={{ scale: 1.2, color: "#34d399" }}
          animate={{ scale: 1, color: "#ffffff" }}
          transition={{ type: "spring", stiffness: 400, damping: 20 }}
          className="text-sm font-black tabular-nums leading-none"
        >
          ₹{score.toLocaleString("en-IN")}
        </motion.div>
      </div>

      {/* Rows cleared */}
      <div className="bg-slate-900/90 rounded-xl px-2.5 py-1.5 border border-slate-700/80 backdrop-blur-sm">
        <div className="text-[9px] font-medium text-slate-500 uppercase tracking-wider mb-0.5">
          Rows
        </div>
        <div className="text-sm font-black text-slate-300 tabular-nums leading-none">
          {rowsCleared}
        </div>
      </div>

      {/* Combo badge */}
      {combo > 1 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="bg-amber-500/20 rounded-xl px-2.5 py-1.5 border border-amber-500/40 backdrop-blur-sm"
        >
          <div className="flex items-center gap-1 mb-0.5">
            <Zap className="w-2.5 h-2.5 text-amber-400" />
            <span className="text-[9px] font-medium text-amber-500 uppercase tracking-wider">
              Combo
            </span>
          </div>
          <div className="text-sm font-black text-amber-400 leading-none">
            x{combo}
          </div>
        </motion.div>
      )}
    </div>
  );
}
