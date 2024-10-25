import { Cancel01Icon } from "hugeicons-react";
import Text from "../typography/text";

interface EmailChipProps {
  email: string;
  onDelete: () => void;
}

export default function EmailChip({ email, onDelete }: EmailChipProps) {
  return (
    <div
      onClick={onDelete}
      className="flex h-7 cursor-pointer items-center justify-center space-x-2 rounded-full bg-neutral-900 pl-3 pr-2"
    >
      <Text.Subtitle className="font-light text-white">{email}</Text.Subtitle>
      <div className="rounded-full bg-white p-[1.5px]">
        <Cancel01Icon className="text-neutral-900" size={12} />
      </div>
    </div>
  );
}
