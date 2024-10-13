"use client";

import Card from "~/components/ui/card";
import IconContainer from "~/components/ui/icon-container";

import {
  Cancel01Icon,
  LockPasswordIcon,
  Mail01Icon,
  MusicNote02Icon,
  PlusSignIcon,
  ViewIcon,
  ViewOffSlashIcon,
} from "hugeicons-react";
import Text from "~/components/typography/Text";
import { Button } from "~/components/ui/button";
import {
  type DragEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Input } from "~/components/ui/input";
import { Switch } from "~/components/ui/switch";
import { cn, fileToBase64 } from "~/lib/utils";
import { REGEX } from "~/constants/regex";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";

interface Input {
  title: string;
  email: string;
  password: string;
}

export default function UploadPage() {
  const [file, setFile] = useState<File | undefined>();
  const [emails, setEmails] = useState<Set<string>>(new Set());
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [locked, setLocked] = useState<boolean>(false);
  const [input, setInput] = useState<Input>({
    email: "",
    password: "",
    title: "",
  });
  const inputRef = useRef<HTMLInputElement | null>(null);

  const { toast } = useToast();

  const { mutateAsync: uploadTrack, isPending: isLoading } =
    api.track.uploadTrack.useMutation();

  const validEmail = useMemo(
    () => REGEX.email.test(input.email),
    [input.email],
  );

  const validInput = useMemo(() => {
    return file && input.title;
  }, [file, input.title]);

  useEffect(() => {
    if (!file) return;
    handleInputChange("title", file.name);
  }, [file]);

  const handleUpload = async () => {
    if (!file) return;

    const { title, password } = input;
    const { type: contentType } = file;
    const fileContent = await fileToBase64(file);

    await uploadTrack({
      contentType,
      fileContent,
      title,
      locked,
      password: locked ? password : undefined,
      emails: [...emails],
    });
  };

  const handleInputChange = (type: keyof Input, value: string) => {
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

  const triggerInput = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleDragging = useCallback(
    (e: DragEvent<HTMLDivElement>, status: boolean) => {
      console.log("STATUS===", status);
      e.preventDefault();
      e.stopPropagation();
    },
    [],
  );

  const handleFileInput = (rawFile: File) => {
    if (!rawFile?.type.includes("audio")) {
      toast({
        title: "Wrong format.",
        description: "This service is only made for audio files.",
        variant: "destructive",
      });
      return;
    }

    setFile(rawFile);
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
    <div
      onDragEnter={(e) => handleDragging(e, true)}
      onDragLeave={(e) => handleDragging(e, false)}
      onDragOver={(e) => handleDragging(e, true)}
      onDrop={(e) => handleFileInput(e.dataTransfer.files[0]!)}
      className="flex min-h-screen flex-col items-center justify-center bg-accent"
    >
      <Card
        title="Upload new track"
        subtitle="Sharing is caring"
        className="w-full max-w-screen-sm"
      >
        <input
          onChange={(e) => {
            const files = e.target.files;
            if (!files || files.length === 0) return;
            handleFileInput(files[0]!);
          }}
          ref={inputRef}
          type="file"
          id="fileInput"
          style={{ display: "none" }}
        />

        {/* Upload File Container */}
        {!file && (
          <div className="my-32 flex flex-col items-center">
            <IconContainer
              className="size-14"
              icon={<MusicNote02Icon fill="black" size={24} />}
            />
            <div className="mt-5 space-y-2 text-center">
              <Button title="Select File" onClick={triggerInput} />
              <Text.Body className="text-xs" subtle>
                Or drag it in here
              </Text.Body>
            </div>
          </div>
        )}
        {file && (
          <div className="mt-4">
            {/* Title Input */}
            <div className="space-y-1">
              <Text.Body className="mb-2 ml-1 text-xs" subtle>
                Title
              </Text.Body>
              <div className="flex h-12 space-x-2">
                <IconContainer
                  icon={<MusicNote02Icon fill="black" size={16} />}
                />
                <Input
                  placeholder="Baby Riddim"
                  value={input.title}
                  onChange={({ currentTarget: { value } }) =>
                    handleInputChange("title", value)
                  }
                />
                <Button
                  onClick={triggerInput}
                  dense
                  className="h-full"
                  title="Replace file"
                />
              </div>
            </div>
            <div className="my-4 border-t border-neutral-200" />

            {/* Password Input */}
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
                <IconContainer icon={<LockPasswordIcon size={16} />} />
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
            </div>

            {/* Email Input */}
            <div className={"mt-4 space-y-1"}>
              <div className="mb-2 flex justify-between">
                <Text.Body className="ml-1 text-xs" subtle>
                  Send out reminders (optional)
                </Text.Body>
              </div>
              <div className={"flex h-12 space-x-2"}>
                <IconContainer icon={<Mail01Icon size={16} />} />
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
              onClick={handleUpload}
              disabled={!validInput || isLoading}
              className="mt-8 h-12 w-full"
              title="Upload"
            />
          </div>
        )}
      </Card>
    </div>
  );
}

interface EmailChipProps {
  email: string;
  onDelete: () => void;
}

function EmailChip({ email, onDelete }: EmailChipProps) {
  return (
    <div
      onClick={onDelete}
      className="flex h-7 cursor-pointer items-center justify-center space-x-2 rounded-full bg-neutral-900 pl-3 pr-2"
    >
      <Text.Subtitle className="font-light text-white">{email}</Text.Subtitle>
      <div className="rounded-full bg-white p-[1.5px]">
        <Cancel01Icon className="text-neutral-900" size={12} />
      </div>
    </div>
  );
}
