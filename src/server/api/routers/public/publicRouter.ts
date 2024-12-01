import { TRPCError } from "@trpc/server";
import { createTRPCRouter, publicProcedure } from "../../trpc";
import { FetchTracksInput } from "./publicTypes";

const fetchTracks = publicProcedure
  .input(FetchTracksInput)
  .query(async ({ ctx, input }) => {
    const { page, size } = input;

    const offset = (page - 1) * size;

    try {
      const [tracks, count] = await Promise.all([
        ctx.db.track.findMany({
          where: { isPublic: true, isArchived: false },
          skip: offset,
          take: size,
        }),
        ctx.db.track.count({
          where: { isPublic: true, isArchived: false },
        }),
      ]);

      return {
        tracks,
        meta: {
          count,
          pages: Math.ceil(count / size),
          page,
          size,
        },
      };
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

export const publicRouter = createTRPCRouter({
  fetch: fetchTracks,
});
