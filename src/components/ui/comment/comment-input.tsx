import { Cancel01Icon, PlusSignIcon } from "hugeicons-react";
import { useMemo, useRef, useState } from "react";
import { REGEX } from "~/constants/regex";
import { cn, convertTimestamp, generateTimestamp } from "~/lib/utils";
import { Button } from "../button";
import { Popover, type PopoverRef } from "../tooltip";
import CommentTypeSelector from "../comment-type-selector";
import { type CommentType } from "~/server/api/routers/comment/commentTypes";

interface CommentInputProps {
  onCreate: ({ content, timestamp, type }: CommentContent) => void;
  time: number;
  maxTime: number;
  className?: string;
}

export interface CommentContent {
  content: string;
  timestamp?: number;
  type: CommentType;
}

export default function CommentInput({
  onCreate,
  className,
  time,
  maxTime,
}: CommentInputProps) {
  const [type, setType] = useState<CommentType>("GENERAL");
  const [timestamp, setTimestamp] = useState<string>("");
  const [input, setInput] = useState<string>("");
  const [isFocused, setIsFocused] = useState<boolean>(false);

  const timestampErrorRef = useRef<PopoverRef | null>(null);

  const handleTimestampChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    const clean = value.replace(/[^0-9:]/g, "");
    if (clean.length > 5) return;

    let formatted = clean;
    if (clean.length === 2 && !clean.includes(":")) formatted += ":";

    setTimestamp(formatted);
  };

  const handleBlur = () => {
    handleFocus(false);
  };

  const handleFocus = (status: boolean) => {
    setIsFocused(status);
  };

  const handleCreate = () => {
    let _timestamp: number | undefined;
    if (timestamp) {
      _timestamp = convertTimestamp(timestamp);
    }

    onCreate({ content: input, timestamp: _timestamp, type });
    setInput("");
    setTimestamp("");
  };

  const validInput = useMemo(() => {
    const _input = input.trim().length > 1;
    if (!timestamp) {
      timestampErrorRef.current?.hide();
      return _input;
    }

    if (!REGEX.timestamp.test(timestamp)) {
      timestampErrorRef.current?.show("invalid timestamp");
      return false;
    }

    if (convertTimestamp(timestamp) > maxTime) {
      timestampErrorRef.current?.show("not within range");
      return false;
    }

    timestampErrorRef.current?.hide();

    return _input;
  }, [input, timestamp, maxTime]);

  return (
    <div className={cn("flex h-11 space-x-2", className)}>
      <div
        className={cn(
          "flex min-h-9 w-full grow rounded-md border border-zinc-200 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-zinc-950 placeholder:text-zinc-500 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-950 disabled:cursor-not-allowed disabled:opacity-50 dark:border-zinc-800 dark:file:text-zinc-50 dark:placeholder:text-zinc-400 dark:focus-visible:ring-zinc-300",
          isFocused ? "border-black" : "border-red",
          "relative bg-neutral-50",
        )}
      >
        <Popover className="mb-1 mr-3" destructive ref={timestampErrorRef}>
          <span className="flex items-center space-x-2">
            {timestamp && (
              <div
                onClick={() => setTimestamp("")}
                className="flex aspect-square h-4 w-4 items-center justify-center rounded-full bg-neutral-200"
              >
                <Cancel01Icon size={10} />
              </div>
            )}
            <input
              type="text"
              onChange={handleTimestampChange}
              value={timestamp}
              placeholder="00:00"
              className="mx-1 w-14 bg-transparent focus:outline-none"
              onFocus={() => {
                handleFocus(true);
                setTimestamp(generateTimestamp(time));
              }}
              onBlur={handleBlur}
            />
          </span>
        </Popover>
        <div className="w-px bg-neutral-200" />
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder="Add comment"
          className="flex w-full grow bg-transparent px-3 py-2 focus:outline-none"
          onFocus={() => handleFocus(true)}
          onBlur={handleBlur}
          onKeyDown={(e) => {
            if (validInput && e.key === "Enter") {
              handleCreate();
            }
          }}
        />
        <CommentTypeSelector
          onChange={setType}
          className="absolute right-3 top-5 -translate-y-1/2 transform"
        />
      </div>
      <div className="rounded-md bg-white">
        <Button
          disabled={!validInput}
          onClick={handleCreate}
          className="min-h-full w-14"
          icon={<PlusSignIcon size={18} />}
        />
      </div>
    </div>
  );
}
