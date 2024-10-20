import Text from "~/components/typography/text";
import { cn } from "~/lib/utils";
import CommentInput, { type CommentContent } from "./comment-input";
import { type Comment } from "@prisma/client";
import { api } from "~/trpc/react";
import { useMemo, useState } from "react";
import { ArrowDown01Icon } from "hugeicons-react";
import { CommentTile } from "./comment-tile";
import { LocalStorage } from "~/lib/localStorage";
import useBreakpoint, { BREAKPOINTS } from "~/hooks/use-breakpoint";

interface CommentsContainerProps {
  time: number;
  trackId: string;
  comments: Comment[];
  markComments: boolean;
  maxTime: number;
  isAdmin: boolean;
  onTimestamp: (timestamp: number) => void;
  className?: string;
}

type SortFilter = "timestamp" | "posted";

export function CommentsContainer({
  time,
  maxTime,
  trackId,
  className,
  markComments,
  isAdmin,
  comments,
  onTimestamp,
}: CommentsContainerProps) {
  const [sortBy, setSortBy] = useState<SortFilter>("timestamp");
  const [ascending, setAscending] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const utils = api.useUtils();
  const isSmall = useBreakpoint(BREAKPOINTS.sm);

  const { mutateAsync: createComment } = api.comment.create.useMutation();

  const empty = comments.length === 0;

  const sortedComments = useMemo(() => {
    const sorted = comments.sort((a, b) => {
      if (sortBy === "timestamp")
        return (b.timestamp ?? 0) - (a.timestamp ?? 0);
      return b.createdAt.getTime() - a.createdAt.getTime();
    });

    return ascending ? sorted : sorted.reverse();
  }, [comments, ascending, sortBy]);

  const liveCommentId = useMemo(() => {
    if (empty) return;

    let closest: { id: string; delta: number } | undefined = undefined;

    for (const { id, timestamp } of sortedComments) {
      if (!timestamp) continue;

      const diff = Math.abs(timestamp - time);
      if (diff > 4) continue;

      if (!closest || diff < closest.delta) {
        closest = {
          id,
          delta: diff,
        };
      }
    }

    return closest?.id ?? undefined;
  }, [time, empty, sortedComments]);

  const triggerSort = (filter: SortFilter) => {
    setSortBy(filter);
    setAscending((prev) => !prev);
  };

  const handleAddComment = async ({ content, timestamp }: CommentContent) => {
    let sessionId: string | undefined;
    if (!isAdmin) {
      sessionId = LocalStorage.fetchSessionId();
    }
    setIsLoading(true);
    await createComment({ content, timestamp, trackId, sessionId });
    await utils.track.invalidate();
    setIsLoading(false);
  };

  return (
    <div className={cn("relative", isSmall && "-mx-[20px]")}>
      <div
        className={cn(
          "relative max-h-[400px] min-h-[400px] grow overflow-y-auto rounded-md border-[.5px] border-neutral-200 bg-white pb-20 shadow-md shadow-neutral-100 no-scrollbar",
          className,
          isSmall && "max-h-none border-none pb-[180px] shadow-none",
        )}
      >
        {empty && (
          <div className="mt-10 text-center">
            <Text.Body subtle>No comments</Text.Body>
            <Text.Subtitle subtle>Be the first one to critique.</Text.Subtitle>
          </div>
        )}

        {/* Sorting Container */}
        {!empty && (
          <div
            className={
              "sticky left-0 right-0 top-0 z-10 flex h-[40px] items-center justify-between border-b border-b-neutral-100 bg-white px-[10px]"
            }
          >
            <div
              onClick={() => triggerSort("timestamp")}
              className="flex cursor-pointer items-center space-x-1 rounded-md px-2 py-1 hover:bg-neutral-100"
            >
              <Text.Subtitle subtle>{"Timestamp"}</Text.Subtitle>
              <ArrowDown01Icon
                size={18}
                className={cn(
                  "text-black/50",
                  !ascending && sortBy === "timestamp" && "rotate-180",
                )}
              />
            </div>
            {!isSmall && (
              <div
                onClick={() => triggerSort("posted")}
                className="flex cursor-pointer items-center space-x-1 rounded-md px-2 py-1 hover:bg-neutral-100"
              >
                <Text.Subtitle subtle>{"Posted"}</Text.Subtitle>
                <ArrowDown01Icon
                  size={18}
                  className={cn(
                    "text-black/50",
                    !ascending && sortBy === "posted" && "rotate-180",
                  )}
                />
              </div>
            )}
          </div>
        )}

        {!empty && (
          <div>
            {sortedComments.map((comment, index) => {
              const last = index === sortedComments.length - 1;
              return (
                <CommentTile
                  isAdmin={isAdmin}
                  markable={markComments}
                  onClick={() =>
                    comment.timestamp && onTimestamp(comment.timestamp)
                  }
                  className={!last ? "border-b border-b-neutral-100" : ""}
                  key={comment.id}
                  comment={comment}
                  live={comment.id === liveCommentId}
                />
              );
            })}
          </div>
        )}
      </div>

      <CommentInput
        maxTime={maxTime}
        time={time}
        className={cn(
          "absolute bottom-3 left-3 right-3",
          isSmall && "fixed bottom-[135px]",
        )}
        onCreate={handleAddComment}
        isLoading={isLoading}
      />
    </div>
  );
}
