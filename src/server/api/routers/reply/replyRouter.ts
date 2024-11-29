import { TRPCError } from "@trpc/server";
import {
  anonPossibleProcedure,
  createTRPCRouter,
  publicProcedure,
} from "../../trpc";
import {
  CreateReplyInput,
  FetchRepliesInput,
  RemoveReplyInput,
} from "./replyTypes";
import { sendCommentNotificationEmail } from "../../email/resend";

const fetchReplies = publicProcedure
  .input(FetchRepliesInput)
  .query(async ({ ctx, input }) => {
    const { commentId } = input;

    try {
      const comment = await ctx.db.comment.findUnique({
        where: { id: commentId },
        include: {
          thread: {
            include: {
              creator: true,
            },
            orderBy: { createdAt: "asc" },
          },
        },
      });

      if (!comment) {
        throw new TRPCError({
          message: "Replies not found",
          code: "NOT_FOUND",
        });
      }

      return comment.thread;
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

const createReply = anonPossibleProcedure
  .input(CreateReplyInput)
  .mutation(async ({ input, ctx: { db, session } }) => {
    const { content, sessionId, commentId } = input;

    try {
      const comment = await db.comment.findUnique({
        where: { id: commentId },
        include: { creator: true, track: { include: { creator: true } } },
      });

      if (!comment) {
        throw new TRPCError({
          message: "Comment with that ID not found.",
          code: "NOT_FOUND",
        });
      }

      const { creator } = comment.track;

      const byAdmin = session?.user.id === creator.id;

      const reply = await db.reply.create({
        data: {
          creatorId: session?.user?.id ?? null,
          sessionId: sessionId ?? null,
          content,
          byAdmin,
          commentId,
        },
      });

      //   if (!byAdmin && creator.email) {
      //     const { id, title } = track;
      //     void sendCommentNotificationEmail({
      //       comment,
      //       email: creator.email,
      //       id: id,
      //       title: title,
      //     });
      //   }

      return reply;
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

const removeReply = anonPossibleProcedure
  .input(RemoveReplyInput)
  .mutation(async ({ input, ctx: { db, session } }) => {
    const { id, sessionId } = input;

    try {
      const reply = await db.reply.findUnique({
        where: { id },
        include: {
          comment: { include: { track: { include: { creator: true } } } },
        },
      });

      if (!reply) {
        throw new TRPCError({
          message: "Reply with that ID not found.",
          code: "NOT_FOUND",
        });
      }

      const {
        comment: {
          track: { creatorId },
        },
        sessionId: _sessionId,
      } = reply;

      if (creatorId !== session?.user?.id && _sessionId !== sessionId) {
        throw new TRPCError({
          message: "You do not have permission for this action.",
          code: "FORBIDDEN",
        });
      }

      await db.reply.delete({
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

export const replyRouter = createTRPCRouter({
  fetchReplies: fetchReplies,
  create: createReply,
  remove: removeReply,
});
