"use client";

import { Download04Icon } from "hugeicons-react";
import { useParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import Text from "~/components/typography/text";
import IconButton from "~/components/ui/animated-icon-button";
import AudioControls from "~/components/ui/audio/audio-controls";
import TimeSlider from "~/components/ui/audio/time-slider";
import VolumeControl from "~/components/ui/audio/volume-control";
import Card from "~/components/ui/card";
import { CommentsContainer } from "~/components/ui/comment/comments-container";
import { Switch } from "~/components/ui/switch";

import { api } from "~/trpc/react";

interface AudioSettings {
  looping: boolean;
  shuffle: boolean;
}

export default function ListenPage() {
  const [liveComments, setLiveComments] = useState<boolean>(false);
  const [volume, setVolume] = useState<number>(100);
  const [time, setTime] = useState<number>(0);
  const [settings, setSettings] = useState<AudioSettings>({
    looping: false,
    shuffle: false,
  });

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { id } = useParams<{ id: string }>();

  const { data: track, isLoading } = api.track.getById.useQuery(
    { id },
    { enabled: !!id },
  );

  const trackMax = audioRef?.current?.duration ?? 0;

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
  }, [volume]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = time;
  }, [time]);

  const triggerPlay = (play: boolean) => {
    if (!audioRef.current) return;
    if (play) {
      audioRef.current.play();
    } else {
      audioRef.current.pause();
    }
  };

  console.log("hello");

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-accent">
      <Card
        isLoading={isLoading}
        title={track?.title}
        subtitle={"Shared by Fabian Simon"}
        className="relative w-full max-w-screen-lg"
      >
        <div className="absolute right-6 top-14 flex space-x-2">
          <Text.Body className="text-xs">Live Comments</Text.Body>
          <Switch
            className="opacity-100"
            checked={liveComments}
            onCheckedChange={setLiveComments}
          />
        </div>

        {/* Comments Container */}
        <CommentsContainer
          trackId={id}
          comments={track?.comments ?? []}
          className="mt-2"
        />

        {/* Audio Controls */}
        <div className="relative my-6 flex w-full grow items-center justify-between">
          <IconButton
            className="z-10"
            icon={<Download04Icon />}
            text="Download"
            onClick={() => console.log("Hello")}
          />

          <div className="absolute left-0 right-0 mx-[30%] flex items-center justify-center">
            <AudioControls
              onLoop={(status) =>
                setSettings((prev) => ({ ...prev, looping: status }))
              }
              onRewind={() => setTime(0)}
              onPlay={triggerPlay}
              onForward={() => setTime(trackMax)}
              onShuffle={(status) =>
                setSettings((prev) => ({ ...prev, shuffle: status }))
              }
            />
          </div>

          <VolumeControl onChange={setVolume} />
        </div>

        {/* Time Slider */}
        <TimeSlider curr={time} max={trackMax} onChange={setTime} />

        {/* Hidden Audio Element */}
        <audio
          ref={audioRef}
          src={track?.file.url}
          // onTimeUpdate={() => setTime(audioRef?.current?.currentTime ?? 0)}
          hidden
        />
      </Card>
    </div>
  );
}
