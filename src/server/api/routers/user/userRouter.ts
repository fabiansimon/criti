import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { UpdateUserInput } from "./userTypes";

const getUser = protectedProcedure.query(async ({ ctx: { db, session } }) => {
  const {
    user: { id },
  } = session;
  try {
    const user = await db.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new TRPCError({ message: "User not found", code: "NOT_FOUND" });
    }

    return user;
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      throw new TRPCError({
        message: error.message,
        code: "INTERNAL_SERVER_ERROR",
      });
    }
  }
});

const updateUser = protectedProcedure
  .input(UpdateUserInput.partial())
  .mutation(async ({ input, ctx: { db, session } }) => {
    const { id, ...updates } = input;
    const {
      user: { id: userId },
    } = session;
    try {
      if (userId !== id) {
        throw new TRPCError({
          message: "Action now allowed.",
          code: "UNAUTHORIZED",
        });
      }

      const user = await db.user.findUnique({
        where: { id },
      });

      if (!user) {
        throw new TRPCError({ message: "User not found", code: "NOT_FOUND" });
      }

      await db.user.update({
        where: { id },
        data: { ...updates },
      });

      return user;
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw new TRPCError({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  });

const archiveUser = protectedProcedure.mutation(
  async ({ ctx: { db, session } }) => {
    const {
      user: { id },
    } = session;

    try {
      const user = await db.user.findUnique({
        where: { id },
        include: { tracks: true },
      });

      if (!user) {
        throw new TRPCError({ message: "User not found", code: "NOT_FOUND" });
      }

      const { tracks } = user;

      const trackIds = tracks.map(({ id }) => id);

      await db.$transaction(async (transaction) => {
        await transaction.trustedSession.deleteMany({
          where: { trackId: { in: trackIds } },
        });

        await transaction.track.deleteMany({
          where: { id: { in: trackIds } },
        });

        await transaction.user.delete({
          where: { id },
        });
      });

      // Handle subscription plan BS

      return { success: true };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw new TRPCError({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  },
);

export const userRouter = createTRPCRouter({
  get: getUser,
  update: updateUser,
  archive: archiveUser,
});
