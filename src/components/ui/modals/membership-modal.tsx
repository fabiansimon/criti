import Text from "~/components/typography/text";
import Card from "../card";
import { cn, convertPrice, hexToRGB } from "~/lib/utils";
import { Cancel01Icon, Tick02Icon } from "hugeicons-react";
import useBreakpoint, { BREAKPOINTS } from "~/hooks/use-breakpoint";
import { MEMBERSHIPS } from "~/constants/membership";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import { useToast } from "~/hooks/use-toast";
import CoffeeButton from "../coffee-button";

interface Benefit {
  render: React.ReactNode;
  enabled: boolean;
}

interface MembershipType {
  title: string;
  priceId: string;
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
      <span className="font-semibold">live for 365 days</span>
    </Text.Body>
  ),
  saveMoney: (
    <Text.Body>
      <span>Save</span>
      <span className="font-semibold"> 40%</span>
    </Text.Body>
  ),
};

const MEMBERSHIP_TYPES: MembershipType[] = [
  {
    title: MEMBERSHIPS.V1_MONTHLY.name,
    priceId: MEMBERSHIPS.V1_MONTHLY.priceId,
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
    title: MEMBERSHIPS.V1_ANNUALLY.name,
    priceId: MEMBERSHIPS.V1_ANNUALLY.priceId,
    description: "🎤 Pay yearly and save 40%",
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
  const isSmall = useBreakpoint(BREAKPOINTS.sm);
  const router = useRouter();
  const { toast } = useToast();

  const { mutateAsync: createCheckout } = api.stripe.checkout.useMutation();

  const handleCheckout = async (priceId: string) => {
    const checkout = await createCheckout({ priceId });
    if (!checkout?.url) {
      toast({
        title: "Something went wrong.",
        description:
          "Sorry you can't upgrade at the moment. Please try again later.",
        variant: "destructive",
      });
      return;
    }

    router.push(checkout.url);
  };

  if (false) {
    return (
      <Card
        title="Sorry you've reached the current limit."
        subtitle="Premium membership are yet to be implemented."
      >
        <CoffeeButton className="mx-auto mt-4 h-10" />
      </Card>
    );
  }

  return (
    <Card
      omitPadding
      className="mx-auto overflow-hidden bg-accent xl:max-w-[80%]"
    >
      <div className="flex justify-center bg-white py-4">
        <div className={cn("text-center", isSmall ? "mx-4" : "w-2/3")}>
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
      <div className="flex w-full space-x-3 overflow-x-auto p-6 no-scrollbar">
        {MEMBERSHIP_TYPES.map((membership, index) => (
          <MembershipCard
            onClick={() => handleCheckout(membership.priceId)}
            key={index}
            membership={membership}
          />
        ))}
      </div>
    </Card>
  );
}

interface MembershipCardProps {
  onClick?: () => void;
  membership: MembershipType;
  className?: string;
}

function MembershipCard({
  membership,
  onClick,
  className,
}: MembershipCardProps) {
  const { color, title, description, benefits, monthlyPrice, prioritized } =
    membership;
  return (
    <div
      onClick={onClick}
      style={{
        borderColor: color,
        boxShadow: `0 4px 6px -1px rgba(${hexToRGB(color)}, 0.2)`,
      }}
      className={cn(
        "min-w-[300px] cursor-pointer overflow-hidden rounded-xl border shadow-md transition-transform hover:scale-[101%]",
        className,
      )}
    >
      <div
        style={{ backgroundColor: color }}
        className="relative space-y-2 px-3 py-2"
      >
        <Text.Subtitle className="text-md">{title}</Text.Subtitle>
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
