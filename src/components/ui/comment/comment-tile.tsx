import { type Comment } from "@prisma/client";
import { useMemo, useState } from "react";
import { api } from "~/trpc/react";
import Dropdown, { type MenuOption } from "../dropdown-menu";
import Text from "~/components/typography/text";
import { motion } from "framer-motion";
import { cn, generateTimestamp, getDateDifference } from "~/lib/utils";
import { Checkbox } from "../checkbox";
import { MoreVerticalCircle01Icon } from "hugeicons-react";

interface CommenTileProps {
  live: boolean;
  markable: boolean;
  comment: Comment;
  onClick: () => void;
}

export function CommentTile({
  comment,
  live,
  markable,
  onClick,
}: CommenTileProps) {
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
      disabled: !markable,
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
        <Text.Subtitle className="mr-1">{"General"}</Text.Subtitle>
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
      onClick={onClick}
      initial="visible"
      animate={deleted ? "hidden" : "visible"}
      variants={{
        hidden: { height: 0 },
        visible: { height: "auto" },
      }}
      className={cn(
        "flex cursor-pointer items-center space-x-2 overflow-hidden px-[15px]",
        byAdmin && "bg-green-400/10",
        !deleted && "min-h-[45px]",
      )}
    >
      <motion.div
        variants={{
          visible: { width: "auto", opacity: 1 },
          hidden: { width: 0, opacity: 0 },
        }}
        transition={{ duration: 0.05 }}
        initial={"hidden"}
        animate={markable ? "visible" : "hidden"}
      >
        <Checkbox checked={checked} onCheckedChange={handleUpdateCheck} />
      </motion.div>

      <div className="min-w-[65px]">
        <div
          className={cn(
            "relative my-auto flex h-6 items-center justify-center space-x-1 overflow-hidden rounded-full",
            bg,
            live && "bg-blue-700",
          )}
        >
          <motion.div
            initial="normal"
            animate={live ? "live" : "normal"}
            variants={{ live: { translateY: 0 }, normal: { translateY: -100 } }}
            className="absolute left-auto right-auto"
          >
            <Text.Subtitle className="text-white">{"Live"}</Text.Subtitle>
          </motion.div>
          <motion.div
            initial="normal"
            animate={live ? "live" : "normal"}
            variants={{ live: { translateY: +100 }, normal: { translateY: 0 } }}
            className="absolute left-auto right-auto"
          >
            {label}
          </motion.div>
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
