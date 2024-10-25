import Text from "~/components/typography/text";

interface ProjectExpiredNotificationEmailProps {
  title: string;
  name: string;
}

export default function ProjectExpiredNotificationEmail({
  title,
  name,
}: ProjectExpiredNotificationEmailProps) {
  return (
    <div>
      <Text.Body>{`Hey there ${name}!`}</Text.Body>
      <Text.Body>{`Your project "${title} was deleted due to expiration."`}</Text.Body>
    </div>
  );
}
