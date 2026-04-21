import React from "react";
import { motion } from "motion/react";
import { 
  Check, 
  Settings, 
  Trash2, 
  Plus,
  Droplets,
  BookOpen,
  Flower2,
  Dumbbell,
  CheckSquare
} from "lucide-react";
import { Habit } from "../types";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HabitItemProps {
  habit: Habit;
  toggleHabit: (id: number) => void;
  openEditModal: (habit: Habit) => void;
  deleteHabit: (id: number) => void;
  setShowAddModal: (show: boolean) => void;
}

export const HabitItem: React.FC<HabitItemProps> = ({
  habit,
  toggleHabit,
  openEditModal,
  deleteHabit,
  setShowAddModal
}) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 10 }}
      className={cn(
        "group flex items-center justify-between p-5 rounded-3xl border transition-all duration-300",
        habit.completed_today 
          ? "bg-emerald-50 border-emerald-100" 
          : "bg-white border-slate-100 hover:border-emerald-200 shadow-sm"
      )}
    >
      <div className="flex items-center gap-4">
        <motion.button 
          whileTap={{ scale: 0.8 }}
          onClick={() => toggleHabit(habit.id)}
          className={cn(
            "w-8 h-8 rounded-xl border-2 flex items-center justify-center transition-all duration-300",
            habit.completed_today 
              ? "bg-emerald-400 border-emerald-400 text-white" 
              : "border-slate-200 text-transparent group-hover:border-emerald-300"
          )}
        >
          <Check size={18} strokeWidth={3} />
        </motion.button>
        <div className="cursor-pointer" onClick={() => openEditModal(habit)}>
          <h3 className={cn(
            "font-bold text-lg transition-all",
            habit.completed_today ? "text-emerald-700 line-through opacity-60" : "text-slate-700"
          )}>
            {habit.title}
          </h3>
          {habit.description && <p className="text-xs text-slate-400">{habit.description}</p>}
        </div>
      </div>
      
      <div className="flex items-center gap-6">
        <div className="hidden sm:flex items-center gap-2">
          <button 
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 rounded-xl text-xs font-bold transition-all"
          >
            <Plus size={14} /> Adicionar
          </button>
          <button 
            onClick={() => openEditModal(habit)}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 text-slate-500 hover:bg-blue-50 hover:text-blue-600 rounded-xl text-xs font-bold transition-all"
          >
            <Settings size={14} /> Editar
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); deleteHabit(habit.id); }}
            className="flex items-center gap-1.5 px-3 py-2 bg-slate-50 text-slate-400 hover:bg-red-50 hover:text-red-500 rounded-xl text-xs font-bold transition-all"
          >
            <Trash2 size={14} /> Remover
          </button>
        </div>
        
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-slate-50 text-slate-400">
           {habit.icon === "Droplets" && <Droplets size={20} />}
           {habit.icon === "BookOpen" && <BookOpen size={20} />}
           {habit.icon === "Flower2" && <Flower2 size={20} />}
           {habit.icon === "Dumbbell" && <Dumbbell size={20} />}
           {habit.icon === "CheckSquare" && <CheckSquare size={20} />}
        </div>
      </div>
    </motion.div>
  );
};
