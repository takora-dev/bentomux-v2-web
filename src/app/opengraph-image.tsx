import { ImageResponse } from "next/og";

import { hero, site } from "@/content/site";

export const alt = `${site.siteName} — ${hero.headline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/** Social card built from the design tokens, not from a raster asset: the card
 *  is text and colour, so it needs no product imagery to stay legible at the
 *  sizes a crawler asks for (`IMG-002`). */
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#17181B",
          padding: "72px",
          border: "1px solid #2C2F34",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 24, height: 24, background: "#4C8EF9", borderRadius: 6 }} />
          <div style={{ color: "#E8EAED", fontSize: 34, fontWeight: 700 }}>{site.siteName}</div>
        </div>
        <div
          style={{
            color: "#E8EAED",
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            maxWidth: 950,
          }}
        >
          {hero.headline}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <div style={{ color: "#A6ABB3", fontSize: 30, maxWidth: 900 }}>{hero.badge}</div>
          <div style={{ height: 4, width: 160, background: "#4C8EF9", borderRadius: 999 }} />
        </div>
      </div>
    ),
    size,
  );
}
