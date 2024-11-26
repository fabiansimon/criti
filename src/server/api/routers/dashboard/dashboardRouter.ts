import { createTRPCRouter } from "../../trpc";
import { dashboardProcedure } from "./dashboardProcedures";
import { ResetDBInput } from "./dashboardTypes";

const resetDB = dashboardProcedure
  .input(ResetDBInput)
  .mutation(async ({ ctx, input }) => {
    const { includeProd } = input;

    if (includeProd) {
    }

    await ctx.db.$transaction(async (db) => {
      // delete all trusted session
      await db.trustedSession.deleteMany({});

      // delete all comments
      await db.comment.deleteMany({});

      // delete all stripe events
      await db.stripeEvent.deleteMany({});

      // delete all files
      await db.file.deleteMany({});

      // delete all verification tokens
      await db.verificationToken.deleteMany({});

      // delete all sessions
      await db.session.deleteMany({});

      // delete all accounts
      await db.account.findMany({});

      // delete all users
      await db.user.deleteMany({});
    });
  });

export const dashboardRouter = createTRPCRouter({
  resetDB: resetDB,
});
