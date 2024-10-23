import { TRPCError } from "@trpc/server";
import { db } from "../db";
import { stripe } from "./client";

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
