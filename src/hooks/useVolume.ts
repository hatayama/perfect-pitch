import { useCallback, useState } from "react";
import { setVolume as applyVolume } from "../audio/ChordPlayer";

const STORAGE_KEY = "perfect-pitch-volume";
const DEFAULT_VOLUME = 80;

function loadVolume(): number {
  const stored: string | null = localStorage.getItem(STORAGE_KEY);
  if (stored === null) {
    return DEFAULT_VOLUME;
  }
  return Number(stored);
}

// 初期ロード時に即座に適用
const initialVolume: number = loadVolume();
applyVolume(initialVolume);

export function useVolume() {
  const [volume, setVolume] = useState<number>(initialVolume);

  const updateVolume = useCallback((percent: number) => {
    applyVolume(percent);
    localStorage.setItem(STORAGE_KEY, String(percent));
    setVolume(percent);
  }, []);

  return { volume, updateVolume } as const;
}
