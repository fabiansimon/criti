import Link from "next/link";

import { LatestPost } from "~/components/ui/post";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default function Home() {
  // const session = await getServerAuthSession();

  return <div></div>;
}
