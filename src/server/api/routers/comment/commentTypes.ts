import { z } from "zod";

export const GetTrackComments = z.object({
  trackId: z.string().uuid(),
});
export const CreateCommentInput = z.object({
  id: z.string().uuid(),
  trackId: z.string().uuid(),
  content: z.string().min(1),
  timestamp: z.number().optional().nullable(),
  sessionId: z.string().uuid().optional().nullable(),
});
export const RemoveCommentInput = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid().optional(),
});

export const UpdateCommentInput = z.object({
  id: z.string().uuid(),
  done: z.boolean(),
});

export type CreateCommentInput = z.infer<typeof CreateCommentInput>;
export type RemoveCommentInput = z.infer<typeof RemoveCommentInput>;
export type UpdateCommentInput = z.infer<typeof UpdateCommentInput>;
export type GetTrackComments = z.infer<typeof GetTrackComments>;
