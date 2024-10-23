import { useModal } from "~/providers/modal-provider";
import Card from "../card";
import TrackInputContainer, {
  type UpdateState,
} from "../track-input-container";
import { api } from "~/trpc/react";
import { useLoading } from "~/providers/loading-provider";
import { Track } from "@prisma/client";
import { SimplfiedTrack } from "~/server/api/routers/track/trackTypes";

interface EditTrackModalProps {
  track: Track | SimplfiedTrack;
  onFinish: () => void;
}
export default function EditTrackModal({
  track,
  onFinish,
}: EditTrackModalProps) {
  const { mutateAsync: updateTrack, isPending } =
    api.track.update.useMutation();

  const utils = api.useUtils();

  const { loading } = useLoading();

  const handleUpdate = async (updates: UpdateState) => {
    loading(async () => {
      await updateTrack({ ...updates, id: track.id });
      await utils.track.invalidate();
      onFinish();
    });
  };

  return (
    <Card
      title="Update Track"
      subtitle="Sharing is caring"
      className="w-full max-w-screen-sm"
    >
      <TrackInputContainer
        isLoading={isPending}
        updateState={{ ...track, password: "" }}
        onClick={(data) => handleUpdate(data as UpdateState)}
      />
    </Card>
  );
}
