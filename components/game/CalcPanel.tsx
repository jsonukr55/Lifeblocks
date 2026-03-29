"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useGameStore } from "@/store/useGameStore";
import { BlockType } from "@/types";
import { TrendingUp, TrendingDown, Calculator, BarChart2 } from "lucide-react";

const TYPE_EMOJI: Record<BlockType, string> = {
  health: "🏥",
  vehicle: "🚗",
  property: "🏠",
  lifestyle: "🎭",
  insurance: "🛡️",
  fd: "💰",
  drinking: "🍺",
  liability: "⚠️",
  assets: "📈",
};

const TYPE_COLORS: Record<BlockType, string> = {
  health: "text-rose-400",
  vehicle: "text-blue-400",
  property: "text-amber-400",
  lifestyle: "text-purple-400",
  insurance: "text-green-400",
  fd: "text-emerald-400",
  drinking: "text-orange-400",
  liability: "text-red-400",
  assets: "text-teal-400",
};

function fmt(n: number) {
  return `₹${Math.abs(n).toLocaleString("en-IN")}`;
}

export default function CalcPanel() {
  const calcHistory = useGameStore((s) => s.calcHistory);
  const placedBlocks = useGameStore((s) => s.placedBlocks);
  const score = useGameStore((s) => s.score);
  const insuranceBalance = useGameStore((s) => s.insuranceBalance);
  const initialInsurance = useGameStore((s) => s.initialInsurance);

  const categoryBreakdown = placedBlocks.reduce<Record<string, number>>((acc, pb) => {
    const key = pb.block.type;
    acc[key] = (acc[key] ?? 0) + pb.block.totalCost;
    return acc;
  }, {});

  const totalSpent = Object.values(categoryBreakdown).reduce((a, b) => a + b, 0);
  const netChange = insuranceBalance - initialInsurance;

  // Summary card — shared between mobile row and desktop column
  const SummaryCard = (
    <div className="bg-slate-900/80 rounded-xl border border-slate-700/80 p-2.5 backdrop-blur-sm flex-1 lg:flex-none">
      <div className="flex items-center gap-1.5 mb-2">
        <Calculator className="w-3 h-3 text-cyan-400" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Summary
        </span>
      </div>
      <div className="flex lg:flex-col gap-3 lg:gap-1.5">
        <div>
          <div className="text-[9px] text-slate-600 uppercase tracking-wider">Spent</div>
          <div className="text-xs font-bold text-slate-300 tabular-nums">{fmt(totalSpent)}</div>
        </div>
        <div>
          <div className="text-[9px] text-slate-600 uppercase tracking-wider">Net</div>
          <div className={`text-xs font-bold tabular-nums ${netChange >= 0 ? "text-emerald-400" : "text-red-400"}`}>
            {netChange >= 0 ? "+" : ""}{fmt(netChange)}
          </div>
        </div>
        <div>
          <div className="text-[9px] text-slate-600 uppercase tracking-wider">Score</div>
          <div className="text-xs font-bold text-amber-400 tabular-nums">{fmt(score)}</div>
        </div>
      </div>
    </div>
  );

  // Category breakdown card
  const CategoryCard = Object.keys(categoryBreakdown).length > 0 ? (
    <div className="bg-slate-900/80 rounded-xl border border-slate-700/80 p-2.5 backdrop-blur-sm flex-1 lg:flex-none">
      <div className="flex items-center gap-1.5 mb-2">
        <BarChart2 className="w-3 h-3 text-purple-400" />
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          By Category
        </span>
      </div>
      <div className="space-y-1">
        {(Object.entries(categoryBreakdown) as [BlockType, number][])
          .sort((a, b) => b[1] - a[1])
          .map(([type, amount]) => {
            const pct = totalSpent > 0 ? (amount / totalSpent) * 100 : 0;
            return (
              <div key={type}>
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-0.5">
                    <span className="text-[9px]">{TYPE_EMOJI[type]}</span>
                    <span className={`text-[9px] capitalize font-medium ${TYPE_COLORS[type]}`}>
                      {type === "fd" ? "FD" : type}
                    </span>
                  </div>
                  <span className="text-[9px] text-slate-500 tabular-nums">{pct.toFixed(0)}%</span>
                </div>
                <div className="h-1 bg-slate-800 rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${pct}%` }}
                    transition={{ type: "spring", stiffness: 100, damping: 20 }}
                  />
                </div>
                <div className="text-[8px] text-slate-600 tabular-nums mt-0.5">{fmt(amount)}</div>
              </div>
            );
          })}
      </div>
    </div>
  ) : null;

  // Row log card
  const RowLogCard = (
    <div className="bg-slate-900/80 rounded-xl border border-slate-700/80 p-2.5 backdrop-blur-sm flex-1 lg:flex-none">
      <div className="flex items-center gap-1.5 mb-2">
        {calcHistory.length > 0 && calcHistory[0].isGood ? (
          <TrendingUp className="w-3 h-3 text-emerald-400" />
        ) : (
          <TrendingDown className="w-3 h-3 text-slate-500" />
        )}
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Row Log
        </span>
      </div>

      {calcHistory.length === 0 ? (
        <p className="text-[9px] text-slate-600 text-center mt-2 leading-tight">
          Complete rows to see calculations
        </p>
      ) : (
        <div className="space-y-1.5 max-h-40 lg:max-h-52 overflow-y-auto">
          <AnimatePresence initial={false}>
            {calcHistory.map((entry) => (
              <motion.div
                key={entry.id}
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ type: "spring", stiffness: 400, damping: 30 }}
                className={`p-1.5 rounded-lg border ${
                  entry.isGood
                    ? "bg-emerald-500/10 border-emerald-500/20"
                    : "bg-red-500/10 border-red-500/20"
                }`}
              >
                <div className={`text-xs font-black tabular-nums ${entry.delta >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                  {entry.delta >= 0 ? "+" : ""}{fmt(entry.delta)}
                </div>
                <div className="text-[9px] text-slate-500 tabular-nums">
                  Row: {fmt(entry.rowValue)}
                </div>
                <div className="flex flex-wrap gap-0.5 mt-0.5">
                  {entry.blocksInRow.map((type) => (
                    <span key={type} className="text-[8px]" title={type}>
                      {TYPE_EMOJI[type]}
                    </span>
                  ))}
                </div>
                <div className="text-[8px] text-slate-600 mt-0.5 leading-tight line-clamp-2">
                  {entry.reason}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );

  return (
    <>
      {/* Desktop: vertical column on the left */}
      <div className="hidden lg:flex flex-col gap-2 w-[130px] flex-shrink-0">
        {SummaryCard}
        {CategoryCard}
        {RowLogCard}
      </div>

      {/* Mobile/tablet: horizontal row of cards below the board */}
      <div className="flex lg:hidden gap-2 w-full overflow-x-auto pb-1">
        <div className="flex-shrink-0 w-[140px]">{SummaryCard}</div>
        {CategoryCard && <div className="flex-shrink-0 w-[160px]">{CategoryCard}</div>}
        <div className="flex-shrink-0 w-[160px]">{RowLogCard}</div>
      </div>
    </>
  );
}
