import { cn } from "~/lib/utils";

const subtleColor = "text-black/50";

interface TextProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  subtle?: boolean;
  className?: string;
  type?: "h1" | "h2" | "h3" | "h4";
}

export default function Text(): JSX.Element {
  return <></>;
}

Text.Body = Body;
Text.Subtitle = Subtitle;
Text.Headline = Headline;

function Body({
  children,
  className,
  subtle,
  ...rest
}: TextProps): JSX.Element {
  return (
    <p
      className={cn("text-sm leading-7", subtle && subtleColor, className)}
      {...rest}
    >
      {children}
    </p>
  );
}
function Subtitle({
  children,
  className,
  subtle,
  ...rest
}: TextProps): JSX.Element {
  return (
    <p
      className={cn("text-xs font-medium", subtle && subtleColor, className)}
      {...rest}
    >
      {children}
    </p>
  );
}
function Headline({
  children,
  className,
  subtle,
  type = "h4",
  ...rest
}: TextProps): JSX.Element {
  const _type = {
    h1: "text-3xl font-extrabold tracking-tight lg:text-4xl",
    h2: "text-2xl font-semibold tracking-tight",
    h3: "text-xl font-semibold tracking-tight",
    h4: "text-lg font-semibold tracking-tight",
  };

  console.log(type && _type[type]);

  return (
    <h1
      className={cn(
        "scroll-m-20",
        type && _type[type],
        subtle && subtleColor,
        className,
      )}
      {...rest}
    >
      {children}
    </h1>
  );
}
