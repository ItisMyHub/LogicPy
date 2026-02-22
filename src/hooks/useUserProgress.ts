import { useState, useEffect, useCallback } from 'react';
import type { UserProgress, Feature, Challenge } from '@/types';

const STORAGE_KEY = 'logicpy-progress-v2';

const XP_PER_LEVEL = 100;
const LEVEL_MULTIPLIER = 1.5;

// Feature unlock requirements
const featureUnlocks: { feature: Feature; level: number; description: string }[] = [
  { feature: 'basic-translation', level: 1, description: 'Translate logic to Python' },
  { feature: 'code-editing', level: 2, description: 'Edit generated Python code' },
  { feature: 'challenges', level: 3, description: 'Fix broken code challenges' },
  { feature: 'export', level: 4, description: 'Export code as .py files' },
  { feature: 'advanced-patterns', level: 5, description: 'Advanced code patterns' },
  { feature: 'custom-functions', level: 7, description: 'Create custom functions' }
];

// Default progress for new users
const defaultProgress: UserProgress = {
  level: 1,
  xp: 0,
  xpToNextLevel: XP_PER_LEVEL,
  completedExamples: [],
  completedChallenges: [],
  unlockedFeatures: ['basic-translation'],
  streakDays: 1,
  lastActiveDate: new Date().toISOString().split('T')[0]
};

export function useUserProgress() {
  const [progress, setProgress] = useState<UserProgress>(defaultProgress);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load progress from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setProgress({ ...defaultProgress, ...parsed });
      } catch {
        setProgress(defaultProgress);
      }
    }
    setIsLoaded(true);
  }, []);

  // Save progress whenever it changes
  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
    }
  }, [progress, isLoaded]);

  // Calculate XP needed for next level
  const getXpForLevel = useCallback((level: number): number => {
    return Math.floor(XP_PER_LEVEL * Math.pow(LEVEL_MULTIPLIER, level - 1));
  }, []);

  // Add XP and check for level up
  const addXp = useCallback((amount: number) => {
    setProgress(prev => {
      let newXp = prev.xp + amount;
      let newLevel = prev.level;
      let xpToNext = prev.xpToNextLevel;

      // Check for level up
      while (newXp >= xpToNext) {
        newXp -= xpToNext;
        newLevel++;
        xpToNext = getXpForLevel(newLevel);
      }

      // Unlock new features
      const newFeatures = featureUnlocks
        .filter(f => f.level <= newLevel && !prev.unlockedFeatures.includes(f.feature))
        .map(f => f.feature);

      return {
        ...prev,
        xp: newXp,
        level: newLevel,
        xpToNextLevel: xpToNext,
        unlockedFeatures: [...prev.unlockedFeatures, ...newFeatures]
      };
    });
  }, [getXpForLevel]);

  // Mark example as completed
  const completeExample = useCallback((exampleId: string) => {
    setProgress(prev => {
      if (prev.completedExamples.includes(exampleId)) {
        return prev;
      }
      return {
        ...prev,
        completedExamples: [...prev.completedExamples, exampleId]
      };
    });
    addXp(5); // 5 XP per example
  }, [addXp]);

  // Mark challenge as completed
  const completeChallenge = useCallback((challenge: Challenge) => {
    setProgress(prev => {
      if (prev.completedChallenges.includes(challenge.id)) {
        return prev;
      }
      return {
        ...prev,
        completedChallenges: [...prev.completedChallenges, challenge.id]
      };
    });
    addXp(challenge.xpReward);
  }, [addXp]);

  // Check if feature is unlocked
  const isFeatureUnlocked = useCallback((feature: Feature): boolean => {
    return progress.unlockedFeatures.includes(feature);
  }, [progress.unlockedFeatures]);

  // Get next unlock info
  const getNextUnlock = useCallback(() => {
    const nextFeature = featureUnlocks.find(f => f.level > progress.level);
    return nextFeature || null;
  }, [progress.level]);

  // Get unlocked features with descriptions
  const getUnlockedFeaturesInfo = useCallback(() => {
    return featureUnlocks.filter(f => progress.unlockedFeatures.includes(f.feature));
  }, [progress.unlockedFeatures]);

  // Update streak
  const updateStreak = useCallback(() => {
    const today = new Date().toISOString().split('T')[0];
    
    setProgress(prev => {
      if (prev.lastActiveDate === today) {
        return prev; // Already active today
      }
      
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      const yesterdayStr = yesterday.toISOString().split('T')[0];
      
      const newStreak = prev.lastActiveDate === yesterdayStr ? prev.streakDays + 1 : 1;
      
      return {
        ...prev,
        streakDays: newStreak,
        lastActiveDate: today
      };
    });
  }, []);

  // Reset progress (for testing)
  const resetProgress = useCallback(() => {
    setProgress(defaultProgress);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  // Get progress percentage for current level
  const getProgressPercentage = useCallback((): number => {
    return Math.round((progress.xp / progress.xpToNextLevel) * 100);
  }, [progress.xp, progress.xpToNextLevel]);

  return {
    progress,
    isLoaded,
    addXp,
    completeExample,
    completeChallenge,
    isFeatureUnlocked,
    getNextUnlock,
    getUnlockedFeaturesInfo,
    updateStreak,
    resetProgress,
    getProgressPercentage
  };
}
