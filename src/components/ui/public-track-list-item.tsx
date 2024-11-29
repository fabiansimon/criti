import { MusicNote02Icon } from "hugeicons-react";
import IconContainer from "./icon-container";
import Text from "../typography/text";
import { PublicTrack } from "~/server/api/routers/public/publicTypes";
import { pluralize } from "~/lib/utils";

interface PublicProjectListItem {
  track: PublicTrack;
  onClick: () => void;
}
export default function PublicProjectListItem({
  track,
  onClick,
}: PublicProjectListItem) {
  const { title, streams } = track;
  return (
    <div
      onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-between rounded-md p-2 hover:bg-neutral-50"
    >
      <div className="flex space-x-3">
        <IconContainer icon={<MusicNote02Icon fill="black" size={16} />} />
        <div className="flex flex-col justify-center space-y-1">
          <div className="flex items-center space-x-2">
            <Text.Body>{title}</Text.Body>
            <div className="-mt-2 ml-1 flex space-x-1"></div>
          </div>
          <Text.Subtitle className="font-normal" subtle>
            {pluralize(streams, "stream")}
          </Text.Subtitle>
        </div>
      </div>
      {/* <Dropdown className="mr-4" options={[]}>
        <div className="rounded-md p-2 hover:bg-neutral-100">
          <MoreVerticalCircle01Icon fill="black" size={18} />
        </div>
      </Dropdown> */}
    </div>
  );
}
