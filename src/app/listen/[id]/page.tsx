"use client";

import { Download04Icon, Share05Icon } from "hugeicons-react";
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
import { Switch } from "~/components/ui/switch";
import useDownload from "~/hooks/use-download";
import { useToast } from "~/hooks/use-toast";
import { LocalStorage } from "~/lib/localStorage";
import { copyToClipboard, generateShareableLink, pluralize } from "~/lib/utils";

import { api } from "~/trpc/react";

export default function ListenPage() {
  const [markComments, setMarkComments] = useState<boolean>(false);
  const [time, setTime] = useState<number>(0);
  const [play, setPlay] = useState<boolean>(false);

  const { id } = useParams<{ id: string }>();
  const { isLoading: downloadLoading, download } = useDownload();
  const { toast } = useToast();

  const { data } = useSession();
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { data: track, isLoading } = api.track.getById.useQuery(
    { id },
    { enabled: !!id },
  );

  const isAdmin = data?.user.id === track?.creatorId;

  const subtitle = useMemo(() => {
    if (isAdmin) {
      return `${pluralize(track?.comments.length ?? 0, "comment")}`;
    }
    return `Shared by ${track?.creator.name}`;
  }, [isAdmin, track]);

  const handleShare = () => {
    const url = generateShareableLink(id);
    console.log(url);
    copyToClipboard(url);
    toast({
      title: "Link copied",
      description: "Share the link with your friends.",
    });
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

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-accent">
      <Card
        isLoading={isLoading}
        title={track?.title}
        subtitle={subtitle}
        className="relative w-full max-w-screen-lg"
      >
        {/* Toggle for marking comments */}
        {isAdmin && (
          <div className="absolute right-6 top-14 flex space-x-2">
            <Text.Body className="text-xs">Mark comments</Text.Body>
            <Switch checked={markComments} onCheckedChange={setMarkComments} />
          </div>
        )}

        {/* Comments Container */}
        <CommentsContainer
          isAdmin={isAdmin}
          markComments={markComments}
          onTimestamp={handleTimeUpdate}
          time={time}
          trackId={id}
          comments={track?.comments ?? []}
          className="mt-4"
        />

        {/* Audio Controls */}
        <div className="relative my-6 flex w-full grow items-center justify-between">
          <div className="flex space-x-2">
            <IconButton
              className="z-10"
              icon={<Download04Icon size={18} />}
              text="Download"
              isLoading={downloadLoading}
              onClick={() =>
                download({
                  url: track?.file.url ?? "",
                  name: track?.title ?? "",
                })
              }
            />
            <IconButton
              className="z-10"
              icon={<Share05Icon size={16} />}
              text="Share"
              onClick={handleShare}
            />
          </div>

          <div className="absolute left-0 right-0 mx-[30%] flex items-center justify-center">
            <AudioControls
              isPlaying={play}
              onPlay={() => triggerPlay()}
              onBackward={() => handleTimeUpdate(Math.min(duration, time - 15))}
              onForward={() => handleTimeUpdate(Math.max(0, time + 15))}
            />
          </div>

          <VolumeControl onChange={handleVolume} />
        </div>

        {/* Time Slider */}
        <TimeSlider curr={time} max={duration} onChange={handleTimeUpdate} />

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
