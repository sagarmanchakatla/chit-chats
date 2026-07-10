import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface RedemptionEmailData {
  chitTitle: string;
  chitEmoji: string;
  chitDescription: string;
  redeemedAt: string;
}

export async function sendRedemptionEmail(data: RedemptionEmailData) {
  const ownerEmail = process.env.OWNER_NOTIFICATION_EMAIL;
  if (!ownerEmail) {
    throw new Error("OWNER_NOTIFICATION_EMAIL not configured");
  }

  const formattedTime = new Date(data.redeemedAt).toLocaleString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });

  const { error } = await resend.emails.send({
    from: "onboarding@resend.dev",
    to: ownerEmail,
    subject: `${data.chitEmoji} Your love chit was redeemed!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #FFF8F8; margin: 0; padding: 40px 20px;">
          <div style="max-width: 480px; margin: 0 auto; background: white; border-radius: 16px; padding: 32px; box-shadow: 0 4px 24px rgba(244, 114, 182, 0.1);">
            <div style="text-align: center; margin-bottom: 24px;">
              <span style="font-size: 48px;">${data.chitEmoji}</span>
            </div>
            <h1 style="color: #1e293b; font-size: 24px; text-align: center; margin-bottom: 8px;">
              Love Chit Redeemed! ❤️
            </h1>
            <p style="color: #64748b; text-align: center; font-size: 14px; margin-bottom: 24px;">
              Your girlfriend just redeemed a special promise.
            </p>
            <div style="background: #FFF7ED; border-radius: 12px; padding: 20px; margin-bottom: 24px;">
              <h2 style="color: #1e293b; font-size: 18px; margin: 0 0 8px 0;">
                ${data.chitTitle}
              </h2>
              <p style="color: #64748b; font-size: 14px; margin: 0 0 12px 0;">
                ${data.chitDescription}
              </p>
              <p style="color: #94a3b8; font-size: 12px; margin: 0;">
                Redeemed on ${formattedTime}
              </p>
            </div>
            <div style="text-align: center; padding: 16px 0;">
              <p style="color: #F472B6; font-size: 16px; font-weight: 500; margin: 0;">
                💕 Time to make this promise come true! 💕
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  });

  if (error) {
    throw new Error(`Failed to send email: ${error.message}`);
  }
}
