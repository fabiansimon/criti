import Text from "~/components/typography/text";
import { cn } from "~/lib/utils";
import { type NavOption } from "./navbar";

interface NavItemProps {
  option: NavOption;
  active: boolean;
  className?: string;
}

export default function NavItem({ option, className, active }: NavItemProps) {
  const { title, onClick, icon, activeIcon } = option;

  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "flex cursor-pointer flex-col items-center justify-center rounded-md px-3 py-1 hover:bg-neutral-100",
        className,
      )}
    >
      <div
        className={cn(
          "flex items-center space-x-2 opacity-50",
          active && "opacity-100",
        )}
      >
        {/* {active && activeIcon ? activeIcon : icon} */}
        <Text.Body>{title}</Text.Body>
      </div>
    </div>
  );
}
