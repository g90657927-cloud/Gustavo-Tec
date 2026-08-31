import React from 'react';
import { Smartphone, Tablet, Monitor, Sparkles } from 'lucide-react';
import { DeviceViewMode } from '../types';

interface DeviceModeSwitcherProps {
  viewMode: DeviceViewMode;
  setViewMode: (mode: DeviceViewMode) => void;
}

export const DeviceModeSwitcher: React.FC<DeviceModeSwitcherProps> = ({
  viewMode,
  setViewMode
}) => {
  return (
    <div className="flex items-center gap-1.5 p-1 rounded-2xl bg-slate-900/80 backdrop-blur-xl border border-white/10 shadow-lg text-xs font-mono">
      <span className="text-[11px] text-slate-400 font-bold px-2 hidden sm:inline flex items-center gap-1">
        <span>Visualização:</span>
      </span>

      <button
        onClick={() => setViewMode('mobile')}
        title="Modo Celular (Smartphone 390px)"
        className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
          viewMode === 'mobile'
            ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Smartphone className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Celular</span>
      </button>

      <button
        onClick={() => setViewMode('tablet')}
        title="Modo Tablet (iPad 768px)"
        className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
          viewMode === 'tablet'
            ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Tablet className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Tablet</span>
      </button>

      <button
        onClick={() => setViewMode('desktop')}
        title="Modo Desktop (Ecrã Completo)"
        className={`px-2.5 py-1.5 rounded-xl font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
          viewMode === 'desktop'
            ? 'bg-cyan-500 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
            : 'text-slate-400 hover:text-white hover:bg-white/5'
        }`}
      >
        <Monitor className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Desktop</span>
      </button>
    </div>
  );
};
