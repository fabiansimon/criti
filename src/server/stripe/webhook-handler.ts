import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { stripe } from "./client";
import type Stripe from "stripe";

export async function getCustomerId({ userId }: { userId: string }) {
  const user = await db.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new TRPCError({ message: "User not found", code: "NOT_FOUND" });
  }

  const { stripeCustomerId, email, name } = user;

  if (stripeCustomerId) return stripeCustomerId;

  const { id: customerId } = await stripe.customers.create({
    email: email ?? undefined,
    name: name ?? undefined,
    metadata: {
      userId,
    },
  });

  await db.user.update({
    where: { id: userId },
    data: {
      stripeCustomerId: customerId,
    },
  });

  return customerId;
}

export async function invoicePayment({ event }: { event: Stripe.Event }) {
  const invoice = event.data.object as Stripe.Invoice;
  const subscriptionId = invoice.subscription as string;
  const { id, status, metadata } =
    await stripe.subscriptions.retrieve(subscriptionId);

  const userId = metadata.userId;

  await db.user.update({
    where: { id: userId },
    data: {
      stripeSubscriptionId: id,
      stripSubscriptionStatus: status,
      membership: "PREMIUM_V1",
    },
  });
}

export async function createSubscription({ event }: { event: Stripe.Event }) {
  const { id, status, metadata } = event.data.object as Stripe.Subscription;
  const { userId } = metadata;

  await db.user.update({
    where: { id: userId },
    data: {
      stripeSubscriptionId: id,
      stripSubscriptionStatus: status,
      membership: "PREMIUM_V1",
    },
  });
}

export async function cancelSubscription({ event }: { event: Stripe.Event }) {
  const { metadata } = event.data.object as Stripe.Subscription;
  const { userId } = metadata;

  await db.user.update({
    where: { id: userId },
    data: {
      stripeSubscriptionId: null,
      stripSubscriptionStatus: null,
      membership: "FREE",
    },
  });
}
