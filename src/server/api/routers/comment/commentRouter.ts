import {
  anonPossibleProcedure,
  createTRPCRouter,
  protectedProcedure,
} from "~/server/api/trpc";
import { TRPCError } from "@trpc/server";
import {
  CreateCommentInput,
  RemoveCommentInput,
  UpdateCommentInput,
} from "./commentTypes";

const createComment = anonPossibleProcedure
  .input(CreateCommentInput)
  .mutation(async ({ input, ctx: { db, session } }) => {
    const { content, trackId, timestamp, sessionId } = input;

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
          timestamp: timestamp ?? null,
          creatorId: session?.user?.id ?? null,
          byAdmin: !!session,
          sessionId: sessionId ?? null,
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

const removeComment = anonPossibleProcedure
  .input(RemoveCommentInput)
  .mutation(async ({ input, ctx: { db, session } }) => {
    const { id, sessionId } = input;

    try {
      const comment = await db.comment.findUnique({
        where: { id },
        include: { track: true },
      });

      if (!comment) {
        throw new TRPCError({
          message: "Comment with that ID not found.",
          code: "NOT_FOUND",
        });
      }

      const {
        track: { creatorId },
        sessionId: _sessionId,
      } = comment;

      if (creatorId !== session?.user?.id && _sessionId !== sessionId) {
        throw new TRPCError({
          message: "You do not have permission for this action.",
          code: "FORBIDDEN",
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

const updateComment = protectedProcedure
  .input(UpdateCommentInput)
  .mutation(async ({ input, ctx: { db, session } }) => {
    const { id, done } = input;
    const {
      user: { id: userId },
    } = session;

    try {
      const comment = await db.comment.findUnique({
        where: { id },
        include: { track: true },
      });

      if (!comment) {
        throw new TRPCError({
          message: "Comment with that ID not found.",
          code: "NOT_FOUND",
        });
      }

      if (comment.track.creatorId !== userId) {
        throw new TRPCError({
          message: "Must be admin to update comment.",
          code: "FORBIDDEN",
        });
      }

      await db.comment.update({
        where: { id },
        data: {
          open: !done,
        },
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
  delete: removeComment,
  update: updateComment,
});
