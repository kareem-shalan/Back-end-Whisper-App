import express from 'express'
import connectDB from './db/connect.db.js'
import authController from './modules/auth/auth.controller.js'
import userController from './modules/user/user.controller.js'
import { errorHandler } from './utils/response.js'
import { workingEmailTemplate } from './template/index.html.js'
import cors from 'cors'
// import { sendEmail } from './utils/email/sendEmail.js'






const bootstrap = async () => {
    // create express app
    const app = express()
    const port = process.env.PORT || 3000

    app.use(cors())
    // connect to db
    await connectDB()

    // create a route
    app.use(express.json())
    app.get('/', (req, res, next) => res.send('Hello World!'))
    app.use('/auth', authController)
    app.use('/user', userController)
    
   
    app.all('*', (req, res, next) => res.status(404).json({
        success: false,
        message: "Route not found"
    }))

    app.use(errorHandler)


    // send email
    // await sendEmail({
    //     // to: "alikemo547@gmail.com",
    //     subject: "Hello From kareem  ✔",
    //     text: "Hello world?", // plain‑text body
    //     html: workingEmailTemplate("kareem")
    // })

    // start the server

    app.listen(port, () => console.log(`Example app listening on port ${port}!`))
}

export default bootstrap