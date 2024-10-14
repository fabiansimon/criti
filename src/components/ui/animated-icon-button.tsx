import { motion } from "framer-motion";
import Text from "../typography/text";
import { useState } from "react";

interface IconButtonProps {
  icon: React.ReactNode;
  text?: string;
  className?: string;
  onClick: () => void;
}
export default function IconButton({
  icon,
  text,
  className,
  onClick,
}: IconButtonProps) {
  const [hovered, setHovered] = useState<boolean>(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="flex h-10 cursor-pointer items-center overflow-hidden rounded-md bg-accent hover:bg-accent/80"
    >
      <div className="flex w-10 items-center justify-center">{icon}</div>
      <motion.div
        transition={{ duration: 0.1 }}
        animate={hovered ? "visible" : "hidden"}
        variants={{
          hidden: { width: 0, opacity: 0 },
          visible: { width: "auto", marginRight: 10, opacity: 1 },
        }}
      >
        {text && <Text.Body>{text}</Text.Body>}
      </motion.div>
    </div>
  );
}
