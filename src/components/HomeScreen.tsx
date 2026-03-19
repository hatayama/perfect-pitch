import { useState } from "react";
import { QRCodeSVG } from "qrcode.react";

function QrSection() {
  const [showQr, setShowQr] = useState<boolean>(false);
  const url: string = window.location.href;

  return (
    <div style={{ marginTop: "24px" }}>
      <button
        onClick={() => setShowQr((prev: boolean) => !prev)}
        style={{
          fontSize: "0.85rem",
          color: "#666",
          background: "none",
          border: "1px solid #ccc",
          borderRadius: "8px",
          padding: "8px 16px",
          cursor: "pointer",
        }}
      >
        {showQr ? "QRコードをとじる" : "QRコードをひらく"}
      </button>
      {showQr && (
        <div style={{ marginTop: "12px" }}>
          <QRCodeSVG value={url} size={160} />
          <p style={{ fontSize: "0.75rem", color: "#999", marginTop: "8px" }}>
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
        color: "#333",
        marginBottom: "8px",
      }}>
        ぜったいおんかん
      </h1>
      <p style={{ color: "#888", fontSize: "0.9rem", marginBottom: "32px" }}>
        れんしゅう
      </p>

      {/* モード選択 */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", alignItems: "center" }}>
        <button
          onClick={onStartAppMode}
          style={{
            fontSize: "1.4rem",
            padding: "20px 48px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#2196F3",
            color: "#fff",
            cursor: "pointer",
            width: "100%",
            maxWidth: "300px",
            boxShadow: "0 4px 12px rgba(33,150,243,0.3)",
          }}
        >
          アプリで れんしゅう
        </button>

        <button
          onClick={onStartPianoMode}
          style={{
            fontSize: "1.4rem",
            padding: "20px 48px",
            borderRadius: "20px",
            border: "none",
            backgroundColor: "#4CAF50",
            color: "#fff",
            cursor: "pointer",
            width: "100%",
            maxWidth: "300px",
            boxShadow: "0 4px 12px rgba(76,175,80,0.3)",
          }}
        >
          ピアノで れんしゅう
        </button>
      </div>

      {/* QRコード（他デバイスからのアクセス用） */}
      <QrSection />

      {/* 設定ボタン（親向け） */}
      <button
        onClick={onOpenSettings}
        style={{
          marginTop: "48px",
          fontSize: "0.85rem",
          color: "#aaa",
          background: "none",
          border: "none",
          cursor: "pointer",
          textDecoration: "underline",
        }}
      >
        せってい
      </button>
    </div>
  );
}
