import { TRPCError } from "@trpc/server";
import { createTRPCRouter, protectedProcedure } from "../../trpc";
import { SendEmailsInput } from "./emailTypes";
import { sendInvitationEmail } from "../../email/resend";
import { db } from "~/server/db";

const sendEmails = protectedProcedure
  .input(SendEmailsInput)
  .mutation(async ({ input }) => {
    const { emails, trackId } = input;
    try {
      const track = await db.track.findUnique({
        where: { id: trackId },
      });

      if (!track) {
        throw new TRPCError({ message: "Track not found.", code: "NOT_FOUND" });
      }

      await sendInvitationEmail({ emails, trackId });
    } catch (error) {
      if (error instanceof Error) {
        console.error(error);
        throw new TRPCError({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
          cause: error,
        });
      }
    }
  });

export const emailRouter = createTRPCRouter({
  send: sendEmails,
});
