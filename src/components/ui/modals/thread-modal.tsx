import { type Comment } from "@prisma/client";
import Card from "../card";
import { api } from "~/trpc/react";
import Text from "~/components/typography/text";
import { generateTimestamp, getDateDifference } from "~/lib/utils";
import { SelectorContainer } from "../comment-type-selector";
import { Input } from "../input";
import { Button } from "../button";
import { useState } from "react";
import { LocalStorage } from "~/lib/localStorage";
import { toast } from "~/hooks/use-toast";
import Dropdown from "../dropdown-menu";
import { Skeleton } from "../skeleton";

interface ThreadModalProps {
  isAdmin: boolean;
  comment: Comment;
}
export default function ThreadModal({ isAdmin, comment }: ThreadModalProps) {
  const {
    byAdmin,
    content,
    createdAt,
    status,
    type,
    timestamp,
    id: commentId,
  } = comment;

  const [input, setInput] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const utils = api.useUtils();

  const { data: thread, isLoading: initLoading } =
    api.reply.fetchReplies.useQuery({
      commentId: comment.id,
    });

  const { mutateAsync: sendReply } = api.reply.create.useMutation();
  const { mutateAsync: removeReply, isPending: removePending } =
    api.reply.remove.useMutation();

  const sessionId = LocalStorage.fetchSessionId();

  const handleReply = async () => {
    setIsLoading(true);
    try {
      let sessionId: string | undefined;
      if (!isAdmin) {
        sessionId = LocalStorage.fetchSessionId();
      }
      await sendReply({ commentId, content: input, sessionId });
      await utils.reply.invalidate();
    } catch (error) {
      toast({
        title: "Something went wrong.",
        description:
          "Sorry we couldn't create your reply. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setInput("");
      setIsLoading(false);
    }
  };

  const handleDeletion = async (id: string) => {
    await removeReply({ id, sessionId });
    await utils.reply.invalidate();
  };

  return (
    <Card className="flex w-full">
      <div className="mb-1 mr-auto flex">
        <SelectorContainer type={type} />
      </div>
      <div className="mb-2 w-[80%] rounded-md border border-neutral-100 bg-neutral-50 px-3 py-2">
        {byAdmin && (
          <Text.Subtitle className="text-[11px] text-green-900">
            {"Admin:"}
          </Text.Subtitle>
        )}

        <span className="flex space-x-1">
          {timestamp !== null && (
            <Text.Body
              subtle
              className="mt-1 text-xs font-medium"
            >{`@${generateTimestamp(timestamp)}`}</Text.Body>
          )}
          <Text.Body>{content}</Text.Body>
        </span>
        <Text.Subtitle className="mt-1 text-right text-[11px]" subtle>
          {getDateDifference({ date: createdAt }).text}
        </Text.Subtitle>
      </div>

      <div className="flex max-h-[300px] flex-col space-y-2 overflow-y-auto no-scrollbar">
        {initLoading &&
          Array.from({ length: 1 }).map((_, index) => (
            <Skeleton
              key={index}
              className="ml-auto min-h-[90px] w-[80%] rounded-md"
            />
          ))}
        {!initLoading &&
          thread?.map((reply) => {
            const isCreator = reply.sessionId === sessionId;

            return (
              <Dropdown
                key={reply.id}
                disabled={!(isCreator || isAdmin) || removePending}
                options={[
                  {
                    title: "Delete",
                    destructive: true,
                    onClick: () => void handleDeletion(reply.id),
                  },
                ]}
              >
                <div className="ml-auto flex w-[80%] flex-col items-end justify-end rounded-md border border-neutral-100 bg-neutral-50 px-4 py-4 hover:bg-neutral-100">
                  {reply.byAdmin && (
                    <Text.Subtitle className="text-[11px] text-green-900">
                      {"Admin:"}
                    </Text.Subtitle>
                  )}

                  <Text.Body className="text-right">{reply.content}</Text.Body>
                  <Text.Subtitle
                    className="mr-atext-[11px] mt-1 text-left"
                    subtle
                  >
                    {getDateDifference({ date: reply.createdAt }).text}
                  </Text.Subtitle>
                </div>
              </Dropdown>
            );
          })}
      </div>

      <div className="mt-4 flex space-x-1">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Reply"
          disabled={isLoading}
          onKeyDown={(e) => {
            if (input.trim().length > 0 && e.key === "Enter") {
              void handleReply();
            }
          }}
        />
        <Button
          className="w-36"
          isLoading={isLoading}
          disabled={input.trim().length < 1}
          onClick={handleReply}
          title="Send"
        />
      </div>
    </Card>
  );
}
