"use client";

import { Add01Icon, Add02Icon, Home11Icon } from "hugeicons-react";
import { usePathname, useRouter } from "next/navigation";
import { cloneElement } from "react";
import Text from "~/components/typography/text";
import { route, ROUTES } from "~/constants/routes";
import { cn } from "~/lib/utils";

interface NavOption {
  title: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  route: string;
  onClick: () => void;
}

export default function NavBar() {
  const router = useRouter();
  const path = usePathname();

  const options: NavOption[] = [
    {
      icon: <Home11Icon size={16} className="text-neutral-700" />,
      activeIcon: <Home11Icon fill="" size={16} className="text-neutral-700" />,
      title: "Home",
      route: ROUTES.home,
      onClick: () => router.push(route(ROUTES.home)),
    },
    {
      icon: <Add01Icon size={16} className="text-neutral-700" />,
      activeIcon: <Add02Icon fill="" size={16} className="text-neutral-700" />,
      title: "Upload",
      route: ROUTES.upload,
      onClick: () => router.push(route(ROUTES.upload)),
    },
  ];

  return (
    <div className="fixed left-0 right-0 top-0 flex h-12 items-center justify-between border-b border-b-neutral-200 bg-white">
      <div className="mx-auto flex space-x-2">
        {options.map((option, index) => (
          <NavItem
            active={path.includes(option.route)}
            key={index}
            option={option}
          />
        ))}
      </div>
    </div>
  );
}

interface NavItemProps {
  option: NavOption;
  active: boolean;
}

function NavItem({ option, active }: NavItemProps) {
  const { title, onClick, icon, activeIcon } = option;

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex cursor-pointer flex-col items-center rounded-md px-3 py-1 opacity-50 hover:bg-neutral-100",
        active && "opacity-100",
      )}
    >
      <div className="flex items-center space-x-2">
        {active ? activeIcon : icon}
        <Text.Body>{title}</Text.Body>
      </div>
    </div>
  );
}
