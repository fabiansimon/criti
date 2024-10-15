import {
  GoBackward15SecIcon,
  GoForward15SecIcon,
  PauseIcon,
  PlayIcon,
} from "hugeicons-react";
import { cn } from "~/lib/utils";

interface AudioControlsProps {
  isPlaying: boolean;
  onBackward: () => void;
  onForward: () => void;
  onPlay: () => void;
  className?: string;
}
export default function AudioControls({
  isPlaying,
  onPlay,
  onBackward,
  onForward,
  className,
}: AudioControlsProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <div
        onClick={onBackward}
        className="flex size-8 cursor-pointer items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100"
      >
        <GoBackward15SecIcon size={20} />
      </div>

      <div
        className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-neutral-900 hover:bg-neutral-700"
        onClick={onPlay}
      >
        {!isPlaying ? (
          <PlayIcon className="text-white" fill="white" size={14} />
        ) : (
          <PauseIcon className="text-white" fill="white" size={14} />
        )}
      </div>

      <div
        onClick={onForward}
        className="flex size-8 cursor-pointer items-center justify-center rounded-md text-neutral-400 hover:bg-neutral-100"
      >
        <GoForward15SecIcon size={20} />
      </div>
    </div>
  );
}
