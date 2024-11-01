"use client";

import {
  Add01Icon,
  Add02Icon,
  Door02Icon,
  Home11Icon,
  Menu01Icon,
  Playlist02Icon,
} from "hugeicons-react";
import { useSession, signOut } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import Text from "~/components/typography/text";
import { route, ROUTES } from "~/constants/routes";
import { cn } from "~/lib/utils";
import Avatar from "../avatar";
import Dropdown, { type MenuOption } from "../dropdown-menu";
import { type DefaultSession } from "next-auth";
import { useModal } from "~/providers/modal-provider";
import MembershipModal from "../modals/membership-modal";
import useBreakpoint, { BREAKPOINTS } from "~/hooks/use-breakpoint";
import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import BeatbackLogo from "public/logo.svg";

type SessionUser = {
  id: string;
} & DefaultSession["user"];

interface NavOption {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  route?: string;
  activeIcon?: React.ReactNode;
}

export default function NavBar() {
  const [expanded, setExpanded] = useState<boolean>(false);
  const { data } = useSession();
  const router = useRouter();
  const path = usePathname();

  const isSmall = useBreakpoint(BREAKPOINTS.sm);

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

  if (path === "/") return;

  return (
    <div className="fixed left-0 right-0 top-0 z-20 flex min-h-14 items-center border-b border-b-neutral-200 bg-white">
      {isSmall && (
        <div
          onClick={() => setExpanded(true)}
          className="pointer-events-auto ml-2 flex h-10 w-10 cursor-pointer items-center justify-center"
        >
          <Menu01Icon />
          <div className="pointer-events-none absolute left-0 right-0 flex items-center justify-center">
            <LogoContainer />
          </div>
        </div>
      )}
      {!isSmall && (
        <div className="mx-auto flex w-full justify-between space-x-2 px-10 md:max-w-screen-lg">
          <LogoContainer />
          <div className="pointer-events-none absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center px-[50%]">
            <div className="pointer-events-auto flex h-12 space-x-2">
              {options.map((option, index) => (
                <NavItem
                  active={option.route ? path.includes(option.route) : false}
                  key={index}
                  option={option}
                />
              ))}
            </div>
          </div>
          <div className="my-2 w-[1px] bg-neutral-100" />
          {data?.user && <UserTile className="" user={data.user} />}
        </div>
      )}
      {isSmall && (
        <Drawer
          onRequestClose={() => setExpanded(false)}
          user={data?.user}
          options={options}
          expanded={expanded}
        />
      )}
    </div>
  );
}

interface DrawerProps {
  options: NavOption[];
  expanded: boolean;
  user?: SessionUser;
  onRequestClose: () => void;
}

function Drawer({ options, expanded, user, onRequestClose }: DrawerProps) {
  const path = usePathname();
  const router = useRouter();
  const { show } = useModal();

  const mobileOptions: NavOption[] = [
    {
      title: "Membership",
      onClick: () => show(<MembershipModal />),
      icon: <Playlist02Icon size={16} />,
    },
  ];
  const handleLogout = async () => {
    router.push(route(ROUTES.landing));
    await signOut();
  };

  return (
    <motion.div
      onClick={onRequestClose}
      initial="hidden"
      animate={expanded ? "visible" : "hidden"}
      variants={{ visible: { opacity: 1 }, hidden: { opacity: 0 } }}
      className={cn(
        "fixed bottom-0 left-0 right-0 top-0 z-50 bg-black/40",
        !expanded && "pointer-events-none",
      )}
    >
      <motion.div
        initial="hidden"
        transition={{ bounce: 0.1 }}
        animate={expanded ? "visible" : "hidden"}
        variants={{ visible: { translateX: 0 }, hidden: { translateX: -1000 } }}
        className="flex h-full w-[80%] flex-col items-start space-y-4 bg-white px-4 py-10"
      >
        {user && (
          <UserTile
            onClick={() => router.push(route(ROUTES.account))}
            user={user}
          />
        )}
        {[...options, ...mobileOptions].map((option, index) => (
          <NavItem
            active={option.route ? path.includes(option.route) : false}
            key={index}
            option={{
              ...option,
              onClick: () => {
                onRequestClose();
                option.onClick();
              },
            }}
          />
        ))}
        <NavItem
          active
          className="absolute bottom-6 left-4 text-red-700"
          option={{
            icon: <Door02Icon size={16} className="text-red-700" />,
            onClick: () => void handleLogout(),
            title: "Log out",
          }}
        />
      </motion.div>
    </motion.div>
  );
}

interface NavItemProps {
  option: NavOption;
  active: boolean;
  className?: string;
}

function NavItem({ option, className, active }: NavItemProps) {
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

interface UserTileProps {
  user: SessionUser;
  onClick?: () => void;
  className?: string;
}

function UserTile({ user, onClick, className }: UserTileProps) {
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
      title: "Account",
      onClick: () => router.push(route(ROUTES.account)),
    },
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
    <div onClick={onClick}>
      <Dropdown disabled={!!onClick} options={options}>
        <div
          className={cn(
            "flex cursor-pointer items-center space-x-3 rounded-lg p-2 hover:bg-neutral-100",
            className,
          )}
        >
          <Avatar className="size-7" url={image ?? ""} name={name ?? ""} />
          <Text.Body className="text-sm">{name ?? ""}</Text.Body>
        </div>
      </Dropdown>
    </div>
  );
}

function LogoContainer() {
  const router = useRouter();
  return (
    <div
      onClick={() => router.push(route(ROUTES.home))}
      className="pointer-events-auto flex h-12 cursor-pointer items-center space-x-2 rounded-md px-2 hover:bg-neutral-100"
    >
      <Image
        src={BeatbackLogo as string}
        alt="beatback logo"
        className="size-6"
      />
      <Text.Body>beatback</Text.Body>
    </div>
  );
}
