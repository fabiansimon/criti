import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { getCustomerId } from "~/server/stripe/webhook-handler";
import { getBaseUrl } from "~/lib/utils";
import { StripeCheckoutInput } from "./stripTypes";

const createCheckoutSession = protectedProcedure
  .input(StripeCheckoutInput)
  .mutation(async ({ input, ctx: { session, stripe } }) => {
    const { priceId } = input;
    const { user } = session;
    try {
      const customerId = await getCustomerId({ userId: user.id });
      if (!customerId)
        throw new TRPCError({
          message: "Customer ID not found.",
          code: "INTERNAL_SERVER_ERROR",
        });

      const baseUrl = getBaseUrl();

      const checkoutSession = await stripe.checkout.sessions.create({
        customer: customerId,
        client_reference_id: user.id,
        payment_method_types: ["card"],
        mode: "subscription",
        success_url: `${baseUrl}/profile?checkoutSuccess=true`,
        cancel_url: `${baseUrl}/profile?checkoutCanceled=true`,
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        subscription_data: {
          metadata: {
            userId: session.user.id,
          },
        },
      });

      return { url: checkoutSession.url };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        throw new TRPCError({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
    return;
  });

const createBillingSession = protectedProcedure.mutation(
  async ({ ctx: { session, stripe } }) => {
    const {
      user: { id: userId },
    } = session;
    try {
      const customerId = await getCustomerId({ userId });
      if (!customerId) {
        throw new TRPCError({
          message: "Customer ID not found.",
          code: "INTERNAL_SERVER_ERROR",
        });
      }

      const baseUrl = getBaseUrl();

      const billingSession = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: `${baseUrl}/home`,
      });

      return { url: billingSession.url };
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        throw new TRPCError({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  },
);

export const stripeRouter = createTRPCRouter({
  checkout: createCheckoutSession,
  billing: createBillingSession,
});
