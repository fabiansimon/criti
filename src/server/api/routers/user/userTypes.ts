import { z } from "zod";

export const UpdateUserInput = z.object({
  id: z.string().uuid(),
  name: z.string(),
});

export type UpdateUserInput = z.infer<typeof UpdateUserInput>;
