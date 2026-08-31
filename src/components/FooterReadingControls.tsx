import React, { useState } from 'react';
import { useTheme } from '../context/ThemeContext';
import { 
  Moon, 
  Sun, 
  Eye, 
  Sliders, 
  Sparkles, 
  ShieldCheck, 
  Layers, 
  Contrast, 
  Flame,
  Check,
  RotateCcw,
  Box,
  Zap
} from 'lucide-react';

export const FooterReadingControls: React.FC = () => {
  const { 
    settings, 
    toggleDarkReadingMode, 
    setOpacityLevel, 
    toggleHighContrast, 
    toggleWarmTint,
    setSpatial3DMode,
    toggleSpatial3D,
    resetTheme 
  } = useTheme();

  const [isOpenExtended, setIsOpenExtended] = useState(false);
  const current3DMode = settings.spatial3DMode || 'immersive';

  return (
    <div className="w-full bg-slate-900/70 border border-white/10 rounded-2xl p-3.5 sm:p-4 backdrop-blur-xl shadow-lg space-y-3">
      
      {/* Top row: Quick toggle + summary */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDarkReadingMode}
            className={`p-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center pill-3d ${
              settings.isDarkReadingMode
                ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                : 'bg-slate-800 text-slate-400 hover:text-white border border-white/10'
            }`}
            title="Alternar Modo Noturno de Baixa Luz"
          >
            {settings.isDarkReadingMode ? (
              <Moon className="w-4 h-4 text-cyan-300" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs sm:text-sm font-bold text-white">
                Modo Leitura & Visual 3D
              </span>
              <span className={`text-[10px] font-mono px-2 py-0.5 rounded-full font-bold border pill-3d ${
                current3DMode === 'immersive'
                  ? 'bg-cyan-950 text-cyan-300 border-cyan-500/40'
                  : current3DMode === 'subtle'
                  ? 'bg-blue-950 text-blue-300 border-blue-500/40'
                  : 'bg-slate-800 text-slate-400 border-slate-700'
              }`}>
                {current3DMode === 'immersive' ? '3D ATIVO' : current3DMode === 'subtle' ? '3D SUAVE' : '3D OFF'}
              </span>
            </div>
            <p className="text-[11px] text-slate-400">
              Profundidade espacial 3D em camadas e aceleração por GPU otimizada para dispositivos leves.
            </p>
          </div>
        </div>

        {/* Action buttons on the right */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          {/* Quick 3D switch */}
          <button
            onClick={toggleSpatial3D}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 pill-3d ${
              current3DMode !== 'off'
                ? 'bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 shadow-[0_0_12px_rgba(6,182,212,0.25)]'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-400 border border-white/10'
            }`}
            title="Alternar Modo 3D Espacial"
          >
            <Box className="w-3.5 h-3.5 text-cyan-400" />
            <span>3D: {current3DMode.toUpperCase()}</span>
          </button>

          {/* Main switch button */}
          <button
            onClick={toggleDarkReadingMode}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-bold font-mono transition-all cursor-pointer flex items-center gap-1.5 pill-3d ${
              settings.isDarkReadingMode
                ? 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.35)]'
                : 'bg-slate-800 hover:bg-slate-750 text-slate-300 border border-white/10'
            }`}
          >
            {settings.isDarkReadingMode ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Modo Escuro</span>
              </>
            ) : (
              <>
                <Moon className="w-3.5 h-3.5 text-cyan-400" />
                <span>Noturno</span>
              </>
            )}
          </button>

          {/* Expand customization button */}
          <button
            onClick={() => setIsOpenExtended(!isOpenExtended)}
            className={`p-2 rounded-xl text-xs font-semibold border transition-all cursor-pointer flex items-center gap-1 pill-3d ${
              isOpenExtended || settings.isHighContrast || settings.isWarmTint || settings.opacityLevel > 0.65
                ? 'bg-cyan-950/60 text-cyan-300 border-cyan-500/40'
                : 'bg-slate-800/80 text-slate-400 hover:text-white border-white/10'
            }`}
            title="Ajustes avançados de opacidade, 3D e contraste"
          >
            <Sliders className="w-3.5 h-3.5" />
            <span className="hidden md:inline text-[11px]">Ajustes</span>
          </button>
        </div>

      </div>

      {/* Extended Controls Tray */}
      {isOpenExtended && (
        <div className="pt-3 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          
          {/* 1. 3D Mode Selector */}
          <div className="p-3 bg-slate-950/60 border border-white/10 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Box className="w-3.5 h-3.5 text-cyan-400" /> Efeitos 3D Leves
              </span>
              <span className="font-mono text-cyan-300 text-[10px]">{current3DMode}</span>
            </div>

            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setSpatial3DMode('immersive')}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                  current3DMode === 'immersive'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                Imersivo
              </button>
              <button
                onClick={() => setSpatial3DMode('subtle')}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                  current3DMode === 'subtle'
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                Suave
              </button>
              <button
                onClick={() => setSpatial3DMode('off')}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                  current3DMode === 'off'
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-400/50 shadow-sm'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                Plano
              </button>
            </div>
          </div>

          {/* 2. Opacity Selector */}
          <div className="p-3 bg-slate-950/60 border border-white/10 rounded-xl space-y-2">
            <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-cyan-400" /> Opacidade dos Cartões
              </span>
              <span className="font-mono text-cyan-300">{Math.round(settings.opacityLevel * 100)}%</span>
            </div>

            <div className="grid grid-cols-3 gap-1">
              <button
                onClick={() => setOpacityLevel(0.65)}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                  settings.opacityLevel <= 0.65
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                Padrão 65%
              </button>
              <button
                onClick={() => setOpacityLevel(0.85)}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                  settings.opacityLevel > 0.65 && settings.opacityLevel <= 0.88
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                Escuro 85%
              </button>
              <button
                onClick={() => setOpacityLevel(0.98)}
                className={`py-1 px-1.5 rounded-lg text-[10px] font-bold font-mono transition-all cursor-pointer ${
                  settings.opacityLevel > 0.88
                    ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-400/50'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-white/5'
                }`}
              >
                Preto 98%
              </button>
            </div>
          </div>

          {/* 3. High Contrast Boost */}
          <div className="p-3 bg-slate-950/60 border border-white/10 rounded-xl space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Contrast className="w-3.5 h-3.5 text-cyan-400" /> Alto Contraste AAA
              </span>
              <span className="font-mono text-[10px] text-slate-400">{settings.isHighContrast ? 'Ativo' : 'Normal'}</span>
            </div>

            <button
              onClick={toggleHighContrast}
              className={`w-full py-1 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                settings.isHighContrast
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-400/50 shadow-[0_0_10px_rgba(52,211,153,0.2)]'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {settings.isHighContrast ? 'Contraste Alto Ativo' : 'Ativar Alto Contraste'}
            </button>
          </div>

          {/* 4. Warm Sepia/Eye Comfort Tint */}
          <div className="p-3 bg-slate-950/60 border border-white/10 rounded-xl space-y-2 flex flex-col justify-between">
            <div className="flex items-center justify-between text-xs text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 text-amber-400" /> Conforto Âmbar
              </span>
              <span className="font-mono text-[10px] text-slate-400">{settings.isWarmTint ? 'Ativo' : 'Desligado'}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                onClick={toggleWarmTint}
                className={`flex-1 py-1 px-2 rounded-lg text-[11px] font-bold transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  settings.isWarmTint
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-400/50 shadow-[0_0_10px_rgba(245,158,11,0.2)]'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-white/5'
                }`}
              >
                {settings.isWarmTint ? 'Luz Âmbar' : 'Filtro Noturno'}
              </button>

              <button
                onClick={resetTheme}
                title="Restaurar padrão original"
                className="p-1.5 rounded-lg bg-slate-900 text-slate-400 hover:text-white border border-white/5 cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" />
              </button>
            </div>
          </div>

        </div>
      )}

    </div>
  );
};
