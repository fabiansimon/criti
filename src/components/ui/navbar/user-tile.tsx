import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { route, ROUTES } from "~/constants/routes";
import { useModal } from "~/providers/modal-provider";
import MembershipModal from "../modals/membership-modal";
import Dropdown, { type MenuOption } from "../dropdown-menu";
import { cn } from "~/lib/utils";
import Avatar from "../avatar";
import { type DefaultSession } from "next-auth";
import Text from "~/components/typography/text";
import { type Membership } from "@prisma/client";

export type SessionUser = {
  id: string;
  membership: Membership;
} & DefaultSession["user"];

interface UserTileProps {
  user: SessionUser;
  onClick?: () => void;
  className?: string;
}

export default function UserTile({ user, onClick, className }: UserTileProps) {
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
