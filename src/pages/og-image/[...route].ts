import { getCollection } from "astro:content";
import logo from "../../assets/logo-stacked-v7.png";
import staryMlynLogo from "../../assets/stary-mlyn-logo.jpg";

type WorkersOgModule = typeof import("workers-og");

declare global {
  // eslint-disable-next-line no-var
  var __workersOg: WorkersOgModule | undefined;
}

const workersOg =
  globalThis.__workersOg ??
  (globalThis.__workersOg = await import("workers-og"));

export const prerender = true;

const invites = await getCollection("invites");

const dateText = "8. 8. 2026";
const placeName = "Starý Mlýn u Byšic";

const serifFontPromise = workersOg.loadGoogleFont({
  family: "Source Serif 4",
  weight: 600,
});

const sansFontPromise = workersOg.loadGoogleFont({
  family: "Source Sans 3",
  weight: 400,
});

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

export async function getStaticPaths() {
  return invites.map((invite) => ({
    params: { route: `invite/${invite.id}.png` },
  }));
}

export async function GET({
  params,
  request,
}: {
  params: { route?: string | string[] };
  request: Request;
}) {
  const route = Array.isArray(params.route)
    ? params.route.join("/")
    : params.route;

  if (!route) {
    return new Response("Not found", { status: 404 });
  }

  const match = route.match(/^invite\/(.+?)(?:\.png)?$/);

  if (!match) {
    return new Response("Not found", { status: 404 });
  }

  const inviteId = match[1];
  const invite = invites.find((item) => item.id === inviteId);

  if (!invite) {
    return new Response("Not found", { status: 404 });
  }

  const message = extractMessage(invite.body) || invite.data.title;
  const logoUrl = new URL(logo.src, request.url).toString();
  const placeLogoUrl = new URL(staryMlynLogo.src, request.url).toString();
  const [serifFont, sansFont] = await Promise.all([
    serifFontPromise,
    sansFontPromise,
  ]);

  const html = `
    <div style="width: 1200px; height: 630px; background: #ffffff; display: flex; flex-direction: column; padding: 80px; box-sizing: border-box; gap: 48px;">
      <div style="font-family: 'Source Serif 4'; font-weight: 600; font-size: 64px; line-height: 1.2; color: #342d28; white-space: pre-wrap;">${escapeHtml(message)}</div>
      <div style="display: flex; align-items: center; gap: 40px; margin-top: auto;">
        <img src="${logoUrl}" width="160" height="160" style="object-fit: contain;" />
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="font-family: 'Source Serif 4'; font-weight: 600; font-size: 36px; line-height: 1.1; color: #342d28;">${escapeHtml(dateText)}</div>
          <div style="display: flex; align-items: center; gap: 16px;">
            <img src="${placeLogoUrl}" width="72" height="72" style="object-fit: contain; border-radius: 16px;" />
            <div style="font-family: 'Source Sans 3'; font-weight: 400; font-size: 32px; line-height: 1.2; color: #60564e;">${escapeHtml(placeName)}</div>
          </div>
        </div>
      </div>
    </div>
  `;

  return new workersOg.ImageResponse(html, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: "Source Serif 4",
        data: serifFont,
        weight: 600,
        style: "normal",
      },
      {
        name: "Source Sans 3",
        data: sansFont,
        weight: 400,
        style: "normal",
      },
    ],
  });
}
