import express from 'express'
import connectDB from './db/connect.db.js'
import authController from './modules/auth/auth.controller.js'
import userController from './modules/user/user.controller.js'
import messageController from './modules/Messages/message.controller.js'
import { errorHandler } from './utils/response.js'
import { workingEmailTemplate } from './template/index.html.js'
import cors from 'cors'
import { sendEmail } from './utils/email/sendEmail.js'
import path from 'node:path';
import morgan from 'morgan'
import helmet from 'helmet'
import { deleteExpiredTokens } from './utils/cron/cron.js'
import { ipKeyGenerator, rateLimit } from 'express-rate-limit'
import MongoStore from 'rate-limit-mongo/lib/mongoStore.js'




const bootstrap = async () => {

    const limiter = rateLimit(
        {
            windowMs: 10 * 60 * 1000,
            limit: 100,

            message: {
                success: false,
                message: "Too many requests, please try again later try again in 10 minutes"
            }
            ,
            standardHeaders: "draft-8"
            ,
            skipFailedRequests: true,
            keyGenerator: (req) => {
                const ip = ipKeyGenerator(req.ip)
                return `${ip}-${req.path}`


            },
            handler: (req, res, next , options) => {
                res.status(429).json({
                    success: false,
                    message: "Too many requests, please try again later try again in 10 minutes",
                    remainingTime: options.remainingTime

                })
            },
            store: new MongoStore(
                {
                    uri: process.env.DB_URI,
                    collectionName: "rateLimit",
                    expires: 10 * 60 * 1000
                }
            )

        }
    )
    // create express app
    const app = express()
    const port = process.env.PORT || 8080
    // app.use(express.static('public'))
    app.use(cors())
    
    app.use(helmet())
    app.use(morgan('dev'))
    // connect to db
    await connectDB()

    // delete expired tokens
    const task = await deleteExpiredTokens()
    // rate limit
    app.use(limiter)

    // create a route
    app.use("/uploads", express.static(path.resolve("./src/uploads")))
    app.use(express.json())
    app.get('/', (req, res, next) => res.send(' Sraha App Backend API is Running 🚀 '))
    app.use('/auth', authController)
    app.use('/user', userController)

    // message routes
    app.use('/message', messageController)


    app.all('{/*dummy}', (req, res, next) => res.status(404).json({
        success: false,
        message: "Route not found"
    }))

    app.use(errorHandler)


    // send email
    await sendEmail({
        to: "alikemo547@gmail.com",
        subject: "Hello From kareem  ✔",
        text: "Hello world?", // plain‑text body
        html: workingEmailTemplate("kareem")
    })

    // start the server

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

export default bootstrap