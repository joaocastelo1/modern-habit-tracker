import React from "react";

export const SettingsView: React.FC = () => {
  return (
    <section className="bg-white rounded-[40px] p-8 shadow-sm border border-slate-100 divide-y divide-slate-100">
      <div className="py-6 flex items-center justify-between font-sans">
        <div>
          <h3 className="font-bold text-slate-700 text-lg">Perfil</h3>
          <p className="text-slate-400 text-sm">Gerencie suas informações pessoais</p>
        </div>
        <button className="text-emerald-500 font-bold hover:underline">Editar</button>
      </div>
      <div className="py-6 flex items-center justify-between font-sans">
        <div>
          <h3 className="font-bold text-slate-700 text-lg">Notificações</h3>
          <p className="text-slate-400 text-sm">Configure seus lembretes diários</p>
        </div>
        <div className="w-12 h-6 bg-emerald-400 rounded-full relative cursor-pointer">
           <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"></div>
        </div>
      </div>
      <div className="py-6 flex items-center justify-between font-sans">
        <div>
          <h3 className="font-bold text-slate-700 text-lg">Tema Escuro</h3>
          <p className="text-slate-400 text-sm">Alterne para o modo noturno</p>
        </div>
        <div className="w-12 h-6 bg-slate-200 rounded-full relative cursor-pointer">
           <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
        </div>
      </div>
    </section>
  );
};
