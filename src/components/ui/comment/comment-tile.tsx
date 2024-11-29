import { type Comment } from "@prisma/client";
import { useEffect, useMemo, useState } from "react";
import { api } from "~/trpc/react";
import Dropdown, { type MenuOption } from "../dropdown-menu";
import Text from "~/components/typography/text";
import { motion } from "framer-motion";
import { cn, generateTimestamp, getDateDifference } from "~/lib/utils";
import { Checkbox } from "../checkbox";
import { Comment01Icon, MoreVerticalCircle01Icon } from "hugeicons-react";
import { LocalStorage } from "~/lib/localStorage";
import useBreakpoint, { BREAKPOINTS } from "~/hooks/use-breakpoint";
import { useModal } from "~/providers/modal-provider";
import ThreadModal from "../modals/thread-modal";

interface CommenTileProps {
  live: boolean;
  markable: boolean;
  isAdmin: boolean;
  comment: Comment;
  onClick: () => void;
  className?: string;
}

export function CommentTile({
  isAdmin,
  comment,
  live,
  markable,
  onClick,
  className,
}: CommenTileProps) {
  const [deleted, setDeleted] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(comment.status !== "OPEN");
  const [hovered, setHovered] = useState<boolean>(false);

  const { content, timestamp, createdAt, id } = comment;

  const isSmall = useBreakpoint(BREAKPOINTS.sm);
  const { show } = useModal();

  const { mutate: updateComment } = api.comment.update.useMutation({
    onError: () => setChecked((prev) => !prev),
  });
  const { mutate: removeComment } = api.comment.delete.useMutation({
    onError: () => setDeleted(false),
  });

  const sessionId = LocalStorage.fetchSessionId();
  const isCreator = comment.sessionId === sessionId;
  const editable = isAdmin || isCreator;

  const menuOptions: MenuOption[] = [
    {
      title: `Mark as ${checked ? "un" : ""}done`,
      onClick: () => handleUpdateCheck(!checked),
      disabled: !markable,
    },
    {
      title: "Delete",
      onClick: () => handleDeleteComment(),
      disabled: !isAdmin && !isCreator,
    },
    {
      title: "Reply",
      onClick: () => handleDeleteComment(),
      disabled: !isAdmin && !isCreator,
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

  const handleReply = () => {
    show(<ThreadModal isAdmin={isAdmin} comment={comment} />);
  };

  const handleDeleteComment = () => {
    removeComment({ id, sessionId: !isAdmin ? sessionId : undefined });
    setDeleted(true);
  };

  const handleUpdateCheck = (status: boolean) => {
    updateComment({ done: status, id: id });
    setChecked(status);
  };

  return (
    <motion.div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      initial="visible"
      animate={deleted ? "hidden" : "visible"}
      variants={{
        hidden: { height: 0, opacity: 0 },
        visible: { height: "auto", opacity: 1 },
      }}
      className={cn(
        "relative flex cursor-pointer items-center space-x-2 overflow-hidden px-[15px]",
        comment.byAdmin && "bg-green-400/10",
        className,
        !deleted && "min-h-[60px] py-4",
      )}
    >
      {/* Checkbox */}
      <motion.div
        variants={{
          visible: { width: 30, opacity: 1 },
          hidden: { width: 0, opacity: 0 },
        }}
        transition={{ duration: 0.05 }}
        initial={"hidden"}
        animate={markable ? "visible" : "hidden"}
      >
        <Checkbox
          className="mb-2 ml-2"
          checked={checked}
          onCheckedChange={handleUpdateCheck}
        />
      </motion.div>

      <div
        className={cn(
          "flex w-full grow items-center gap-2",
          isSmall && "flex-col items-start",
        )}
      >
        {/* Timestamp Container */}
        <div className="w-full max-w-[70px]">
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
              variants={{
                live: { translateY: 0 },
                normal: { translateY: -100 },
              }}
              className="absolute left-auto right-auto"
            >
              <Text.Subtitle className="text-white">{"Live"}</Text.Subtitle>
            </motion.div>
            <motion.div
              initial="normal"
              animate={live ? "live" : "normal"}
              variants={{
                live: { translateY: +100 },
                normal: { translateY: 0 },
              }}
              className="absolute left-auto right-auto"
            >
              {label}
            </motion.div>
          </div>
        </div>

        {/* Content */}
        <div className="flex w-full grow flex-col">
          {comment.byAdmin && (
            <Text.Subtitle className="text-[11px] text-green-900">
              {"Admin:"}
            </Text.Subtitle>
          )}
          <Text.Body className="font-light">{content}</Text.Body>
        </div>
      </div>

      {!isSmall && (
        <Text.Subtitle className="text-right" subtle>
          {getDateDifference({ date: createdAt }).text}
        </Text.Subtitle>
      )}

      {editable && (
        <Dropdown
          className={cn("", isSmall ? "absolute right-3 top-3" : "mr-4")}
          options={menuOptions}
        >
          <MoreVerticalCircle01Icon fill="black" size={20} />
        </Dropdown>
      )}
      <motion.div
        initial="hidden"
        animate={hovered ? "expanded" : "hidden"}
        variants={{ expanded: { width: 100 }, hidden: { width: 0, border: 0 } }}
        className="flex items-center justify-center overflow-hidden border-l border-l-neutral-50"
      >
        <div
          onClick={handleReply}
          className="flex h-full w-full items-center justify-center space-x-2 rounded-md py-2 hover:bg-neutral-100"
        >
          <Comment01Icon className="text-neutral-700" size={12} />
          <Text.Subtitle className="text-xs" subtle>
            Reply
          </Text.Subtitle>
        </div>
      </motion.div>
    </motion.div>
  );
}
