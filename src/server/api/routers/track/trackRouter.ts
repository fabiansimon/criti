import * as bcrypt from "bcrypt";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { GetTrackByIdInput, UploadTrackInput } from "./trackTypes";
import { TRPCError } from "@trpc/server";
import { storeFile } from "~/server/supabase";

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

      console.log("==== creatorId", creatorId);
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

const getTrackById = protectedProcedure
  .input(GetTrackByIdInput)
  .query(async ({ input, ctx: { db } }) => {
    const { id } = input;

    try {
      const track = await db.track.findUnique({
        where: { id },
        include: { file: true, comments: true },
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

export const trackRouter = createTRPCRouter({
  upload: uploadTrack,
  getById: getTrackById,
});
