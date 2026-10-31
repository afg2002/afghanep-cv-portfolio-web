/**
 * Generates 1200×630 Open Graph images at build time with Satori (layout → SVG)
 * and resvg (SVG → PNG). No headless browser required, so it stays fast on CI.
 *
 * Fonts are loaded from @fontsource so the rendered image matches the site.
 */
import fs from "node:fs";
import path from "node:path";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const WIDTH = 1200;
const HEIGHT = 630;

let fontCache:
  | { display: Buffer; mono: Buffer; monoMedium: Buffer }
  | null = null;

function readFont(pkg: string, file: string): Buffer {
  const candidates = [
    path.join(process.cwd(), "node_modules", "@fontsource", pkg, "files", file),
    path.join(process.cwd(), "node_modules", "@fontsource", pkg, file),
  ];
  for (const candidate of candidates) {
    if (fs.existsSync(candidate)) return fs.readFileSync(candidate);
  }
  throw new Error(`[og] font not found: ${pkg}/${file}`);
}

function fonts() {
  if (!fontCache) {
    fontCache = {
      display: readFont("space-grotesk", "space-grotesk-latin-600-normal.woff"),
      mono: readFont("jetbrains-mono", "jetbrains-mono-latin-400-normal.woff"),
      monoMedium: readFont("jetbrains-mono", "jetbrains-mono-latin-500-normal.woff"),
    };
  }
  return fontCache;
}

const palette = {
  bg: "#0a0a0b",
  surface: "#121214",
  text: "#f4f4f5",
  text2: "#d4d4d8",
  muted: "#9a9aa3",
  accent: "#ff4a1c",
  line: "rgba(255,255,255,0.14)",
};

export interface OgOptions {
  /** Small mono label above the headline, e.g. "WRITING". */
  eyebrow: string;
  /** Main headline. */
  title: string;
  /** Optional bottom-left context line. */
  footer?: string;
  /** Right-hand meta rows. */
  meta?: Array<{ label: string; value: string; accent?: boolean }>;
}

function template({ eyebrow, title, footer, meta = [] }: OgOptions) {
  // Keep long titles inside the safe area by shrinking type for longer strings.
  const len = title.length;
  const fontSize = len > 92 ? 50 : len > 64 ? 60 : len > 40 ? 72 : 82;

  return {
    type: "div",
    props: {
      style: {
        width: `${WIDTH}px`,
        height: `${HEIGHT}px`,
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        backgroundColor: palette.bg,
        color: palette.text,
        padding: "56px",
        fontFamily: "Space Grotesk",
        position: "relative",
      },
      children: [
        // Top meta row
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingBottom: "20px",
              borderBottom: `1px solid ${palette.line}`,
            },
            children: [
              {
                type: "div",
                props: {
                  style: { display: "flex", alignItems: "center", gap: "12px" },
                  children: [
                    {
                      type: "div",
                      props: {
                        style: {
                          width: "10px",
                          height: "10px",
                          borderRadius: "9999px",
                          backgroundColor: palette.accent,
                        },
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          fontFamily: "JetBrains Mono",
                          fontSize: "15px",
                          letterSpacing: "3px",
                          color: palette.text2,
                        },
                        children: eyebrow.toUpperCase(),
                      },
                    },
                  ],
                },
              },
              {
                type: "div",
                props: {
                  style: {
                    fontFamily: "JetBrains Mono",
                    fontSize: "15px",
                    letterSpacing: "3px",
                    color: palette.muted,
                  },
                  children: "AEP.MY.ID",
                },
              },
            ],
          },
        },

        // Middle: headline + meta panel
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              flexGrow: 1,
              alignItems: "center",
              gap: "44px",
              paddingTop: "20px",
              paddingBottom: "20px",
            },
            children: [
              {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexGrow: 1,
                    flexShrink: 1,
                    width: "0",
                    fontSize: `${fontSize}px`,
                    fontWeight: 600,
                    lineHeight: 1.12,
                    letterSpacing: "-2px",
                    color: palette.text,
                  },
                  children: title,
                },
              },
              meta.length
                ? {
                    type: "div",
                    props: {
                      style: {
                        display: "flex",
                        flexDirection: "column",
                        width: "320px",
                        flexShrink: 0,
                        border: `1px solid ${palette.line}`,
                        backgroundColor: palette.surface,
                      },
                      children: [
                        {
                          type: "div",
                          props: {
                            style: {
                              padding: "12px 18px",
                              borderBottom: `1px solid ${palette.line}`,
                              fontFamily: "JetBrains Mono",
                              fontSize: "12px",
                              letterSpacing: "2px",
                              color: palette.muted,
                            },
                            children: "DETAILS",
                          },
                        },
                        ...meta.map((row) => ({
                          type: "div",
                          props: {
                            style: {
                              display: "flex",
                              justifyContent: "space-between",
                              gap: "12px",
                              padding: "14px 18px",
                              borderBottom: `1px solid rgba(255,255,255,0.08)`,
                            },
                            children: [
                              {
                                type: "div",
                                props: {
                                  style: {
                                    fontFamily: "JetBrains Mono",
                                    fontSize: "12px",
                                    letterSpacing: "1.6px",
                                    color: palette.muted,
                                  },
                                  children: row.label.toUpperCase(),
                                },
                              },
                              {
                                type: "div",
                                props: {
                                  style: {
                                    fontFamily: "JetBrains Mono",
                                    fontSize: "13px",
                                    color: row.accent ? palette.accent : palette.text2,
                                  },
                                  children: row.value,
                                },
                              },
                            ],
                          },
                        })),
                      ],
                    },
                  }
                : null,
            ].filter(Boolean),
          },
        },

        // Bottom row
        {
          type: "div",
          props: {
            style: {
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              paddingTop: "20px",
              borderTop: `1px solid ${palette.line}`,
              fontFamily: "JetBrains Mono",
              fontSize: "15px",
              letterSpacing: "2px",
              color: palette.muted,
            },
            children: [
              {
                type: "div",
                props: {
                  style: { color: palette.text2 },
                  children: (footer || "AFGHAN EKA PANGESTU").toUpperCase(),
                },
              },
              {
                type: "div",
                props: { children: "SOFTWARE DEVELOPER" },
              },
            ],
          },
        },
      ],
    },
  } as any;
}

export async function renderOgImage(options: OgOptions): Promise<Buffer> {
  const f = fonts();
  const svg = await satori(template(options), {
    width: WIDTH,
    height: HEIGHT,
    fonts: [
      { name: "Space Grotesk", data: f.display, weight: 600, style: "normal" },
      { name: "JetBrains Mono", data: f.mono, weight: 400, style: "normal" },
      { name: "JetBrains Mono", data: f.monoMedium, weight: 500, style: "normal" },
    ],
  });

  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: WIDTH },
  });
  return Buffer.from(resvg.render().asPng());
}
