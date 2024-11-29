"use client";

import {
  LockPasswordIcon,
  Mail01Icon,
  MusicNote02Icon,
  PlusSignIcon,
  ViewIcon,
  ViewOffSlashIcon,
} from "hugeicons-react";
import Text from "../typography/text";
import IconContainer from "./icon-container";
import { Input } from "./input";
import { useEffect, useMemo, useState } from "react";
import { Button } from "./button";
import { cn } from "~/lib/utils";
import { Switch } from "./switch";
import { REGEX } from "~/constants/regex";
import useBreakpoint, { BREAKPOINTS } from "~/hooks/use-breakpoint";
import EmailChip from "./email-chip";
import Modal from "./modals/modal";
import Card from "./card";
import { api } from "~/trpc/react";
import { useModal } from "~/providers/modal-provider";

interface InputType {
  title: string;
  email: string;
  password: string;
}

export interface UpdateState {
  id: string;
  title: string;
  locked: boolean;
  isPublic: boolean;
}

export interface CreateState {
  title: string;
  emails: string[];
  password: string;
  locked: boolean;
  isPublic: boolean;
}

interface TrackInputContainerProps {
  onClick: (data: UpdateState | CreateState) => void;
  isLoading?: boolean;
  updateState?: UpdateState;
  file?: File;
  onFile?: () => void;
}

export default function TrackInputContainer({
  isLoading,
  onClick,
  updateState,
  file,
  onFile,
}: TrackInputContainerProps) {
  const [pwVisible, setPwVisible] = useState<boolean>(false);
  const [emails, setEmails] = useState<Set<string>>(new Set());
  const [isPublic, setIsPublic] = useState<boolean>(!!updateState?.isPublic);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [locked, setLocked] = useState<boolean>(!!updateState?.locked);
  const [input, setInput] = useState<InputType>({
    email: "",
    password: "",
    title: updateState?.title ?? file?.name ?? "",
  });

  const isSmall = useBreakpoint(BREAKPOINTS.sm);

  const update = !!updateState;

  const validEmail = useMemo(
    () => REGEX.email.test(input.email),
    [input.email],
  );

  const validUpdate = useMemo(() => {
    return true;
  }, []);

  const validInput = useMemo(() => {
    if (update) return validUpdate;
    const validTitle = input.title.trim().length > 1;
    const validPw = !locked || REGEX.roomPassword.test(input.password.trim());

    return validTitle && validPw && !!file;
  }, [file, locked, input, update, validUpdate]);

  useEffect(() => {
    if (!file) return;
    setInput((prev) => ({ ...prev, title: file.name }));
  }, [file]);

  const handleClick = () => {
    const { title, password } = input;

    if (update) {
      const { id } = updateState;
      return onClick({
        id,
        title,
        locked,
        password,
        isPublic,
      });
    }

    return onClick({
      title,
      emails: [...emails],
      password,
      locked,
      isPublic,
    });
  };

  const handleInputChange = (type: keyof InputType, value: string) => {
    setInput((prev) => {
      switch (type) {
        case "title":
          return { ...prev, title: value };
        case "password":
          return { ...prev, password: value };
        case "email":
          return { ...prev, email: value };
        default:
          return prev;
      }
    });
  };

  const addEmail = () => {
    setEmails((prev) => {
      const set = new Set(prev);
      set.add(input.email);
      return set;
    });
    handleInputChange("email", "");
  };

  const removeEmail = (email: string) => {
    setEmails((prev) => {
      const set = new Set(prev);
      set.delete(email);
      return set;
    });
    handleInputChange("email", "");
  };

  return (
    <div className="mt-4 md:min-w-[500px]">
      {/* Title Input */}
      <div className="space-y-1">
        <Text.Body className="mb-2 ml-1 text-xs" subtle>
          Title
        </Text.Body>
        <div className="flex h-12 space-x-2">
          {!isSmall && (
            <IconContainer icon={<MusicNote02Icon fill="black" size={16} />} />
          )}
          <Input
            placeholder="Baby Riddim"
            value={input.title}
            onChange={({ currentTarget: { value } }) =>
              handleInputChange("title", value)
            }
          />
          {!update && (
            <Button
              onClick={onFile}
              dense
              className="h-full"
              title="Replace file"
            />
          )}
        </div>
      </div>

      {/* Make public Container */}
      <div className="mb-2 mt-4 flex justify-between rounded-md border border-neutral-200 bg-neutral-50 px-3 py-[8.5px]">
        <div className="flex flex-col space-y-1">
          <Text.Body className="font-semibold">Make your work public</Text.Body>
          <Text.Body className="text-xs" subtle>
            That way you can get feedback from people all over the world
          </Text.Body>
        </div>
        <Switch
          className="opacity-100"
          checked={isPublic}
          onCheckedChange={setIsPublic}
        />
      </div>

      <div className="my-4 border-t border-neutral-200" />

      {/* Password Input */}
      {!update && !isPublic && (
        <div className={"space-y-1"}>
          <div className="mb-2 flex justify-between">
            <Text.Body className="ml-1 text-xs" subtle>
              Use Password (optional)
            </Text.Body>
            <Switch
              className="opacity-100"
              checked={locked}
              onCheckedChange={setLocked}
            />
          </div>

          <div
            className={cn(
              "relative flex h-12 space-x-2",
              !locked && "opacity-50",
            )}
          >
            {!isSmall && (
              <IconContainer icon={<LockPasswordIcon size={16} />} />
            )}
            <Input
              type={!showPassword ? "password" : "text"}
              disabled={!locked}
              value={input.password}
              onChange={({ currentTarget: { value } }) =>
                handleInputChange("password", value)
              }
            />
            {locked && input.password.length > 0 && (
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
          {locked && !REGEX.roomPassword.test(input.password.trim()) && (
            <Text.Body className="text-right text-[11px] text-red-500">
              Password must be at least 8 characters.
            </Text.Body>
          )}
        </div>
      )}

      {/* Update Password Input */}
      {update && !isPublic && (
        <div className={"space-y-1"}>
          <div className="mb-2 flex justify-between">
            <Text.Body className="ml-1 text-xs" subtle>
              Use Password (optional)
            </Text.Body>
            <Switch
              className="opacity-100"
              checked={locked}
              onCheckedChange={setLocked}
            />
          </div>

          {locked && (
            <div
              className={cn(
                "relative flex h-12 space-x-2",
                !locked && "opacity-50",
              )}
            >
              {!isSmall && (
                <IconContainer icon={<LockPasswordIcon size={16} />} />
              )}

              <div
                onClick={() => setPwVisible(true)}
                className={cn(
                  "flex min-h-9 w-full grow cursor-pointer items-center rounded-md border border-zinc-200 bg-transparent px-3 py-1 shadow-sm",
                )}
              >
                <Text.Body>
                  {updateState.locked ? "Change password" : "Set Password"}
                </Text.Body>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Email Input */}
      {!update && (
        <div className={"mt-4 space-y-1"}>
          <div className="mb-2 flex justify-between">
            <Text.Body className="ml-1 text-xs" subtle>
              Send out reminders (optional)
            </Text.Body>
          </div>
          <div className={"flex h-12 space-x-2"}>
            {!isSmall && <IconContainer icon={<Mail01Icon size={16} />} />}
            <Input
              placeholder="youremail@gmail.com"
              value={input.email}
              onChange={({ currentTarget: { value } }) =>
                handleInputChange("email", value)
              }
            />
            <Button
              disabled={!validEmail}
              onClick={addEmail}
              dense
              className="h-full"
              icon={<PlusSignIcon size={18} />}
            />
          </div>
        </div>
      )}

      {/* Email List */}
      <div className="mt-3 flex flex-wrap gap-1">
        {[...emails].map((email) => (
          <EmailChip
            key={email}
            email={email}
            onDelete={() => removeEmail(email)}
          />
        ))}
      </div>

      <Button
        onClick={handleClick}
        isLoading={isLoading}
        disabled={!validInput || isLoading}
        className="mt-8 h-12 w-full"
        title={update ? "Update" : "Create"}
      />

      {update && (
        <PasswordUpdateModal
          trackId={updateState.id}
          isVisible={pwVisible}
          onRequestClose={() => setPwVisible(false)}
        />
      )}
    </div>
  );
}

interface PasswordUpdateModalProps {
  isVisible: boolean;
  trackId: string;
  onRequestClose: () => void;
}

function PasswordUpdateModal({
  isVisible,
  trackId,
  onRequestClose,
}: PasswordUpdateModalProps) {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");
  const isSmall = useBreakpoint(BREAKPOINTS.sm);

  const { hide } = useModal();

  const { mutateAsync: updatePassword } =
    api.track.updatePassword.useMutation();
  const utils = api.useUtils();

  const handleUpdate = async () => {
    if (!REGEX.roomPassword.test(password)) return;

    setIsLoading(true);
    try {
      await updatePassword({ id: trackId, password });
      await utils.track.invalidate();
      hide();
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal isVisible={isVisible} onRequestClose={onRequestClose}>
      <Card
        title="Enter password"
        subtitle="Must be at least 8 characters long"
        className="md:min-w-[500px]"
      >
        <div className={cn("relative mt-4 flex h-12 space-x-2")}>
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
          onClick={handleUpdate}
          isLoading={isLoading}
          disabled={!REGEX.roomPassword.test(password)}
          className="mt-6 h-12 w-full"
          title={"Update"}
        />
      </Card>
    </Modal>
  );
}
