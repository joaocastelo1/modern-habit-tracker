import React from "react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface HeaderProps {
  activeTab: string;
}

export const Header: React.FC<HeaderProps> = ({ activeTab }) => {
  const today = format(new Date(), "EEEE, d 'de' MMMM", { locale: ptBR });

  return (
    <header className="mb-8 text-center">
      <h1 className="text-3xl font-bold text-slate-800 mb-1">
        {activeTab === "dashboard" && "Painel de Hábitos Moderno"}
        {activeTab === "habits" && "Meus Hábitos"}
        {activeTab === "calendar" && "Calendário de Consistência"}
        {activeTab === "stats" && "Análise de Desempenho"}
        {activeTab === "settings" && "Configurações"}
      </h1>
      <p className="text-slate-500 font-medium lowercase first-letter:uppercase">Olá, Sofia! – {today}</p>
    </header>
  );
};
