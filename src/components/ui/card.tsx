import { cn } from "~/lib/utils";
import Text from "../typography/Text";

interface CardProps {
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
}

export default function Card({
  title,
  subtitle,
  children,
  className,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-md border-[.5px] border-neutral-200 bg-white px-[20px] py-[15px]",
        className,
      )}
    >
      <Text.Headline type="h2">{title}</Text.Headline>
      <Text.Body subtle>{subtitle}</Text.Body>
      {children}
    </div>
  );
}
