"use client";

import { Add01Icon, Add02Icon, Home11Icon } from "hugeicons-react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Text from "~/components/typography/text";
import { route, ROUTES } from "~/constants/routes";
import { cn } from "~/lib/utils";
import Avatar from "../avatar";
import Dropdown, { type MenuOption } from "../dropdown-menu";
import { type DefaultSession } from "next-auth";
import { useModal } from "~/providers/modal-provider";
import { useEffect } from "react";
import MembershipModal from "../modals/membership-modal";

type SessionUser = {
  id: string;
} & DefaultSession["user"];

interface NavOption {
  title: string;
  icon: React.ReactNode;
  activeIcon: React.ReactNode;
  route: string;
  onClick: () => void;
}

export default function NavBar() {
  const { data } = useSession();
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
    <div className="fixed left-0 right-0 top-0 flex min-h-14 items-center border-b border-b-neutral-200 bg-white">
      <div className="ml-[80%]">
        <div />
      </div>
      <div className="absolute flex w-full items-center">
        <div className="mx-auto flex space-x-2">
          {options.map((option, index) => (
            <NavItem
              active={path.includes(option.route)}
              key={index}
              option={option}
            />
          ))}
          <div className="my-2 w-[1px] bg-neutral-100" />
          {data?.user && <UserTile className="" user={data.user} />}
        </div>
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
        "flex cursor-pointer flex-col items-center justify-center rounded-md px-3 py-1 hover:bg-neutral-100",
      )}
    >
      <div
        className={cn(
          "flex items-center space-x-2 opacity-50",
          active && "opacity-100",
        )}
      >
        {active ? activeIcon : icon}
        <Text.Body>{title}</Text.Body>
      </div>
    </div>
  );
}

interface UserTileProps {
  user: SessionUser;
  className?: string;
}

function UserTile({ user, className }: UserTileProps) {
  const { image, name } = user;

  const router = useRouter();
  const { show } = useModal();

  const handleLogout = async () => {
    router.push(route(ROUTES.landing));
    await signOut();
  };

  const showMemberships = () => {
    show(<MembershipModal />);
  };

  const options: MenuOption[] = [
    {
      title: "Membership",
      onClick: showMemberships,
    },
    {
      title: "Sign out",
      onClick: () => void handleLogout(),
    },
  ];

  return (
    <Dropdown options={options}>
      <div
        className={cn(
          "flex cursor-pointer items-center space-x-3 rounded-lg p-2 hover:bg-neutral-100",
          className,
        )}
      >
        <Avatar className="size-7" url={image ?? ""} name={name ?? ""} />
        <Text.Body className="text-sm">{"Account"}</Text.Body>
      </div>
    </Dropdown>
  );
}
