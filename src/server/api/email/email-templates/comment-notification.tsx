import { type Comment } from "@prisma/client";
import Text from "~/components/typography/text";
import { generateTimestamp } from "~/lib/utils";

interface CommentNotificationEmailProps {
  title: string;
  url: string;
  content: Comment;
}

export default function CommentNotificationEmail({
  url,
  title,
  content,
}: CommentNotificationEmailProps) {
  const { content: text } = content;
  return (
    <div>
      <Text.Body>{`You received a new comment for your track ${title}`}</Text.Body>
      <Text.Body>{`"${text} ${content.timestamp ? `@${generateTimestamp(content.timestamp)}` : ""}"`}</Text.Body>
      <Text.Body>{url}</Text.Body>
    </div>
  );
}
