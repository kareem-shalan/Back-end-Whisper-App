export const workingEmailTemplate = (userName, otp) => {
    return `
    <!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
    </head>
    <body style="margin: 0; padding: 20px; font-family: Arial, sans-serif; background-color: #f3f4f6;">
        
        <!-- Container -->
        <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
            
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #9333ea 0%, #2563eb 100%); padding: 30px 20px; text-align: center;">
                <h1 style="margin: 0 0 10px 0; font-size: 28px; color: #ffffff;">whisper App</h1>
                <p style="margin: 0; color: #c4b5fd; font-size: 16px;">Anonymous Messages Platform</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 30px; drop-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                <h2 style="margin: 0 0 15px 0; font-size: 24px; color: #1f2937;">Hello ${userName}! </h2>
                <h2 style="margin: 0 0 15px 0; font-size: 24px; color:rgb(85, 231, 17);"> OTP : ${otp}  👋 </h2>
                <p style="margin: 0 0 25px 0; color: #6b7280; line-height: 1.6;">You've received a new OTP on whisper App.</p>
                
                <!-- Message Box -->
                <div style="background-color: #f9fafb; border-left: 4px solid #9333ea; padding: 25px; border-radius: 8px; margin-bottom: 25px;">
                    <h3 style="margin: 0 0 15px 0; font-size: 18px; color: #111827;">💬 New Anonymous Message</h3>
                    <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; margin-bottom: 15px;">
                                <p style="margin: 0; color: #374151; font-style: italic;">"Hey ${userName}! <span style="color:rgb(85, 231, 17);">${otp}</span> , don't share it with anyone."</p>
                    </div>
                    <p style="margin: 0; font-size: 14px; color: #6b7280;">Received: Today at ${new Date().toLocaleString()}</p>
                </div>
                
                <!-- Button -->
                <div style="text-align: center; margin-bottom: 30px;">
                    <a href="https://your-whisper-app.com/messages" 
                       style="display: inline-block; background: linear-gradient(135deg, #9333ea 0%, #2563eb 100%); 
                              color: #ffffff; padding: 15px 30px; border-radius: 25px; text-decoration: none; 
                              font-weight: bold; font-size: 16px;">
                        View All Messages
                    </a>
                </div>
                
                <!-- Features -->
                    <div style="display: flex; gap: 10px; margin-bottom: 25px; justify-content: space-between; align-items: space-between;  ">
                    <div style="flex: 1; background-color: #dbeafe; padding: 20px; border-radius: 8px; width: 40%;">
                        <h4 style="margin: 0 0 5px 0; color: #1f2937;">🔒 Anonymous</h4>
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">100% anonymous messaging</p>
                    </div>
                    <div style="flex: 1; background-color: #d1fae5;  padding: 20px; border-radius: 8px; width: 40%; margin-left: 10px;">
                        <h4 style="margin: 0 0 5px 0; color: #1f2937;">🛡️ Secure</h4>
                        <p style="margin: 0; font-size: 14px; color: #6b7280;">Your privacy is protected</p>
                    </div>
                </div>
                
                
                <!-- Tip -->
                <div style="background-color: #fefce8; border: 1px solid #fde047; padding: 20px; border-radius: 8px;">
                    <h4 style="margin: 0 0 8px 0; color: #92400e;">💡 Tip:</h4>
                    <p style="margin: 0; font-size: 14px; color: #a16207;">Share your whisper link on social media to receive more anonymous messages from friends!</p>
                </div>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f9fafb; padding: 20px; text-align: center;">
                <p style="margin: 0; font-size: 14px; color: #6b7280;">&copy; 2025 whisper app 📩. All rights reserved.</p>
                <p style="margin: 10px 0 0 0; font-size: 12px; color: #9ca3af;">
                    <a href="#" style="color: #9333ea; text-decoration: none;">Privacy</a> | 
                    <a href="#" style="color: #9333ea; text-decoration: none;">Unsubscribe</a> | 
                    <a href="#" style="color: #9333ea; text-decoration: none;">Support</a>
                </p>
            </div>
        </div>
        
    </body>
    </html>
    `;
};