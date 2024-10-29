import * as bcrypt from "bcrypt";
import {
  anonPossibleProcedure,
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  ArchiveProjectInput,
  GetTrackByIdInput,
  GetTracksByUserOutput,
  UpdateProjectPasswordInput,
  UpdateTrackInput,
  UploadTrackInput,
} from "./trackTypes";
import { TRPCError } from "@trpc/server";
import { storeFile } from "~/server/supabase";
import { env } from "~/env";
import { Membership } from "@prisma/client";
import { sendInvitationEmail } from "../../email/resend";
import { expiresIn } from "~/lib/utils";

const archiveTrack = protectedProcedure
  .input(ArchiveProjectInput)
  .mutation(async ({ input, ctx: { db, session } }) => {
    const { id } = input;
    const {
      user: { id: userId },
    } = session;

    try {
      const track = await db.track.findUnique({
        where: { id },
        include: { creator: true },
      });

      if (!track) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Track not found.",
        });
      }

      const {
        creator: { id: creatorId },
        fileId,
      } = track;

      if (creatorId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unallowed action.",
        });
      }

      await db.track.update({
        where: { id },
        data: { isArchived: true },
      });

      await db.file.update({
        where: { id: fileId },
        data: { isArchived: true },
      });
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

const updateTrack = protectedProcedure
  .input(UpdateTrackInput)
  .mutation(async ({ input, ctx: { db, session } }) => {
    const { id, ...updates } = input;
    const {
      user: { id: userId },
    } = session;

    try {
      const track = await db.track.findUnique({
        where: { id },
        include: { creator: true },
      });

      if (!track) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Track not found.",
        });
      }

      const {
        creator: { id: creatorId },
      } = track;

      if (creatorId !== userId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Unallowed action.",
        });
      }

      if (updates.password) {
        const salt = await bcrypt.genSalt(10);
        updates.password = await bcrypt.hash(updates.password, salt);

        await db.trustedSession.deleteMany({
          where: { trackId: id },
        });
      }

      await db.track.update({
        where: { id },
        data: updates,
      });

      return track;
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

const uploadTrack = protectedProcedure
  .input(UploadTrackInput)
  .mutation(async ({ input, ctx: { db, session } }) => {
    const { contentType, fileContent, title, emails, password } = input;
    const {
      user: { id: creatorId },
    } = session;

    let hashedPassword = null;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      hashedPassword = await bcrypt.hash(password, salt);
    }

    try {
      const base64Data = fileContent.split(",")[1];
      if (!base64Data)
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "File Content is not valid.",
        });

      const buffer = Buffer.from(base64Data, "base64");
      const arrayBuffer = new Uint8Array(buffer).buffer;

      const { fileUrl } = await storeFile({
        buffer: arrayBuffer,
        type: contentType,
      });

      const file = await db.file.create({
        data: {
          url: fileUrl,
          mime: contentType,
          byteSize: arrayBuffer.byteLength,
        },
      });

      const track = await db.track.create({
        data: {
          title,
          creatorId,
          password: hashedPassword,
          fileId: file.id,
        },
        include: { file: true },
      });

      if (emails.length > 0) {
        await sendInvitationEmail({ emails, trackId: track.id });
      }

      return track;
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

const isTrackLocked = anonPossibleProcedure
  .input(GetTrackByIdInput)
  .query(async ({ input, ctx: { db, session } }) => {
    const { id, sessionId, password: plainPassword } = input;

    try {
      const now = new Date();
      const track = await db.track.findUnique({
        where: { id, isArchived: false },
        include: {
          trustedSessions: {
            where: {
              sessionId,
              expiresAt: { gte: now },
            },
          },
        },
      });

      if (!track) {
        throw new TRPCError({
          message: "Track not found.",
          code: "NOT_FOUND",
        });
      }

      if (!track.password || track?.trustedSessions?.length > 0) return false;

      const { password, creatorId, id: trackId } = track;

      let unlocked = false;

      if (!unlocked) {
        unlocked = session?.user.id === creatorId;
      }

      if (!unlocked && plainPassword) {
        unlocked = await bcrypt.compare(plainPassword, password);
      }

      if (unlocked) {
        const now = new Date();
        const expiresAt = new Date(now.getTime() + 60 * 60 * 1000); // Add 60 minutes
        await db.trustedSession.create({
          data: {
            sessionId,
            trackId,
            expiresAt,
          },
        });
      }

      return !unlocked;
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw new TRPCError({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
          cause: error,
        });
      }
    }
  });

const updateTrackPassword = protectedProcedure
  .input(UpdateProjectPasswordInput)
  .mutation(async ({ input, ctx: { db, session } }) => {
    const { password, id } = input;
    const { user } = session;

    try {
      const track = await db.track.findUnique({
        where: { id, creatorId: user.id },
      });

      if (!track) {
        throw new TRPCError({ message: "Track not found", code: "NOT_FOUND" });
      }

      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      await db.track.update({
        where: { id },
        data: { password: hashedPassword },
      });

      return { success: true };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw new TRPCError({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
          cause: error,
        });
      }
    }
  });

const getTrackById = publicProcedure
  .input(GetTrackByIdInput)
  .query(async ({ input, ctx: { db } }) => {
    const { id, sessionId } = input;

    try {
      const track = await db.track.findUnique({
        where: { id, isArchived: false },
        include: {
          file: true,
          creator: true,
          trustedSessions: { where: { sessionId } },
        },
      });

      if (!track) {
        throw new TRPCError({
          message: "Track not found.",
          code: "NOT_FOUND",
        });
      }

      const { password, createdAt, creator } = track;
      if (password) {
        if (track.trustedSessions.length === 0) {
          throw new TRPCError({
            message: "Please try again.",
            code: "UNAUTHORIZED",
          });
        }
      }

      track.password = null;
      track.trustedSessions = [];

      let expiryLimit = 0;
      if (creator.membership === "FREE") {
        expiryLimit = env.FREE_EXPIRE_IN_DAYS;
      } else {
        expiryLimit = env.PREMIUM_V1_EXPIRE_IN_DAYS;
      }

      return {
        ...track,
        expiresIn: expiresIn({ daysLimit: expiryLimit, createdAt }),
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw new TRPCError({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
          cause: error,
        });
      }
    }
  });

const getAllTracksByUser = protectedProcedure
  .output(GetTracksByUserOutput)
  .query(async ({ ctx: { db, session } }) => {
    const {
      user: { id: userId },
    } = session;

    try {
      const tracks = await db.track.findMany({
        where: { creatorId: userId, isArchived: false },
        include: { comments: { where: { open: true } } },
      });

      const user = await db.user.findUnique({
        where: { id: userId },
      });

      if (!user) {
        throw new TRPCError({ message: "User not found.", code: "NOT_FOUND" });
      }

      let expiryLimit = 0;
      if (user.membership === "FREE") {
        expiryLimit = env.FREE_EXPIRE_IN_DAYS;
      } else {
        expiryLimit = env.PREMIUM_V1_EXPIRE_IN_DAYS;
      }

      const formatted = tracks.map(
        ({ id, title, createdAt, comments, password }) => {
          return {
            id,
            title,
            createdAt,
            locked: !!password,
            openComments:
              comments.filter(({ byAdmin, open }) => !byAdmin && open).length >
              0,
            expiresIn: expiresIn({ daysLimit: expiryLimit, createdAt }),
          };
        },
      );

      return formatted;
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw new TRPCError({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
          cause: error,
        });
      }
    }
  });

const checkTrackLimit = protectedProcedure.query(
  async ({ ctx: { db, session } }) => {
    const {
      user: { id },
    } = session;
    try {
      const [freeLimit, premiumLimit] = [
        env.FREE_TRACK_LIMIT,
        env.PREMIUM_V1_TRACK_LIMIT,
      ];

      const user = await db.user.findUnique({
        where: { id },
        include: { tracks: { where: { isArchived: false } } },
      });

      if (!user) {
        throw new TRPCError({
          message: "No user found.",
          code: "NOT_FOUND",
        });
      }

      const { membership, tracks } = user;

      /*
      / Maybe store the membership details in a seperate DB table
      */

      let limit = 0;
      if (membership === Membership.FREE) {
        limit = freeLimit;
      } else {
        limit = premiumLimit;
      }

      if (tracks.length >= limit) {
        return {
          allowed: false,
        };
      }

      return {
        allowed: true,
      };
    } catch (error) {
      console.error(error);
      if (error instanceof Error) {
        throw new TRPCError({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
          cause: error,
        });
      }
    }
  },
);

export const trackRouter = createTRPCRouter({
  upload: uploadTrack,
  update: updateTrack,
  archive: archiveTrack,
  isLocked: isTrackLocked,
  getAll: getAllTracksByUser,
  getById: getTrackById,
  checkLimit: checkTrackLimit,
  updatePassword: updateTrackPassword,
});
