import axios from "axios";

export const sendOtpOnWhatsApp = async (recipient, otp) => {
  try {
    const response = await axios.post(
      "https://sandbox.sendchamp.com/api/v1/whatsapp/template/send",
      {
        recipient, 
        type: "template",
        template_code: "YOUR_TEMPLATE_CODE", 
        sender: "234810000000", 
        custom_data: {
          body: {
            "1": otp, 
          },
        },
      },
      {
        headers: {
          Accept: "application/json",
          Authorization: `Bearer ${process.env.SENDCHAMP_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Error sending WhatsApp OTP:", error.response?.data || error.message);
    throw new Error("Failed to send OTP via WhatsApp");
  }
};
