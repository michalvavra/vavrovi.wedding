import { readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { generateOpenGraphImage } from "../node_modules/astro-og-canvas/dist/generateOpenGraphImage.js";

const root = dirname(fileURLToPath(import.meta.url));
const projectRoot = dirname(root);

const dateText = "8. 8. 2026";
const placeName = "Starý Mlýn u Byšic";

const extractMessage = (body = "") => {
  const withoutFrontmatter = body.replace(/^---[\s\S]*?---/, "").trim();
  const withoutTags = withoutFrontmatter.replace(/<[^>]+>/g, "");
  const firstParagraph = withoutTags
    .split(/\n{2,}/)
    .map((paragraph) => paragraph.trim())
    .find(Boolean);

  return (firstParagraph ?? "").replace(/\s+/g, " ").trim();
};

const baseOptions = {
  description: `${dateText} · ${placeName}`,
  bgGradient: [[250, 246, 240]],
  padding: 80,
  logo: {
    path: "./src/assets/logo-stacked-v7.png",
    size: [360],
  },
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

const renderInvite = async (slug) => {
  const invitePath = join(projectRoot, "src/content/invites", `${slug}.mdx`);
  const body = await readFile(invitePath, "utf-8");
  const message = extractMessage(body);

  const image = await generateOpenGraphImage({
    ...baseOptions,
    title: message,
  });

  const outputPath = join(projectRoot, "tmp", `og-${slug}.png`);
  await writeFile(outputPath, Buffer.from(await image.arrayBuffer()));

  return outputPath;
};

await renderInvite("pacakovi");
await renderInvite("rudi");
