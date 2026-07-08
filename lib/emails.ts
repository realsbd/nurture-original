import { resend, EMAIL_FROM } from "@/lib/resend"

// ── Brand ────────────────────────────────────────────────────────────────
const BRAND = {
  primary: "#0047c7",
  ink: "#001b40",
  gray: "#5b6b82",
  ice: "#eaf2ff",
}

/** Shared HTML shell so both emails look consistent. */
function layout(opts: {
  heading: string
  accent: string
  intro: string
  bodyHtml: string
  footerNote?: string
}): string {
  return `<!DOCTYPE html>
<html>
  <body style="margin:0;padding:0;background:#f4f7fb;font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f4f7fb;padding:32px 12px;">
      <tr><td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid ${BRAND.ice};">
          <tr>
            <td style="background:${BRAND.primary};padding:28px 32px;">
              <span style="color:#ffffff;font-size:20px;font-weight:800;letter-spacing:0.04em;">NURTURE WATER</span>
            </td>
          </tr>
          <tr>
            <td style="padding:36px 32px 8px;">
              <span style="display:inline-block;font-size:12px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:${opts.accent};">${opts.heading}</span>
            </td>
          </tr>
          <tr>
            <td style="padding:8px 32px 0;">
              <p style="margin:0 0 20px;font-size:16px;line-height:1.6;color:${BRAND.ink};">${opts.intro}</p>
              ${opts.bodyHtml}
            </td>
          </tr>
          <tr>
            <td style="padding:28px 32px 36px;">
              <p style="margin:0;font-size:13px;line-height:1.6;color:${BRAND.gray};">
                ${opts.footerNote ?? "Questions? Just reply to this email — we're happy to help."}
              </p>
              <p style="margin:16px 0 0;font-size:12px;color:${BRAND.gray};">
                Nurture Water · Naturally Alkaline Spring Water · Proudly Canadian
              </p>
            </td>
          </tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`
}

/** A simple label/value row block used inside the email body. */
function detailRows(rows: Array<[string, string]>): string {
  return `<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:${BRAND.ice};border-radius:12px;padding:4px 0;margin:0 0 24px;">
    ${rows
      .map(
        ([label, value]) => `<tr>
      <td style="padding:10px 20px;font-size:13px;color:${BRAND.gray};">${label}</td>
      <td style="padding:10px 20px;font-size:14px;font-weight:600;color:${BRAND.ink};text-align:right;">${value}</td>
    </tr>`
      )
      .join("")}
  </table>`
}

// ── Public senders ─────────────────────────────────────────────────────────

export interface PaymentSuccessEmailData {
  to: string
  customerName?: string
  productSummary: string
  amountFormatted: string
  orderRef: string
  isSubscription: boolean
}

/** Sent after a successful checkout (one-time or first subscription charge). */
export async function sendPaymentSuccessEmail(data: PaymentSuccessEmailData) {
  const name = data.customerName?.trim() || "there"
  const subject = data.isSubscription
    ? "Your Nurture subscription is confirmed"
    : "Thanks for your Nurture order"

  const html = layout({
    heading: "Payment confirmed",
    accent: "#12b76a",
    intro: `Hi ${name}, your payment went through successfully. ${
      data.isSubscription
        ? "Your subscription is now active — here are the details:"
        : "Here's a summary of your order:"
    }`,
    bodyHtml: detailRows([
      ["Order", data.productSummary],
      ["Amount", data.amountFormatted],
      [data.isSubscription ? "Subscription ref" : "Order ref", data.orderRef],
    ]),
    footerNote:
      "We'll send your order on its way shortly. Questions? Just reply to this email.",
  })

  return resend.emails.send({
    from: EMAIL_FROM,
    to: data.to,
    subject,
    html,
  })
}

export interface PaymentFailedEmailData {
  to: string
  customerName?: string
  amountFormatted: string
  reason: "renewal" | "initial"
}

/** Sent when a payment fails (subscription renewal or an async initial charge). */
export async function sendPaymentFailedEmail(data: PaymentFailedEmailData) {
  const name = data.customerName?.trim() || "there"
  const intro =
    data.reason === "renewal"
      ? `Hi ${name}, we weren't able to process the payment for your Nurture subscription renewal.`
      : `Hi ${name}, unfortunately your recent Nurture payment didn't go through.`

  const html = layout({
    heading: "Payment failed",
    accent: "#d92d20",
    intro,
    bodyHtml:
      detailRows([["Amount due", data.amountFormatted]]) +
      `<p style="margin:0 0 8px;font-size:15px;line-height:1.6;color:${BRAND.ink};">
        Please update your payment method to keep your ${
          data.reason === "renewal" ? "subscription active" : "order on track"
        }. No further action is needed if you've already resolved this.
      </p>`,
    footerNote:
      "Need a hand? Reply to this email and we'll sort it out with you.",
  })

  return resend.emails.send({
    from: EMAIL_FROM,
    to: data.to,
    subject:
      data.reason === "renewal"
        ? "Action needed: your Nurture subscription payment failed"
        : "Action needed: your Nurture payment failed",
    html,
  })
}
