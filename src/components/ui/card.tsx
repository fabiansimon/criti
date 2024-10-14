import { cn } from "~/lib/utils";
import Text from "../typography/text";
import LoadingSpinner from "./loading-spinner";

interface CardProps {
  isLoading?: boolean;
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
  isLoading,
}: CardProps) {
  return (
    <div
      className={cn(
        "rounded-md border-[.5px] border-neutral-200 bg-white px-[20px] py-[15px]",
        className,
      )}
    >
      <div>
        <Text.Headline type="h2">{title}</Text.Headline>
        <Text.Body subtle>{subtitle}</Text.Body>
        {isLoading && <LoadingSpinner />}
        {children}
      </div>
    </div>
  );
}
