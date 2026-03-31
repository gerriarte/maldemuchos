import { ImageResponse } from "next/og";

export const size = {
  width: 1200,
  height: 630,
};

export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#0A0A0A",
          color: "#fff",
          padding: "56px",
          border: "8px solid #fff",
        }}
      >
        <div style={{ color: "#E5FF00", fontSize: 36, fontWeight: 700 }}>
          MAL DE MUCHOS
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: 74, fontWeight: 800, textTransform: "uppercase", lineHeight: 1.05 }}>
            Quejas anonimas
          </div>
          <div style={{ fontSize: 34, color: "#FF3B30" }}>
            Historias reales para exigir mejor servicio
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    },
  );
}
