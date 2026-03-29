"use client";

import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { calculateRank } from "@/lib/gameEngine";
import { Trophy, RotateCcw, Shield, Star } from "lucide-react";

const RANK_COLORS: Record<string, string> = {
  "Financial Guru": "from-amber-400 to-yellow-300",
  "Investment Expert": "from-emerald-400 to-cyan-400",
  "Savvy Saver": "from-blue-400 to-cyan-400",
  "Cautious Planner": "from-purple-400 to-violet-400",
  Beginner: "from-slate-400 to-slate-300",
};

const RANK_EMOJI: Record<string, string> = {
  "Financial Guru": "🏆",
  "Investment Expert": "💎",
  "Savvy Saver": "⭐",
  "Cautious Planner": "📊",
  Beginner: "🌱",
};

export default function GameOver() {
  const score = useGameStore((s) => s.score);
  const insuranceBalance = useGameStore((s) => s.insuranceBalance);
  const initialInsurance = useGameStore((s) => s.initialInsurance);
  const rowsCleared = useGameStore((s) => s.rowsCleared);
  const username = useGameStore((s) => s.username);
  const resetGame = useGameStore((s) => s.resetGame);

  const rank = calculateRank(score);
  const rankColor = RANK_COLORS[rank] ?? "from-slate-400 to-slate-300";
  const rankEmoji = RANK_EMOJI[rank] ?? "🎮";
  const survivalPct = ((insuranceBalance / initialInsurance) * 100).toFixed(0);

  const stats = [
    {
      label: "Final Score",
      value: `₹${score.toLocaleString("en-IN")}`,
      icon: Star,
      color: "text-amber-400",
    },
    {
      label: "Insurance Left",
      value: `₹${insuranceBalance.toLocaleString("en-IN")} (${survivalPct}%)`,
      icon: Shield,
      color: "text-emerald-400",
    },
    {
      label: "Rows Cleared",
      value: rowsCleared.toString(),
      icon: Trophy,
      color: "text-cyan-400",
    },
  ];

  return (
    <div className="min-h-dvh flex items-center justify-center p-4 bg-slate-950">
      {/* Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-amber-500/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative bg-slate-900/95 rounded-2xl p-6 max-w-sm w-full shadow-2xl border border-slate-700/80 text-center"
      >
        {/* Game over header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
        >
          <p className="text-slate-500 text-xs uppercase tracking-widest mb-1">
            Game Over
          </p>
          <h1 className="text-2xl font-black text-white mb-1">
            {insuranceBalance <= 0 ? "Insurance Depleted!" : "Grid Full!"}
          </h1>
          <p className="text-slate-400 text-sm mb-4">
            Great game,{" "}
            <span className="text-cyan-400 font-bold">{username}</span>!
          </p>
        </motion.div>

        {/* Rank */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
          className="mb-6"
        >
          <div className="text-5xl mb-2">{rankEmoji}</div>
          <div
            className={`text-2xl font-black bg-gradient-to-r ${rankColor} bg-clip-text text-transparent`}
          >
            {rank}
          </div>
        </motion.div>

        {/* Stats */}
        <div className="space-y-2 mb-6">
          {stats.map((stat, i) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.label}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="flex items-center justify-between bg-slate-800/60 rounded-xl px-4 py-2.5 border border-slate-700/50"
              >
                <div className="flex items-center gap-2">
                  <Icon className={`w-3.5 h-3.5 ${stat.color}`} />
                  <span className="text-xs text-slate-400">{stat.label}</span>
                </div>
                <span className="text-sm font-bold text-white tabular-nums">
                  {stat.value}
                </span>
              </motion.div>
            );
          })}
        </div>

        {/* Play again */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          onClick={resetGame}
          className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl
                     font-black text-base bg-gradient-to-r from-emerald-500 to-cyan-500
                     text-white shadow-lg shadow-emerald-500/20"
        >
          <RotateCcw className="w-4 h-4" />
          Play Again
        </motion.button>
      </motion.div>
    </div>
  );
}
