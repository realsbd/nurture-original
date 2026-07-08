import { Resend } from "resend"

if (!process.env.RESEND_API_KEY) {
  throw new Error(
    "Missing RESEND_API_KEY environment variable. " +
      "Add it to .env.local to enable transactional emails."
  )
}

/**
 * Singleton Resend client — server-side only.
 * Never import this in client components (it carries the secret API key).
 */
export const resend = new Resend(process.env.RESEND_API_KEY)

/**
 * The verified sender address used for all customer emails.
 * Set EMAIL_FROM in .env.local to a mailbox on your verified Resend domain,
 * e.g. `Nurture Water <orders@yourdomain.ca>`. Falls back to Resend's shared
 * test sender, which only delivers to your own Resend account email.
 */
export const EMAIL_FROM =
  process.env.EMAIL_FROM ?? "Nurture Water <onboarding@resend.dev>"
