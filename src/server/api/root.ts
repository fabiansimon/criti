import { trackRouter } from "./routers/track/trackRouter";
import { commentRouter } from "./routers/comment/commentRouter";
import { createCallerFactory, createTRPCRouter } from "~/server/api/trpc";
import { stripeRouter } from "./routers/stripe/stripeRouter";
import { userRouter } from "./routers/user/userRouter";
import { emailRouter } from "./routers/email/emailRouter";
import { dashboardRouter } from "./routers/dashboard/dashboardRouter";
import { publicRouter } from "./routers/public/publicRouter";
import { replyRouter } from "./routers/reply/replyRouter";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  track: trackRouter,
  comment: commentRouter,
  stripe: stripeRouter,
  user: userRouter,
  email: emailRouter,
  dashboard: dashboardRouter,
  public: publicRouter,
  reply: replyRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;

/**
 * Create a server-side caller for the tRPC API.
 * @example
 * const trpc = createCaller(createContext);
 * const res = await trpc.post.all();
 *       ^? Post[]
 */
export const createCaller = createCallerFactory(appRouter);
