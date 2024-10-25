import Text from "~/components/typography/text";

interface ProjectExpiredWarningEmailProps {
  name: string;
  title: string;
  url: string;
}

export default function ProjectExpiredWarningEmail({
  name,
  title,
  url,
}: ProjectExpiredWarningEmailProps) {
  return (
    <div>
      <Text.Body>{`Hey there ${name}!`}</Text.Body>
      <Text.Body>{`Your proejct "${title}" will be deleted within the next 24 hours due to expiration. `}</Text.Body>
      <Text.Body>
        {
          "If you decide to keep the project online, consider upgrading your membership."
        }
      </Text.Body>
    </div>
  );
}
