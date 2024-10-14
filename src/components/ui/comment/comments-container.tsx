import Text from "~/components/typography/text";
import { cn, generateTimestamp, getDateDifference } from "~/lib/utils";
import { type CommentContent, CommentInput } from "./comment-input";
import { type Comment } from "@prisma/client";
import { api } from "~/trpc/react";
import { useMemo, useState } from "react";
import Dropdown, { type MenuOption } from "../dropdown-menu";
import { MoreVerticalCircle01Icon } from "hugeicons-react";
import { Checkbox } from "../checkbox";
import { motion } from "framer-motion";

interface CommentsContainerProps {
  trackId: string;
  comments: Comment[];
  className?: string;
}

interface CommenTileProps {
  comment: Comment;
}

export function CommentsContainer({
  trackId,
  className,
  comments,
}: CommentsContainerProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const utils = api.useUtils();

  const { mutateAsync: createComment } = api.comment.create.useMutation();

  const empty = comments.length === 0;

  const handleAddComment = async ({ content, timestamp }: CommentContent) => {
    setIsLoading(true);
    await createComment({ content, timestamp, trackId });
    await utils.track.invalidate();
    setIsLoading(false);
  };

  return (
    <div className="relative">
      <div
        className={cn(
          "relative max-h-[400px] min-h-[400px] grow overflow-y-auto rounded-md border-[.5px] border-neutral-200 bg-white pb-20 shadow-md shadow-neutral-100 no-scrollbar",
          className,
        )}
      >
        {empty && (
          <div className="mt-10 text-center">
            <Text.Body subtle>No comments</Text.Body>
            <Text.Subtitle subtle>Be the first one to critique.</Text.Subtitle>
          </div>
        )}
        {!empty && (
          <div>
            {comments.map((comment) => (
              <CommentTile key={comment.id} comment={comment} />
            ))}
          </div>
        )}
      </div>
      <CommentInput
        className="absolute bottom-3 left-3 right-3"
        onCreate={handleAddComment}
        isLoading={isLoading}
      />
    </div>
  );
}

function CommentTile({ comment }: CommenTileProps) {
  const [deleted, setDeleted] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(!comment.open);
  const { byAdmin, content, timestamp, createdAt, id } = comment;

  const { mutate: updateComment } = api.comment.update.useMutation({
    onError: () => setChecked((prev) => !prev),
  });
  const { mutate: removeComment } = api.comment.delete.useMutation({
    onError: () => setDeleted(false),
  });

  const menuOptions: MenuOption[] = [
    {
      title: `Mark as ${checked ? "un" : ""}done`,
      onClick: () => handleUpdateCheck(!checked),
    },
    {
      title: "Delete",
      onClick: () => handleDeleteComment(),
    },
  ];

  const { bg, label } = useMemo(
    () => ({
      bg: timestamp ? "bg-neutral-950" : "bg-neutral-200",
      label: timestamp ? (
        <Text.Subtitle className="text-white">
          {generateTimestamp(timestamp)}
        </Text.Subtitle>
      ) : (
        <Text.Subtitle>{"General"}</Text.Subtitle>
      ),
    }),
    [timestamp],
  );

  const handleDeleteComment = () => {
    removeComment({ id });
    setDeleted(true);
  };

  const handleUpdateCheck = (status: boolean) => {
    updateComment({ done: status, id: id });
    setChecked(status);
  };

  return (
    <motion.div
      initial="visible"
      animate={deleted ? "hidden" : "visible"}
      variants={{
        hidden: { height: 0 },
        visible: { height: "auto" },
      }}
      className={cn(
        "flex items-center space-x-2 overflow-hidden px-[15px]",
        byAdmin && "bg-green-400/10",
        !deleted && "min-h-[45px]",
      )}
    >
      <Checkbox checked={checked} onCheckedChange={handleUpdateCheck} />
      <div className="min-w-[60px]">
        <div
          className={cn(
            "my-auto flex h-6 items-center justify-center space-x-1 rounded-full",
            bg,
          )}
        >
          {label}
        </div>
      </div>

      <div className="my-3 flex w-full grow flex-col -space-y-1">
        {byAdmin && (
          <Text.Subtitle className="text-[11px] text-green-900">
            {"Admin:"}
          </Text.Subtitle>
        )}
        <Text.Body className="font-light">{content}</Text.Body>
      </div>
      <Text.Subtitle className="min-w-24 text-right" subtle>
        {getDateDifference(createdAt.toString()).text}
      </Text.Subtitle>

      <Dropdown className="mr-4" options={menuOptions}>
        <MoreVerticalCircle01Icon fill="black" size={18} />
      </Dropdown>
    </motion.div>
  );
}
