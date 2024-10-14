import { z } from "zod";

export const GetTrackByIdInput = z.object({
  id: z.string().uuid(),
});

export const UploadTrackInput = z.object({
  title: z.string(),
  fileContent: z.string(),
  contentType: z.string(),
  locked: z.boolean().default(false),
  password: z.string().optional(),
  emails: z.array(z.string().email()),
});

export type UploadTrackInput = z.infer<typeof UploadTrackInput>;
export type GetTrackByIdInput = z.infer<typeof GetTrackByIdInput>;
