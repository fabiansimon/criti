import Text from "~/components/typography/text";
import { cn } from "~/lib/utils";
import { CommentInput } from "./comment-input";
import { type Comment } from "@prisma/client";

interface CommentsContainerProps {
  comments: Comment[];
  className?: string;
}

interface CommenTileProps {
  comment: Comment;
}

export function CommentsContainer({
  className,
  comments,
}: CommentsContainerProps) {
  const empty = comments.length === 0;
  return (
    <div
      className={cn(
        "relative min-h-[200px] rounded-md border-[.5px] border-neutral-200 bg-white shadow-md shadow-neutral-100",
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
      <CommentInput
        className="absolute bottom-3 left-3 right-3"
        onCreate={(comment) => console.log(comment)}
      />
    </div>
  );
}

function CommentTile({ comment }: CommenTileProps) {
  return <div></div>;
}
