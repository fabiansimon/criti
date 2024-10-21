import cron from "node-cron";
import { PrismaClient } from "@prisma/client";
import { env } from "~/env";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") globalForPrisma.prisma = db;

// eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access
cron.schedule("0 * * * *", async () => {
  console.log("==== Cleaning up expired Trusted Sessions");

  try {
    const now = new Date();
    await db.trustedSession.deleteMany({
      where: {
        expiresAt: { lte: now },
      },
    });
  } catch (error) {
    console.error("Error cleaning up expired Trusted Sessions", error);
  }
});
