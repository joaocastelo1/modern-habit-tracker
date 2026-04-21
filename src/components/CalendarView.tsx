import React from "react";
import { motion } from "motion/react";
import { Flower2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const CalendarView: React.FC = () => {
  return (
    <section className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100">
      <div className="grid grid-cols-7 gap-2 mb-4 text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
        {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => <div key={day}>{day}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-3">
        {Array.from({ length: 31 }).map((_, i) => (
          <motion.div 
            key={i}
            whileHover={{ scale: 1.1 }}
            className={cn(
              "aspect-square rounded-2xl flex items-center justify-center text-sm font-bold transition-all",
              i + 1 === new Date().getDate() ? "bg-emerald-400 text-white shadow-lg shadow-emerald-200" : "bg-slate-50 text-slate-400"
            )}
          >
            {i + 1}
          </motion.div>
        ))}
      </div>
      <div className="mt-8 p-4 bg-emerald-50 rounded-2xl flex items-center gap-4">
         <div className="w-10 h-10 rounded-full bg-emerald-400 flex items-center justify-center text-white">
            <Flower2 size={20} />
         </div>
         <div>
            <p className="text-sm font-bold text-emerald-800">Você está em uma sequência de 5 dias!</p>
            <p className="text-xs text-emerald-600">Continue assim para desbloquear uma nova conquista.</p>
         </div>
      </div>
    </section>
  );
};
