"use client";

import Card from "~/components/ui/card";
import IconContainer from "~/components/ui/icon-container";

import {
  MoreVerticalCircle01Icon,
  MusicNote02Icon,
  PlusSignIcon,
} from "hugeicons-react";
import Text from "~/components/typography/text";
import Dropdown, { type MenuOption } from "~/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { route, ROUTES } from "~/constants/routes";

export default function Home() {
  const router = useRouter();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-accent">
      <Card
        title="Your shared projects"
        subtitle="3 Tracks shared"
        className="md:min-w-[60%] md:max-w-[400px]"
      >
        <div className="-mx-3 my-7">
          {/* Track List */}
          <div className="max-h-[400px] space-y-2 overflow-y-auto pb-2 no-scrollbar">
            {Array.from({ length: 2 }).map((_, index) => (
              <ProjectListItem
                onClick={() => router.push(route(ROUTES.listen))}
                key={index}
              />
            ))}
          </div>

          {/* Add new Button */}
          <div className="border-t border-neutral-100" />
          <div
            onClick={() => router.push(route(ROUTES.upload))}
            className="flex w-full cursor-pointer items-center space-x-3 rounded-md p-2 hover:bg-neutral-50"
          >
            <IconContainer icon={<PlusSignIcon size={20} />} />
            <Text.Body>Add new track</Text.Body>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface ProjectListItemProps {
  onClick: () => void;
}

function ProjectListItem({ onClick }: ProjectListItemProps) {
  const menuOptions: MenuOption[] = [
    {
      title: "Delete",
      onClick: () => console.log("delete item"),
    },
    {
      title: "Edit",
      onClick: () => console.log("Edit item"),
    },
  ];

  return (
    <div
      onClick={onClick}
      className="flex w-full cursor-pointer items-center justify-between rounded-md p-2 hover:bg-neutral-50"
    >
      <div className="flex space-x-3">
        <IconContainer icon={<MusicNote02Icon fill="black" size={16} />} />
        <div>
          <div className="flex space-x-3 space-y-1">
            <Text.Body>Autpilot_224hz.wav</Text.Body>
            <div className="mt-1 flex h-6 items-center rounded-full bg-green-300/30 px-2">
              <Text.Subtitle className="text-[10px] font-normal text-green-700">
                open comments
              </Text.Subtitle>
            </div>
          </div>
          <Text.Subtitle className="font-normal" subtle>
            Created 2 months ago
          </Text.Subtitle>
        </div>
      </div>
      <Dropdown className="mr-4" options={menuOptions}>
        <MoreVerticalCircle01Icon fill="black" size={18} />
      </Dropdown>
    </div>
  );
}
