import { cn } from "~/lib/utils";
import { Slider } from "../slider";
import { VolumeHighIcon, VolumeLowIcon } from "hugeicons-react";

interface VolumeControlProps {
  onChange: (value: number) => void;
  className?: string;
}

export default function VolumeControl({
  onChange,
  className,
}: VolumeControlProps) {
  return (
    <div className={cn("flex items-center space-x-2", className)}>
      <VolumeLowIcon size={18} />
      <Slider
        onValueChange={(values) => onChange(values[0]!)}
        defaultValue={[100]}
        max={100}
        step={1}
        className={"w-28"}
      />
      <VolumeHighIcon size={18} />
    </div>
  );
}
