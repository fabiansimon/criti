import { z } from "zod";

export const CreateCommentInput = z.object({
  trackId: z.string().uuid(),
  content: z.string().min(1),
  timestamp: z.number().optional(),
});
export const RemoveCommentInput = z.object({
  id: z.string().uuid(),
});

export const UpdateCommentInput = z.object({
  id: z.string().uuid(),
  done: z.boolean(),
});

export type CreateCommentInput = z.infer<typeof CreateCommentInput>;
export type RemoveCommentInput = z.infer<typeof RemoveCommentInput>;
export type UpdateCommentInput = z.infer<typeof UpdateCommentInput>;
