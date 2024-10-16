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
  const { show: showDialog, hide: hideDialog } = useDialog();
  const { show: showModal, hide: hideModal } = useModal();

  const utils = api.useUtils();

  const { mutateAsync: deleteTrack } = api.track.archive.useMutation({
    onError: () => setDeleted(false),
  });
  const { mutateAsync: updateTrack, isPending: isLoading } =
    api.track.update.useMutation({
      onError: () => setDeleted(false),
    });

  const handleUpdate = async (data: UpdateState) => {
    await updateTrack({ ...data });
    await utils.track.invalidate();
    hideModal();
  };

  const handleEdit = () => {
    showModal(
      <TrackInputContainer
        isLoading={isLoading}
        updateState={track}
        onClick={(data) => handleUpdate(data as UpdateState)}
      />,
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
            setDeleted(true);
            hideDialog();
            await deleteTrack({ id });
            void utils.track.invalidate();
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
      title: "Delete",
      onClick: () => void handleDelete(),
    },
    {
      title: "Edit",
      onClick: handleEdit,
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
        <div>
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
