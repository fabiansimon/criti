import { cn } from "~/lib/utils";
import Text from "../typography/text";

interface EmptyInfoProps {
  title: string;
  subtitle: string;
  className?: string;
}
export default function EmptyInfo({
  title,
  subtitle,
  className,
}: EmptyInfoProps) {
  return (
    <div className={cn("text-center", className)}>
      <Text.Body subtle>{title}</Text.Body>
      <Text.Subtitle subtle>{subtitle}</Text.Subtitle>
    </div>
  );
}
