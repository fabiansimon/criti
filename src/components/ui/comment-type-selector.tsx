import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { CommentType } from "~/server/api/routers/comment/commentTypes";
import Text from "../typography/text";
import { cn, hexToRGB } from "~/lib/utils";
import { dir } from "console";

interface CommentTypeSelectorProps {
  onChange: (type: CommentType) => void;
  className?: string;
}

interface SelectionType {
  type: CommentType;
  title: string;
  color: string;
}

export const commentTypeOptions: SelectionType[] = [
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
  const [selected, setSelected] = useState<SelectionType>(
    commentTypeOptions[0]!,
  );
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const { render, midpoint } = useMemo(() => {
    const inverted = commentTypeOptions.filter(
      ({ type }) => type !== selected.type,
    );
    const midpoint = Math.ceil(inverted.length / 2);
    const [pre, post] = [inverted.slice(0, midpoint), inverted.slice(midpoint)];

    return {
      render: [...pre, selected, ...post],
      midpoint,
    };
  }, [selected]);

  const handleChoice = (choice: SelectionType) => {
    setSelected(choice);
    setIsVisible((prev) => !prev);
    onChange(choice.type);
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col space-y-1",
          isVisible && "z-50",
          className,
        )}
      >
        {render.map((s, i) => {
          const visible = s.type === selected.type || isVisible;
          const direction = i <= midpoint ? 1 : -1;
          return (
            <motion.div
              key={s.type}
              initial={visible ? "visible" : "hidden"}
              animate={visible ? "visible" : "hidden"}
              variants={{
                visible: { opacity: 1, translateY: 0 },
                hidden: {
                  opacity: 0,
                  translateY: direction * 20 * Math.abs(i - midpoint),
                },
              }}
              className={cn(!visible && "pointer-events-none")}
            >
              <SelectorContainer type={s} onClick={() => handleChoice(s)} />
            </motion.div>
          );
        })}
      </div>
      <motion.div
        animate={isVisible ? "visible" : "hidden"}
        variants={{ visible: { opacity: 0.5 }, hidden: { opacity: 0 } }}
        className={cn(
          "fixed bottom-0 left-0 right-0 top-0 z-40 bg-black",
          !isVisible && "pointer-events-none",
        )}
        onClick={() => setIsVisible(false)}
      />
    </>
  );
}

interface SelectorContainerProps {
  type: SelectionType;
  onClick?: () => void;
  className?: string;
}
export function SelectorContainer({
  type,
  onClick,
  className,
}: SelectorContainerProps) {
  const { title, color } = type;
  const rgb = hexToRGB(color);
  return (
    <div
      className={cn(
        "overflow-hidden rounded-full bg-white shadow-sm",
        className,
      )}
    >
      <div
        onClick={onClick}
        className="flex cursor-pointer px-2 py-[4.5px]"
        style={{
          backgroundColor: `rgba(${rgb}, 0.15)`,
          borderColor: `rgba(${rgb}, 0.05)`,
        }}
      >
        <Text.Body className="mx-auto text-xs font-medium" style={{ color }}>
          {title}
        </Text.Body>
      </div>
    </div>
  );
}
