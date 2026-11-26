import { ImageResponse } from "next/og";

export const size = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "8px",
          background: "linear-gradient(135deg, #07080D 0%, #111827 100%)",
          border: "1px solid #22D3EE",
          color: "#F5F7FA",
          fontSize: "18px",
          fontWeight: 700,
        }}
      >
        S
      </div>
    ),
    { ...size }
  );
}
