import { cn } from "~/lib/utils";
import Text from "../typography/text";
import LoadingSpinner from "./loading-spinner";
import { RefreshIcon } from "hugeicons-react";

interface CardProps {
  isLoading?: boolean;
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
  onRefresh?: () => void;
}

export default function Card({
  title,
  subtitle,
  children,
  className,
  isLoading,
  onRefresh,
}: CardProps) {
  return (
    <div
      className={cn(
        "relative rounded-md border-[.5px] border-neutral-200 bg-white px-[20px] py-[15px]",
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
      {!isLoading && onRefresh && (
        <div
          onClick={onRefresh}
          className="absolute right-2 top-2 cursor-pointer rounded-md p-1 hover:bg-neutral-100"
        >
          <RefreshIcon className="text-neutral-500" size={16} />
        </div>
      )}
    </div>
  );
}
