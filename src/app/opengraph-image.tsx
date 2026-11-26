import { ImageResponse } from "next/og";

export const alt = "Soniaa (Sonya) S. — Fractional CMO | The Clarity Lens";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          backgroundColor: "#07080D",
          backgroundImage:
            "radial-gradient(circle at 80% 20%, rgba(34, 211, 238, 0.2), transparent 45%), radial-gradient(circle at 15% 85%, rgba(245, 158, 11, 0.18), transparent 45%)",
          color: "#F5F7FA",
          padding: "56px 64px",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "10px 18px",
              borderRadius: "999px",
              border: "1px solid rgba(255,255,255,0.14)",
              backgroundColor: "rgba(255,255,255,0.04)",
              fontSize: "20px",
              color: "#22D3EE",
            }}
          >
            <span>THE CLARITY LENS · FRACTIONAL CMO</span>
          </div>
          <div style={{ fontSize: "20px", color: "#94A3B8" }}>10,574 LinkedIn Followers</div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
          <div style={{ fontSize: "58px", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.03em" }}>
            Soniaa (Sonya) S.
          </div>
          <div style={{ fontSize: "28px", color: "#CBD5E1", lineHeight: 1.35, maxWidth: "960px" }}>
            “I notice what others don&apos;t. The gaps, the confusion, the unspoken story, and I help make sense of it.”
          </div>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderTop: "1px solid rgba(255,255,255,0.12)",
            paddingTop: "24px",
            fontSize: "20px",
            color: "#94A3B8",
          }}
        >
          <span>Brand to Revenue · Messaging to Conversion · Ops to Execution · People to Everything</span>
          <span style={{ color: "#F59E0B" }}>USA · UAE · INDIA</span>
        </div>
      </div>
    ),
    { ...size }
  );
}
