import { useEffect, useMemo, useRef, useState } from "react";
import { motion } from "framer-motion";
import Text from "~/components/typography/text";
import { Input } from "../input";
import { ViewIcon, ViewOffSlashIcon } from "hugeicons-react";
import { signIn } from "next-auth/react";
import { Button } from "../button";
import { REGEX } from "~/constants/regex";

interface EmailLoginProps {
  visible: boolean;
  onLayout: (height: number) => void;
  onBack: () => void;
}

export default function EmailLogin({
  visible,
  onBack,
  onLayout,
}: EmailLoginProps) {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [showPassword, setShowPassword] = useState<boolean>(false);

  const ref = useRef<HTMLDivElement | null>(null);

  const validInput = useMemo(() => {
    return REGEX.email.test(email);
    // return REGEX.email.test(email) && REGEX.userPassword.test(password);
  }, [password, email]);

  useEffect(() => {
    if (!ref.current) return;
    const height = ref.current.getBoundingClientRect().height;
    onLayout(height);
  }, []);

  const handleLogin = async () => {
    await signIn("email", { email });
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={visible ? "visible" : "hidden"}
      variants={{ visible: { translateX: 0 }, hidden: { translateX: 1000 } }}
      className="absolute left-0 right-0 top-4 mx-5 flex flex-col"
    >
      <Text.Headline type="h2">{"Sign in with email"}</Text.Headline>
      <Text.Body subtle>
        {"Level up your career in just one simple step"}
      </Text.Body>
      <div className="mt-4 flex flex-col space-y-2">
        <Input
          type="email"
          className="h-12"
          placeholder="youremail@email.com"
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        />
        {/* <div className="relative h-12">
          <Input
            className="h-full"
            placeholder="*******"
            value={password}
            type={!showPassword ? "password" : "text"}
            onChange={(e) => setPassword(e.target.value)}
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
        </div> */}
      </div>
      <div className="my-4 h-[1px] w-full bg-neutral-100" />
      <Button
        className="min-h-12"
        title="Continue"
        onClick={handleLogin}
        disabled={!validInput}
      />
      <Button
        title="Go back"
        className="mt-2"
        onClick={onBack}
        variant={"link"}
      />
    </motion.div>
  );
}
