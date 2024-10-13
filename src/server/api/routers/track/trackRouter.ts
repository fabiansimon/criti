import * as bcrypt from "bcrypt";
import { createTRPCRouter, protectedProcedure } from "~/server/api/trpc";
import { UploadTrackInput } from "./trackTypes";
import { TRPCError } from "@trpc/server";
import { storeFile } from "~/server/supabase";

const uploadTrack = protectedProcedure
  .input(UploadTrackInput)
  .mutation(async ({ input, ctx: { db } }) => {
    console.log("CALLED");
    const { contentType, fileContent, title, locked, emails } = input;

    console.log("=== Sending out emails to:", emails);

    let hashedPassword = "";
    if (locked) {
      const { password } = input;
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
          password: locked ? hashedPassword : null,
          fileId: file.id,
        },
        include: { file: true },
      });

      return track;
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        throw new TRPCError({
          message: error.message,
          code: "INTERNAL_SERVER_ERROR",
        });
      }
    }
  });

export const trackRouter = createTRPCRouter({
  uploadTrack,
});
