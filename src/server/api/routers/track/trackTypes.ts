import { z } from "zod";

export const GetTracksByUserOutput = z
  .array(
    z.object({
      id: z.string().uuid(),
      title: z.string(),
      locked: z.boolean(),
      createdAt: z.date(),
      openComments: z.boolean(),
      expiresIn: z.number(),
      isPublic: z.boolean(),
    }),
  )
  .default([]);

export const GetFilteredTracksInput = z.object({
  amount: z.number().default(3),
  isPublic: z.boolean().default(false),
});

export const ArchiveProjectInput = z.object({
  id: z.string().uuid(),
});

export const UpdateProjectPasswordInput = z.object({
  id: z.string().uuid(),
  password: z.string(),
});

export const IsTrackLockedInput = z.object({
  id: z.string().uuid(),
});

export const GetTrackByIdInput = z.object({
  id: z.string().uuid(),
  password: z.string().optional(),
  sessionId: z.string().uuid(),
});

export const UploadTrackInput = z.object({
  title: z.string(),
  fileContent: z.string(),
  contentType: z.string(),
  password: z.string().optional(),
  emails: z.array(z.string().email()),
  isPublic: z.boolean().default(false),
});

export const UpdateTrackInput = UploadTrackInput.omit({
  contentType: true,
  fileContent: true,
})
  .partial()
  .extend({
    id: z.string(),
  });

export const CheckTrackLimitOutput = z.object({
  allowed: z.boolean(),
});

export type UploadTrackInput = z.infer<typeof UploadTrackInput>;
export type GetTrackByIdInput = z.infer<typeof GetTrackByIdInput>;
export type GetTracksByUserOutput = z.infer<typeof GetTracksByUserOutput>;
export type ArchiveProjectInput = z.infer<typeof ArchiveProjectInput>;
export type UpdateTrackInput = z.infer<typeof UpdateTrackInput>;
export type CheckTrackLimitOutput = z.infer<typeof CheckTrackLimitOutput>;
export type UpdateProjectPasswordInput = z.infer<
  typeof UpdateProjectPasswordInput
>;
export type IsTrackLockedInput = z.infer<typeof IsTrackLockedInput>;
export type SimplfiedTrack = z.infer<typeof GetTracksByUserOutput>[number];
export type GetFilteredTracksInput = z.infer<typeof GetFilteredTracksInput>;
