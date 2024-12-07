import { type CommentStatus } from "~/server/api/routers/comment/commentTypes";
import { cn } from "~/lib/utils";
import AnimatedSelector, { type SelectorType } from "./animated-selector";
import { useMemo } from "react";

interface CommentStatusSelectorProps {
  status: CommentStatus;
  onChange: (type: CommentStatus) => void;
  className?: string;
}

type CommentSelectorType = SelectorType<CommentStatus>;

const options: CommentSelectorType[] = [
  {
    type: "OPEN",
    title: "Open",
    color: "#8F8F8F",
  },
  {
    type: "COMPLETED",
    title: "Completed",
    color: "#65a30d",
  },
  {
    type: "DISMISSED",
    title: "Dismissed",
    color: "#E5494E",
  },
  {
    type: "IN_PROGRESS",
    title: "In Progress",
    color: "#0072F6",
  },
  {
    type: "UNDER_REVIEW",
    title: "In Review",
    color: "#8E4EC6",
  },
];

export default function CommentStatusSelector({
  status,
  className,
  onChange,
}: CommentStatusSelectorProps) {
  const initValue = useMemo(
    () => options.find(({ type }) => type === status) ?? options[0]!,
    [status],
  );

  return (
    <AnimatedSelector
      options={options}
      initValue={initValue}
      onChange={(choice) => onChange(choice.type)}
      className={cn("", className)}
    />
  );
}
