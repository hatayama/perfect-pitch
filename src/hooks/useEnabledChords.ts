import { useCallback, useEffect, useMemo, useState } from "react";
import { ALL_CHORDS, type ChordDefinition } from "../constants/chords";
import { assert } from "../utils/assert";

const STORAGE_KEY = "perfect-pitch-enabled-chords";

const ALL_CHORD_IDS: ReadonlySet<string> = new Set(ALL_CHORDS.map((c: ChordDefinition) => c.id));
const DEFAULT_ENABLED_CHORD_IDS: readonly string[] = [
  "do-mi-so",
  "do-fa-ra",
] as const;

// 旧バージョンのLocalStorageキーを削除（モジュール読み込み時に1回だけ実行）
localStorage.removeItem("perfect-pitch-progress");
localStorage.removeItem("perfect-pitch-level-up-days");

function createDefaultEnabledIds(): ReadonlySet<string> {
  return new Set<string>(DEFAULT_ENABLED_CHORD_IDS);
}

function loadEnabledIds(): ReadonlySet<string> {
  const stored: string | null = localStorage.getItem(STORAGE_KEY);
  if (stored === null) {
    return createDefaultEnabledIds();
  }

  const parsed: unknown = JSON.parse(stored);
  if (!Array.isArray(parsed) || parsed.length === 0) {
    return createDefaultEnabledIds();
  }

  // 現在のALL_CHORDSに存在するIDのみを残す
  const validIds: Set<string> = new Set(
    (parsed as string[]).filter((id: string) => ALL_CHORD_IDS.has(id)),
  );

  if (validIds.size === 0) {
    return createDefaultEnabledIds();
  }

  assert(validIds.size > 0, "loadEnabledIds must return non-empty set");
  return validIds;
}

function saveEnabledIds(ids: ReadonlySet<string>): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
}

export function useEnabledChords() {
  const [enabledChordIds, setEnabledChordIds] = useState<ReadonlySet<string>>(loadEnabledIds);

  useEffect(() => {
    saveEnabledIds(enabledChordIds);
  }, [enabledChordIds]);

  const enabledChords: readonly ChordDefinition[] = useMemo(
    () => ALL_CHORDS.filter((c: ChordDefinition) => enabledChordIds.has(c.id)),
    [enabledChordIds],
  );

  const toggleChord = useCallback((chordId: string) => {
    setEnabledChordIds((prev: ReadonlySet<string>) => {
      // 最後の1つは無効化させない
      if (prev.has(chordId) && prev.size <= 1) {
        return prev;
      }

      const next: Set<string> = new Set(prev);
      if (next.has(chordId)) {
        next.delete(chordId);
      } else {
        next.add(chordId);
      }

      return next;
    });
  }, []);

  const resetToDefault = useCallback(() => {
    setEnabledChordIds(createDefaultEnabledIds());
  }, []);

  return {
    enabledChords,
    enabledChordIds,
    toggleChord,
    resetToDefault,
  } as const;
}
