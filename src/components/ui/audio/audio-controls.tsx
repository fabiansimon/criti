import { PauseIcon, PlayIcon, RepeatIcon, ShuffleIcon } from "hugeicons-react";
import { useState } from "react";
import { cn } from "~/lib/utils";
import DoubleArrowIcon from "public/double_arrow.svg";
import Image from "next/image";

interface AudioControlsProps {
  onLoop: (status: boolean) => void;
  onRewind: () => void;
  onPlay: (status: boolean) => void;
  onForward: () => void;
  onShuffle: (status: boolean) => void;
  className?: string;
}
export default function AudioControls({
  onLoop,
  onRewind,
  onPlay,
  onForward,
  onShuffle,
  className,
}: AudioControlsProps) {
  const [loop, setLoop] = useState<boolean>(false);
  const [play, setPlay] = useState<boolean>(false);
  const [shuffle, setShuffle] = useState<boolean>(false);

  const triggerLoop = () => {
    setLoop((prev) => {
      const status = !prev;
      onLoop(status);
      return status;
    });
  };

  const triggerPlay = () => {
    setPlay((prev) => {
      const status = !prev;
      onPlay(status);
      return status;
    });
  };

  const triggerShuffle = () => {
    setShuffle((prev) => {
      const status = !prev;
      onShuffle(status);
      return status;
    });
  };

  return (
    <div className={cn("flex items-center space-x-3", className)}>
      <div
        onClick={triggerLoop}
        className="flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-100"
      >
        <RepeatIcon size={16} className={!loop ? "opacity-40" : ""} />
      </div>

      <Image
        onClick={onRewind}
        src={DoubleArrowIcon}
        className="rotate-180 cursor-pointer hover:opacity-80"
        alt="rewind icon"
      />

      <div
        className="flex size-8 cursor-pointer items-center justify-center rounded-full bg-neutral-900 hover:bg-neutral-700"
        onClick={triggerPlay}
      >
        {!play ? (
          <PlayIcon className="text-white" fill="white" size={14} />
        ) : (
          <PauseIcon className="text-white" fill="white" size={14} />
        )}
      </div>

      <Image
        onClick={onForward}
        src={DoubleArrowIcon}
        className="cursor-pointer hover:opacity-80"
        alt="fastfoward icon"
      />

      <div
        onClick={triggerShuffle}
        className="flex size-8 cursor-pointer items-center justify-center rounded-md hover:bg-neutral-100"
      >
        <ShuffleIcon size={16} className={!shuffle ? "opacity-40" : ""} />
      </div>
    </div>
  );
}
