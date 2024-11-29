"use client";

import Card from "~/components/ui/card";
import { useRouter } from "next/navigation";
import { route, ROUTES } from "~/constants/routes";
import { api } from "~/trpc/react";
import ProjectListItem from "~/components/ui/project-list-item";
import Pagination, { PaginationInfo } from "~/components/ui/pagination";
import PublicProjectListItem from "~/components/ui/public-track-list-item";
import Text from "~/components/typography/text";
import { useState } from "react";
import LoadingSpinner from "~/components/ui/loading-spinner";

export default function PublicPage() {
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    size: 10,
  });

  const router = useRouter();

  const { data, isLoading } = api.public.fetch.useQuery({
    page: pagination.page,
    size: pagination.size,
  });

  const tracks = data?.tracks ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-white pb-10 pt-20">
      <div className="mx-auto w-full px-4 md:max-w-screen-lg md:px-10">
        <Text.Headline type="h2">{"Public songs"}</Text.Headline>
        <Text.Body subtle>{"Explore the publicly shared tracks"}</Text.Body>

        {isLoading && <LoadingSpinner className="mx-auto mt-[40%]" />}
        {!isLoading && (
          <div className="-mx-2 mt-4 flex min-h-full grow flex-col space-y-2">
            {tracks.map((track) => (
              <PublicProjectListItem
                key={track.id}
                onClick={() => router.push(route(ROUTES.listen, track.id))}
                track={track}
              />
            ))}
          </div>
        )}
      </div>
      <Pagination
        disabled={isLoading}
        pagination={pagination}
        onChange={setPagination}
        className="mt-auto"
        totalPages={data?.meta.pages ?? 0}
      />
    </div>
  );
}
