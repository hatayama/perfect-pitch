import { afterEach, describe, expect, it, vi } from "vitest";
import type { ChordDefinition } from "../constants/chords";
import { pickRandomChord } from "./pickRandomChord";

const CHORDS: readonly ChordDefinition[] = [
  { id: "first", label: "1", notes: ["C4"], colorName: "赤", colorHex: "#E53935", textColor: "#fff" },
  { id: "second", label: "2", notes: ["D4"], colorName: "黄色", colorHex: "#FDD835", textColor: "#222" },
  { id: "third", label: "3", notes: ["E4"], colorName: "青", colorHex: "#1E88E5", textColor: "#fff" },
  { id: "fourth", label: "4", notes: ["F4"], colorName: "黒", colorHex: "#212121", textColor: "#fff" },
] as const;

describe("pickRandomChord", () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("乱数の区間を各和音へ均等に割り当てる", () => {
    vi.spyOn(Math, "random")
      .mockReturnValueOnce(0)
      .mockReturnValueOnce(0.249999)
      .mockReturnValueOnce(0.25)
      .mockReturnValueOnce(0.499999)
      .mockReturnValueOnce(0.5)
      .mockReturnValueOnce(0.749999)
      .mockReturnValueOnce(0.75)
      .mockReturnValueOnce(0.999999);

    const selectedIds: readonly string[] = [
      pickRandomChord(CHORDS, null).id,
      pickRandomChord(CHORDS, null).id,
      pickRandomChord(CHORDS, null).id,
      pickRandomChord(CHORDS, null).id,
      pickRandomChord(CHORDS, null).id,
      pickRandomChord(CHORDS, null).id,
      pickRandomChord(CHORDS, null).id,
      pickRandomChord(CHORDS, null).id,
    ];

    expect(selectedIds).toEqual([
      "first",
      "first",
      "second",
      "second",
      "third",
      "third",
      "fourth",
      "fourth",
    ]);
  });

  it("直前の和音以外から均等に選ぶ", () => {
    vi.spyOn(Math, "random").mockReturnValue(0);

    const selected: ChordDefinition = pickRandomChord(CHORDS, "first");

    expect(selected.id).toBe("second");
  });
});
