import { useState, useEffect, useCallback } from 'react';
import type { AppSettings } from '@/types';
import { defaultAIConfig } from '@/services/aiService';

const STORAGE_KEY = 'logicpy-settings-v1';

const defaultSettings: AppSettings = {
  aiConfig: defaultAIConfig,
  theme: 'light',
  autoTranslate: false,
  showHints: true,
  soundEnabled: false
};

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load settings from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setSettings({ ...defaultSettings, ...parsed });
      } catch {
        setSettings(defaultSettings);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save settings whenever they change
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(settings));
    }
  }, [settings, isLoaded]);

  // Toggle hints
  const toggleHints = useCallback(() => {
    setSettings(prev => ({
      ...prev,
      showHints: !prev.showHints
    }));
  }, []);

  // Reset settings
  const resetSettings = useCallback(() => {
    setSettings(defaultSettings);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // AI config — kept for SettingsPanel props compatibility
  const setAIProvider = useCallback((provider: 'openai' | 'anthropic' | 'local') => {
    setSettings(prev => ({
      ...prev,
      aiConfig: { ...prev.aiConfig, provider, enabled: provider !== 'local' }
    }));
  }, []);

  const setApiKey = useCallback((apiKey: string) => {
    setSettings(prev => ({
      ...prev,
      aiConfig: { ...prev.aiConfig, apiKey: apiKey.trim() || undefined }
    }));
  }, []);

  const setAIModel = useCallback((model: string) => {
    setSettings(prev => ({
      ...prev,
      aiConfig: { ...prev.aiConfig, model }
    }));
  }, []);

  const toggleAutoTranslate = useCallback(() => {
    setSettings(prev => ({ ...prev, autoTranslate: !prev.autoTranslate }));
  }, []);

  const toggleSound = useCallback(() => {
    setSettings(prev => ({ ...prev, soundEnabled: !prev.soundEnabled }));
  }, []);

  const isAIConfigured = useCallback((): boolean => {
    return false; // Always local
  }, []);

  return {
    settings,
    isLoaded,
    setAIProvider,
    setApiKey,
    setAIModel,
    toggleAutoTranslate,
    toggleHints,
    toggleSound,
    resetSettings,
    isAIConfigured
  };
}