import { useState, type CSSProperties } from "react";
import { QRCodeSVG } from "qrcode.react";

const homeActionButtonStyle: CSSProperties = {
  fontSize: "1.3rem",
  fontWeight: 800,
  letterSpacing: "0.03em",
  whiteSpace: "nowrap",
  padding: "20px 32px",
  borderRadius: "20px",
  border: "none",
  color: "#fff",
  cursor: "pointer",
  width: "100%",
  maxWidth: "340px",
};

const subtleSettingsButtonStyle: CSSProperties = {
  ...homeActionButtonStyle,
  fontSize: "1rem",
  fontWeight: 700,
  marginTop: "32px",
  backgroundColor: "var(--btn-subtle)",
  boxShadow: "0 4px 12px var(--btn-subtle-shadow)",
};

function QrSection() {
  const [showQr, setShowQr] = useState<boolean>(false);
  const url: string = window.location.href;

  return (
    <div style={{ marginTop: "24px" }}>
      <button
        onClick={() => setShowQr((prev: boolean) => !prev)}
        style={{
          fontSize: "0.85rem",
          color: "var(--text-muted)",
          background: "none",
          border: "1px solid var(--border-default)",
          borderRadius: "8px",
          padding: "8px 16px",
          cursor: "pointer",
        }}
      >
        {showQr ? "QRコードをとじる" : "QRコードをひらく"}
      </button>
      {showQr && (
        <div style={{ marginTop: "12px" }}>
          <QRCodeSVG value={url} size={160} bgColor="var(--qr-bg)" fgColor="var(--qr-fg)" />
          <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", marginTop: "8px" }}>
            {url}
          </p>
        </div>
      )}
    </div>
  );
}

interface HomeScreenProps {
  readonly onStartAppMode: () => void;
  readonly onStartPianoMode: () => void;
  readonly onOpenSettings: () => void;
}

export function HomeScreen({
  onStartAppMode,
  onStartPianoMode,
  onOpenSettings,
}: HomeScreenProps) {
  return (
    <div style={{
      textAlign: "center",
      padding: "32px 16px",
      maxWidth: "500px",
      margin: "0 auto",
    }}>
      <h1 style={{
        fontSize: "2rem",
        color: "var(--text-primary)",
        marginBottom: "8px",
      }}>
        ぜったいおんかん
      </h1>
      <p style={{ color: "var(--text-secondary)", fontSize: "0.9rem", marginBottom: "32px" }}>
        れんしゅう
      </p>

      {/* モード選択 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
        <button
          onClick={onStartAppMode}
          style={{
            ...homeActionButtonStyle,
            backgroundColor: "#2196F3",
            boxShadow: "0 4px 12px rgba(33,150,243,0.3)",
          }}
        >
          アプリで れんしゅう
        </button>

        <button
          onClick={onStartPianoMode}
          style={{
            ...homeActionButtonStyle,
            backgroundColor: "#4CAF50",
            boxShadow: "0 4px 12px rgba(76,175,80,0.3)",
          }}
        >
          ピアノで れんしゅう
        </button>
        <p style={{ fontSize: "0.75rem", color: "var(--text-tertiary)", margin: "-8px 0 0" }}>
          パパママに おねがいしてね
        </p>
      </div>

      {/* QRコード（他デバイスからのアクセス用） */}
      <QrSection />

      {/* 設定ボタン（親向け） */}
      <button
        onClick={onOpenSettings}
        style={subtleSettingsButtonStyle}
      >
        せってい
      </button>
    </div>
  );
}
