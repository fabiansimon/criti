import { z } from "zod";

export const UploadTrackInput = z.object({
  title: z.string(),
  fileContent: z.string(),
  contentType: z.string(),
  locked: z.boolean().default(false),
  password: z.string().optional(),
});

export type UploadTrackInput = z.infer<typeof UploadTrackInput>;
