import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

const invites = defineCollection({
  loader: glob({ pattern: "**/*.mdx", base: "./src/content/invites" }),
  schema: z.object({
    title: z.string(),
    phoneNumbers: z.array(z.string()),
    lang: z.enum(["cs", "en"]).optional().default("cs"),
  }),
});

export const collections = { invites };
