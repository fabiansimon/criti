import { z } from "zod";

export const StripeCheckoutInput = z.object({
  priceId: z.string(),
});

export type StripeCheckoutInput = z.infer<typeof StripeCheckoutInput>;
