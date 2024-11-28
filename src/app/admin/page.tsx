"use client";

import { signOut, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import { Button } from "~/components/ui/button";
import Card from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { WHITELISTED_EMAILS } from "~/constants/dev";
import { LocalStorage } from "~/lib/localStorage";
import { useDialog } from "~/providers/dialog-provider";
import { api } from "~/trpc/react";

export default function AdminPage() {
  const { mutateAsync: resetDB } = api.dashboard.resetDB.useMutation();

  const { data, status } = useSession();
  const router = useRouter();
  const { show } = useDialog();

  useEffect(() => {
    if (
      status !== "loading" &&
      !WHITELISTED_EMAILS.includes(data?.user?.email ?? "")
    ) {
      router.push("/");
    }
  }, [data, router, status]);

  if (!data) return;

  const handleReset = async () => {
    await resetDB({ includeProd: false });
    await signOut();
    router.push("/");
    LocalStorage.clean();
  };

  const options: Array<{
    title: string;
    action: () => Promise<void>;
  }> = [
    {
      title: "Reset DB",
      action: async () => handleReset(),
    },
  ];

  const confirmAction = ({
    title,
    action,
  }: {
    title: string;
    action: () => Promise<void>;
  }) => {
    show({
      title: "Are you sure?",
      subtitle: "Enter the exact title of the action to confirm",
      render: <ConfirmationField title={title} action={action} />,
    });
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-accent">
      <Card className="min-w-[500px]">
        {options.map(({ title, action }, index) => (
          <Button
            className="w-full"
            variant={"outline"}
            key={index}
            title={title}
            onClick={() => confirmAction({ title, action })}
          />
        ))}
      </Card>
    </div>
  );
}

interface ConfirmationFieldProps {
  title: string;
  action: () => Promise<void>;
}

function ConfirmationField({ title, action }: ConfirmationFieldProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [input, setInput] = useState<string>("");

  const { hide } = useDialog();
  const validInput = useMemo(() => input === title, [input, title]);

  const handleAction = async () => {
    if (!validInput) return;
    setIsLoading(true);
    try {
      await action();
      hide();
    } catch (_) {
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex space-x-1">
      <Input
        placeholder={title}
        value={input}
        onChange={(e) => setInput(e.target.value)}
      />
      <Button
        isLoading={isLoading}
        disabled={!validInput}
        onClick={handleAction}
        title={title}
      />
    </div>
  );
}
