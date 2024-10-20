"use client";

import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Text from "~/components/typography/text";
import Card from "~/components/ui/card";
import GithubIcon from "public/github_icon.svg";
import GoogleIcon from "public/google_icon.svg";
import { Mail01Icon } from "hugeicons-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { cn } from "~/lib/utils";
import { useRouter } from "next/navigation";
import { route, ROUTES } from "~/constants/routes";

interface AuthOption {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export default function AuthModal() {
  const [showForm, setShowForm] = useState<boolean>(false);
  const { status } = useSession();
  const router = useRouter();

  if (status === "authenticated") return router.push(route(ROUTES.home));

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
    onClick: () => console.log("email"),
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-accent">
      <Card className="relative min-w-[400px] overflow-visible">
        <motion.div
          initial="main"
          animate={showForm ? "form" : "main"}
          variants={{ main: { translateX: 0 }, form: { translateX: -1000 } }}
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
          <div className="my-4 h-[1px] w-full bg-neutral-100" />
          <AuthOption disabled option={emailOption} />
        </motion.div>
        {/* <motion.div
          initial="form"
          animate={showForm ? "form" : "main"}
          variants={{ main: { translateX: 1000 }, form: { translateX: 0 } }}
          className="absolute left-0 right-0 top-4 mx-5"
        >
          <Text.Headline type="h2">{"Sign in with email"}</Text.Headline>
          <Text.Body subtle>
            {"Level up your career in just one simple step"}
          </Text.Body>
          <div className="mt-4 space-y-2">
            <Input
              placeholder="Baby Riddim"
              value={input.title}
              onChange={({ currentTarget: { value } }) =>
                handleInputChange("title", value)
              }
            />
          </div>
          <div className="my-4 h-[1px] w-full bg-neutral-100" />
        </motion.div> */}
      </Card>
    </div>
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
