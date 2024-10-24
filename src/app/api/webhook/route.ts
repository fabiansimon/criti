import { headers } from "next/headers";
import { NextResponse } from "next/server";
import type Stripe from "stripe";
import { env } from "~/env";
import { db } from "~/server/db";
import { stripe } from "~/server/stripe/client";
import {
  cancelSubscription,
  createSubscription,
  invoicePayment,
} from "~/server/stripe/webhook-handler";

export async function POST(req: Request) {
  const body = await req.text();
  const signature = headers().get("Stripe-Signature");
  const secret = env.STRIPE_WEBHOOK_SECRET;

  if (!signature) {
    return new NextResponse("Missing Signature", { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, secret);

    switch (event.type) {
      case "invoice.paid":
        // Used to provision services after the trial has ended.
        // The status of the invoice will show up as paid. Store the status in your database to reference when a user accesses your service to avoid hitting rate limits.
        await invoicePayment({ event });
        break;

      case "customer.subscription.created":
      case "customer.subscription.updated":
        // Used to provision services as they are added to a subscription.
        await createSubscription({ event });
        break;

      case "invoice.payment_failed":
        // If the payment fails or the customer does not have a valid payment method,
        //  an invoice.payment_failed event is sent, the subscription becomes past_due.
        // Use this webhook to notify your user that their payment has
        // failed and to retrieve new card details.
        // Can also have Stripe send an email to the customer notifying them of the failure. See settings: https://dashboard.stripe.com/settings/billing/automatic
        break;

      case "customer.subscription.deleted":
        // handle subscription cancelled automatically based
        // upon your subscription settings.
        await cancelSubscription({
          event,
        });
        break;

      default:
        break;
    }

    await db.stripeEvent.create({
      data: {
        id: event.id,
        type: event.type,
        object: event.object,
        api_version: event.api_version,
        account: event.account,
        created: new Date(event.created * 1000), // convert to milliseconds
        data: {
          object: JSON.stringify(event.data.object),
          previous_attributes: JSON.stringify(event.data.previous_attributes),
        },
        livemode: event.livemode,
        pending_webhooks: event.pending_webhooks,
        request: {
          id: event.request?.id,
          idempotency_key: event.request?.idempotency_key,
        },
      },
    });
  } catch (error) {
    console.error("Error processing webhook event", error);
    return new NextResponse("Error processing webhook event", { status: 400 });
  }
}
