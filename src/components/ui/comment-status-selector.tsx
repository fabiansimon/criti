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
    color: "#3a86ff",
  },
  {
    type: "COMPLETED",
    title: "Completed",
    color: "#353535",
  },
  {
    type: "DISMISSED",
    title: "Dismissed",
    color: "#fb5607",
  },
  {
    type: "IN_PROGRESS",
    title: "In Progress",
    color: "#ff006e",
  },
  {
    type: "UNDER_REVIEW",
    title: "Under Review",
    color: "#8338ec",
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
