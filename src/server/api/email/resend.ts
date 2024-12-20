import { type SendVerificationRequestParams } from "next-auth/providers/email";
import { Resend } from "resend";
import MagicLinkEmail from "./email-templates/magic-ink";
import { env } from "~/env";
import InviteEmail from "./email-templates/invite";
import { generateShareableLink } from "~/lib/utils";
import CommentNotificationEmail from "./email-templates/comment-notification";
import { type Comment } from "@prisma/client";
import ProjectExpiredNotificationEmail from "./email-templates/project-expired-notification";
import ProjectExpiredWarningEmail from "./email-templates/project-expired-warning";

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
      to: email,
      subject: "Login Link to your Account",
      body: MagicLinkEmail({ url }),
    });
  } catch (error) {
    console.error("Unable to send verification email", error);
  }
}

export async function sendExpirationWarningEmail({
  email,
  title,
  name,
  url,
}: {
  email: string;
  title: string;
  name: string;
  url: string;
}) {
  return await sendEmail({
    from: "beatback <noreply@beatback.io>",
    to: email,
    subject: "Warning! Your Project will expire soon",
    body: ProjectExpiredWarningEmail({ title, name, url }),
  });
}

export async function sendExpirationNotificationEmail({
  email,
  title,
  name,
}: {
  email: string;
  title: string;
  name: string;
}) {
  return await sendEmail({
    from: "beatback <noreply@beatback.io>",
    to: email,
    subject: "Expirated Project",
    body: ProjectExpiredNotificationEmail({ title, name }),
  });
}

export async function sendInvitationEmail({
  emails,
  trackId,
  sender,
  title,
}: {
  emails: string[];
  trackId: string;
  title: string;
  sender: string;
}) {
  return await sendEmail({
    from: "beatback <invite@beatback.io>",
    to: emails,
    subject: "You're invited!",
    body: InviteEmail({
      title,
      by: sender,
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
  const res = await sendEmail({
    from: "beatback <noreply@beatback.io>",
    to: email,
    subject: "New commment added!",
    body: CommentNotificationEmail({
      content: comment,
      title,
      url: generateShareableLink(id),
    }),
  });

  return res;
}

async function sendEmail({
  from,
  to,
  subject,
  body,
}: {
  from: string;
  to: string | string[];
  subject: string;
  body: React.ReactNode;
}) {
  const res = await resend.emails.send({
    from,
    to,
    subject,
    react: body,
  });

  if (res.error) {
    console.error("Error when sending email", res.error);
  }

  return res;
}
