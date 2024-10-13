import { z } from "zod";

export const UploadTrackInput = z.object({
  title: z.string(),
  fileContent: z.string(),
  contentType: z.string(),
  locked: z.boolean().default(false),
  password: z.string().optional(),
  emails: z.array(z.string().email()),
});

export type UploadTrackInput = z.infer<typeof UploadTrackInput>;
