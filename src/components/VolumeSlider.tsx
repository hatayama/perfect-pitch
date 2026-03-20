interface VolumeSliderProps {
  readonly volume: number;
  readonly onChangeVolume: (percent: number) => void;
}

function VolumeIcon({ muted }: { readonly muted: boolean }) {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d="M4 9H8L13 5V19L8 15H4V9Z"
        fill="currentColor"
      />
      {muted ? (
        <path
          d="M16 9L21 14M21 9L16 14"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      ) : (
        <>
          <path
            d="M16 9.5C17.4 10.4 18.2 11.9 18.2 13.5C18.2 15.1 17.4 16.6 16 17.5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path
            d="M18.8 7C21 8.6 22.3 11 22.3 13.5C22.3 16 21 18.4 18.8 20"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      )}
    </svg>
  );
}

export function VolumeSlider({ volume, onChangeVolume }: VolumeSliderProps) {
  const muted: boolean = volume === 0;
  const fillPercent: string = `${volume}%`;

  return (
    <div className="volume-slider">
      <span
        className="volume-slider__icon"
        style={{ color: muted ? "var(--text-secondary)" : "var(--text-primary)" }}
      >
        <VolumeIcon muted={muted} />
      </span>
      <input
        className="volume-slider__range"
        type="range"
        min={0}
        max={100}
        value={volume}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          onChangeVolume(Number(e.target.value))
        }
        style={{
          background: `linear-gradient(90deg, var(--slider-fill) 0%, var(--slider-fill) ${fillPercent}, var(--slider-track) ${fillPercent}, var(--slider-track) 100%)`,
        }}
      />
    </div>
  );
}
