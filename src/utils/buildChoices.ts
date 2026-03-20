import type { ChordDefinition } from "../constants/chords";
import { assert } from "./assert";

export function buildChoices(enabledChords: readonly ChordDefinition[]): readonly ChordDefinition[] {
  assert(enabledChords.length > 0, "enabledChords must not be empty");
  // 設定画面で無効化した和音をここで混ぜると、保護者が意図した出題範囲を破ってしまう
  return enabledChords;
}
