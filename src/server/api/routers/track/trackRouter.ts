import * as bcrypt from "bcrypt";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import {
  ArchiveProjectInput,
  GetTrackByIdInput,
  GetTracksByUserOutput,
  UpdateTrackInput,
  UploadTrackInput,
} from "./trackTypes";
import { TRPCError } from "@trpc/server";
import { storeFile } from "~/server/supabase";
import { UpdateCommentInput } from "../comment/commentTypes";

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

      await db.track.update({
        where: { id },
        data: updates,
      });

      console.log("==== UPDATES: ", updates);
      return track;
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

const uploadTrack = protectedProcedure
  .input(UploadTrackInput)
  .mutation(async ({ input, ctx: { db, session } }) => {
    const { contentType, fileContent, title, locked, emails, password } = input;
    const {
      user: { id: creatorId },
    } = session;

    let hashedPassword = "";
    if (locked) {
      if (!password)
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Missing password.",
        });

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
          locked,
          creatorId,
          password: locked ? hashedPassword : null,
          fileId: file.id,
        },
        include: { file: true },
      });

      return track;
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

const getTrackById = publicProcedure
  .input(GetTrackByIdInput)
  .query(async ({ input, ctx: { db } }) => {
    const { id } = input;

    try {
      const track = await db.track.findUnique({
        where: { id, isArchived: false },
        include: { file: true, comments: true, creator: true },
      });

      if (!track) {
        throw new TRPCError({
          message: "Track not found.",
          code: "NOT_FOUND",
        });
      }
      return track;
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

      const formatted = tracks.map(
        ({ id, title, createdAt, comments, locked }) => ({
          id: id,
          title: title,
          createdAt: createdAt,
          locked,
          openComments: comments.length > 0,
        }),
      );

      return formatted;
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

export const trackRouter = createTRPCRouter({
  upload: uploadTrack,
  update: updateTrack,
  archive: archiveTrack,
  getAll: getAllTracksByUser,
  getById: getTrackById,
});
