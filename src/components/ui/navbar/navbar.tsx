"use client";

import { Add01Icon, Add02Icon, Home11Icon, Menu01Icon } from "hugeicons-react";
import { useSession } from "next-auth/react";
import { usePathname, useRouter } from "next/navigation";
import { route, ROUTES } from "~/constants/routes";
import useBreakpoint, { BREAKPOINTS } from "~/hooks/use-breakpoint";
import { useState } from "react";
import LogoContainer from "./logo-container";
import NavItem from "./navigation-item";
import UserTile from "./user-tile";
import Drawer from "./drawer";

export interface NavOption {
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
            <LogoContainer user={data?.user} />
          </div>
        </div>
      )}
      {!isSmall && (
        <div className="mx-auto flex w-full justify-between space-x-2 px-10 md:max-w-screen-lg">
          <LogoContainer user={data?.user} />
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
