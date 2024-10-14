"use client";

import { type Comment } from "@prisma/client";
import { PlusSignIcon } from "hugeicons-react";
import { useParams } from "next/navigation";
import { useMemo, useState } from "react";
import Text from "~/components/typography/text";
import { Button } from "~/components/ui/button";
import Card from "~/components/ui/card";
import { CommentsContainer } from "~/components/ui/comment/comments-container";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { REGEX } from "~/constants/regex";
import { cn, convertTimestamp } from "~/lib/utils";

import { api } from "~/trpc/react";

export default function ListenPage() {
  const [liveComments, setLiveComments] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>();

  const { data: track, isLoading } = api.track.getById.useQuery(
    { id },
    { enabled: !!id },
  );

  console.log(track);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-accent">
      <Card
        isLoading={isLoading}
        title={track?.title}
        subtitle={"Shared by Fabian Simon"}
        className="relative w-full max-w-screen-lg"
      >
        <div className="absolute right-4 top-14 flex space-x-2">
          <Text.Body className="text-xs">Live Comments</Text.Body>
          <Switch
            className="opacity-100"
            checked={liveComments}
            onCheckedChange={setLiveComments}
          />
        </div>
        <CommentsContainer comments={track?.comments ?? []} className="mt-2" />
      </Card>
    </div>
  );
}
