import type { APIRoute } from "astro";
import { getCollection } from "astro:content";
import { ImageResponse, loadGoogleFont } from "workers-og";

const invites = await getCollection("invites");

const extractMessage = (body?: string) => {
  if (!body) {
    return "";
  }

  const withoutFrontmatter = body.replace(/^---[\s\S]*?---/, "").trim();
  const withoutTags = withoutFrontmatter.replace(/<[^>]+>/g, "");
  const firstParagraph = withoutTags
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .find(Boolean);

  return (firstParagraph ?? "").replace(/\s+/g, " ").trim();
};

const escapeHtml = (value: string) =>
  value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\"/g, "&quot;")
    .replace(/'/g, "&#39;");

export const GET: APIRoute = async ({ params }) => {
  const inviteId = params.inviteId;

  if (!inviteId) {
    return new Response("Not found", { status: 404 });
  }

  const invite = invites.find((item) => item.id === inviteId);

  if (!invite) {
    return new Response("Not found", { status: 404 });
  }

  const message = extractMessage(invite.body) || invite.data.title;
  const dateText = "8. 8. 2026";
  const serifFont = await loadGoogleFont({
    family: "Source Serif 4",
    weight: 600,
  });

  const html = `
    <div style="display: flex; flex-direction: column; height: 100vh; width: 100vw; padding: 60px; box-sizing: border-box; font-family: 'Source Serif 4'; background: #ffffff; color: #111111;">
      <h1 style="font-size: 60px; font-weight: 600; margin: 0;">${escapeHtml(message)}</h1>
      <p style="font-size: 60px; font-weight: 600; margin: auto 0 0 0;">${dateText}</p>
    </div>
  `;

  return new ImageResponse(html, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Source Serif 4",
        data: serifFont,
        weight: 600,
        style: "normal",
      },
    ],
  });
};
