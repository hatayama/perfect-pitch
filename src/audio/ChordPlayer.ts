import * as Tone from "tone";

const CHORD_REPEAT_COUNT = 3;
const CHORD_DURATION = "2n";
const CHORD_INTERVAL_SEC = 1.2;

let sampler: Tone.Sampler | null = null;
let samplerReadyPromise: Promise<void> | null = null;

function createSampler(): Promise<void> {
  if (samplerReadyPromise !== null) {
    return samplerReadyPromise;
  }

  samplerReadyPromise = new Promise<void>((resolve) => {
    // Salamander Grand Piano samples (hosted on tonejs.github.io)
    sampler = new Tone.Sampler({
      urls: {
        A0: "A0.mp3",
        C1: "C1.mp3",
        "D#1": "Ds1.mp3",
        "F#1": "Fs1.mp3",
        A1: "A1.mp3",
        C2: "C2.mp3",
        "D#2": "Ds2.mp3",
        "F#2": "Fs2.mp3",
        A2: "A2.mp3",
        C3: "C3.mp3",
        "D#3": "Ds3.mp3",
        "F#3": "Fs3.mp3",
        A3: "A3.mp3",
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
        C5: "C5.mp3",
        "D#5": "Ds5.mp3",
        "F#5": "Fs5.mp3",
        A5: "A5.mp3",
        C6: "C6.mp3",
        "D#6": "Ds6.mp3",
        "F#6": "Fs6.mp3",
        A6: "A6.mp3",
        C7: "C7.mp3",
        "D#7": "Ds7.mp3",
        "F#7": "Fs7.mp3",
        A7: "A7.mp3",
        C8: "C8.mp3",
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: resolve,
    }).toDestination();
  });

  return samplerReadyPromise;
}

export function initSampler(): Promise<void> {
  return createSampler();
}

export async function playChord(notes: readonly string[]): Promise<void> {
  await Tone.start();
  await createSampler();

  const s: Tone.Sampler = sampler!;
  const now: number = Tone.now();
  for (let i = 0; i < CHORD_REPEAT_COUNT; i++) {
    const time: number = now + i * CHORD_INTERVAL_SEC;
    s.triggerAttackRelease(notes as string[], CHORD_DURATION, time);
  }
}

export async function playSingleNote(note: string): Promise<void> {
  await Tone.start();
  await createSampler();

  sampler!.triggerAttackRelease(note, CHORD_DURATION);
}
