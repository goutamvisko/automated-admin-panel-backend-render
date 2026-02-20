export const emailTemplates = {
  FORGOT_PASSWORD_OTP: ({ name, otp, expiryMinutes }) => ({
    subject: '🔐 Reset Your Password – OTP',
    text: `Hi ${name},
Your OTP is ${otp}. It will expire in ${expiryMinutes} minutes.
If you didn't request this, please ignore.`,
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6;">
        <h2 style="color:#2563eb;">Password Reset OTP</h2>
        <p>Hi <strong>${name}</strong>,</p>
        <p>Your One-Time Password (OTP) is:</p>
        <h1 style="letter-spacing:4px;">${otp}</h1>
        <p>This OTP will expire in <strong>${expiryMinutes} minutes</strong>.</p>
        <p style="color:#6b7280;font-size:13px;">
          If you did not request this, please ignore this email.
        </p>
        <hr />
        <p style="font-size:12px;color:#9ca3af;">
          © ${new Date().getFullYear()} CertMitra
        </p>
      </div>
    `,
  }),

  PROFILE_UPDATED: ({ name }) => ({
    subject: '✅ Profile Updated Successfully',
    text: `Hi ${name}, your profile has been updated successfully.`,
    html: `
      <h2>Profile Updated</h2>
      <p>Hello ${name},</p>
      <p>Your profile details were updated successfully.</p>
    `,
  }),
};
