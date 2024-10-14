import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import { CreateCommentInput, RemoveCommentInput } from "./commentTypes";

const createAnonComment = publicProcedure
  .input(CreateCommentInput)
  .mutation(async ({ input, ctx: { db } }) => {
    const { content, trackId, timestamp } = input;

    try {
      const track = await db.track.findUnique({
        where: { id: trackId },
      });

      if (!track) {
        throw new TRPCError({
          message: "Track with that ID not found.",
          code: "NOT_FOUND",
        });
      }

      const comment = await db.comment.create({
        data: {
          content,
          byAdmin: false,
          timestamp: timestamp ?? null,
          track: {
            connect: {
              id: trackId,
            },
          },
        },
      });

      return comment;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        throw new TRPCError({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  });

const createComment = protectedProcedure
  .input(CreateCommentInput)
  .mutation(async ({ input, ctx: { db } }) => {
    const { content, trackId, timestamp } = input;

    try {
      const track = await db.track.findUnique({
        where: { id: trackId },
      });

      if (!track) {
        throw new TRPCError({
          message: "Track with that ID not found.",
          code: "NOT_FOUND",
        });
      }

      const comment = await db.comment.create({
        data: {
          content,
          byAdmin: true,
          timestamp: timestamp ?? null,
          track: {
            connect: {
              id: trackId,
            },
          },
        },
      });

      return comment;
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        throw new TRPCError({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  });

const removeComment = protectedProcedure
  .input(RemoveCommentInput)
  .mutation(async ({ input, ctx: { db } }) => {
    const { id } = input;

    try {
      const comment = await db.comment.findUnique({
        where: { id },
      });

      if (!comment) {
        throw new TRPCError({
          message: "Comment with that ID not found.",
          code: "NOT_FOUND",
        });
      }

      await db.comment.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        throw new TRPCError({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  });

export const commentRouter = createTRPCRouter({
  create: createComment,
  createAnon: createAnonComment,
  delete: removeComment,
});
