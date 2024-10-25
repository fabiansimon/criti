import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { env } from "~/env";
import { sendExpirationNotificationEmail } from "~/server/api/email/resend";
import { db } from "~/server/db";
import { deleteFiles } from "~/server/supabase";

export async function GET() {
  const cronKey = headers().get("cron-secret-key");
  if (cronKey !== env.CRON_SECRET_KEY) {
    return new NextResponse("Unauthorized", { status: 403 });
  }

  try {
    const now = new Date();
    // Remove all expired sessions
    await db.trustedSession.deleteMany({
      where: { expiresAt: { lte: now } },
    });

    // Remove all expired sessions
    const [freeDays, premiumDays] = [
      env.FREE_EXPIRE_IN_DAYS,
      env.PREMIUM_V1_EXPIRE_IN_DAYS,
    ];

    const freeExpireBy = new Date();
    freeExpireBy.setDate(freeExpireBy.getDate() - freeDays);

    const premiumExpireBy = new Date();
    premiumExpireBy.setDate(premiumExpireBy.getDate() - premiumDays);

    const expiredTracks = await db.track.findMany({
      where: {
        OR: [
          {
            createdAt: { lte: freeExpireBy },
            creator: { membership: "FREE" },
          },
          {
            createdAt: { lte: premiumExpireBy },
            creator: { membership: "PREMIUM_V1" },
          },
        ],
      },
      include: { file: true, creator: true },
    });

    const expiredIds: string[] = [];
    const expiredPaths: string[] = [];
    // Sending out emails + collection ids to delete
    expiredTracks.forEach(
      ({ id, file: { url }, creator: { name, email }, title }) => {
        expiredIds.push(id);
        expiredPaths.push(url);
        if (email) {
          console.log("=== SENDING EMAIL TO:", title, name, email);
          void sendExpirationNotificationEmail({
            title,
            name: name ?? "",
            email,
          });
        }
      },
    );

    // Archive tracks for now
    await db.track.updateMany({
      where: { id: { in: expiredIds } },
      data: { isArchived: true },
    });

    const relativePaths = expiredPaths
      .map((fullPath) => {
        const regex = new RegExp(`/${env.SUPABASE_BUCKET}/(.+)`);
        const match = fullPath.match(regex);
        return match ? match[1] : null;
      })
      .filter((path): path is string => Boolean(path));

    if (relativePaths.length > 0) {
      await deleteFiles(relativePaths);
    }

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: `"Internal Server Error": $${error as string}` },
      { status: 500 },
    );
  }
}
