import { useMemo, useState } from "react";
import { api } from "~/trpc/react";
import Dropdown, { type MenuOption } from "../dropdown-menu";
import Text from "~/components/typography/text";
import { motion } from "framer-motion";
import { cn, generateTimestamp, getDateDifference } from "~/lib/utils";
import { Comment01Icon, MoreVerticalCircle01Icon } from "hugeicons-react";
import { LocalStorage } from "~/lib/localStorage";
import useBreakpoint, { BREAKPOINTS } from "~/hooks/use-breakpoint";
import { useModal } from "~/providers/modal-provider";
import ThreadModal from "../modals/thread-modal";
import {
  type CommentStatus,
  type CommentType,
} from "~/server/api/routers/comment/commentTypes";
import CommentStatusSelector from "../comment-status-selector";
import { toast } from "~/hooks/use-toast";
import { type SummarizedComment } from "./comments-container";

interface CommenTileProps {
  live: boolean;
  isAdmin: boolean;
  comment: SummarizedComment;
  onClick: () => void;
  className?: string;
}

export function CommentTile({
  isAdmin,
  comment,
  live,
  onClick,
  className,
}: CommenTileProps) {
  const [deleted, setDeleted] = useState<boolean>(false);
  const [hovered, setHovered] = useState<boolean>(false);

  const { content, timestamp, createdAt, id, status, type, byAdmin, replies } =
    comment;

  const isSmall = useBreakpoint(BREAKPOINTS.sm);
  const { show } = useModal();

  const { mutateAsync: updateComment } = api.comment.update.useMutation();
  const { mutate: removeComment } = api.comment.delete.useMutation({
    onError: () => setDeleted(false),
  });
  const utils = api.useUtils();

  const sessionId = LocalStorage.fetchSessionId();
  const isCreator = comment.sessionId === sessionId;
  const editable = isAdmin || isCreator;

  const menuOptions: MenuOption[] = [
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

  const handleUpdateCheck = async (status: CommentStatus) => {
    try {
      await updateComment({ status, id: id });
    } catch (_) {
      toast({
        title: "Something went wrong.",
        description:
          "Sorry we can't update the comment at the moment. Try again later",
        variant: "destructive",
      });
    } finally {
      // void utils.comment.invalidate();
    }
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
      className={cn(
        "relative flex w-full cursor-pointer items-center transition-all duration-75 hover:bg-neutral-50",
        className,
      )}
    >
      <div className="flex w-full flex-col space-y-3">
        {/* <LiveOverlay isLive={live} /> */}
        <div className="relative flex items-center justify-between">
          <div className="px-auto absolute left-0 right-0 flex w-full justify-center">
            <CommentInfoContainer
              isLive={live}
              onClick={handleReply}
              replies={replies}
              type={type}
              timestamp={timestamp}
            />
          </div>
          <div className="flex h-7 w-full items-center justify-between">
            {isAdmin ? (
              <CommentStatusSelector
                status={status}
                onChange={handleUpdateCheck}
              />
            ) : (
              <div />
            )}

            {!isSmall && (
              <Text.Subtitle className="mr-2" subtle>
                {getDateDifference({ date: createdAt }).text}
              </Text.Subtitle>
            )}
          </div>
          {/* {!live && byAdmin && (
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center">
            <div className="mx-auto -mt-3 flex items-center space-x-1">
              <PinLocation02Icon size={14} className="text-black/70" />
              <Text.Body subtle className="text-xs">
                {"by Admin"}
              </Text.Body>
            </div>
          </div> */}
          {/* )} */}
        </div>
        <Text.Body className="flex w-full">{content}</Text.Body>
      </div>
      {/* {editable && (
        <Dropdown
          className={cn("", isSmall ? "absolute right-4 top-3" : "mr-2")}
          options={menuOptions}
        >
          <MoreVerticalCircle01Icon fill="black" size={18} />
        </Dropdown>
      )} */}
    </div>
  );

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
        <Text.Subtitle className="min-w-24 text-right" subtle>
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

interface CommentInfoContainerProps {
  onClick: () => void;
  type: CommentType;
  isLive: boolean;
  replies: number;
  timestamp: number | null;
}
function CommentInfoContainer({
  onClick,
  type,
  timestamp,
  isLive,
  replies,
}: CommentInfoContainerProps) {
  return (
    <motion.div
      initial="hidden"
      animate={isLive ? "live" : "normal"}
      variants={{ live: { width: 70 }, normal: { width: "auto" } }}
      onClick={onClick}
      className="relative flex h-7 items-center space-x-2 overflow-hidden rounded-full bg-neutral-100 px-2 transition-all duration-75 hover:bg-neutral-200"
    >
      <motion.div
        initial="hidden"
        animate={isLive ? "visible" : "hidden"}
        variants={{ visible: { translateY: 0 }, hidden: { translateY: -50 } }}
        className="absolute bottom-0 left-0 right-0 top-0 -my-4 flex items-center justify-center space-x-[5px] bg-red-500 py-4"
      >
        <div
          className={cn(
            "size-[5px] rounded-full bg-white",
            isLive && "animate-pulse",
          )}
        />
        <Text.Body className={cn("text-white", isLive && "animate-pulse")}>
          Live
        </Text.Body>
      </motion.div>
      <div className="ml-2 min-w-10">
        <Text.Body subtle className="px-1 text-xs">
          #{`${type.slice(0, 1)}${type.slice(1).toLowerCase()}`}
        </Text.Body>
      </div>
      {timestamp && <div className="h-full w-[1px] bg-neutral-200" />}
      {timestamp && (
        <div className="min-w-10">
          <Text.Body subtle className="px-1 text-center text-xs">
            {generateTimestamp(timestamp)}
          </Text.Body>
        </div>
      )}
      <div className="h-full w-[1px] bg-neutral-200" />
      <div className="mr-2 flex min-w-10 items-center justify-center space-x-[1px]">
        <Comment01Icon className="text-black/50" size={13} />
        <Text.Body subtle className="px-1 text-xs">
          {replies}
        </Text.Body>
      </div>
    </motion.div>
  );
}
