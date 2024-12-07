"use client";

import {
  Download04Icon,
  MoreVerticalCircle01Icon,
  PencilEdit01Icon,
  Share05Icon,
} from "hugeicons-react";
import { useSession } from "next-auth/react";
import { useParams } from "next/navigation";
import { useMemo, useRef, useState } from "react";
import Text from "~/components/typography/text";
import IconButton from "~/components/ui/animated-icon-button";
import AudioControls from "~/components/ui/audio/audio-controls";
import TimeSlider from "~/components/ui/audio/time-slider";
import VolumeControl from "~/components/ui/audio/volume-control";
import Card from "~/components/ui/card";
import { CommentsContainer } from "~/components/ui/comment/comments-container";
import Dropdown, { type MenuOption } from "~/components/ui/dropdown-menu";
import { ExpirationChip } from "~/components/ui/info-chips";
import EditTrackModal from "~/components/ui/modals/edit-track-modal";
import PasswordModal from "~/components/ui/modals/password-modal";
import ShareModal from "~/components/ui/modals/share-modal";
import useBreakpoint, { BREAKPOINTS } from "~/hooks/use-breakpoint";
import useDownload from "~/hooks/use-download";
import { LocalStorage } from "~/lib/localStorage";
import { cn, pluralize } from "~/lib/utils";
import { useModal } from "~/providers/modal-provider";

import { api } from "~/trpc/react";

export default function ListenPage() {
  const [time, setTime] = useState<number>(0);
  const [play, setPlay] = useState<boolean>(false);
  const [password, setPassword] = useState<string>("");

  const isSmall = useBreakpoint(BREAKPOINTS.sm);

  const { id } = useParams<{ id: string }>();
  const { isLoading: downloadLoading, download } = useDownload();
  const { show: showModal, hide: hideModal } = useModal();

  const { data } = useSession();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const sessionId = LocalStorage.fetchSessionId() ?? "";

  const { data: isLocked, isLoading: lockedLoading } =
    api.track.isLocked.useQuery({
      id,
      sessionId,
      password,
    });

  const { data: track, isLoading } = api.track.getById.useQuery(
    { id, sessionId },
    { enabled: isLocked === false },
  );

  const isAdmin = data?.user.id === track?.creatorId;

  const menuOptions: MenuOption[] = [
    {
      title: "Edit",
      onClick: () => void handleEdit(),
      disabled: !isAdmin,
    },
    {
      title: "Download",
      onClick: () => void handleDownload(),
    },
    {
      title: "Share",
      onClick: () => void handleShare(),
    },
  ];

  const subtitle = useMemo(() => {
    return pluralize(track?.streams ?? 0, "stream");
  }, [track]);

  const handleDownload = () => {
    void download({
      url: track?.file.url ?? "",
      name: track?.title ?? "",
    });
  };

  const handleShare = () => {
    if (!track) return;
    showModal(<ShareModal trackId={track.id} />);
  };

  const handleEdit = () => {
    if (!track) return;
    showModal(
      <EditTrackModal
        track={{ ...track, openComments: false }}
        onFinish={hideModal}
      />,
    );
  };

  const handleVolume = (volume: number) => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
  };

  const triggerPlay = (state?: boolean) => {
    if (!audioRef.current) return;
    setPlay((prev) => {
      const status = state ?? !prev;
      if (status) void audioRef.current!.play();
      else void audioRef.current!.pause();
      return status;
    });
  };

  const handleTimeUpdate = (time: number) => {
    if (!audioRef.current) return;
    triggerPlay(true);
    audioRef.current.currentTime = time;
  };

  const duration = audioRef.current?.duration ?? 0;

  if (!lockedLoading && isLocked)
    return (
      <PasswordModal
        isVisible
        onInput={setPassword}
        isLoading={!!password && lockedLoading}
      />
    );

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-accent">
      <Card
        isLoading={isLoading || lockedLoading}
        title={track?.title}
        subtitle={subtitle}
        className={cn("relative w-full max-w-screen-lg")}
        trailing={
          <div className="flex flex-col items-end justify-between">
            <div className="flex">
              {track?.expiresIn && <ExpirationChip hours={track.expiresIn} />}
            </div>
          </div>
        }
      >
        {/* Comments Container */}
        <CommentsContainer
          maxTime={duration ?? Infinity}
          isAdmin={isAdmin}
          onTimestamp={handleTimeUpdate}
          time={time}
          trackId={id}
          className="mt-6"
        />

        {/* Audio Controls */}
        <div
          className={cn(
            "fixed bottom-0 left-0 right-0 flex min-h-[120px] flex-col rounded-tl-lg rounded-tr-lg border-t border-t-neutral-200 bg-white px-4 pb-6 shadow-upward",
          )}
        >
          <div
            className={cn(
              "relative my-6 flex w-full grow items-center justify-between",
            )}
          >
            {isSmall && (
              <Dropdown options={menuOptions}>
                <div className="flex h-10 w-10 cursor-pointer items-center justify-center overflow-hidden rounded-md bg-accent hover:bg-accent/80">
                  <MoreVerticalCircle01Icon size={18} fill="black" />
                </div>
              </Dropdown>
            )}

            {!isSmall && (
              <div className="z-10 flex space-x-2">
                {isAdmin && (
                  <IconButton
                    icon={<PencilEdit01Icon size={17} />}
                    text="Edit"
                    onClick={handleEdit}
                  />
                )}
                <IconButton
                  icon={<Download04Icon size={18} />}
                  text="Download"
                  isLoading={downloadLoading}
                  onClick={handleDownload}
                />
                <IconButton
                  icon={<Share05Icon size={16} />}
                  text="Share"
                  onClick={handleShare}
                />
              </div>
            )}

            <div
              className={
                "absolute left-0 right-0 mx-[30%] flex items-center justify-center"
              }
            >
              <AudioControls
                isPlaying={play}
                onPlay={() => triggerPlay()}
                onBackward={() =>
                  handleTimeUpdate(Math.min(duration, time - 15))
                }
                onForward={() => handleTimeUpdate(Math.max(0, time + 15))}
              />
            </div>

            {!isSmall && <VolumeControl onChange={handleVolume} />}
          </div>

          {/* Time Slider */}
          <TimeSlider curr={time} max={duration} onChange={handleTimeUpdate} />
        </div>

        {/* Hidden Audio Element */}
        <audio
          onEnded={() => setPlay(false)}
          onTimeUpdate={() => setTime(audioRef.current?.currentTime ?? 0)}
          src={track?.file.url}
          ref={audioRef}
          hidden
        />
      </Card>
    </div>
  );
}
