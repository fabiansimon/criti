import Text from "~/components/typography/text";
import Card from "../card";
import { cn, convertPrice, hexToRGB } from "~/lib/utils";
import { Cancel01Icon, Tick02Icon } from "hugeicons-react";

interface Benefit {
  render: React.ReactNode;
  enabled: boolean;
}

interface MembershipType {
  title: string;
  description: string;
  monthlyPrice: number;
  benefits: Benefit[];
  color: string;
  prioritized?: boolean;
}

const BENEFITS = {
  maxProjects: (
    <Text.Body>
      <span>Upload and share up to </span>
      <span className="font-semibold">50 projects </span>
      <span>effortlessly</span>
    </Text.Body>
  ),
  noExpiration: (
    <Text.Body>
      <span>Your tracks stay </span>
      <span className="font-semibold">live indefinitely</span>
    </Text.Body>
  ),
  saveMoney: (
    <Text.Body>
      <span>Save</span>
      <span className="font-semibold"> 30%</span>
    </Text.Body>
  ),
};

const MEMBERSHIP_TYPES: MembershipType[] = [
  {
    title: "Monthly",
    description: "⏰ Cancel at any time",
    monthlyPrice: 9.99,
    color: "#FFF28E",
    benefits: [
      {
        render: BENEFITS.maxProjects,
        enabled: true,
      },
      {
        render: BENEFITS.noExpiration,
        enabled: true,
      },
      {
        render: BENEFITS.saveMoney,
        enabled: false,
      },
    ],
  },
  {
    title: "Yearly",
    description: "🎤 Pay once and save 30%",
    monthlyPrice: 5.99,
    color: "#8ED6FF",
    prioritized: true,
    benefits: [
      {
        render: BENEFITS.maxProjects,
        enabled: true,
      },
      {
        render: BENEFITS.noExpiration,
        enabled: true,
      },
      {
        render: BENEFITS.saveMoney,
        enabled: true,
      },
    ],
  },
];

export default function MembershipModal() {
  return (
    <Card omitPadding className="overflow-hidden bg-accent">
      <div className="flex justify-center bg-white py-4">
        <div className="w-2/3 text-center">
          <Text.Headline type="h3">
            {"Level up - and do more with Premium"}
          </Text.Headline>
          <Text.Body subtle>
            <span>
              Subscribe today to level up your professional career. Enjoy major
              benefits for the price of{" "}
            </span>
            <span className="font-semibold text-black">one cup of coffee </span>
            <span>per month ☕</span>
          </Text.Body>
        </div>
      </div>
      <div className="flex space-x-3 p-6">
        {MEMBERSHIP_TYPES.map((membership, index) => (
          <MembershipCard key={index} membership={membership} />
        ))}
        {/* <MembershipCard membership={membership} /> */}
      </div>
    </Card>
  );
}

interface MembershipCardProps {
  membership: MembershipType;
  className?: string;
}

function MembershipCard({ membership, className }: MembershipCardProps) {
  const { color, title, description, benefits, monthlyPrice, prioritized } =
    membership;
  return (
    <div
      style={{
        borderColor: color,
        boxShadow: `0 4px 6px -1px rgba(${hexToRGB(color)}, 0.2)`,
      }}
      className={cn(
        "cursor-pointer overflow-hidden rounded-xl border shadow-md transition-transform hover:scale-[101%]",
        className,
      )}
    >
      <div
        style={{ backgroundColor: color }}
        className="relative space-y-2 px-3 py-2"
      >
        <Text.Headline type="h4">{title}</Text.Headline>
        <Text.Body>{description}</Text.Body>
        {prioritized && (
          <div className="absolute right-1 top-1 rounded-full bg-white px-3 py-1">
            <Text.Body>Bestseller 🎉</Text.Body>
          </div>
        )}
      </div>
      <div className="bg-white px-4 py-3">
        <Text.Body subtle>Benefits</Text.Body>
        <div className="mt-4 space-y-5">
          {benefits.map(({ enabled, render }, index) => (
            <div key={index} className="flex items-center space-x-2">
              <div
                className={cn(
                  "flex h-4 w-4 items-center justify-center rounded-full bg-green-500",
                  !enabled && "bg-neutral-200",
                )}
              >
                {enabled ? (
                  <Tick02Icon size={14} className="text-white" />
                ) : (
                  <Cancel01Icon size={12} />
                )}
              </div>
              <div className={enabled ? "opacity-100" : "opacity-30"}>
                {render}
              </div>
            </div>
          ))}
        </div>
        <div className="mt-4 space-y-1 text-right">
          <Text.Headline type="h1" className="font-normal">
            {convertPrice(monthlyPrice, "$")}
          </Text.Headline>
          <Text.Body>{"per month"}</Text.Body>
        </div>
      </div>
    </div>
  );
}
