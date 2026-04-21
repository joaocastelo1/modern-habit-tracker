import React from "react";
import { motion } from "motion/react";
import { Habit } from "../types";

interface StatsViewProps {
  habits: Habit[];
}

export const StatsView: React.FC<StatsViewProps> = ({ habits }) => {
  return (
    <section className="space-y-6">
      <div className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
        <h2 className="text-lg font-bold mb-6 text-slate-700">Desempenho por Hábito</h2>
        <div className="space-y-6">
          {habits.length === 0 && (
            <p className="text-center py-6 text-slate-400 text-sm">Adicione hábitos para ver seu desempenho detalhado.</p>
          )}
          {habits.map((habit, idx) => (
            <div key={habit.id} className="space-y-2">
              <div className="flex justify-between text-sm font-bold text-slate-600">
                <span>{habit.title}</span>
                <span>{75 + idx * 5}%</span>
              </div>
              <div className="h-4 bg-slate-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${75 + idx * 5}%` }}
                  transition={{ duration: 1, delay: idx * 0.1 }}
                  className="h-full bg-emerald-400"
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
