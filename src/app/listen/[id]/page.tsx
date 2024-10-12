import Link from "next/link";
import Text from "~/components/typography/Text";

import { LatestPost } from "~/components/ui/post";
import { getServerAuthSession } from "~/server/auth";
import { api, HydrateClient } from "~/trpc/server";

export default async function ListenPage() {
  const hello = await api.post.hello({ text: "from tRPC" });
  const session = await getServerAuthSession();

  void api.post.getLatest.prefetch();

  return (
    <HydrateClient>
      <Text.Body>Hello World</Text.Body>
    </HydrateClient>
  );
}
