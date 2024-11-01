import Card from "../card";
import Modal from "./modal";
import useBreakpoint, { BREAKPOINTS } from "~/hooks/use-breakpoint";
import IconContainer from "../icon-container";
import { LockPasswordIcon, ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import { Input } from "../input";
import { useMemo, useState } from "react";
import { Button } from "../button";
import { useRouter } from "next/navigation";
import { REGEX } from "~/constants/regex";

interface PasswordModalProps {
  isVisible: boolean;
  isLoading: boolean;
  onInput: (value: string) => void;
}

export default function PasswordModal({
  isVisible,
  isLoading,
  onInput,
}: PasswordModalProps) {
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const router = useRouter();
  const isSmall = useBreakpoint(BREAKPOINTS.sm);

  const validInput = useMemo(() => {
    return REGEX.roomPassword.test(password.trim());
  }, [password]);

  const handleCancel = () => {
    router.back();
  };

  return (
    <Modal isVisible={isVisible}>
      <Card
        title="This track is locked"
        subtitle="Please enter your given password. If you don't have one contact the creator for one"
      >
        <div className={"relative mt-8 flex h-12 space-x-2"}>
          {!isSmall && <IconContainer icon={<LockPasswordIcon size={16} />} />}
          <Input
            type={!showPassword ? "password" : "text"}
            value={password}
            onChange={({ currentTarget: { value } }) => setPassword(value)}
          />
          {password.length > 0 && (
            <div
              className="absolute right-4 top-[14px] cursor-pointer text-black"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? (
                <ViewIcon size={18} />
              ) : (
                <ViewOffSlashIcon size={18} />
              )}
            </div>
          )}
        </div>
        <Button
          onClick={() => onInput(password.trim())}
          isLoading={isLoading}
          disabled={!validInput || isLoading}
          className="mt-4 h-12 w-full"
          title={"Access"}
        />
        <Button
          onClick={handleCancel}
          className="mx-auto mt-2 flex"
          variant={"link"}
          title={"Go back"}
        />
      </Card>
    </Modal>
  );
}
