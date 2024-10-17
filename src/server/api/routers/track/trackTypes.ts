import { z } from "zod";

export const GetTracksByUserOutput = z
  .array(
    z.object({
      id: z.string().uuid(),
      title: z.string(),
      locked: z.boolean(),
      createdAt: z.date(),
      openComments: z.boolean(),
    }),
  )
  .default([]);

export const ArchiveProjectInput = z.object({
  id: z.string().uuid(),
});

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

export const UpdateTrackInput = UploadTrackInput.omit({
  contentType: true,
  fileContent: true,
})
  .partial()
  .extend({
    id: z.string(),
  });

export type UploadTrackInput = z.infer<typeof UploadTrackInput>;
export type GetTrackByIdInput = z.infer<typeof GetTrackByIdInput>;
export type GetTracksByUserOutput = z.infer<typeof GetTracksByUserOutput>;
export type ArchiveProjectInput = z.infer<typeof ArchiveProjectInput>;
export type UpdateTrackInput = z.infer<typeof UpdateTrackInput>;
export type SimplfiedTrack = z.infer<typeof GetTracksByUserOutput>[number];
