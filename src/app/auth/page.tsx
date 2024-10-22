"use client";

import { useSession } from "next-auth/react";
import Card from "~/components/ui/card";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { route, ROUTES } from "~/constants/routes";
import EmailLogin from "~/components/ui/auth/email-login";
import ProvidersLogin from "~/components/ui/auth/providers-login";

export default function AuthModal() {
  const [stepIndex, setStepIndex] = useState<number>(0);
  const [heights, setHeights] = useState<number[]>(new Array(2));
  const { status } = useSession();
  const router = useRouter();

  const height = useMemo(() => heights[stepIndex]! + 30, [heights, stepIndex]); // add 30 for padding

  const addHeight = (height: number, index: number) => {
    setHeights((prev) => {
      const old = [...prev];
      old[index] = height;
      return old;
    });
  };

  if (status === "authenticated") return router.push(route(ROUTES.home));

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-accent">
      <motion.div animate={{ height }}>
        <Card className="relative h-full min-w-[400px] overflow-hidden">
          <ProvidersLogin
            visible={stepIndex === 0}
            onLayout={(height) => addHeight(height, 0)}
            onEmail={() => setStepIndex(1)}
          />
          <EmailLogin
            visible={stepIndex === 1}
            onLayout={(height) => addHeight(height, 1)}
            onBack={() => setStepIndex(0)}
          />
        </Card>
      </motion.div>
    </div>
  );
}
