import { type SendVerificationRequestParams } from "next-auth/providers/email";
import { Resend } from "resend";
import MagicLinkEmail from "./email-templates/magic-ink";
import { env } from "~/env";
import InviteEmail from "./email-templates/invite";
import { generateShareableLink } from "~/lib/utils";
import CommentNotificationEmail from "./email-templates/comment-notification";
import { type Comment } from "@prisma/client";

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

export async function sendInvitationEmail({
  emails,
  trackId,
}: {
  emails: string[];
  trackId: string;
}) {
  return await sendEmail({
    from: "Vocast <onboarding@resend.dev>",
    to: [...emails],
    subject: "Hello world",
    body: InviteEmail({
      title: "Project",
      by: "Someone",
      link: generateShareableLink(trackId),
    }),
  });
}

export async function sendCommentNotificationEmail({
  title,
  id,
  email,
  comment,
}: {
  title: string;
  id: string;
  email: string;
  comment: Comment;
}) {
  return await sendEmail({
    from: "Vocast <onboarding@resend.dev>",
    to: [...email],
    subject: "Fresh commment added",
    body: CommentNotificationEmail({
      content: comment,
      title,
      url: generateShareableLink(id),
    }),
  });
}

async function sendEmail({
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
