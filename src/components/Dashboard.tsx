import React from "react";
import { motion } from "motion/react";
import { 
  BarChart3, 
  Check 
} from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Habit, WeeklyStat } from "../types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface DashboardProps {
  habits: Habit[];
  weeklyStats: WeeklyStat[];
  completionRate: number;
  resetAllData: () => void;
  setActiveTab: (tab: string) => void;
}

const chartData = [
  { name: "Seg", value: 80 },
  { name: "Ter", value: 90 },
  { name: "Qua", value: 70 },
  { name: "Qui", value: 85 },
  { name: "Sex", value: 95 },
  { name: "Sáb", value: 60 },
  { name: "Dom", value: 75 },
];

export const Dashboard: React.FC<DashboardProps> = ({
  habits,
  weeklyStats,
  completionRate,
  resetAllData,
  setActiveTab
}) => {
  return (
    <div className="space-y-6">
      {/* Weekly Progress Card */}
      <motion.section 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100"
      >
        <h2 className="text-lg font-bold mb-6 text-slate-700">Progresso Semanal</h2>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={weeklyStats.length > 0 ? weeklyStats.map(s => ({ name: s.date, value: s.count * 10 })) : chartData}>
              <XAxis 
                dataKey="name" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fill: '#64748b', fontSize: 12 }} 
                dy={10}
              />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' }}
              />
              <Bar dataKey="value" radius={[6, 6, 0, 0]} barSize={40}>
                {(weeklyStats.length > 0 ? weeklyStats : chartData).map((_, index) => (
                  <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#94a3b8' : '#6ee7b7'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.section>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Taxa de Conclusão</p>
            <p className="text-4xl font-black text-slate-800">{completionRate}%</p>
          </div>
          <div className="w-16 h-16 rounded-full border-8 border-emerald-100 border-t-emerald-400 flex items-center justify-center">
            <motion.div 
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-2 h-2 rounded-full bg-emerald-400"
            ></motion.div>
          </div>
        </motion.div>
        
        <motion.div 
          whileHover={{ y: -5 }}
          className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex items-center justify-between"
        >
          <div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Dias Consecutivos</p>
            <p className="text-4xl font-black text-slate-800">14</p>
          </div>
          <div className="h-12 w-px bg-slate-100"></div>
          <div className="text-emerald-500">
            <BarChart3 size={40} />
          </div>
        </motion.div>
      </div>

      {/* Today's Habits (Summary) */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-2">
           <h2 className="text-lg font-bold text-slate-700">Hábitos de Hoje</h2>
           <div className="flex gap-4">
              <button 
                onClick={resetAllData}
                className="text-xs font-bold text-red-400 hover:text-red-500 hover:underline transition-colors"
              >
                Resetar Tudo
              </button>
              <button onClick={() => setActiveTab("habits")} className="text-xs font-bold text-emerald-500 hover:underline">Ver Todos</button>
           </div>
        </div>
        <div className="space-y-3">
          {habits.length === 0 && (
            <p className="text-center py-6 text-slate-400 text-sm italic">Nenhum hábito para hoje. Que tal criar um?</p>
          )}
          {habits.slice(0, 3).map((habit) => (
            <motion.div 
              key={habit.id}
              className={cn(
                "flex items-center justify-between p-4 rounded-2xl border transition-all duration-300",
                habit.completed_today ? "bg-emerald-50 border-emerald-100" : "bg-white border-slate-100"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn("w-6 h-6 rounded-lg flex items-center justify-center", habit.completed_today ? "bg-emerald-400 text-white" : "bg-slate-100 text-slate-300")}>
                   <Check size={14} strokeWidth={3} />
                </div>
                <span className={cn("font-bold", habit.completed_today ? "text-emerald-700 line-through opacity-60" : "text-slate-700")}>{habit.title}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};
