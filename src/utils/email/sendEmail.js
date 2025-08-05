import nodemailer from "nodemailer";

export async function sendEmail({
    from=process.env.APP_EMAIL,
    to=[],
    cc=[],
    bcc=[],
    subject="Saraha_App📩",
    text="",
    html = "",
    attachments=[],
}) {



    // Create a test account or replace with real credentials.
    const transporter = nodemailer.createTransport({

        service: "gmail",
        auth: {
            user: process.env.APP_EMAIL,
            pass: process.env.APP_PASSWORD,
        },
    });


    const info = await transporter.sendMail({
        from: `"Saraha_App📩" <${from}>`,
      to,
       subject,
        text, // plain‑text body
        html,
        attachments,
        cc,
        bcc,
    
    });

    console.log("Message sent:", info.messageId);

}



// Wrap in an async IIFE so we can use await.



