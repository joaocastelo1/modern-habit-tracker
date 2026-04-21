import React from "react";
import { motion } from "motion/react";
import { 
  Plus, 
  Droplets, 
  BookOpen, 
  Flower2, 
  Dumbbell, 
  CheckSquare,
  Trash2
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface HabitModalProps {
  editingHabitId: number | null;
  newHabit: {
    title: string;
    description: string;
    icon: string;
    color: string;
    target_value: string;
  };
  setNewHabit: (habit: any) => void;
  handleCloseModal: () => void;
  saveHabit: (e: React.FormEvent) => void;
  deleteHabit: (id: number) => void;
}

export const HabitModal: React.FC<HabitModalProps> = ({
  editingHabitId,
  newHabit,
  setNewHabit,
  handleCloseModal,
  saveHabit,
  deleteHabit
}) => {
  return (
    <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[40px] p-8 w-full max-w-md shadow-2xl"
      >
        <h2 className="text-2xl font-black text-slate-800 mb-6">{editingHabitId ? "Editar Hábito" : "Novo Hábito"}</h2>
        <form onSubmit={saveHabit} className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">O que você quer cultivar?</label>
            <input 
              autoFocus
              required
              type="text" 
              placeholder="Ex: Beber 2L de água"
              className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-400 outline-none font-medium text-slate-800"
              value={newHabit.title}
              onChange={e => setNewHabit({...newHabit, title: e.target.value})}
            />
          </div>
          
          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Descrição (opcional)</label>
            <input 
              type="text" 
              placeholder="Ex: Pelo menos 8 copos por dia"
              className="w-full bg-slate-50 border-none rounded-2xl p-4 focus:ring-2 focus:ring-emerald-400 outline-none font-medium text-slate-800"
              value={newHabit.description}
              onChange={e => setNewHabit({...newHabit, description: e.target.value})}
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Cor e Ícone</label>
            <div className="grid grid-cols-5 gap-3 mb-4">
              {['emerald', 'blue', 'purple', 'rose', 'orange'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setNewHabit({...newHabit, color: c})}
                  className={cn(
                    "h-10 rounded-xl transition-all border-2",
                    newHabit.color === c ? "border-slate-800 scale-105" : "border-transparent opacity-60 hover:opacity-100",
                    c === 'emerald' && "bg-emerald-400",
                    c === 'blue' && "bg-blue-400",
                    c === 'purple' && "bg-purple-400",
                    c === 'rose' && "bg-rose-400",
                    c === 'orange' && "bg-orange-400"
                  )}
                />
              ))}
            </div>
            <div className="flex justify-between">
              {[
                { name: "Droplets", icon: Droplets },
                { name: "BookOpen", icon: BookOpen },
                { name: "Flower2", icon: Flower2 },
                { name: "Dumbbell", icon: Dumbbell },
                { name: "CheckSquare", icon: CheckSquare },
              ].map((item) => (
                <button
                  key={item.name}
                  type="button"
                  onClick={() => setNewHabit({...newHabit, icon: item.name})}
                  className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                    newHabit.icon === item.name 
                      ? "bg-slate-800 text-white shadow-lg" 
                      : "bg-slate-50 text-slate-400 hover:bg-slate-100"
                  )}
                >
                  <item.icon size={20} />
                </button>
              ))}
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-4">
            <div className="flex gap-3">
              <button 
                type="button"
                onClick={handleCloseModal}
                className="flex-1 py-4 rounded-2xl font-bold text-slate-400 hover:bg-slate-50 transition-colors"
              >
                Cancelar
              </button>
              <button 
                type="submit"
                className="flex-1 py-4 bg-emerald-400 text-white rounded-2xl font-bold shadow-lg shadow-emerald-200 hover:bg-emerald-500 transition-colors"
              >
                {editingHabitId ? "Salvar" : "Adicionar"}
              </button>
            </div>
            {editingHabitId && (
              <button 
                type="button"
                onClick={() => {
                  if (editingHabitId) {
                    deleteHabit(editingHabitId);
                    handleCloseModal();
                  }
                }}
                className="w-full py-4 text-red-500 font-bold hover:bg-red-50 rounded-2xl transition-colors flex items-center justify-center gap-2"
              >
                <Trash2 size={18} />
                Deletar Hábito
              </button>
            )}
          </div>
        </form>
      </motion.div>
    </div>
  );
};
