"use client";

import { signIn } from "next-auth/react";
import Image from "next/image";
import Text from "~/components/typography/text";
import Card from "~/components/ui/card";
import GithubIcon from "public/github_icon.svg";
import GoogleIcon from "public/google_icon.svg";
import { Mail01Icon } from "hugeicons-react";

interface AuthOption {
  title: string;
  icon: React.ReactNode;
  onClick: () => void;
}

export default function AuthModal() {
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
      onClick: () => void signIn("google"),
      icon: <Image src={GithubIcon as string} alt="github logo" />,
    },
  ];

  const emailOption: AuthOption = {
    title: "Email",
    icon: <Mail01Icon size={18} />,
    onClick: () => void signIn("email"),
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-accent">
      <Card
        title="Sign in"
        subtitle="Level up your career in just one simple step"
        className="min-w-[400px]"
      >
        <div className="my-4 flex flex-col space-y-2">
          {providerOptions.map((option, index) => (
            <AuthOption key={index} option={option} />
          ))}
        </div>
        <div className="my-4 h-[1px] w-full bg-neutral-100" />
        <AuthOption option={emailOption} />
      </Card>
    </div>
  );
}

interface AuthOptionProps {
  option: AuthOption;
}

function AuthOption({ option }: AuthOptionProps) {
  const { title, icon, onClick } = option;
  return (
    <div
      onClick={onClick}
      className="flex h-12 cursor-pointer items-center space-x-2 rounded-lg border border-neutral-200 px-2 transition-shadow hover:bg-neutral-50 hover:shadow-sm"
    >
      <div className="flex w-10 justify-center">{icon}</div>
      <Text.Body>{title}</Text.Body>
    </div>
  );
}
