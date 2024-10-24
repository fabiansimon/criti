import Text from "~/components/typography/text";

interface InviteEmailProps {
  title: string;
  by: string;
  link: string;
}

export default function InviteEmail({ title, by, link }: InviteEmailProps) {
  return (
    <div>
      <Text.Body>{`Invited to ${title} by ${by}`}</Text.Body>
      <Text.Body className="underline">{link}</Text.Body>
    </div>
  );
}
