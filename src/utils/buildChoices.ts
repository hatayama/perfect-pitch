import { ALL_CHORDS, MIN_CHOICES, type ChordDefinition } from "../constants/chords";
import { assert } from "./assert";

// 有効な和音が少ない場合、無効な和音をダミー選択肢として追加して最低数を確保する
export function buildChoices(enabledChords: readonly ChordDefinition[]): readonly ChordDefinition[] {
  assert(enabledChords.length > 0, "enabledChords must not be empty");

  if (enabledChords.length >= MIN_CHOICES) {
    return enabledChords;
  }

  const enabledIds: Set<string> = new Set(enabledChords.map((c: ChordDefinition) => c.id));
  const extras: ChordDefinition[] = ALL_CHORDS.filter(
    (c: ChordDefinition) => !enabledIds.has(c.id),
  );

  const needed: number = MIN_CHOICES - enabledChords.length;
  const fillers: ChordDefinition[] = extras.slice(0, needed);

  return [...enabledChords, ...fillers];
}
