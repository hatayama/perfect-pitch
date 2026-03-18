import { useCallback, useMemo, useState } from "react";
import { ALL_CHORDS, DEFAULT_LEVEL_UP_DAYS } from "../constants/chords";

const LEVEL_UP_DAYS_KEY = "perfect-pitch-level-up-days";

function loadLevelUpDays(): number {
  const stored: string | null = localStorage.getItem(LEVEL_UP_DAYS_KEY);
  if (stored === null) {
    return DEFAULT_LEVEL_UP_DAYS;
  }
  return Number(stored);
}

function saveLevelUpDays(days: number): void {
  localStorage.setItem(LEVEL_UP_DAYS_KEY, String(days));
}

interface ChordStat {
  correctCount: number;
  totalCount: number;
  lastPracticed: string;
  consecutiveCorrectDays: number;
}

export interface Progress {
  currentLevel: number;
  chordStats: Record<string, ChordStat>;
}

const STORAGE_KEY = "perfect-pitch-progress";

function createDefaultProgress(): Progress {
  return {
    currentLevel: 1,
    chordStats: {},
  };
}

function loadProgress(): Progress {
  const stored: string | null = localStorage.getItem(STORAGE_KEY);
  if (stored === null) {
    return createDefaultProgress();
  }
  return JSON.parse(stored) as Progress;
}

function saveProgress(progress: Progress): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
}

function getTodayString(): string {
  return new Date().toISOString().slice(0, 10);
}

export function useProgress() {
  const [progress, setProgress] = useState<Progress>(loadProgress);
  const [levelUpDays, setLevelUpDays] = useState<number>(loadLevelUpDays);

  const unlockedChords = useMemo(
    () => ALL_CHORDS.slice(0, progress.currentLevel),
    [progress.currentLevel],
  );

  const recordAnswer = useCallback((chordId: string, correct: boolean) => {
    setProgress((prev: Progress) => {
      const today: string = getTodayString();
      const existing: ChordStat | undefined = prev.chordStats[chordId];

      const wasLastPracticedToday: boolean = existing?.lastPracticed === today;
      const previousConsecutiveDays: number = existing?.consecutiveCorrectDays ?? 0;

      let consecutiveCorrectDays: number;
      if (correct) {
        consecutiveCorrectDays = wasLastPracticedToday
          ? previousConsecutiveDays
          : previousConsecutiveDays + 1;
      } else {
        consecutiveCorrectDays = 0;
      }

      const updatedStat: ChordStat = {
        correctCount: (existing?.correctCount ?? 0) + (correct ? 1 : 0),
        totalCount: (existing?.totalCount ?? 0) + 1,
        lastPracticed: today,
        consecutiveCorrectDays,
      };

      const newStats: Record<string, ChordStat> = {
        ...prev.chordStats,
        [chordId]: updatedStat,
      };

      const latestChordId: string = ALL_CHORDS[prev.currentLevel - 1].id;
      const latestStat: ChordStat | undefined = newStats[latestChordId];
      const shouldLevelUp: boolean =
        latestStat !== undefined &&
        latestStat.consecutiveCorrectDays >= levelUpDays &&
        prev.currentLevel < ALL_CHORDS.length;

      const newProgress: Progress = {
        ...prev,
        currentLevel: shouldLevelUp ? prev.currentLevel + 1 : prev.currentLevel,
        chordStats: newStats,
      };

      saveProgress(newProgress);
      return newProgress;
    });
  }, [levelUpDays]);

  const updateLevelUpDays = useCallback((days: number) => {
    saveLevelUpDays(days);
    setLevelUpDays(days);
  }, []);

  const resetProgress = useCallback(() => {
    const defaultProgress: Progress = createDefaultProgress();
    saveProgress(defaultProgress);
    setProgress(defaultProgress);
  }, []);

  return {
    progress,
    unlockedChords,
    levelUpDays,
    recordAnswer,
    updateLevelUpDays,
    resetProgress,
  } as const;
}
