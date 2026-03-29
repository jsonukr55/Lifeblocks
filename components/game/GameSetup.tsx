"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { Shield, Zap, Trophy, User } from "lucide-react";

const PRESETS = [
  {
    label: "Starter",
    value: 20000,
    icon: Zap,
    desc: "Tight budget · High stakes",
    color: "from-orange-500 to-red-500",
    ring: "ring-orange-500/50",
  },
  {
    label: "Standard",
    value: 50000,
    icon: Shield,
    desc: "Balanced gameplay",
    color: "from-blue-500 to-cyan-500",
    ring: "ring-blue-500/50",
    recommended: true,
  },
  {
    label: "Premium",
    value: 100000,
    icon: Trophy,
    desc: "Room to experiment",
    color: "from-emerald-500 to-teal-500",
    ring: "ring-emerald-500/50",
  },
];

const BLOCK_INFO = [
  { emoji: "🏥", label: "Health", desc: "Essential, medium risk" },
  { emoji: "💰", label: "Fixed Deposit", desc: "Low risk, bonus reward" },
  { emoji: "📈", label: "Assets", desc: "Long-term investment boost" },
  { emoji: "🛡️", label: "Insurance", desc: "Reduces row penalties" },
  { emoji: "🍺", label: "Drinking", desc: "High risk, heavy penalty" },
  { emoji: "⚠️", label: "Liability", desc: "Recurring penalties" },
];

export default function GameSetup() {
  const [selected, setSelected] = useState(50000);
  const [custom, setCustom] = useState("");
  const [username, setUsername] = useState("");
  const initGame = useGameStore((s) => s.initGame);

  const handleStart = () => {
    const amount = custom ? parseInt(custom, 10) : selected;
    if (amount >= 1000) initGame(amount, username);
  };

  const effectiveAmount = custom ? parseInt(custom, 10) || 0 : selected;

  return (
    <div className="min-h-dvh flex items-start sm:items-center justify-center p-4 py-6 bg-slate-950 overflow-y-auto">
      {/* Background decoration */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -left-40 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-40 -right-40 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-purple-500/5 rounded-full blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="relative bg-slate-900/95 rounded-2xl p-6 max-w-md w-full shadow-2xl border border-slate-700/80 backdrop-blur-sm"
      >
        {/* Header */}
        <div className="text-center mb-6">
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 300 }}
            className="text-5xl mb-3"
          >
            🧱
          </motion.div>
          <h1 className="text-3xl font-black bg-gradient-to-r from-emerald-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent mb-1">
            LifeBlocks
          </h1>
          <p className="text-slate-400 text-sm">
            Build your financial life, one block at a time.
          </p>
        </div>

        {/* Username */}
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
            <User className="w-3.5 h-3.5" />
            Your Name
          </h2>
          <input
            type="text"
            placeholder="Enter your name (optional)..."
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            maxLength={24}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5
                       text-sm text-slate-300 placeholder:text-slate-600
                       focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30
                       transition-colors"
          />
        </div>

        {/* Insurance selection */}
        <div className="mb-4">
          <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3 flex items-center gap-1.5">
            <Shield className="w-3.5 h-3.5" />
            Starting Insurance Balance
          </h2>

          <div className="grid grid-cols-3 gap-2">
            {PRESETS.map((p) => {
              const Icon = p.icon;
              const isSelected = selected === p.value && !custom;
              return (
                <motion.button
                  key={p.value}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    setSelected(p.value);
                    setCustom("");
                  }}
                  className={`
                    relative p-3 rounded-xl border text-left transition-all
                    ${
                      isSelected
                        ? `border-transparent bg-gradient-to-br ${p.color} bg-opacity-20 ring-2 ${p.ring}`
                        : "border-slate-700 bg-slate-800/50 hover:border-slate-600"
                    }
                  `}
                >
                  {p.recommended && (
                    <div className="absolute -top-1.5 -right-1.5 bg-cyan-500 text-white text-[8px] font-bold px-1.5 py-0.5 rounded-full">
                      REC
                    </div>
                  )}
                  <Icon
                    className={`w-4 h-4 mb-1 ${
                      isSelected ? "text-white" : "text-slate-500"
                    }`}
                  />
                  <div
                    className={`font-bold text-sm ${
                      isSelected ? "text-white" : "text-slate-300"
                    }`}
                  >
                    {p.label}
                  </div>
                  <div
                    className={`text-xs font-semibold ${
                      isSelected ? "text-white/80" : "text-slate-400"
                    }`}
                  >
                    ₹{(p.value / 1000).toFixed(0)}k
                  </div>
                  <div
                    className={`text-[9px] mt-0.5 ${
                      isSelected ? "text-white/60" : "text-slate-600"
                    }`}
                  >
                    {p.desc}
                  </div>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Custom input */}
        <div className="mb-5">
          <input
            type="number"
            placeholder="Or enter custom amount (min ₹1,000)..."
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            className="w-full bg-slate-800/80 border border-slate-700 rounded-xl px-4 py-2.5
                       text-sm text-slate-300 placeholder:text-slate-600
                       focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/30
                       transition-colors"
          />
          {custom && effectiveAmount < 1000 && (
            <p className="text-red-400 text-xs mt-1 ml-1">Minimum amount is ₹1,000</p>
          )}
        </div>

        {/* How to play */}
        <div className="mb-5 p-3 bg-slate-800/60 rounded-xl border border-slate-700/50">
          <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
            Block Types
          </h3>
          <div className="grid grid-cols-2 gap-1">
            {BLOCK_INFO.map((info) => (
              <div key={info.label} className="flex items-start gap-1.5">
                <span className="text-sm leading-none mt-0.5">{info.emoji}</span>
                <div>
                  <div className="text-[10px] font-semibold text-slate-300">{info.label}</div>
                  <div className="text-[9px] text-slate-600">{info.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start button */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          onClick={handleStart}
          disabled={effectiveAmount < 1000}
          className="w-full py-3.5 rounded-xl font-black text-base
                     bg-gradient-to-r from-emerald-500 via-cyan-500 to-blue-500
                     text-white shadow-lg shadow-emerald-500/20
                     disabled:opacity-40 disabled:cursor-not-allowed
                     transition-opacity"
        >
          Start Game · ₹{effectiveAmount.toLocaleString("en-IN")}
        </motion.button>
      </motion.div>
    </div>
  );
}
