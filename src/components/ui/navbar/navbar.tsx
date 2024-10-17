"use client";

import { Add01Icon, Add02Icon, Home11Icon } from "hugeicons-react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Text from "~/components/typography/text";
import { route, ROUTES } from "~/constants/routes";
import { cn } from "~/lib/utils";
import Avatar from "../avatar";
import Dropdown, { type MenuOption } from "../dropdown-menu";

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
    <div className="fixed left-0 right-0 top-0 flex items-center justify-between border-b border-b-neutral-200 bg-white">
      <div className="mx-auto flex space-x-2">
        {options.map((option, index) => (
          <NavItem
            active={path.includes(option.route)}
            key={index}
            option={option}
          />
        ))}
      </div>
      {data?.user && (
        <UserTile
          className="my-1"
          email={data.user.email!}
          name={data.user.name!}
          imageUri={data.user.image ?? undefined}
        />
      )}
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

interface UserTileProps {
  name: string;
  email: string;
  imageUri?: string;
  className?: string;
}

function UserTile({ imageUri, name, className, email }: UserTileProps) {
  const handleLogout = async () => {
    await signOut();
    console.log("hello");
  };

  const options: MenuOption[] = [
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
        <Avatar className="size-8" url={imageUri} name={name} />
        <div>
          <Text.Body className="text-xs">{name}</Text.Body>
          <Text.Subtitle className="text-[11px]" subtle>
            {email}
          </Text.Subtitle>
        </div>
      </div>
    </Dropdown>
  );
}
