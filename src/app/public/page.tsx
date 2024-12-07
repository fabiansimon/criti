"use client";

import { useRouter } from "next/navigation";
import { route, ROUTES } from "~/constants/routes";
import { api } from "~/trpc/react";
import Pagination, { type PaginationInfo } from "~/components/ui/pagination";
import PublicProjectListItem from "~/components/ui/public-track-list-item";
import Text from "~/components/typography/text";
import { useEffect, useState } from "react";
import LoadingSpinner from "~/components/ui/loading-spinner";
import EmptyInfo from "~/components/ui/empty-info";
import { Switch } from "~/components/ui/switch";

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
  const { data: userTracks } = api.track.getFiltered.useQuery(
    {
      amount: 3,
      isPublic: false,
    },
    { enabled: !isLoading && data?.tracks.length === 0 },
  );

  const tracks = data?.tracks ?? [];

  return (
    <div className="flex min-h-screen flex-col bg-white pb-10 pt-20">
      <div className="mx-auto w-full px-4 md:max-w-screen-lg md:px-10">
        <Text.Headline type="h2">{"Public songs"}</Text.Headline>
        <Text.Body subtle>{"Explore the publicly shared tracks"}</Text.Body>

        {isLoading && <LoadingSpinner className="mx-auto mt-[40%]" />}
        {!isLoading && tracks.length === 0 && (
          <div>
            <EmptyInfo
              className="mt-[35%]"
              title="No public tracks yet."
              subtitle="Be the first one to share one."
            />
            {(userTracks ?? []).length > 0 && (
              <div className="mx-auto mt-4 w-[30%] space-y-2 rounded-md border border-neutral-100 p-2">
                <Text.Body className="text-center font-medium" subtle>
                  Make public
                </Text.Body>
                {userTracks?.map(({ id, title }) => (
                  <TrackTile key={id} title={title} id={id} />
                ))}
              </div>
            )}
          </div>
        )}
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

interface TrackTitleProps {
  title: string;
  id: string;
}
function TrackTile({ title, id }: TrackTitleProps) {
  const [isPublic, setIsPublic] = useState<boolean>(false);

  const { mutateAsync: updateTrack } = api.track.update.useMutation();
  const utils = api.useUtils();

  const update = async () => {
    setIsPublic(true);
    await updateTrack({ isPublic: true, id });
    setTimeout(() => void utils.public.invalidate(), 1_000);
  };

  return (
    <div className="flex justify-between space-x-1">
      <Text.Body>{title}</Text.Body>
      <Switch checked={isPublic} disabled={isPublic} onCheckedChange={update} />
    </div>
  );
}
