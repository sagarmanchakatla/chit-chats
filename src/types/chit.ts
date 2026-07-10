import { z } from "zod/v4";

export const chitSchema = z.object({
  title: z.string().min(1, "Title is required").max(100),
  description: z.string().min(1, "Description is required").max(500),
  emoji: z.string().min(1, "Emoji is required").max(10),
  theme: z.string().regex(/^#[0-9A-Fa-f]{6}$/, "Theme must be a valid hex color"),
  illustration: z.string().max(500).nullable(),
  order_index: z.number().int().min(0),
  gif_url: z.string().max(500).nullable(),
});

export const chitIdSchema = z.object({
  id: z.string().uuid("Invalid chit ID"),
});

export type ChitInput = z.infer<typeof chitSchema>;
