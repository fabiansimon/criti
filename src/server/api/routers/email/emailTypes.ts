import { z } from "zod";

export const SendEmailsInput = z.object({
  trackId: z.string().uuid(),
  emails: z.array(z.string().email()),
});

export type SendEmailsInput = z.infer<typeof SendEmailsInput>;
