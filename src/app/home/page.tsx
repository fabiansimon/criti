"use client";

import Card from "~/components/ui/card";
import IconContainer from "~/components/ui/icon-container";

import { PlusSignIcon } from "hugeicons-react";
import Text from "~/components/typography/text";
import { useRouter } from "next/navigation";
import { route, ROUTES } from "~/constants/routes";
import { api } from "~/trpc/react";
import ProjectListItem from "~/components/ui/project-list-item";
import { pluralize } from "~/lib/utils";

export default function HomePage() {
  const router = useRouter();

  const { data: tracks, isLoading } = api.track.getAll.useQuery();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-accent">
      <Card
        isLoading={isLoading}
        title="Your shared projects"
        subtitle={`${pluralize(tracks?.length ?? 0, "track")} shared`}
        className="md:min-w-[60%] md:max-w-[400px]"
      >
        <div className="-mx-3 my-7">
          {/* Track List */}
          <div className="max-h-[400px] space-y-2 overflow-y-auto pb-2 no-scrollbar">
            {(tracks ?? []).map((track) => (
              <ProjectListItem
                key={track.id}
                track={track}
                onClick={() => router.push(route(ROUTES.listen, track.id))}
              />
            ))}
          </div>

          {/* Add new Button */}
          <div className="border-t border-neutral-100" />
          <div
            onClick={() => router.push(route(ROUTES.upload))}
            className="flex w-full cursor-pointer items-center space-x-3 rounded-md p-2 hover:bg-neutral-50"
          >
            <IconContainer icon={<PlusSignIcon size={20} />} />
            <Text.Body>Add new track</Text.Body>
          </div>
        </div>
      </Card>
    </div>
  );
}
