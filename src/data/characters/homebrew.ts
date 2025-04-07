import { z } from "astro/zod";

export const homebrewCharacterSchema = z.object({
  id: z.string(),
  image: z.string().url().optional(),
  firstNightReminder: z.string().optional(),
  otherNightReminder: z.string().optional(),
  setup: z.boolean().optional(),
  reminders: z.array(z.string()).optional(),
  name: z.string().optional(),
  team: z.string(),
  ability: z.string(),
  firstNight: z.number().optional(),
  otherNight: z.number().optional(),
});

export type HomebrewCharacter = z.infer<typeof homebrewCharacterSchema>;
