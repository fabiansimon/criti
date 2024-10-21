"use client";

import Card from "~/components/ui/card";
import IconContainer from "~/components/ui/icon-container";

import Text from "~/components/typography/text";
import { Button } from "~/components/ui/button";
import {
  type DragEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { fileToBase64 } from "~/lib/utils";
import { useToast } from "~/hooks/use-toast";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { route, ROUTES } from "~/constants/routes";
import TrackInputContainer, {
  type CreateState,
} from "~/components/ui/track-input-container";
import { MusicNote02Icon } from "hugeicons-react";
import { useSession } from "next-auth/react";
import { useModal } from "~/providers/modal-provider";
import MembershipModal from "~/components/ui/modals/membership-modal";
import useIsMobile from "~/hooks/use-is-mobile";

export default function UploadPage() {
  const [file, setFile] = useState<File | undefined>();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { show } = useModal();
  const router = useRouter();
  const { data: session } = useSession();

  const utils = api.useUtils();
  const { mutateAsync: uploadTrack, isPending: isLoading } =
    api.track.upload.useMutation();
  const { data: allowUpload } = api.track.checkLimit.useQuery(undefined, {
    enabled: !!file,
  });

  const handleUpload = async (data: CreateState) => {
    if (!session?.user.membership || !file) return;
    if (!allowUpload?.allowed) {
      show(<MembershipModal />);
      return;
    }

    const { title, password, locked, emails } = data;
    const { type: contentType } = file;
    const fileContent = await fileToBase64(file);

    const track = await uploadTrack({
      contentType,
      fileContent,
      title,
      locked,
      password: locked ? password.trim() : undefined,
      emails,
    });

    if (!track) return;
    void utils.track.invalidate();
    router.push(route(ROUTES.listen, track.id));
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
              {!isMobile && (
                <Text.Body className="text-xs" subtle>
                  Or drag it in here
                </Text.Body>
              )}
            </div>
          </div>
        )}
        {file && (
          <TrackInputContainer
            file={file}
            onFile={triggerInput}
            isLoading={isLoading}
            onClick={(data) => handleUpload(data as CreateState)}
          />
        )}
      </Card>
    </div>
  );
}
