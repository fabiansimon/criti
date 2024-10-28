import { cn, getDateDifference } from "~/lib/utils";
import { type SimplfiedTrack } from "~/server/api/routers/track/trackTypes";
import Dropdown, { type MenuOption } from "./dropdown-menu";
import IconContainer from "./icon-container";
import {
  Comment01Icon,
  Key02Icon,
  MoreVerticalCircle01Icon,
  MusicNote02Icon,
} from "hugeicons-react";
import Text from "../typography/text";
import { api } from "~/trpc/react";
import { useMemo, useState } from "react";
import { useDialog } from "~/providers/dialog-provider";
import { useLoading } from "~/providers/loading-provider";
import EditTrackModal from "./modals/edit-track-modal";
import { useModal } from "~/providers/modal-provider";
import ShareModal from "./modals/share-modal";
import useBreakpoint, { BREAKPOINTS } from "~/hooks/use-breakpoint";
import { ExpirationChip, InfoChip } from "./info-chips";

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

  const { loading } = useLoading();
  const { show: showDialog, hide: hideDialog } = useDialog();
  const { show: showModal, hide: hideModal } = useModal();

  const utils = api.useUtils();
  const { mutateAsync: deleteTrack } = api.track.archive.useMutation({
    onError: () => setDeleted(false),
  });

  const handleEdit = () => {
    showModal(<EditTrackModal onFinish={hideModal} track={track} />);
  };

  const handleShare = () => {
    showModal(<ShareModal trackId={track.id} />);
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
            loading(async () => {
              setDeleted(true);
              hideDialog();
              await deleteTrack({ id });
              await utils.track.invalidate();
              stop();
            });
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
            <div className="-mt-2 ml-1 flex space-x-1">
              <ExpirationChip hours={track.expiresIn} />
              {openComments && (
                <InfoChip
                  backgroundColor="bg-blue-300/30"
                  textColor="text-blue-700"
                  icon={<Comment01Icon size={13} />}
                  text="open comments"
                />
              )}
            </div>
          </div>
          <Text.Subtitle className="font-normal" subtle>
            {getDateDifference({ date: createdAt }).text}
          </Text.Subtitle>
        </div>
      </div>
      <Dropdown className="mr-4" options={menuOptions}>
        <div className="rounded-md p-2 hover:bg-neutral-100">
          <MoreVerticalCircle01Icon fill="black" size={18} />
        </div>
      </Dropdown>
    </div>
  );
}
