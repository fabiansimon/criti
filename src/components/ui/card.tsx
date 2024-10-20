import { cn } from "~/lib/utils";
import Text from "../typography/text";
import LoadingSpinner from "./loading-spinner";
import useBreakpoint, { BREAKPOINTS } from "~/hooks/use-breakpoint";

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
  const isSmall = useBreakpoint(BREAKPOINTS.sm);

  return (
    <div
      className={cn(
        "relative rounded-md border-[.5px] border-neutral-200 bg-white",
        !omitPadding && "px-[20px] py-[15px]",
        className,
        isSmall && "mt-14 h-full min-w-full grow",
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
