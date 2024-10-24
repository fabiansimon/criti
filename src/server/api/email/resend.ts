import { type SendVerificationRequestParams } from "next-auth/providers/email";
import { Resend } from "resend";
import MagicLinkEmail from "./email-templates/magic-ink";
import { env } from "~/env";

const resend = new Resend(env.RESEND_API_KEY);

export async function sendVerificationRequest(
  params: SendVerificationRequestParams,
) {
  const {
    identifier: email,
    url,
    provider: { from },
  } = params;

  try {
    await sendEmail({
      from,
      to: [...email],
      subject: "Login Link to your Account",
      body: MagicLinkEmail({ url }),
    });
  } catch (error) {
    console.error("Unable to send verification email", error);
  }
}

export async function sendEmail({
  from,
  to,
  subject,
  body,
}: {
  from: string;
  to: string[];
  subject: string;
  body: React.ReactNode;
}) {
  return await resend.emails.send({
    from,
    to,
    subject,
    react: body,
  });
}
