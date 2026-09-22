import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import type { PropsWithChildren } from 'react';

export type ThemeColorId = 'forest' | 'blue' | 'indigo' | 'violet' | 'orange' | 'rose';

export interface ThemePreset {
  id: ThemeColorId;
  label: string;
  primary: string;
  primaryHover: string;
  primaryActive: string;
  primarySoft: string;
  primaryMuted: string;
  primaryBorder: string;
  onPrimary: string;
}

export const themePresets: readonly ThemePreset[] = [
  {
    id: 'forest',
    label: 'Bosque',
    primary: '#176b2c',
    primaryHover: '#125823',
    primaryActive: '#0d461b',
    primarySoft: '#edf7ef',
    primaryMuted: '#dbeee0',
    primaryBorder: '#a7cfb1',
    onPrimary: '#ffffff',
  },
  {
    id: 'blue',
    label: 'Azul',
    primary: '#1d4ed8',
    primaryHover: '#1e40af',
    primaryActive: '#1e3a8a',
    primarySoft: '#eff6ff',
    primaryMuted: '#dbeafe',
    primaryBorder: '#93c5fd',
    onPrimary: '#ffffff',
  },
  {
    id: 'indigo',
    label: 'Índigo',
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    primaryActive: '#3730a3',
    primarySoft: '#eef2ff',
    primaryMuted: '#e0e7ff',
    primaryBorder: '#a5b4fc',
    onPrimary: '#ffffff',
  },
  {
    id: 'violet',
    label: 'Violeta',
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    primaryActive: '#5b21b6',
    primarySoft: '#f5f3ff',
    primaryMuted: '#ede9fe',
    primaryBorder: '#c4b5fd',
    onPrimary: '#ffffff',
  },
  {
    id: 'orange',
    label: 'Naranja',
    primary: '#c2410c',
    primaryHover: '#9a3412',
    primaryActive: '#7c2d12',
    primarySoft: '#fff7ed',
    primaryMuted: '#ffedd5',
    primaryBorder: '#fdba74',
    onPrimary: '#ffffff',
  },
  {
    id: 'rose',
    label: 'Rosa',
    primary: '#be123c',
    primaryHover: '#9f1239',
    primaryActive: '#881337',
    primarySoft: '#fff1f2',
    primaryMuted: '#ffe4e6',
    primaryBorder: '#fda4af',
    onPrimary: '#ffffff',
  },
];

interface ThemeContextValue {
  themeColor: ThemeColorId;
  setThemeColor: (themeColor: ThemeColorId) => void;
  presets: readonly ThemePreset[];
}

const ThemeContext = createContext<ThemeContextValue | null>(null);
const STORAGE_KEY = 'webblueprint-theme-color';

function isThemeColorId(value: string | null): value is ThemeColorId {
  return themePresets.some((preset) => preset.id === value);
}

function readInitialTheme(): ThemeColorId {
  if (typeof window === 'undefined') {
    return 'forest';
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  return isThemeColorId(stored) ? stored : 'forest';
}

export function ThemeProvider({ children }: PropsWithChildren) {
  const [themeColor, setThemeColor] = useState<ThemeColorId>(readInitialTheme);

  useEffect(() => {
    const preset = themePresets.find((candidate) => candidate.id === themeColor) ?? themePresets[0];
    if (!preset) {
      return;
    }

    const root = document.documentElement;
    root.dataset.themeColor = preset.id;
    root.style.setProperty('--theme-primary', preset.primary);
    root.style.setProperty('--theme-primary-hover', preset.primaryHover);
    root.style.setProperty('--theme-primary-active', preset.primaryActive);
    root.style.setProperty('--theme-primary-soft', preset.primarySoft);
    root.style.setProperty('--theme-primary-muted', preset.primaryMuted);
    root.style.setProperty('--theme-primary-border', preset.primaryBorder);
    root.style.setProperty('--theme-on-primary', preset.onPrimary);
    window.localStorage.setItem(STORAGE_KEY, preset.id);
  }, [themeColor]);

  const value = useMemo<ThemeContextValue>(
    () => ({ themeColor, setThemeColor, presets: themePresets }),
    [themeColor],
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used inside ThemeProvider.');
  }

  return context;
}
