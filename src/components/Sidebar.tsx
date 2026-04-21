import React from "react";
import { motion } from "motion/react";
import { 
  LayoutDashboard, 
  CheckSquare, 
  Calendar, 
  BarChart3, 
  Settings 
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarItemProps {
  icon: React.ElementType;
  label: string;
  active?: boolean;
  onClick: () => void;
}

const SidebarItem = ({ icon: Icon, label, active = false, onClick }: SidebarItemProps) => (
  <motion.div 
    whileHover={{ x: 4 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={cn(
      "flex flex-col items-center justify-center py-4 px-2 cursor-pointer transition-all duration-200 group",
      active ? "bg-emerald-100 text-emerald-700 border-r-4 border-emerald-500" : "text-slate-400 hover:text-emerald-500"
    )}
  >
    <Icon size={24} className="mb-1 group-hover:scale-110 transition-transform" />
    <span className="text-[10px] font-medium uppercase tracking-wider">{label}</span>
  </motion.div>
);

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab }) => {
  return (
    <aside className="w-24 bg-white border-r border-slate-200 flex flex-col">
      <div className="h-24 flex items-center justify-center bg-emerald-400 text-white">
        <CheckSquare size={32} />
      </div>
      <nav className="flex-1">
        <SidebarItem 
          icon={LayoutDashboard} 
          label="Painel" 
          active={activeTab === "dashboard"} 
          onClick={() => setActiveTab("dashboard")} 
        />
        <SidebarItem 
          icon={CheckSquare} 
          label="Hábitos" 
          active={activeTab === "habits"} 
          onClick={() => setActiveTab("habits")} 
        />
        <SidebarItem 
          icon={Calendar} 
          label="Calendário" 
          active={activeTab === "calendar"} 
          onClick={() => setActiveTab("calendar")} 
        />
        <SidebarItem 
          icon={BarChart3} 
          label="Progresso" 
          active={activeTab === "stats"} 
          onClick={() => setActiveTab("stats")} 
        />
        <SidebarItem 
          icon={Settings} 
          label="Configurações" 
          active={activeTab === "settings"} 
          onClick={() => setActiveTab("settings")} 
        />
      </nav>
    </aside>
  );
};
