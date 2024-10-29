"use client";

import * as React from "react";
import * as TooltipPrimitive from "@radix-ui/react-tooltip";

import { cn } from "~/lib/utils";
import Text from "../typography/text";

interface TooltipProps {
  children: React.ReactNode;
  text?: string;
  className?: string;
  destructive?: boolean;
}

export interface PopoverRef {
  show: (message: string) => void;
  hide: () => void;
}

export const Popover = React.forwardRef<PopoverRef, TooltipProps>(
  ({ children, text, destructive, className }, ref) => {
    const [content, setContent] = React.useState<string | undefined>();

    React.useImperativeHandle(ref, () => ({
      show(message: string) {
        setContent(message);
      },
      hide() {
        setContent(undefined);
      },
    }));

    if (!ref) {
      return (
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>{children}</TooltipTrigger>
            <TooltipContent
              className={cn(destructive && "bg-red-600", className)}
            >
              <Text.Body
                className={cn("text-[11px]", destructive && "text-white")}
              >
                {content ?? text}
              </Text.Body>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      );
    }

    return (
      <TooltipProvider>
        <Tooltip open={!!content}>
          <TooltipTrigger>{children}</TooltipTrigger>
          <TooltipContent
            className={cn(destructive && "bg-red-600", className)}
          >
            <Text.Body
              className={cn("text-[11px]", destructive && "text-white")}
            >
              {content ?? text}
            </Text.Body>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  },
);

// Add displayName to the Popover component
Popover.displayName = "Popover";

const TooltipProvider = TooltipPrimitive.Provider;

const Tooltip = TooltipPrimitive.Root;

const TooltipTrigger = TooltipPrimitive.Trigger;

const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 overflow-hidden rounded-md bg-zinc-900 px-3 py-1.5 text-xs text-zinc-50 animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 dark:bg-zinc-50 dark:text-zinc-900",
      className,
    )}
    {...props}
  />
));
TooltipContent.displayName = TooltipPrimitive.Content.displayName;
