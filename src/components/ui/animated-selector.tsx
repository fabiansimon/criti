import { useMemo, useState } from "react";
import { cn, hexToRGB } from "~/lib/utils";
import Text from "../typography/text";
import { motion } from "framer-motion";

export interface SelectorType<T> {
  type: T;
  color: string;
  title: string;
}

export interface AnimatedSelectorProps<T> {
  initValue: SelectorType<T>;
  disabled?: boolean;
  options: SelectorType<T>[];
  className: string;
  onChange: (value: SelectorType<T>) => void;
}

export default function AnimatedSelector<T>({
  initValue,
  options,
  className,
  disabled,
  onChange,
}: AnimatedSelectorProps<T>) {
  const [selected, setSelected] = useState<SelectorType<T>>(initValue);
  const [isVisible, setIsVisible] = useState<boolean>(false);

  const { render, midpoint } = useMemo(() => {
    const inverted = options.filter(({ type }) => type !== selected.type);
    const midpoint = Math.ceil(inverted.length / 2);
    const [pre, post] = [inverted.slice(0, midpoint), inverted.slice(midpoint)];

    return {
      render: [...pre, selected, ...post],
      midpoint,
    };
  }, [selected, options]);

  const handleChoice = (choice: SelectorType<T>) => {
    setSelected(choice);
    onChange(choice);
    setIsVisible((prev) => !prev);
  };

  return (
    <>
      <div
        className={cn(
          "flex flex-col space-y-1",
          isVisible && "z-[100]",
          className,
        )}
      >
        {render.map((s, i) => {
          const visible = s.type === selected.type || isVisible;
          const direction = i <= midpoint ? 1 : -1;
          return (
            <motion.div
              key={i}
              initial={visible ? "visible" : "hidden"}
              animate={visible ? "visible" : "hidden"}
              variants={{
                visible: { opacity: 1, translateY: 0 },
                hidden: {
                  opacity: 0,
                  translateY: direction * 20 * Math.abs(i - midpoint),
                },
              }}
              className={cn((!visible || disabled) && "pointer-events-none")}
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
          "fixed -left-10 bottom-0 right-0 top-0 z-[99] bg-black",
          !isVisible && "pointer-events-none",
        )}
        onClick={() => setIsVisible(false)}
      />
    </>
  );
}

interface SelectorContainerProps<T> {
  type: SelectorType<T>;
  onClick?: () => void;
  className?: string;
}
export function SelectorContainer<T>({
  type,
  onClick,
  className,
}: SelectorContainerProps<T>) {
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
        onClick={(e) => {
          e.stopPropagation();
          if (onClick) onClick();
        }}
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
