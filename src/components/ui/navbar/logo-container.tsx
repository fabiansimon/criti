import { useRouter } from "next/navigation";
import Text from "~/components/typography/text";
import { route, ROUTES } from "~/constants/routes";
import BeatbackLogo from "public/logo.svg";
import BeatbackProLogo from "public/logo-premium.svg";
import Image from "next/image";
import { type SessionUser } from "./user-tile";

interface LogoContainerProps {
  user?: SessionUser | null;
}
export default function LogoContainer({ user }: LogoContainerProps) {
  const router = useRouter();
  const premium = user?.membership === "PREMIUM_V1";

  return (
    <div
      onClick={() => router.push(route(ROUTES.home))}
      className="pointer-events-auto flex h-12 cursor-pointer items-center space-x-2 rounded-md px-2 hover:bg-neutral-100"
    >
      <Image
        src={(premium ? BeatbackProLogo : BeatbackLogo) as string}
        alt="beatback logo"
        className="size-6"
      />
      <span className="flex space-x-1">
        <Text.Body>beatback</Text.Body>
        {premium && <Text.Body className="font-bold">pro</Text.Body>}
      </span>
    </div>
  );
}
