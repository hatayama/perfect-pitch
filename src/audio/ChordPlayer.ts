import * as Tone from "tone";

const CHORD_REPEAT_COUNT = 3;
const CHORD_DURATION = "2n";
const CHORD_INTERVAL_SEC = 1.2;
const SAMPLER_BASE_VOLUME_DB = 16;
const CORRECT_SE_VOLUME_DB = SAMPLER_BASE_VOLUME_DB;
const INCORRECT_SE_VOLUME_DB = SAMPLER_BASE_VOLUME_DB;

// iOSの消音モードでもWeb Audio APIの音を鳴らすため、HTML5 Audio要素で無音を再生して音声セッションを"playback"に切り替える
const SILENT_MP3 = "data:audio/mp3;base64,SUQzBAAAAAAAI1RTU0UAAAAPAAADTGF2ZjU4Ljc2LjEwMAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRBqJAAAAAAAAAAAAAAAAAAAA//tQAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAWGluZwAAAA8AAAACAAABhgC7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7u7//////////////////////////////////////////////////////////////////8AAAAATGF2YzU4LjEzAAAAAAAAAAAAAAAAJAAAAAAAAAAAAYYoRBqJAAAAAAAAAAAAAAAAAAAA";
let silentAudioUnlocked = false;

function unlockIOSAudio(): void {
  if (silentAudioUnlocked) return;
  silentAudioUnlocked = true;

  const audio: HTMLAudioElement = new Audio(SILENT_MP3);
  audio.play().catch(() => {
    // 再生失敗は無視（非iOS環境では不要なため）
  });
}

let sampler: Tone.Sampler | null = null;
let samplerReadyPromise: Promise<void> | null = null;
let scheduledTimeoutIds: ReturnType<typeof window.setTimeout>[] = [];
let correctSeSynth: Tone.PolySynth | null = null;
let incorrectSeSynth: Tone.Synth | null = null;

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
      // 端末側の音量を上げにくい場面でも聞き取りやすくしたいので、基準出力を約2倍相当に上げる
      volume: SAMPLER_BASE_VOLUME_DB,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
      onload: resolve,
    }).toDestination();
  });

  return samplerReadyPromise;
}

function getCorrectSeSynth(): Tone.PolySynth {
  if (correctSeSynth !== null) {
    return correctSeSynth;
  }

  correctSeSynth = new Tone.PolySynth(Tone.Synth, {
    volume: CORRECT_SE_VOLUME_DB,
    oscillator: { type: "triangle" },
    envelope: {
      attack: 0.005,
      decay: 0.22,
      sustain: 0,
      release: 0.35,
    },
  }).toDestination();
  return correctSeSynth;
}

function getIncorrectSeSynth(): Tone.Synth {
  if (incorrectSeSynth !== null) {
    return incorrectSeSynth;
  }

  incorrectSeSynth = new Tone.Synth({
    volume: INCORRECT_SE_VOLUME_DB,
    oscillator: { type: "square" },
    envelope: {
      attack: 0.01,
      decay: 0.18,
      sustain: 0.08,
      release: 0.18,
    },
  }).toDestination();
  return incorrectSeSynth;
}

export function initSampler(): Promise<void> {
  return createSampler();
}

export async function prepareAudioPlayback(): Promise<void> {
  unlockIOSAudio();
  await Tone.start();
  await createSampler();
}

// 0〜100のパーセント値をTone.jsのデシベル値に変換して適用
export function setVolume(percent: number): void {
  const db: number = percent <= 0 ? -Infinity : -40 * (1 - percent / 100);
  Tone.getDestination().volume.value = db;
}

function stopCurrentPlayback(): void {
  for (const id of scheduledTimeoutIds) {
    window.clearTimeout(id);
  }
  scheduledTimeoutIds = [];
  sampler?.releaseAll();
}

export async function playChord(notes: readonly string[]): Promise<void> {
  await prepareAudioPlayback();

  stopCurrentPlayback();

  const s: Tone.Sampler = sampler!;
  s.triggerAttackRelease(notes as string[], CHORD_DURATION);

  for (let i = 1; i < CHORD_REPEAT_COUNT; i++) {
    const timeoutId: ReturnType<typeof window.setTimeout> = window.setTimeout(() => {
      s.triggerAttackRelease(notes as string[], CHORD_DURATION);
    }, CHORD_INTERVAL_SEC * i * 1000);
    scheduledTimeoutIds.push(timeoutId);
  }
}

export async function playSingleNote(note: string): Promise<void> {
  await prepareAudioPlayback();

  sampler!.triggerAttackRelease(note, CHORD_DURATION);
}

export async function playCorrectSe(): Promise<void> {
  await prepareAudioPlayback();

  const synth: Tone.PolySynth = getCorrectSeSynth();
  const now: number = Tone.now();
  synth.triggerAttackRelease(["G5", "C6"], "16n", now, 0.95);
  synth.triggerAttackRelease(["A5", "D6"], "16n", now + 0.12, 0.95);
  synth.triggerAttackRelease(["B5", "E6"], "16n", now + 0.24, 1);
  synth.triggerAttackRelease(["C6", "E6", "G6"], "4n", now + 0.38, 1);
}

export async function playIncorrectSe(): Promise<void> {
  await prepareAudioPlayback();

  const synth: Tone.Synth = getIncorrectSeSynth();
  const now: number = Tone.now();
  synth.triggerAttackRelease("C3", "8n", now, 0.9);
  synth.triggerAttackRelease("F#2", "8n", now + 0.14, 1);
}
