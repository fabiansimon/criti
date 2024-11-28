import Image from "next/image";
import { signIn } from "next-auth/react";
import { useEffect, useRef } from "react";
import GithubIcon from "public/github_icon.svg";
import GoogleIcon from "public/google_icon.svg";
import { Mail01Icon } from "hugeicons-react";
import { motion } from "framer-motion";
import Text from "~/components/typography/text";
import { cn } from "~/lib/utils";

interface ProvidersLoginProps {
  visible: boolean;
  onLayout: (height: number) => void;
  onEmail: () => void;
}

interface AuthOption {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export default function ProvidersLogin({
  visible,
  onLayout,
  onEmail,
}: ProvidersLoginProps) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!ref.current) return;
    const height = ref.current.getBoundingClientRect().height;
    onLayout(height);
  }, []);

  const providerOptions: AuthOption[] = [
    {
      title: "Continue with Google",
      onClick: () => void signIn("google"),
      icon: (
        <Image
          src={GoogleIcon as string}
          alt="google logo"
          className="size-6"
        />
      ),
    },
    {
      title: "Continue with Github",
      onClick: () => void signIn("github"),
      icon: <Image src={GithubIcon as string} alt="github logo" />,
    },
  ];

  const emailOption: AuthOption = {
    title: "Email",
    icon: <Mail01Icon size={18} />,
    onClick: onEmail,
  };

  return (
    <motion.div
      ref={ref}
      initial="visible"
      animate={visible ? "visible" : "hidden"}
      variants={{ visible: { translateX: 0 }, hidden: { translateX: -1000 } }}
    >
      <Text.Headline type="h2">{"Sign in"}</Text.Headline>
      <Text.Body subtle>
        {"Level up your career in just one simple step"}
      </Text.Body>
      <div className="mt-4 space-y-2">
        {providerOptions.map((option, index) => (
          <AuthOption key={index} option={option} />
        ))}
      </div>
      <div className="pointer-events-none cursor-not-allowed opacity-50">
        <div className="my-4 h-[1px] w-full bg-neutral-100" />
        <AuthOption option={emailOption} />
        <Text.Body className="mt-2 text-center text-[11px]">
          Email login coming soon
        </Text.Body>
      </div>
    </motion.div>
  );
}

interface AuthOptionProps {
  option: AuthOption;
  disabled?: boolean;
}

function AuthOption({ option, disabled }: AuthOptionProps) {
  const { title, icon, onClick } = option;
  return (
    <div
      onClick={onClick}
      className={cn(
        "flex h-12 cursor-pointer items-center space-x-2 rounded-lg border border-neutral-200 px-2 transition-shadow hover:bg-neutral-50 hover:shadow-sm",
        disabled && "cursor-not-allowed opacity-50",
      )}
    >
      <div className="flex w-10 justify-center">{icon}</div>
      <Text.Body>{title}</Text.Body>
    </div>
  );
}
