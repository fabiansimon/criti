import Text from "~/components/typography/text";
import Card from "../card";
import { cn, convertPrice } from "~/lib/utils";
import { Cancel01Icon, Tick02Icon } from "hugeicons-react";

interface Benefit {
  type: string;
  enabled: boolean;
}

interface MembershipOption {
  title: string;
  description: string;
  priority?: boolean;
  price: number;
  benefits: Benefit[];
}

const BENEFITS = {
  uploadLimit: "Upload and share up to 50 projects effortlessly",
  noExpiration: "Your tracks stay live indefinitely",
  saveMoney: "Save 30%",
};

const options: MembershipOption[] = [
  {
    title: "Monthly",
    description: "⏰ Cancel at any time",
    price: 9.99,
    benefits: [
      {
        type: BENEFITS.uploadLimit,
        enabled: true,
      },
      {
        type: BENEFITS.noExpiration,
        enabled: true,
      },
      {
        type: BENEFITS.saveMoney,
        enabled: false,
      },
    ],
  },
  {
    title: "Yearly",
    description: "🎤 Pay once and save 30%",
    price: 5.99,
    priority: true,
    benefits: [
      {
        type: BENEFITS.uploadLimit,
        enabled: true,
      },
      {
        type: BENEFITS.noExpiration,
        enabled: true,
      },
      {
        type: BENEFITS.saveMoney,
        enabled: true,
      },
    ],
  },
];

export default function PremiumModel() {
  return (
    <Card className="bg-accent text-center">
      <div className="space-y-1">
        <Text.Headline type="h4">
          Leve up - and do more with Premium
        </Text.Headline>
        <Text.Body subtle>
          <span>
            Subscribe today to level up your professional career. Enjoy major
            benefits for the price of{" "}
          </span>
          <span className="font-semibold text-black">one cup of coffee</span>
          <span> per month ☕️</span>
        </Text.Body>
      </div>

      <div className="mt-10 flex w-full grow space-x-2">
        {options.map((option, index) => {
          return (
            <OptionCard
              color={index === 0 ? "bg-yellow-200" : "bg-blue-300"}
              className={cn(
                index === 0 ? "border-yellow-200" : "border-blue-300",
              )}
              key={index}
              option={option}
            />
          );
        })}
        <CoffeCard />
      </div>
    </Card>
  );
}

interface OptionCardProps {
  color: string;
  option: MembershipOption;
  bestseller?: boolean;
  className?: string;
}

function OptionCard({ option, className, color }: OptionCardProps) {
  const { benefits, description, price, priority, title } = option;

  return (
    <div
      className={cn(
        "relative flex w-full cursor-pointer flex-col overflow-hidden rounded-lg border shadow-sm transition-shadow hover:shadow-lg",
        className,
      )}
    >
      {priority && (
        <div className="absolute right-2 top-2 rounded-full bg-white px-3 py-2">
          <Text.Subtitle>Bestseller 🎉</Text.Subtitle>
        </div>
      )}
      <div className={cn("space-y-1 px-3 pb-[12px] pt-2 text-left", color)}>
        <Text.Headline type="h4" className="font-normal">
          {title}
        </Text.Headline>
        <Text.Subtitle className="font-light opacity-80">
          {description}
        </Text.Subtitle>
      </div>
      <div className="px-5 py-3 text-left">
        <Text.Body className="text-left" subtle>
          Benefits
        </Text.Body>
        <div className="mt-4 space-y-4">
          {benefits.map(({ type, enabled }, index) => (
            <div key={index} className="flex justify-start space-x-3">
              <div
                className={cn(
                  "mb-auto flex min-h-5 min-w-5 items-center justify-center rounded-full",
                  enabled ? "bg-green-600" : "bg-neutral-200",
                )}
              >
                {enabled ? (
                  <Tick02Icon className="text-white" size={14} />
                ) : (
                  <Cancel01Icon size={12} />
                )}
              </div>
              <Text.Body className={cn(!enabled ? "opacity-30" : "opacity-1")}>
                {type}
              </Text.Body>
            </div>
          ))}

          <div className="flex flex-col items-end">
            <Text.Headline type="h2" className="font-normal">
              {convertPrice(price, "$")}
            </Text.Headline>
            <Text.Body>per month</Text.Body>
          </div>
        </div>
      </div>
    </div>
  );
}

interface CoffeCardProps {
  className?: string;
}

function CoffeCard({ className }: CoffeCardProps) {
  return (
    <div
      className={cn(
        "relative flex w-full cursor-pointer flex-col overflow-hidden rounded-lg border shadow-md transition-shadow hover:shadow-xl",
        className,
      )}
    >
      <div
        className={cn("space-y-1 px-3 pb-[12px] pt-2 text-left", "bg-red-300")}
      >
        <Text.Headline type="h4" className="font-normal">
          Support Creator
        </Text.Headline>
        <Text.Subtitle className="font-light opacity-80">
          Not a membership!
        </Text.Subtitle>
      </div>
      <div className="px-5 py-3 text-left">
        <Text.Body subtle>Benefits</Text.Body>
        <div className="mt-4 space-y-4">
          <div className="flex justify-start space-x-3">
            <div
              className={
                "mb-auto flex min-h-5 min-w-5 items-center justify-center rounded-full bg-green-600"
              }
            >
              <Tick02Icon className="text-white" size={14} />
            </div>
            <Text.Body>
              Treat an exhausted student to a cup of coffee 🚀
            </Text.Body>
          </div>
        </div>
      </div>
    </div>
  );
}
