"use client";

import { Mail01Icon, UserIcon } from "hugeicons-react";
import { useEffect, useMemo, useState } from "react";
import Text from "~/components/typography/text";
import { Button } from "~/components/ui/button";
import Card from "~/components/ui/card";
import IconContainer from "~/components/ui/icon-container";
import { Input } from "~/components/ui/input";
import { readableDate } from "~/lib/utils";
import { api } from "~/trpc/react";
import { motion } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useToast } from "~/hooks/use-toast";
import { useLoading } from "~/providers/loading-provider";

export default function AccountPage() {
  const [name, setName] = useState<string>("");

  const { mutateAsync: updateUser, isPending: updateLoading } =
    api.user.update.useMutation();
  const { mutateAsync: createBillingSession } =
    api.stripe.billing.useMutation();

  const { data: user, isLoading } = api.user.get.useQuery();
  const utils = api.useUtils();
  const { toast } = useToast();

  const router = useRouter();
  const { data } = useSession();
  const { loading } = useLoading();

  const activeChanges = useMemo(() => {
    return name.trim() !== user?.name && name.length > 2;
  }, [user?.name, name]);

  useEffect(() => {
    if (!user) return;
    setName(user.name ?? "");
  }, [user]);

  const handleBilling = async () => {
    loading(async () => {
      const billing = await createBillingSession();
      if (!billing?.url) {
        toast({
          title: "Something went wrong.",
          description:
            "Sorry you can't upgrade at the moment. Please try again later.",
          variant: "destructive",
        });
      }
      router.push(billing!.url);
    });
  };

  const handleUpdate = async () => {
    if (!data?.user) return;
    loading(async () => {
      await updateUser({ id: data.user.id, name: name.trim() });
      await utils.user.invalidate();
    });
  };

  return (
    <div className="flex min-h-screen w-full grow flex-col items-center justify-center bg-accent">
      <Card
        isLoading={isLoading}
        title="Your account"
        subtitle={`Member since ${readableDate(user?.createdAt ?? "")}`}
      >
        <div className="w-[400px]">
          <div className="mt-5 flex grow flex-col space-y-2">
            <div className="flex w-full overflow-x-hidden">
              <IconContainer icon={<UserIcon size={16} />} />
              <Input
                className="my-[1px] ml-2 mr-1 flex h-12 overflow-visible"
                placeholder="Your Name"
                value={name}
                onChange={({ currentTarget: { value } }) => setName(value)}
              />

              <motion.div
                initial="hidden"
                animate={activeChanges ? "visible" : "hidden"}
                variants={{
                  visible: {
                    width: 170,
                  },
                  hidden: {
                    width: 0,
                  },
                }}
                className="flex w-full grow"
              >
                <Button
                  isLoading={updateLoading}
                  onClick={handleUpdate}
                  className="ml-2 inline-block h-full w-[160px] flex-none"
                  title="Update"
                />
              </motion.div>
            </div>
            <div className="flex h-12 space-x-2">
              <IconContainer icon={<Mail01Icon size={16} />} />
              <Input disabled value={user?.email ?? ""} />
            </div>
          </div>
          <div className="my-4 h-[1px] w-full bg-neutral-100" />
          <Text.Headline type="h4">Your Membership</Text.Headline>
          <div
            onClick={handleBilling}
            className="mt-2 cursor-pointer space-y-1 rounded-lg border border-neutral-100 p-2 hover:bg-neutral-50"
          >
            <Text.Subtitle className="text-sm">Premium Annually</Text.Subtitle>
            <Text.Subtitle className="text-[11px] font-normal" subtle>
              Manage subscription and billing
            </Text.Subtitle>
          </div>
        </div>
      </Card>
    </div>
  );
}
