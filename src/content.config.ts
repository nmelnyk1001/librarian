import { defineCollection, z } from "astro:content";

import { glob } from "astro/loaders";
import { homebrewCharacterSchema } from "./data/characters/homebrew";

const scripts = defineCollection({
  loader: glob({ pattern: "**/*.json", base: "./src/data/scripts" }),
  schema: z
    .tuple([
      z.object({
        id: z.literal("_meta"),
        author: z.string(),
        name: z.string(),
        almanac: z.string().url().optional(),
      }),
    ])
    .rest(z.string().or(homebrewCharacterSchema)),
});

const scriptChangelogs = defineCollection({
  loader: glob({ pattern: "**/CHANGELOG.md", base: "./src/data/scripts" }),
});

const scriptReadmes = defineCollection({
  loader: glob({ pattern: "**/README.md", base: "./src/data/scripts" }),
  schema: ({ image }) =>
    z.object({
      frontImage: image().optional(),
      backImage: image().optional(),
    }),
});

const blogPosts = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "./src/data/posts" }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    author: z.string(),
    pubDate: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
  }),
});

export const collections = {
  scripts,
  scriptChangelogs,
  scriptReadmes,
  blogPosts,
};
