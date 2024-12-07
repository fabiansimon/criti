"use client";

import {
  Add01Icon,
  Add02Icon,
  Home11Icon,
  Megaphone01Icon,
  Menu01Icon,
  Rocket01Icon,
} from "hugeicons-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { route, ROUTES } from "~/constants/routes";
import useBreakpoint, { BREAKPOINTS } from "~/hooks/use-breakpoint";
import { useState } from "react";
import LogoContainer from "./logo-container";
import NavItem from "./navigation-item";
import UserTile from "./user-tile";
import Drawer from "./drawer";
import Text from "~/components/typography/text";

export interface NavOption {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
  route?: string;
  activeIcon?: React.ReactNode;
}

export default function NavBar() {
  const [expanded, setExpanded] = useState<boolean>(false);

  const { data, status } = useSession();
  const router = useRouter();
  const path = usePathname();

  const isSmall = useBreakpoint(BREAKPOINTS.sm);
  const isAuth = status !== "unauthenticated";

  const options: NavOption[] = [
    {
      icon: <Home11Icon size={16} className="text-neutral-700" />,
      activeIcon: <Home11Icon fill="" size={16} className="text-neutral-700" />,
      title: "Home",
      route: ROUTES.home,
      onClick: () => router.push(route(ROUTES.home)),
    },
    {
      icon: <Megaphone01Icon size={16} className="text-neutral-700" />,
      activeIcon: <Megaphone01Icon size={16} className="text-neutral-700" />,
      title: "Public",
      route: ROUTES.public,
      onClick: () => router.push(route(ROUTES.public)),
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
    <div className="fixed left-0 right-0 top-0 z-20 flex min-h-14 items-center border-b border-b-neutral-200 bg-white">
      {isSmall && (
        <div
          onClick={() => setExpanded(true)}
          className="pointer-events-auto ml-2 flex h-10 w-10 cursor-pointer items-center justify-center"
        >
          <Menu01Icon />
          <div className="pointer-events-none absolute left-0 right-0 flex items-center justify-center">
            <LogoContainer user={data?.user} />
          </div>
        </div>
      )}
      {!isSmall && (
        <div className="mx-auto flex w-full justify-between space-x-2 px-10 md:max-w-screen-lg">
          <LogoContainer user={data?.user} />
          {isAuth && (
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
          )}
          {isAuth && data?.user && <UserTile className="" user={data.user} />}
          {!isAuth && (
            <div
              onClick={() => router.push(route(ROUTES.auth))}
              className="flex cursor-pointer items-center space-x-2 rounded-lg p-2 text-right hover:bg-neutral-100"
            >
              <Rocket01Icon className="size-5" />
              <Text.Body className="font-semibold">{"Sign up"}</Text.Body>
            </div>
          )}
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
