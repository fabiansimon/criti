import { type CommentType } from "~/server/api/routers/comment/commentTypes";
import { cn } from "~/lib/utils";
import AnimatedSelector, { type SelectorType } from "./animated-selector";

interface CommentTypeSelectorProps {
  onChange: (type: CommentType) => void;
  className?: string;
}

type CommentSelectorType = SelectorType<CommentType>;

export const commentsSelectorOptions: CommentSelectorType[] = [
  {
    type: "GENERAL",
    title: "General",
    color: "#353535",
  },
  {
    type: "DROP",
    title: "Drop",
    color: "#fb5607",
  },
  {
    type: "LYRIC",
    title: "Lyric",
    color: "#ff006e",
  },
  {
    type: "MIX",
    title: "Mix",
    color: "#3a86ff",
  },
  {
    type: "TRANSITION",
    title: "Transition",
    color: "#8338ec",
  },
];

export default function CommentTypeSelector({
  className,
  onChange,
}: CommentTypeSelectorProps) {
  return (
    <AnimatedSelector
      options={commentsSelectorOptions}
      initValue={commentsSelectorOptions[0]!}
      onChange={(choice) => onChange(choice.type)}
      className={cn("", className)}
    />
  );
}
