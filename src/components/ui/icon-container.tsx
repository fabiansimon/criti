import { cn } from "~/lib/utils";

interface IconContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  icon: React.ReactNode;
}

export default function IconContainer({ icon, className }: IconContainerProps) {
  return (
    <div
      className={cn(
        "bg-accent flex aspect-square size-12 items-center justify-center rounded-md border border-white",
        className,
      )}
    >
      {icon}
    </div>
  );
}
