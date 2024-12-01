import { z } from "zod";

export const FetchTracksInput = z.object({
  page: z.number().min(1).default(1),
  size: z.number().min(1).max(100).default(10),
});

export const PublicTrack = z.object({
  title: z.string(),
  streams: z.number(),
  id: z.string().uuid(),
});

export type FetchTrackInput = z.infer<typeof FetchTracksInput>;
export type PublicTrack = z.infer<typeof PublicTrack>;
