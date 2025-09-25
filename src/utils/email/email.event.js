import { EventEmitter } from "node:events";
import { sendEmail } from "./sendEmail.js";
import { workingEmailTemplate } from "../../template/index.html.js";

const emailEvent = new EventEmitter();
emailEvent.on("confirmEmail", async (data) => {
    await sendEmail({
        to: data.email,
        subject: "Confirm your email",
        html: workingEmailTemplate(data.firstName, data.otp)
    })
})
emailEvent.on("confirmPassword", async (data) => {
    await sendEmail({
        to: data.email,
        subject: "Confirm your password",
        html: workingEmailTemplate(data.firstName, data.otp)
    })
})
emailEvent.on("forgotPassword", async (data) => {
    await sendEmail({
        to: data.email,
        subject: "Forgot Password",
        html: workingEmailTemplate(data.firstName, data.otp)
     
    })
})


export default emailEvent;