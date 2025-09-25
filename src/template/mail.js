// Beautiful Email Template for Saraha App
export const emailTemplate = (userName = "User", message = "Welcome to Saraha App!") => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Saraha App</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f6f9;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                padding: 30px 20px;
                text-align: center;
                color: white;
            }
            
            .logo {
                font-size: 2.5rem;
                margin-bottom: 10px;
            }
            
            .header h1 {
                font-size: 28px;
                margin-bottom: 5px;
                font-weight: 600;
            }
            
            .header p {
                font-size: 16px;
                opacity: 0.9;
            }
            
            .content {
                padding: 40px 30px;
            }
            
            .greeting {
                font-size: 20px;
                color: #2c3e50;
                margin-bottom: 20px;
            }
            
            .message {
                font-size: 16px;
                color: #555;
                margin-bottom: 30px;
                line-height: 1.8;
            }
            
            .cta-button {
                display: inline-block;
                background: linear-gradient(45deg, #667eea, #764ba2);
                color: white;
                padding: 15px 30px;
                text-decoration: none;
                border-radius: 25px;
                font-weight: 600;
                font-size: 16px;
                text-align: center;
                margin: 20px 0;
                transition: transform 0.3s ease;
            }
            
            .cta-button:hover {
                transform: translateY(-2px);
            }
            
            .features {
                margin: 30px 0;
                background-color: #f8f9fa;
                border-radius: 8px;
                padding: 25px;
            }
            
            .feature-item {
                display: flex;
                align-items: center;
                margin-bottom: 15px;
                padding: 10px 0;
            }
            
            .feature-item:last-child {
                margin-bottom: 0;
            }
            
            .feature-icon {
                width: 40px;
                height: 40px;
                background: linear-gradient(45deg, #667eea, #764ba2);
                border-radius: 50%;
                display: flex;
                align-items: center;
                justify-content: center;
                margin-right: 15px;
                font-size: 18px;
                color: white;
            }
            
            .feature-text {
                flex: 1;
            }
            
            .feature-title {
                font-weight: 600;
                color: #2c3e50;
                margin-bottom: 3px;
            }
            
            .feature-desc {
                font-size: 14px;
                color: #7f8c8d;
            }
            
            .divider {
                height: 1px;
                background: linear-gradient(to right, transparent, #ddd, transparent);
                margin: 30px 0;
            }
            
            .footer {
                background-color: #2c3e50;
                color: #ecf0f1;
                text-align: center;
                padding: 30px 20px;
            }
            
            .footer-content {
                margin-bottom: 20px;
            }
            
            .social-links {
                margin: 20px 0;
            }
            
            .social-link {
                display: inline-block;
                width: 40px;
                height: 40px;
                background-color: #34495e;
                border-radius: 50%;
                color: white;
                text-decoration: none;
                margin: 0 5px;
                line-height: 40px;
                font-size: 18px;
            }
            
            .footer-text {
                font-size: 12px;
                color: #95a5a6;
                margin-top: 15px;
            }
            
            @media only screen and (max-width: 600px) {
                .email-container {
                    margin: 0;
                    border-radius: 0;
                }
                
                .content {
                    padding: 30px 20px;
                }
                
                .header {
                    padding: 25px 20px;
                }
                
                .header h1 {
                    font-size: 24px;
                }
                
                .cta-button {
                    display: block;
                    text-align: center;
                }
                
                .feature-item {
                    flex-direction: column;
                    text-align: center;
                }
                
                .feature-icon {
                    margin-right: 0;
                    margin-bottom: 10px;
                }
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <!-- Header -->
            <div class="header">
                <div class="logo">📩</div>
                <h1>Saraha App</h1>
                <p>Your trusted messaging platform</p>
            </div>
            
            <!-- Main Content -->
            <div class="content">
                <div class="greeting">Hello ${userName}! 👋</div>
                
                <div class="message">
                    ${message}
                </div>
                
                <div style="text-align: center;">
                    <a href="https://your-app-url.com/dashboard" class="cta-button">
                        Get Started Now
                    </a>
                </div>
                
                <!-- Features Section -->
                <div class="features">
                    <div class="feature-item">
                        <div class="feature-icon">🚀</div>
                        <div class="feature-text">
                            <div class="feature-title">Fast & Reliable</div>
                            <div class="feature-desc">Lightning-fast message delivery with 99.9% uptime</div>
                        </div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">🔒</div>
                        <div class="feature-text">
                            <div class="feature-title">Secure & Private</div>
                            <div class="feature-desc">End-to-end encryption keeps your conversations safe</div>
                        </div>
                    </div>
                    
                    <div class="feature-item">
                        <div class="feature-icon">📱</div>
                        <div class="feature-text">
                            <div class="feature-title">Cross-Platform</div>
                            <div class="feature-desc">Available on web, iOS, and Android devices</div>
                        </div>
                    </div>
                </div>
                
                <div class="divider"></div>
                
                <p style="color: #7f8c8d; font-size: 14px;">
                    Need help? Contact our support team at 
                    <a href="mailto:support@saraha-app.com" style="color: #667eea;">support@saraha-app.com</a>
                </p>
            </div>
            
            <!-- Footer -->
            <div class="footer">
                <div class="footer-content">
                    <strong>Saraha App</strong><br>
                    Making communication simple and secure
                </div>
                
                <div class="social-links">
                    <a href="#" class="social-link">📘</a>
                    <a href="#" class="social-link">🐦</a>
                    <a href="#" class="social-link">📷</a>
                    <a href="#" class="social-link">💼</a>
                </div>
                
                <div class="footer-text">
                    © 2024 Saraha App. All rights reserved.<br>
                    You're receiving this email because you have an account with us.<br>
                    <a href="#" style="color: #95a5a6;">Unsubscribe</a> | 
                    <a href="#" style="color: #95a5a6;">Privacy Policy</a>
                </div>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Welcome Email Template
export const welcomeEmailTemplate = (userName , OTP) => {
    return emailTemplate(
        userName,
        `
        We're absolutely thrilled to have you join the Saraha App community! 🎉
        <br><br>
        Your account has been successfully created and you're all set to start connecting with friends, 
        family, and colleagues in a whole new way. Our platform is designed to make your communication 
        experience seamless, secure, and enjoyable.
        <br><br>
        <strong>What's Next?</strong>
        <ul style="text-align: left; margin: 15px 0; padding-left: 20px;">
            <li>Complete your profile setup</li>
            <li>Invite your friends to join</li>
            <li>Explore our amazing features</li>
            <li>Start your first conversation</li>
        </ul>
        `
    );
};

// Verification Email Template
export const verificationEmailTemplate = (userName, verificationLink) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Verify Your Email - Saraha App</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f6f9;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #28a745 0%, #20c997 100%);
                padding: 30px 20px;
                text-align: center;
                color: white;
            }
            
            .content {
                padding: 40px 30px;
                text-align: center;
            }
            
            .verify-button {
                display: inline-block;
                background: linear-gradient(45deg, #28a745, #20c997);
                color: white;
                padding: 18px 40px;
                text-decoration: none;
                border-radius: 30px;
                font-weight: 600;
                font-size: 18px;
                margin: 30px 0;
                transition: transform 0.3s ease;
            }
            
            .verify-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 25px rgba(40, 167, 69, 0.3);
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div style="font-size: 3rem; margin-bottom: 10px;">✉️</div>
                <h1>Email Verification</h1>
                <p>Almost there! Just one more step...</p>
            </div>
            
            <div class="content">
                <h2 style="color: #2c3e50; margin-bottom: 20px;">Hello ${userName}!</h2>
                
                <p style="font-size: 16px; color: #555; margin-bottom: 30px;">
                    Thank you for signing up with whisper app 📩! To complete your registration and 
                    start using all our amazing features, please verify your email address by 
                    clicking the button below.
                </p>
                
                <a href="${verificationLink}" class="verify-button">
                    Verify My Email Address
                </a>
                
                <p style="font-size: 14px; color: #7f8c8d; margin-top: 30px;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${verificationLink}" style="color: #28a745; word-break: break-all;">${verificationLink}</a>
                </p>
                
                <div style="background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px; padding: 20px; margin: 30px 0;">
                    <p style="color: #856404; font-size: 14px; margin: 0;">
                        ⏰ <strong>Important:</strong> This verification link will  in 24 hours for security reasons.
                    </p>
                </div>
                
                <p style="font-size: 12px; color: #95a5a6; margin-top: 20px;">
                    If you didn't create an account with whisper app 📩, please ignore this email.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Password Reset Email Template
export const passwordResetEmailTemplate = (userName, resetLink) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Reset Your Password - Saraha App</title>
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body {
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                background-color: #f4f6f9;
            }
            
            .email-container {
                max-width: 600px;
                margin: 0 auto;
                background-color: #ffffff;
                border-radius: 12px;
                overflow: hidden;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
            }
            
            .header {
                background: linear-gradient(135deg, #dc3545 0%, #fd7e14 100%);
                padding: 30px 20px;
                text-align: center;
                color: white;
            }
            
            .content {
                padding: 40px 30px;
                text-align: center;
            }
            
            .reset-button {
                display: inline-block;
                background: linear-gradient(45deg, #dc3545, #fd7e14);
                color: white;
                padding: 18px 40px;
                text-decoration: none;
                border-radius: 30px;
                font-weight: 600;
                font-size: 18px;
                margin: 30px 0;
                transition: transform 0.3s ease;
            }
            
            .reset-button:hover {
                transform: translateY(-3px);
                box-shadow: 0 10px 25px rgba(220, 53, 69, 0.3);
            }
        </style>
    </head>
    <body>
        <div class="email-container">
            <div class="header">
                <div style="font-size: 3rem; margin-bottom: 10px;">🔐</div>
                <h1>Password Reset</h1>
                <p>Secure your account with a new password</p>
            </div>
            
            <div class="content">
                <h2 style="color: #2c3e50; margin-bottom: 20px;">Hello ${userName}!</h2>
                
                <p style="font-size: 16px; color: #555; margin-bottom: 30px;">
                    We received a request to reset your password for your whisper app 📩 account. 
                    If you made this request, click the button below to create a new password.
                </p>
                
                <a href="${resetLink}" class="reset-button">
                    Reset My Password
                </a>
                
                <p style="font-size: 14px; color: #7f8c8d; margin-top: 30px;">
                    If the button doesn't work, copy and paste this link into your browser:<br>
                    <a href="${resetLink}" style="color: #dc3545; word-break: break-all;">${resetLink}</a>
                </p>
                
                <div style="background: #f8d7da; border: 1px solid #f5c6cb; border-radius: 8px; padding: 20px; margin: 30px 0;">
                    <p style="color: #721c24; font-size: 14px; margin: 0;">
                        ⚠️ <strong>Security Notice:</strong> This password reset link will expire in 1 hour.
                        If you didn't request this reset, please ignore this email and your password will remain unchanged.
                    </p>
                </div>
                
                <p style="font-size: 12px; color: #95a5a6; margin-top: 20px;">
                    For your security, never share this link with anyone.
                </p>
            </div>
        </div>
    </body>
    </html>
    `;
};

// Export default template for quick use
export default emailTemplate;
