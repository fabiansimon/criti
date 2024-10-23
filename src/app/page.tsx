"use client";

import { useRouter } from "next/navigation";
import Text from "~/components/typography/text";
import { Button } from "~/components/ui/button";
import Card from "~/components/ui/card";
import { route, ROUTES } from "~/constants/routes";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-accent">
      <Card className="px-auto">
        <Text.Body>Get Started</Text.Body>
        <Button
          title="Get started"
          onClick={() => router.push(route(ROUTES.auth))}
        />
      </Card>
    </div>
  );
}
