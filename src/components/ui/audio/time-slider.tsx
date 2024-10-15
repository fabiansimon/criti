import Text from "~/components/typography/text";
import { cn, generateTimestamp } from "~/lib/utils";
import { Slider } from "../slider";

interface TimeSliderProps {
  curr: number;
  max: number;
  onChange: (time: number) => void;
}

export default function TimeSlider({ curr, max, onChange }: TimeSliderProps) {
  return (
    <div className="flex items-center space-x-4">
      <Text.Subtitle className="text-[10px] font-normal">
        {generateTimestamp(curr)}
      </Text.Subtitle>
      <Slider
        onValueChange={(values) => onChange(values[0]!)}
        defaultValue={[curr]}
        max={max}
        value={[curr]}
        step={1}
        className={cn("w-full")}
      />
      <Text.Subtitle className="text-[10px] font-normal">
        {generateTimestamp(max)}
      </Text.Subtitle>
    </div>
  );
}
