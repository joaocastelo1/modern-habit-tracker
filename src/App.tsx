import React, { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Habit, WeeklyStat } from "./types";

// Components
import { Sidebar } from "./components/Sidebar";
import { Header } from "./components/Header";
import { Dashboard } from "./components/Dashboard";
import { HabitList } from "./components/HabitList";
import { HabitModal } from "./components/HabitModal";
import { CalendarView } from "./components/CalendarView";
import { StatsView } from "./components/StatsView";
import { SettingsView } from "./components/SettingsView";

export default function App() {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [weeklyStats, setWeeklyStats] = useState<WeeklyStat[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [editingHabitId, setEditingHabitId] = useState<number | null>(null);
  const [newHabit, setNewHabit] = useState({ 
    title: "", 
    description: "", 
    icon: "CheckSquare", 
    color: "emerald", 
    target_value: "" 
  });

  // Load from LocalStorage on mount
  useEffect(() => {
    const savedHabits = localStorage.getItem("habits_cache");
    if (savedHabits) {
      try {
        setHabits(JSON.parse(savedHabits));
      } catch (e) {
        console.error("Failed to parse LocalStorage habits", e);
      }
    }
    fetchHabits();
    fetchStats();
  }, []);

  // Save to LocalStorage whenever habits change
  useEffect(() => {
    if (habits.length > 0) {
      localStorage.setItem("habits_cache", JSON.stringify(habits));
    }
  }, [habits]);

  const fetchHabits = async () => {
    try {
      const res = await fetch("/api/habits");
      const data = await res.json();
      setHabits(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("API error, check server.ts:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const res = await fetch("/api/stats/weekly");
      const data = await res.json();
      setWeeklyStats(data || []);
    } catch (err) {
      console.error(err);
    }
  };

  const toggleHabit = async (id: number) => {
    try {
      const res = await fetch(`/api/habits/${id}/toggle`, { method: "POST" });
      if (res.ok) {
        setHabits(habits.map(h => h.id === id ? { ...h, completed_today: !h.completed_today } : h));
        fetchStats();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const saveHabit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const isEditing = editingHabitId !== null;
      const url = isEditing ? `/api/habits/${editingHabitId}` : "/api/habits";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHabit)
      });
      if (res.ok) {
        handleCloseModal();
        fetchHabits();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleCloseModal = () => {
    setShowAddModal(false);
    setEditingHabitId(null);
    setNewHabit({ title: "", description: "", icon: "CheckSquare", color: "emerald", target_value: "" });
  };

  const openEditModal = (habit: Habit) => {
    setEditingHabitId(habit.id);
    setNewHabit({
      title: habit.title,
      description: habit.description || "",
      icon: habit.icon || "CheckSquare",
      color: habit.color || "emerald",
      target_value: habit.target_value || ""
    });
    setShowAddModal(true);
  };

  const deleteHabit = async (id: number) => {
    if (!confirm("Tem certeza que deseja excluir este hábito?")) return;
    try {
      const res = await fetch(`/api/habits/${id}`, { method: "DELETE" });
      if (res.ok) fetchHabits();
    } catch (err) {
      console.error(err);
    }
  };

  const resetAllData = async () => {
    if (!confirm("⚠️ ATENÇÃO: Isso irá apagar TODOS os hábitos e estatísticas permanentemente. Deseja continuar?")) return;
    try {
      localStorage.removeItem("habits_cache");
      const res = await fetch("/api/habits/reset/all", { method: "DELETE" });
      if (res.ok) {
        setHabits([]);
        setWeeklyStats([]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const completionRate = habits.length > 0 
    ? Math.round((habits.filter(h => h.completed_today).length / habits.length) * 100) 
    : 0;

  return (
    <div className="flex h-screen bg-slate-50 font-sans text-slate-900 overflow-hidden">
      {/* Sidebar Navigation */}
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto p-4 md:p-8 relative">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="max-w-4xl mx-auto"
          >
            <Header activeTab={activeTab} />

            <div className="space-y-6">
              {activeTab === "dashboard" && (
                <Dashboard 
                  habits={habits}
                  weeklyStats={weeklyStats}
                  completionRate={completionRate}
                  resetAllData={resetAllData}
                  setActiveTab={setActiveTab}
                />
              )}

              {activeTab === "habits" && (
                <HabitList 
                  habits={habits}
                  loading={loading}
                  toggleHabit={toggleHabit}
                  openEditModal={openEditModal}
                  deleteHabit={deleteHabit}
                  resetAllData={resetAllData}
                  setShowAddModal={setShowAddModal}
                  setEditingHabitId={setEditingHabitId}
                  setNewHabit={setNewHabit}
                />
              )}

              {activeTab === "calendar" && <CalendarView />}
              {activeTab === "stats" && <StatsView habits={habits} />}
              {activeTab === "settings" && <SettingsView />}
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Global Floating Action Button */}
        <motion.button 
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => {
            setEditingHabitId(null);
            setNewHabit({ title: "", description: "", icon: "CheckSquare", color: "emerald", target_value: "" });
            setShowAddModal(true);
          }}
          className="fixed bottom-8 right-8 w-16 h-16 md:w-20 md:h-20 bg-emerald-300 hover:bg-emerald-400 text-emerald-900 rounded-full shadow-lg shadow-emerald-200 flex flex-col items-center justify-center transition-all duration-300 z-40"
        >
          <Plus size={32} />
          <span className="text-[10px] font-bold uppercase mt-1 leading-tight text-center hidden md:block">Novo<br/>Hábito</span>
        </motion.button>

        {/* Unified Modal Overlay */}
        {showAddModal && (
          <HabitModal 
            editingHabitId={editingHabitId}
            newHabit={newHabit}
            setNewHabit={setNewHabit}
            handleCloseModal={handleCloseModal}
            saveHabit={saveHabit}
            deleteHabit={deleteHabit}
          />
        )}
      </main>
    </div>
  );
}
