import * as bcrypt from "bcrypt";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { UploadTrackInput } from "./trackTypes";
import { TRPCError } from "@trpc/server";
import { storeFile } from "~/server/supabase";

const uploadTrack = protectedProcedure
  .input(UploadTrackInput)
  .mutation(async ({ input }) => {
    const { contentType, fileContent, title, locked } = input;

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
      const { fileUrl } = await storeFile({
        buffer: arrayBuffer,
        type: contentType,
      });

    }


  });

export const trackRouter = createTRPCRouter({
  uploadTrack,
});
