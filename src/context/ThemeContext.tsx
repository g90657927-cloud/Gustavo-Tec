import React, { createContext, useContext, useState, useEffect } from 'react';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { persistReadingPreferences } from '../lib/firestoreService';

export interface ThemeSettings {
  isDarkReadingMode: boolean;
  opacityLevel: number; // 0.65 (normal), 0.85 (escuro), 0.98 (ultra-preto)
  isHighContrast: boolean;
  isWarmTint: boolean;
  spatial3DMode: 'immersive' | 'subtle' | 'off'; // 3D espacial leve para todos os dispositivos
}

interface ThemeContextType {
  settings: ThemeSettings;
  toggleDarkReadingMode: () => void;
  setOpacityLevel: (level: number) => void;
  toggleHighContrast: () => void;
  toggleWarmTint: () => void;
  setSpatial3DMode: (mode: 'immersive' | 'subtle' | 'off') => void;
  toggleSpatial3D: () => void;
  resetTheme: () => void;
}

const DEFAULT_SETTINGS: ThemeSettings = {
  isDarkReadingMode: false,
  opacityLevel: 0.65,
  isHighContrast: false,
  isWarmTint: false,
  spatial3DMode: 'immersive',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    try {
      const saved = localStorage.getItem('gustavotec_theme_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...DEFAULT_SETTINGS,
          ...parsed,
          spatial3DMode: parsed.spatial3DMode || DEFAULT_SETTINGS.spatial3DMode
        };
      }
    } catch (e) {
      console.warn('Erro ao ler tema salvo:', e);
    }
    return DEFAULT_SETTINGS;
  });

  // Real-time Firestore sync with reading_preferences for active user
  useEffect(() => {
    const activeEmail = localStorage.getItem('gustavo_tec_active_email_v1');
    if (!activeEmail) return;

    const docId = activeEmail.toLowerCase().trim() === 'sougustavo000@gmail.com'
      ? 'usr-gustavo-peixoto'
      : `usr_${activeEmail.toLowerCase().trim().replace(/[^a-z0-9]/g, '_')}`;

    const prefDocRef = doc(db, 'reading_preferences', docId);

    const unsubscribe = onSnapshot(prefDocRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data();
        setSettings((prev) => ({
          ...prev,
          isDarkReadingMode: typeof data.isDarkReadingMode === 'boolean' ? data.isDarkReadingMode : prev.isDarkReadingMode,
          opacityLevel: typeof data.opacityLevel === 'number' ? data.opacityLevel : prev.opacityLevel,
          isHighContrast: typeof data.isHighContrast === 'boolean' ? data.isHighContrast : prev.isHighContrast,
          isWarmTint: typeof data.isWarmTint === 'boolean' ? data.isWarmTint : prev.isWarmTint,
          spatial3DMode: data.spatial3DMode || prev.spatial3DMode
        }));
      }
    }, (err) => {
      console.warn('Reading preferences snapshot notice:', err);
    });

    return () => unsubscribe();
  }, []);

  // Apply settings to document element and persist to local storage & Firestore
  useEffect(() => {
    try {
      localStorage.setItem('gustavotec_theme_settings', JSON.stringify(settings));
      
      const activeEmail = localStorage.getItem('gustavo_tec_active_email_v1');
      if (activeEmail) {
        const docId = activeEmail.toLowerCase().trim() === 'sougustavo000@gmail.com'
          ? 'usr-gustavo-peixoto'
          : `usr_${activeEmail.toLowerCase().trim().replace(/[^a-z0-9]/g, '_')}`;
        persistReadingPreferences(docId, activeEmail, settings).catch(() => {});
      }
    } catch (e) {
      console.warn('Erro ao salvar tema:', e);
    }

    const root = document.documentElement;
    const body = document.body;

    if (settings.isDarkReadingMode) {
      root.classList.add('dark-reading-mode');
      body.classList.add('dark-reading-mode');
      root.style.setProperty('--card-opacity-val', String(settings.opacityLevel || 0.65));
    } else {
      root.classList.remove('dark-reading-mode');
      body.classList.remove('dark-reading-mode');
      root.style.setProperty('--card-opacity-val', '0.65');
    }

    if (settings.isHighContrast) {
      root.classList.add('high-contrast-mode');
    } else {
      root.classList.remove('high-contrast-mode');
    }

    if (settings.isWarmTint) {
      root.classList.add('warm-tint-mode');
    } else {
      root.classList.remove('warm-tint-mode');
    }

    // 3D Spatial Depth Mode for lightweight devices
    root.classList.remove('spatial-3d-immersive', 'spatial-3d-subtle', 'spatial-3d-off');
    body.classList.remove('spatial-3d-immersive', 'spatial-3d-subtle', 'spatial-3d-off');
    const mode = settings.spatial3DMode || 'immersive';
    if (mode === 'immersive') {
      root.classList.add('spatial-3d-immersive');
      body.classList.add('spatial-3d-immersive');
    } else if (mode === 'subtle') {
      root.classList.add('spatial-3d-subtle');
      body.classList.add('spatial-3d-subtle');
    } else {
      root.classList.add('spatial-3d-off');
      body.classList.add('spatial-3d-off');
    }
  }, [settings]);

  const toggleDarkReadingMode = () => {
    setSettings(prev => ({
      ...prev,
      isDarkReadingMode: !prev.isDarkReadingMode,
      // If turning on and opacity was standard 0.65, elevate to 0.95 for deep low-light reading
      opacityLevel: !prev.isDarkReadingMode && prev.opacityLevel <= 0.65 ? 0.95 : prev.opacityLevel
    }));
  };

  const setOpacityLevel = (level: number) => {
    setSettings(prev => ({
      ...prev,
      opacityLevel: level,
      // If selecting a darker opacity, ensure dark reading mode is activated
      isDarkReadingMode: level > 0.65 ? true : prev.isDarkReadingMode
    }));
  };

  const toggleHighContrast = () => {
    setSettings(prev => ({
      ...prev,
      isHighContrast: !prev.isHighContrast
    }));
  };

  const toggleWarmTint = () => {
    setSettings(prev => ({
      ...prev,
      isWarmTint: !prev.isWarmTint
    }));
  };

  const setSpatial3DMode = (mode: 'immersive' | 'subtle' | 'off') => {
    setSettings(prev => ({
      ...prev,
      spatial3DMode: mode
    }));
  };

  const toggleSpatial3D = () => {
    setSettings(prev => {
      const current = prev.spatial3DMode || 'immersive';
      return {
        ...prev,
        spatial3DMode: current === 'immersive' ? 'subtle' : current === 'subtle' ? 'off' : 'immersive'
      };
    });
  };

  const resetTheme = () => {
    setSettings(DEFAULT_SETTINGS);
  };

  return (
    <ThemeContext.Provider
      value={{
        settings,
        toggleDarkReadingMode,
        setOpacityLevel,
        toggleHighContrast,
        toggleWarmTint,
        setSpatial3DMode,
        toggleSpatial3D,
        resetTheme
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme deve ser utilizado dentro de um ThemeProvider');
  }
  return context;
};
