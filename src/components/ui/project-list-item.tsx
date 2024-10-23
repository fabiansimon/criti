import { useToast } from "~/hooks/use-toast";
import {
  copyToClipboard,
  generateShareableLink,
  getDateDifference,
} from "~/lib/utils";
import { type SimplfiedTrack } from "~/server/api/routers/track/trackTypes";
import Dropdown, { type MenuOption } from "./dropdown-menu";
import IconContainer from "./icon-container";
import {
  Key02Icon,
  MoreVerticalCircle01Icon,
  MusicNote02Icon,
} from "hugeicons-react";
import Text from "../typography/text";
import { api } from "~/trpc/react";
import { useState } from "react";
import { useDialog } from "~/providers/dialog-provider";
import { useModal } from "~/providers/modal-provider";
import TrackInputContainer, { type UpdateState } from "./track-input-container";
import Card from "./card";
import { useLoading } from "~/providers/loading-provider";

interface ProjectListItemProps {
  track: SimplfiedTrack;
  onClick: () => void;
}

export default function ProjectListItem({
  track,
  onClick,
}: ProjectListItemProps) {
  const [deleted, setDeleted] = useState<boolean>(false);
  const { createdAt, locked, title, openComments, id } = track;

  const { toast } = useToast();
  const { start, stop } = useLoading();
  const { show: showDialog, hide: hideDialog } = useDialog();
  const { show: showModal, hide: hideModal } = useModal();

  const utils = api.useUtils();

  const { mutateAsync: deleteTrack } = api.track.archive.useMutation({
    onError: () => setDeleted(false),
  });
  const { mutateAsync: updateTrack } = api.track.update.useMutation();

  const handleUpdate = async (updates: UpdateState) => {
    start();
    hideModal();
    await updateTrack({ ...updates, id: track.id });
    await utils.track.invalidate();
    stop();
  };

  const handleEdit = () => {
    showModal(
      <Card
        title="Update Track"
        subtitle="Sharing is caring"
        className="w-full max-w-screen-sm"
      >
        <TrackInputContainer
          updateState={{ ...track, password: "" }}
          onClick={(data) => handleUpdate(data as UpdateState)}
        />
      </Card>,
    );
  };

  const handleShare = () => {
    const url = generateShareableLink(id);
    copyToClipboard(url);
    toast({
      title: "Link copied",
      description: "Share the link with your friends.",
    });
  };

  const handleDelete = async () => {
    showDialog({
      title: "Delete Track",
      subtitle: "This action cannot be undone. Are you sure?",
      actions: [
        {
          title: "Cancel",
          onClick: hideDialog,
        },
        {
          title: "Delete",
          destructive: true,
          onClick: async () => {
            start();
            setDeleted(true);
            hideDialog();
            await deleteTrack({ id });
            await utils.track.invalidate();
            stop();
          },
        },
      ],
    });
  };

  const menuOptions: MenuOption[] = [
    {
      title: "Share",
      onClick: handleShare,
    },
    {
      title: "Edit",
      onClick: handleEdit,
    },
    {
      title: "Delete",
      destructive: true,
      onClick: () => void handleDelete(),
    },
  ];

  if (deleted) return;

  return (
    <div
      onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-between rounded-md p-2 hover:bg-neutral-50"
    >
      <div className="flex space-x-3">
        <IconContainer icon={<MusicNote02Icon fill="black" size={16} />} />
        <div className="flex flex-col justify-center space-y-1">
          <div className="flex items-center space-x-2">
            {locked && (
              <Key02Icon size={18} className="-mr-1 text-white" fill="" />
            )}
            <Text.Body>{title}</Text.Body>
            {openComments && (
              <div className="mt-1 flex h-6 items-center rounded-full bg-green-300/30 px-2">
                <Text.Subtitle className="text-[10px] font-normal text-green-700">
                  open comments
                </Text.Subtitle>
              </div>
            )}
          </div>
          <Text.Subtitle className="font-normal" subtle>
            {getDateDifference(createdAt.toString()).text}
          </Text.Subtitle>
        </div>
      </div>
      <Dropdown className="mr-4" options={menuOptions}>
        <MoreVerticalCircle01Icon fill="black" size={18} />
      </Dropdown>
    </div>
  );
}
