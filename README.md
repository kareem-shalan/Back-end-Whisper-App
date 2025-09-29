# 🚀 Sraha App - Backend API

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white)
![Express.js](https://img.shields.io/badge/Express.js-404D59?style=for-the-badge)
![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=JSON%20web%20tokens&logoColor=white)
![Cloudinary](https://img.shields.io/badge/Cloudinary-3448CC?style=for-the-badge&logo=cloudinary&logoColor=white)

**A robust, secure, and scalable messaging application backend built with Node.js and Express**

[![License: ISC](https://img.shields.io/badge/License-ISC-blue.svg)](https://opensource.org/licenses/ISC)
[![Author](https://img.shields.io/badge/Author-Kareem%20Shalan-green.svg)](https://www.linkedin.com/in/kareem-shalan)

</div>

---

## 📋 Table of Contents

- [✨ Features](#-features)
- [🛠️ Tech Stack](#️-tech-stack)
- [🚀 Quick Start](#-quick-start)
- [📁 Project Structure](#-project-structure)
- [🔐 API Endpoints](#-api-endpoints)
- [🔧 Configuration](#-configuration)
- [📦 Dependencies](#-dependencies)
- [🛡️ Security Features](#️-security-features)
- [📊 Rate Limiting](#-rate-limiting)
- [☁️ File Upload](#️-file-upload)
- [📧 Email System](#-email-system)
- [🔄 Cron Jobs](#-cron-jobs)
- [🧪 Testing](#-testing)
- [📝 Environment Variables](#-environment-variables)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

---

## ✨ Features

### 🔐 **Authentication & Authorization**
- **Multi-provider Authentication**: System-based and Google OAuth2
- **Secure Password Management**: Bcrypt hashing with salt rounds
- **JWT Token System**: Access and refresh token implementation
- **Email Verification**: OTP-based email confirmation
- **Password Recovery**: Secure forgot password flow with OTP
- **Device Management**: Track and manage user devices

### 💬 **Messaging System**
- **Real-time Messaging**: Send messages between users
- **File Attachments**: Support for image uploads via Cloudinary
- **Message History**: Persistent message storage
- **User Management**: Profile management and user operations

### 🛡️ **Security & Performance**
- **Rate Limiting**: Advanced rate limiting with MongoDB storage
- **Input Validation**: Joi schema validation for all endpoints
- **Security Headers**: Helmet.js for security headers
- **CORS Configuration**: Cross-origin resource sharing setup
- **Request Logging**: Morgan HTTP request logger
- **Error Handling**: Centralized error handling middleware

### ☁️ **Cloud Integration**
- **Cloudinary Integration**: Image upload and management
- **Email Service**: Nodemailer with HTML templates
- **MongoDB Atlas**: Cloud database with Mongoose ODM

---

## 🛠️ Tech Stack

| Category | Technology |
|----------|------------|
| **Runtime** | Node.js (ES Modules) |
| **Framework** | Express.js 5.x |
| **Database** | MongoDB with Mongoose |
| **Authentication** | JWT, Google OAuth2, Bcrypt |
| **File Upload** | Multer + Cloudinary |
| **Email** | Nodemailer |
| **Security** | Helmet, CORS, Rate Limiting |
| **Validation** | Joi |
| **Logging** | Morgan |
| **Scheduling** | Node-cron |

---

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- Cloudinary account
- Email service credentials

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/sraha-app.git
   cd sraha-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy the environment template
   cp src/config/.env.example src/config/.env.production
   
   # Edit the environment variables
   nano src/config/.env.production
   ```

4. **Start the application**
   ```bash
   # Development mode with auto-reload
   npm run dev
   
   # Production mode
   npm start
   ```

5. **Verify installation**
   ```bash
   curl http://localhost:8080
   # Expected: "Sraha App Backend API is Running 🚀"
   ```

---

## 📁 Project Structure

```
src/
├── app.js                    # Application entry point
├── app.controller.js         # Main application controller
├── config/                   # Configuration files
├── db/                       # Database configuration
│   ├── connect.db.js        # MongoDB connection
│   ├── db.service.js        # Database service layer
│   └── models/              # Mongoose models
│       ├── User.model.js    # User schema
│       ├── Message.model.js # Message schema
│       └── blackList.model.js # Token blacklist
├── middleware/              # Custom middleware
│   ├── authentication.middleware.js
│   └── validation.meddleware.js
├── modules/                 # Feature modules
│   ├── auth/               # Authentication module
│   ├── user/               # User management
│   └── Messages/           # Messaging system
├── template/               # Email templates
├── uploads/                # File uploads directory
└── utils/                  # Utility functions
    ├── cron/              # Scheduled tasks
    ├── email/             # Email utilities
    ├── multer/            # File upload configs
    └── security/          # Security utilities
```

---

## 🔐 API Endpoints

### Authentication Routes (`/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/auth/signup` | User registration | ❌ |
| `POST` | `/auth/login` | User login | ❌ |
| `POST` | `/auth/login/google` | Google OAuth login | ❌ |
| `POST` | `/auth/signup/google` | Google OAuth signup | ❌ |
| `PATCH` | `/auth/forgot-password` | Request password reset | ❌ |
| `PATCH` | `/auth/verify-forgot-password` | Verify reset OTP | ❌ |
| `PATCH` | `/auth/reset-forgot-password` | Reset password | ❌ |
| `PATCH` | `/auth/confirm-email` | Confirm email address | ❌ |

### User Routes (`/user`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `GET` | `/user/profile` | Get user profile | ✅ |
| `PUT` | `/user/profile` | Update user profile | ✅ |
| `DELETE` | `/user/profile` | Delete user account | ✅ |

### Message Routes (`/message`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| `POST` | `/message/:receiverId` | Send message | ❌ |
| `POST` | `/message/:receiverId/sender` | Send message (authenticated) | ✅ |

---

## 🔧 Configuration

### Database Configuration
The application uses MongoDB with Mongoose ODM. Connection is established in `src/db/connect.db.js`:

```javascript
const connectDB = async () => {
    const url = process.env.DB_URI
    try {
        await mongoose.connect(url)
        console.log("Connected to MongoDB")
    } catch (error) {
        console.log(error)
    }
}
```

### Rate Limiting
Advanced rate limiting is implemented with MongoDB storage:

```javascript
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000, // 10 minutes
    limit: 100, // requests per window
    store: new MongoStore({
        uri: process.env.DB_URI,
        collectionName: "rateLimit",
        expires: 10 * 60 * 1000
    })
})
```

---

## 📦 Dependencies

### Core Dependencies
- **express**: Web framework
- **mongoose**: MongoDB object modeling
- **jsonwebtoken**: JWT token handling
- **bcryptjs**: Password hashing
- **joi**: Schema validation

### Security Dependencies
- **helmet**: Security headers
- **cors**: Cross-origin resource sharing
- **express-rate-limit**: Rate limiting
- **rate-limit-mongo**: MongoDB rate limit store

### File & Media Dependencies
- **multer**: File upload handling
- **cloudinary**: Cloud image management

### Email & Communication
- **nodemailer**: Email sending
- **google-auth-library**: Google OAuth

### Utilities
- **dotenv**: Environment variables
- **morgan**: HTTP request logger
- **node-cron**: Task scheduling
- **uuid**: Unique identifier generation
- **nanoid**: URL-safe unique IDs

---

## 🛡️ Security Features

### Authentication Security
- **Password Hashing**: Bcrypt with salt rounds
- **JWT Tokens**: Secure token-based authentication
- **Token Blacklisting**: Expired token management
- **Device Tracking**: Multi-device session management

### API Security
- **Rate Limiting**: Prevents abuse and DDoS attacks
- **Input Validation**: Joi schema validation
- **Security Headers**: Helmet.js protection
- **CORS**: Controlled cross-origin access

### Data Security
- **Encryption**: Crypto-js for sensitive data
- **Secure Headers**: Helmet security middleware
- **Environment Variables**: Sensitive data protection

---

## 📊 Rate Limiting

The application implements sophisticated rate limiting:

- **Window**: 10 minutes
- **Limit**: 100 requests per window
- **Storage**: MongoDB-based persistence
- **Key Strategy**: IP + endpoint based
- **Skip Failed**: Failed requests don't count

---

## ☁️ File Upload

### Cloudinary Integration
- **Image Upload**: Automatic image optimization
- **File Validation**: Type and size validation
- **CDN Delivery**: Fast global content delivery
- **Transformations**: On-the-fly image processing

### Supported Formats
- **Images**: JPEG, PNG, GIF, WebP
- **Max Size**: Configurable per endpoint
- **Multiple Files**: Up to 2 attachments per message

---

## 📧 Email System

### Features
- **HTML Templates**: Beautiful email templates
- **OTP Delivery**: Secure one-time passwords
- **Welcome Emails**: User onboarding
- **Password Reset**: Secure recovery emails

### Templates
- Email verification
- Password reset
- Welcome messages
- System notifications

---

## 🔄 Cron Jobs

### Automated Tasks
- **Token Cleanup**: Remove expired tokens
- **Database Maintenance**: Cleanup old records
- **Email Queue**: Process pending emails

### Configuration
```javascript
// Example cron job
const deleteExpiredTokens = async () => {
    // Cleanup logic here
}
```

---

## 🧪 Testing

### Postman Collection
A comprehensive Postman collection is included (`whisper-app.postman_collection.json`) with:

- Authentication endpoints
- User management
- Message operations
- Error handling examples

### Manual Testing
```bash
# Test basic connectivity
curl http://localhost:8080

# Test authentication
curl -X POST http://localhost:8080/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"password123"}'
```

---

## 📝 Environment Variables

Create a `.env.production` file in `src/config/`:

```env
# Server Configuration
PORT=8080
MOOD=PRO
NODE_ENV=production

# Database
DB_URI=mongodb://localhost:27017/sraha-app
# or MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/sraha-app

# JWT Configuration
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=7d

# Email Configuration
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password

# Cloudinary Configuration
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# Google OAuth
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some amazing feature'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open a Pull Request**

### Development Guidelines
- Follow ES6+ JavaScript standards
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass

---

## 📄 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**Kareem Shalan**
- GitHub: [@kareemshalan](https://github.com/kareemshalan)
- Email: alikemo547@gmail.com

---

<div align="center">

### ⭐ Star this repository if you found it helpful!

**Built with ❤️ by Kareem Shalan**

![Made with Love](https://img.shields.io/badge/Made%20with-❤️-red.svg)

</div>
