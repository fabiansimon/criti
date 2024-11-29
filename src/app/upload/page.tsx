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
import LoadingSpinner from "~/components/ui/loading-spinner";
import CommentTypeSelector from "~/components/ui/comment-type-selector";
import ThreadModal from "~/components/ui/modals/thread-modal";

const MAX_SIZE_MB = 50;
const MAX_FILE_SIZE = MAX_SIZE_MB * 1024 * 1024; // 200MB in bytes

const ACCEPTED_MIMES = [
  "audio/mpeg",
  "audio/wav",
  "audio/ogg",
  "audio/aac",
  "audio/flac",
  "audio/mp4",
];

interface FileError {
  title: string;
  description: string;
}

export default function UploadPage() {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [file, setFile] = useState<File | undefined>();

  const inputRef = useRef<HTMLInputElement | null>(null);

  const isMobile = useIsMobile();
  const { toast } = useToast();
  const { show, hide } = useModal();
  const router = useRouter();
  const { data: session } = useSession();

  const utils = api.useUtils();
  const { mutateAsync: uploadTrack, isPending } =
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

    setIsLoading(true);

    try {
      const { title, password, locked, emails, isPublic } = data;
      const { type: contentType } = file;
      const fileContent = await fileToBase64(file);

      const track = await uploadTrack({
        contentType,
        fileContent,
        title,
        password: locked && !isPublic ? password.trim() : undefined,
        emails,
        isPublic,
      });

      if (!track) return;
      router.push(route(ROUTES.listen, track.id));
      void utils.track.invalidate();
    } catch (_) {
      toast({
        title: "Something went wrong.",
        description: "Sorry please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
      hide();
    }
  };

  const triggerInput = () => {
    if (inputRef.current) inputRef.current.click();
  };

  const handleDragging = useCallback((e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const checkFile = (file: File) => {
    let error: FileError | undefined;

    if (!ACCEPTED_MIMES.includes(file.type)) {
      error = {
        title: "Unsupported File Format",
        description:
          "The uploaded file format is not supported. Please upload a valid audio file (e.g., MP3, WAV, or OGG).",
      };
    }

    if (file.size > MAX_FILE_SIZE) {
      error = {
        title: "File Too Large",
        description: `The uploaded file exceeds the maximum size of ${MAX_SIZE_MB}MB. Please upload a smaller audio file.`,
      };
    }

    if (error) {
      const { title, description } = error;
      toast({
        title,
        description,
        variant: "destructive",
      });
    }

    return !!!error;
  };

  const handleFileInput = (rawFile: File) => {
    if (!checkFile(rawFile)) {
      return;
    }

    setFile(rawFile);
  };

  return (
    <div
      onDragEnter={(e) => handleDragging(e)}
      onDragLeave={(e) => handleDragging(e)}
      onDragOver={(e) => handleDragging(e)}
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
          accept={ACCEPTED_MIMES.join(", ")}
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
            isLoading={isLoading || isPending}
            onClick={(data) => handleUpload(data as CreateState)}
          />
        )}

        {isLoading && <LoadingContainer />}
      </Card>
      {/* <LoadingModal isVisible={true} /> */}
    </div>
  );
}

function LoadingContainer() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = Math.random() * (150 - 50) + 50;

    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prev + 2;
      });
    }, interval);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="absolute bottom-0 left-0 right-0 top-0 flex flex-col items-center justify-center bg-white">
      <Text.Body className="font-semibold">
        Uploading your masterpiece
      </Text.Body>
      <Text.Body className="mb-3 mt-2" subtle>
        {`${progress}% - Almost there!`}
      </Text.Body>
      <LoadingSpinner className="size-8" />
    </div>
  );
}
