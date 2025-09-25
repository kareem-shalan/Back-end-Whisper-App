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





const bootstrap = async () => {
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
    console.log({ task })

    // create a route
    app.use("/uploads", express.static(path.resolve("./src/uploads")))
    app.use(express.json())
    app.get('/', (req, res, next) => res.send('Hello World!'))
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