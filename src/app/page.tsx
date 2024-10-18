"use client";

import { signIn } from "next-auth/react";
import { Button } from "~/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-full w-full grow items-center justify-center">
      <Button title="Log in" onClick={() => signIn()} />
    </div>
  );
}
