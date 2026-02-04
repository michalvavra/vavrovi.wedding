import { getCollection } from "astro:content";
import { OGImageRoute } from "astro-og-canvas";

export const prerender = true;

const invites = await getCollection("invites");

const dateText = "8. 8. 2026";
const placeName = "Starý Mlýn u Byšic";

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

const pages = Object.fromEntries(
  invites.map((invite) => [
    `invite/${invite.id}`,
    {
      title: invite.data.title,
      lang: invite.data.lang ?? "cs",
      message: extractMessage(invite.body),
    },
  ]),
);

export const { getStaticPaths, GET } = await OGImageRoute({
  param: "route",
  pages,
  getImageOptions: (_path, page) => {
    const message = page.message || page.title;

    return {
      title: message,
      description: `${dateText} · ${placeName}`,
      bgGradient: [[255, 255, 255]],
      bgImage: {
        path: "./src/assets/logo-og.png",
        fit: "none",
        position: ["end", "start"],
      },
      padding: 80,
      font: {
        title: {
          families: ["Source Serif 4"],
          weight: "SemiBold",
          size: 64,
          lineHeight: 1.2,
          color: [52, 45, 40],
        },
        description: {
          families: ["Source Sans 3"],
          weight: "Normal",
          size: 36,
          lineHeight: 1.3,
          color: [96, 86, 78],
        },
      },
      fonts: [
        "https://fonts.gstatic.com/s/sourceserif4/v14/vEFy2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6OAVIJmeUDygwjihdqrhw.ttf",
        "https://fonts.gstatic.com/s/sourceserif4/v14/vEFy2_tTDB4M7-auWDN0ahZJW3IX2ih5nk3AucvUHf6OAVIJmeUDygwjisltrhw.ttf",
        "https://fonts.gstatic.com/s/sourcesans3/v19/nwpBtKy2OAdR1K-IwhWudF-R9QMylBJAV3Bo8Ky461EN.ttf",
        "https://fonts.gstatic.com/s/sourcesans3/v19/nwpBtKy2OAdR1K-IwhWudF-R9QMylBJAV3Bo8Kxm7FEN.ttf",
      ],
    };
  },
});
