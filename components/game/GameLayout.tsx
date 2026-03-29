"use client";

import GameBoard from "./GameBoard";
import SideTray from "./SideTray";
import CalcPanel from "./CalcPanel";
import InsuranceMeter from "./InsuranceMeter";
import ScorePanel from "./ScorePanel";
import FeedbackToast from "./FeedbackToast";
import DragLayer from "./DragLayer";
import { useGameStore } from "@/store/useGameStore";
import { Pause, Play, RotateCcw, User } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function GameLayout() {
  const phase = useGameStore((s) => s.phase);
  const username = useGameStore((s) => s.username);
  const pauseGame = useGameStore((s) => s.pauseGame);
  const resumeGame = useGameStore((s) => s.resumeGame);
  const resetGame = useGameStore((s) => s.resetGame);

  return (
    <div className="min-h-dvh flex flex-col bg-slate-950 p-2 sm:p-3 gap-2 sm:gap-3 max-w-4xl mx-auto w-full">
      {/* Top bar: username + score + insurance meter + controls */}
      <div className="flex items-center gap-2 flex-wrap">
        {/* Username badge */}
        <div className="flex items-center gap-1.5 bg-slate-900/80 rounded-xl px-3 py-1.5 border border-slate-700/80 flex-shrink-0">
          <User className="w-3.5 h-3.5 text-cyan-400" />
          <span className="text-xs font-bold text-white max-w-[80px] truncate">{username}</span>
        </div>

        <ScorePanel />

        <div className="flex-1 min-w-[120px]">
          <InsuranceMeter />
        </div>

        <div className="flex gap-1.5 flex-shrink-0">
          <button
            onClick={phase === "playing" ? pauseGame : resumeGame}
            className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/80
                       flex items-center justify-center text-slate-400
                       hover:bg-slate-700 hover:text-white transition-colors active:scale-95"
            title={phase === "playing" ? "Pause" : "Resume"}
          >
            {phase === "playing" ? (
              <Pause className="w-4 h-4" />
            ) : (
              <Play className="w-4 h-4" />
            )}
          </button>
          <button
            onClick={resetGame}
            className="w-9 h-9 rounded-xl bg-slate-800/80 border border-slate-700/80
                       flex items-center justify-center text-slate-400
                       hover:bg-slate-700 hover:text-red-400 transition-colors active:scale-95"
            title="Restart"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main play area: CalcPanel | GameBoard | SideTray */}
      <div className="flex gap-2 sm:gap-3 flex-1 items-start">
        {/* Calculations panel — hidden on mobile/tablet, visible on large screens */}
        <div className="hidden lg:flex">
          <CalcPanel />
        </div>

        {/* Game board — fixed max-width so it never expands beyond Tetris size */}
        <div className="flex-1 flex items-start justify-center min-w-0">
          <div className="w-full" style={{ maxWidth: "360px" }}>
            <GameBoard />
          </div>
        </div>

        {/* Block tray — right side */}
        <SideTray />
      </div>

      {/* CalcPanel shown below the board on mobile/tablet */}
      <div className="flex lg:hidden">
        <CalcPanel />
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-1.5 justify-center pb-1">
        {(
          [
            ["health", "🏥"],
            ["vehicle", "🚗"],
            ["property", "🏠"],
            ["fd", "💰"],
            ["assets", "📈"],
            ["insurance", "🛡️"],
            ["lifestyle", "🎭"],
            ["drinking", "🍺"],
            ["liability", "⚠️"],
          ] as [string, string][]
        ).map(([type, emoji]) => (
          <div
            key={type}
            className="flex items-center gap-0.5 text-[9px] text-slate-500 capitalize"
          >
            <span>{emoji}</span>
            <span>{type}</span>
          </div>
        ))}
      </div>

      {/* Pause overlay */}
      <AnimatePresence>
        {phase === "paused" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-30"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-slate-900 rounded-2xl p-8 text-center border border-slate-700 shadow-2xl"
            >
              <Pause className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <div className="text-2xl font-black text-white mb-2">Paused</div>
              <div className="text-slate-500 text-sm mb-1">
                Good move,{" "}
                <span className="text-cyan-400 font-semibold">{username}</span>!
              </div>
              <p className="text-slate-400 text-sm mb-6">
                Take a breath and plan your next move.
              </p>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={resumeGame}
                className="flex items-center gap-2 mx-auto px-8 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl font-bold text-white shadow-lg"
              >
                <Play className="w-4 h-4" />
                Resume
              </motion.button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating layers */}
      <DragLayer />
      <FeedbackToast />
    </div>
  );
}
