import { z } from "zod";

export const CommentType = z.enum([
  "MIX",
  "LYRIC",
  "DROP",
  "TRANSITION",
  "GENERAL",
]);

export const CommentStatus = z.enum([
  "OPEN",
  "IN_PROGRESS",
  "DISMISSED",
  "UNDER_REVIEW",
  "COMPLETED",
]);

export const GetTrackComments = z.object({
  trackId: z.string().uuid(),
});

export const CreateCommentInput = z.object({
  id: z.string().uuid(),
  trackId: z.string().uuid(),
  content: z.string().min(1),
  timestamp: z.number().optional().nullable(),
  type: CommentType.default("GENERAL"),
  sessionId: z.string().uuid().optional().nullable(),
});

export const RemoveCommentInput = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid().optional(),
});

export const UpdateCommentInput = z.object({
  id: z.string().uuid(),
  status: CommentStatus.optional(),
  pinned: z.boolean().default(false),
});

export type CreateCommentInput = z.infer<typeof CreateCommentInput>;
export type RemoveCommentInput = z.infer<typeof RemoveCommentInput>;
export type UpdateCommentInput = z.infer<typeof UpdateCommentInput>;
export type GetTrackComments = z.infer<typeof GetTrackComments>;
export type CommentType = z.infer<typeof CommentType>;
export type CommentStatus = z.infer<typeof CommentStatus>;
