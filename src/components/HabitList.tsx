import React, { useState } from "react";
import { AnimatePresence } from "motion/react";
import { Habit } from "../types";
import { HabitItem } from "./HabitItem";

interface HabitListProps {
  habits: Habit[];
  loading: boolean;
  toggleHabit: (id: number) => void;
  openEditModal: (habit: Habit) => void;
  deleteHabit: (id: number) => void;
  resetAllData: () => void;
  setShowAddModal: (show: boolean) => void;
  setEditingHabitId: (id: number | null) => void;
  setNewHabit: (habit: any) => void;
}

export const HabitList: React.FC<HabitListProps> = ({
  habits,
  loading,
  toggleHabit,
  openEditModal,
  deleteHabit,
  resetAllData,
  setShowAddModal,
  setEditingHabitId,
  setNewHabit
}) => {
  const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');

  const filteredHabits = habits.filter(habit => {
    if (filter === 'pending') return !habit.completed_today;
    if (filter === 'completed') return habit.completed_today;
    return true;
  });

  return (
    <section className="space-y-4">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 px-2">
        <h2 className="text-lg font-bold text-slate-700">Gerenciar Hábitos</h2>
        
        <div className="flex flex-wrap items-center gap-3">
          {/* Filters */}
          <div className="flex bg-slate-100 p-1 rounded-xl">
            {(['all', 'pending', 'completed'] as const).map((f) => (
              <button
                key={f}
                onClick={() => setFilter(f)}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  filter === f 
                    ? "bg-white text-emerald-600 shadow-sm" 
                    : "text-slate-500 hover:text-slate-700"
                }`}
              >
                {f === 'all' && 'Todos'}
                {f === 'pending' && 'Pendentes'}
                {f === 'completed' && 'Concluídos'}
              </button>
            ))}
          </div>

          <div className="h-6 w-px bg-slate-200 hidden md:block"></div>

          <div className="flex gap-4">
            <button 
              onClick={resetAllData}
              className="text-xs font-bold text-red-100 hover:text-red-500 hover:underline transition-colors px-2"
            >
              Resetar Tudo
            </button>
            <button 
              onClick={() => {
                setEditingHabitId(null);
                setNewHabit({ title: "", description: "", icon: "CheckSquare", color: "emerald", target_value: "" });
                setShowAddModal(true);
              }}
              className="bg-emerald-400 text-white px-4 py-2 rounded-xl text-sm font-bold shadow-md hover:bg-emerald-500 transition-colors"
            >
              + Novo Hábito
            </button>
          </div>
        </div>
      </div>
      
      <div className="space-y-3">
        {filteredHabits.length === 0 && !loading && (
          <div className="text-center py-12 bg-white rounded-3xl border-2 border-dashed border-slate-200">
            <p className="text-slate-400">
              {filter === 'all' && 'Nenhum hábito cadastrado ainda.'}
              {filter === 'pending' && 'Nenhum hábito pendente! Parabéns! 🎉'}
              {filter === 'completed' && 'Nenhum hábito concluído ainda hoje. Vamos lá! 💪'}
            </p>
          </div>
        )}
        
        <AnimatePresence mode="popLayout">
          {filteredHabits.map((habit) => (
            <HabitItem 
              key={habit.id}
              habit={habit}
              toggleHabit={toggleHabit}
              openEditModal={openEditModal}
              deleteHabit={deleteHabit}
              setShowAddModal={setShowAddModal}
            />
          ))}
        </AnimatePresence>
      </div>
    </section>
  );
};
