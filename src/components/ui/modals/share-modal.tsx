import Card from "../card";
import Text from "~/components/typography/text";
import IconContainer from "../icon-container";
import { Mail01Icon, PlusSignIcon } from "hugeicons-react";
import { Input } from "../input";
import { Button } from "../button";
import EmailChip from "../email-chip";
import { useMemo, useState } from "react";
import { REGEX } from "~/constants/regex";
import { copyToClipboard, generateShareableLink } from "~/lib/utils";
import { useToast } from "~/hooks/use-toast";
import { useModal } from "~/providers/modal-provider";
import { api } from "~/trpc/react";
import { Switch } from "../switch";

interface ShareModalProps {
  trackId: string;
}
export default function ShareModal({ trackId }: ShareModalProps) {
  const [emails, setEmails] = useState<Set<string>>(new Set());
  const [email, setEmail] = useState<string>("");

  const { toast } = useToast();
  const { hide: hideModal } = useModal();

  const { mutate: sendEmails } = api.email.send.useMutation();

  const validInput = useMemo(() => emails.size > 0, [emails]);
  const validEmail = useMemo(() => REGEX.email.test(email), [email]);

  const copyLink = () => {
    const url = generateShareableLink(trackId);
    copyToClipboard(url);
    toast({
      title: "Link copied",
      description: "Share the link with your friends.",
    });
    hideModal();
  };

  const handleSendEmails = () => {
    sendEmails({ emails: [...emails], trackId });
    toast({
      title: "Invitations sent",
      description: "Emails were sent out to invitees.",
    });
    hideModal();
  };

  const addEmail = () => {
    setEmails((prev) => {
      const set = new Set(prev);
      set.add(email);
      return set;
    });
    setEmail("");
  };

  const removeEmail = (email: string) => {
    setEmails((prev) => {
      const set = new Set(prev);
      set.delete(email);
      return set;
    });
    setEmail("");
  };

  return (
    <Card
      title="Share Track"
      subtitle="Send out emails or just send them your link"
      className="w-[450px]"
    >
      {/* Email Input */}
      <div className={"mt-4 space-y-1"}>
        <div className="mb-2 flex justify-between">
          <Text.Body className="ml-1 text-xs" subtle>
            Add email
          </Text.Body>
        </div>
        <div className={"flex h-12 space-x-2"}>
          <IconContainer icon={<Mail01Icon size={16} />} />
          <Input
            placeholder="theiremail@gmail.com"
            value={email}
            onChange={({ currentTarget: { value } }) => setEmail(value)}
            onKeyDown={(e) => {
              if (validEmail && e.key === "Enter") {
                addEmail();
              }
            }}
          />
          <Button
            disabled={!validEmail}
            onClick={addEmail}
            dense
            className="h-full"
            icon={<PlusSignIcon size={18} />}
          />
        </div>
      </div>

      {/* Email List */}
      <div className="mt-3 flex flex-wrap gap-1">
        {[...emails].map((email) => (
          <EmailChip
            key={email}
            email={email}
            onDelete={() => removeEmail(email)}
          />
        ))}
      </div>

      <Button
        onClick={handleSendEmails}
        disabled={!validInput}
        className="mt-4 h-12 w-full"
        title={"Invite"}
      />
      <div className="my-4 border-t border-neutral-200" />
      <div
        onClick={copyLink}
        className="cursor-pointer space-y-1 rounded-lg border border-neutral-100 bg-white py-3 text-center shadow-sm hover:bg-neutral-50"
      >
        <Text.Body className="font-semibold">Or just share the link</Text.Body>
        <Text.Subtitle subtle>Click to copy to clipboard</Text.Subtitle>
      </div>
    </Card>
  );
}
