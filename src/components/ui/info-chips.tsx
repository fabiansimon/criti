import { useMemo } from "react";
import useBreakpoint, { BREAKPOINTS } from "~/hooks/use-breakpoint";
import { cn, getDateDifference } from "~/lib/utils";
import Text from "../typography/text";
import { Clock03Icon, Comment01Icon } from "hugeicons-react";
import { Popover } from "./tooltip";

interface InfoChipProps {
  icon: React.ReactNode;
  text: string;
  backgroundColor: string;
  textColor: string;
  infoText?: string;
}
export function InfoChip({
  icon,
  text,
  backgroundColor,
  textColor,
  infoText,
}: InfoChipProps) {
  const isSmall = useBreakpoint(BREAKPOINTS.sm);

  return (
    <Popover text={infoText}>
      <div
        className={cn(
          "mt-1 flex min-h-6 items-center space-x-[3.5px] rounded-full px-2",
          backgroundColor,
          textColor,
        )}
      >
        {icon}
        <Text.Subtitle className={cn("text-[10px] font-normal", textColor)}>
          {text}
        </Text.Subtitle>
      </div>
    </Popover>
  );
}

interface ExpirationChipProps {
  hours: number;
}
export function ExpirationChip({ hours }: ExpirationChipProps) {
  const { text: expiresIn } = getDateDifference({
    hours,
    currentString: "today",
    past: false,
  });

  const { textColor, backgroundColor } = useMemo(() => {
    // Within 24 hours
    if (hours < 24)
      return {
        textColor: "text-red-700",
        backgroundColor: "bg-red-300/30",
      };

    // Within a week
    if (hours < 24 * 7)
      return {
        textColor: "text-orange-700",
        backgroundColor: "bg-orange-300/30",
      };

    return {
      textColor: "text-green-700",
      backgroundColor: "bg-green-300/30",
    };
  }, [hours]);

  return (
    <InfoChip
      infoText={`This track will expire ${expiresIn}`}
      icon={<Clock03Icon size={13} />}
      text={expiresIn}
      backgroundColor={backgroundColor}
      textColor={textColor}
    />
  );
}

export function OpenCommentsChip() {
  return (
    <InfoChip
      infoText={"This track has some open comments"}
      backgroundColor="bg-blue-300/30"
      textColor="text-blue-700"
      icon={<Comment01Icon size={13} />}
      text="open comments"
    />
  );
}
