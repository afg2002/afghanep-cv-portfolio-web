import type { APIRoute } from "astro";
import { renderOgImage } from "../../lib/og";

export const GET: APIRoute = async () => {
  const png = await renderOgImage({
    eyebrow: "Software Developer",
    title: "I build backend systems that hold up.",
    footer: "Bogor, Indonesia",
    meta: [
      { label: "Experience", value: "2+ years", accent: true },
      { label: "Focus", value: "Backend / APIs" },
      { label: "Stack", value: "Java · Laravel · Go" },
    ],
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
