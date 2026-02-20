export const whatsappTemplates  = {
    FORGOT_PASSWORD_OTP: ({ name, otp, expiryMinutes }) =>{
        return `Hi ${name},\nYour OTP is ${otp}. It will expire in ${expiryMinutes} minutes.`
    }
}