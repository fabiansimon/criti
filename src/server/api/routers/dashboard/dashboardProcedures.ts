import { TRPCError } from "@trpc/server";
import { protectedProcedure, timingMiddleware } from "../../trpc";
import { env } from "~/env";
import { WHITELISTED_EMAILS } from "~/constants/dev";

/**
 * Router for admins only (developers)
 */
export const dashboardProcedure = protectedProcedure
  .use(timingMiddleware)
  .use(({ ctx, next }) => {
    if (
      !ctx.session?.user ||
      !WHITELISTED_EMAILS.includes(ctx.session?.user.email ?? "")
    ) {
      throw new TRPCError({ code: "UNAUTHORIZED" });
    }

    if (env.NODE_ENV !== "development") {
      throw new TRPCError({ code: "PRECONDITION_FAILED" });
    }

    return next({
      ctx: {
        // infers the `session` as non-nullable
        session: { ...ctx.session, user: ctx.session.user },
      },
    });
  });
