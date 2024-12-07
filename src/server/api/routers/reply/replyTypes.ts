import { z } from "zod";

export const FetchRepliesInput = z.object({
  commentId: z.string().uuid(),
});

export const CreateReplyInput = z.object({
  commentId: z.string().uuid(),
  content: z.string().min(1),
  sessionId: z.string().uuid().optional().nullable(),
});

export const RemoveReplyInput = z.object({
  id: z.string().uuid(),
  sessionId: z.string().uuid().optional(),
});

export type FetchRepliesInput = z.infer<typeof FetchRepliesInput>;
export type CreateReplyInput = z.infer<typeof CreateReplyInput>;
export type RemoveReplyInput = z.infer<typeof RemoveReplyInput>;
