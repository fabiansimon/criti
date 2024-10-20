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
  omitPadding?: boolean;
}

export default function Card({
  title,
  subtitle,
  children,
  className,
  isLoading,
  omitPadding,
}: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-md border-[.5px] border-neutral-200 bg-white",
        !omitPadding && "px-[20px] py-[15px]",
        className,
      )}
    >
      {isLoading && (
        <div className="flex w-full grow items-center justify-center">
          <LoadingSpinner className="size-8" />
        </div>
      )}
      {!isLoading && (
        <div>
          <Text.Headline type="h2">{title}</Text.Headline>
          <Text.Body subtle>{subtitle}</Text.Body>
          {children}
        </div>
      )}
    </div>
  );
}
