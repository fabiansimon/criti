import { cn } from "~/lib/utils";
import Text from "../typography/text";
import LoadingSpinner from "./loading-spinner";
import useBreakpoint, { BREAKPOINTS } from "~/hooks/use-breakpoint";
import { useSession } from "next-auth/react";

interface CardProps {
  isLoading?: boolean;
  children?: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  className?: string;
  omitPadding?: boolean;
  trailing?: React.ReactNode;
}

export default function Card({
  title,
  subtitle,
  children,
  className,
  isLoading,

  trailing,
  omitPadding,
}: CardProps) {
  const { status } = useSession();
  const isSmall = useBreakpoint(BREAKPOINTS.sm);

  return (
    <div
      className={cn(
        "relative rounded-md border-[.5px] border-neutral-200 bg-white",
        !omitPadding && "px-[20px] py-[15px]",
        className,
        isSmall && "h-full min-w-full grow",
        isSmall && status === "authenticated" && "mt-14",
      )}
    >
      {isLoading && (
        <div className="flex w-full grow items-center justify-center">
          <LoadingSpinner className="size-8" />
        </div>
      )}
      {!isLoading && (
        <div>
          <div className="flex w-full justify-between">
            <div>
              <Text.Headline type="h2">{title}</Text.Headline>
              <Text.Body subtle>{subtitle}</Text.Body>
            </div>
            {trailing}
          </div>
          {children}
        </div>
      )}
    </div>
  );
}
