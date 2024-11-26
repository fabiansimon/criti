import { z } from "zod";

export const ResetDBInput = z.object({
  includeProd: z.boolean().default(false),
});

export type ResetDBInput = z.infer<typeof ResetDBInput>;
