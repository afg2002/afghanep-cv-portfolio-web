import type { APIRoute } from "astro";
import { renderOgImage } from "../../lib/og";
import { getSiteFacts } from "../../lib/status";

export const GET: APIRoute = async () => {
  const facts = await getSiteFacts();

  const png = await renderOgImage({
    eyebrow: "Site status",
    title: "The site, reporting on itself.",
    footer: "aep.my.id/status",
    meta: [
      { label: "Commit", value: facts.commit?.hash ?? "—", accent: true },
      { label: "Source", value: `${facts.sourceLines.toLocaleString("en-US")} lines` },
      { label: "Writing", value: `${facts.posts} post · ${facts.postWords} words` },
    ],
  });

  return new Response(new Uint8Array(png), {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
