import { usePathname, useRouter } from "next/navigation";
import { useModal } from "~/providers/modal-provider";
import MembershipModal from "../modals/membership-modal";
import { Door02Icon, Playlist02Icon, Rocket01Icon } from "hugeicons-react";
import { route, ROUTES } from "~/constants/routes";
import { signOut, useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { cn } from "~/lib/utils";
import UserTile, { type SessionUser } from "./user-tile";
import NavItem from "./navigation-item";
import { type NavOption } from "./navbar";

interface DrawerProps {
  options: NavOption[];
  expanded: boolean;
  user?: SessionUser;
  onRequestClose: () => void;
}

export default function Drawer({
  options,
  expanded,
  user,
  onRequestClose,
}: DrawerProps) {
  const path = usePathname();
  const router = useRouter();
  const { show } = useModal();
  const { status } = useSession();

  const isAuth = status !== "unauthenticated";

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
        {isAuth && user && (
          <UserTile
            onClick={() => router.push(route(ROUTES.account))}
            user={user}
          />
        )}
        {isAuth &&
          [...options, ...mobileOptions].map((option, index) => (
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
          active={false}
          option={{
            icon: <Rocket01Icon />,
            onClick: () => {
              router.push(route(ROUTES.auth));
              onRequestClose();
            },
            title: "Get started",
          }}
        />
        {isAuth && (
          <NavItem
            active
            className="absolute bottom-6 left-4 text-red-700"
            option={{
              icon: <Door02Icon size={16} className="text-red-700" />,
              onClick: () => void handleLogout(),
              title: "Log out",
            }}
          />
        )}
      </motion.div>
    </motion.div>
  );
}
