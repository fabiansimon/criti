import Text from "~/components/typography/text";

interface MagicLinkEmailProps {
  url: string;
}

export default function MagicLinkEmail({ url }: MagicLinkEmailProps) {
  return (
    <div>
      <Text.Body>{"MagicLink"}</Text.Body>
      <Text.Body className="underline">{url}</Text.Body>
    </div>
  );
}
