import UserModel, { role, provider } from "../../db/models/User.model.js"
import { asyncHandler, successHandler } from "../../utils/response.js"
import * as DBService from "../../db/db.service.js"
import { compareHash, generateHash } from "../../utils/security/hash.security.js"
import { encrypt } from "../../utils/security/encryption.security.js"
import { generateNewCredentials } from "../../utils/security/token.security.js"

import { OAuth2Client } from 'google-auth-library'



export const signup = asyncHandler(async (req, res, next) => {


    const { firstName,
        lastName,
        email,
        password,
        confirmEmail,
        phone,
        gender } = req.body


    if (await DBService.findOne({ model: UserModel, filter: { email } })) {
        return next(new Error("User already exists", { cause: 400 }))
    }


    const hashedPassword = await generateHash({ plaintext: password, saltRound: 12 })

    const encryptedPhone = await encrypt({ plaintext: phone, secretKey: process.env.ENCRYPTION_SECRET })
    const [user] = await DBService.create({
        model: UserModel,
        data: [{ firstName, lastName, email, password: hashedPassword, confirmEmail, phone: encryptedPhone, gender, role: role.user }],
        options: { validateBeforeSave: true }
    })



    successHandler({ res, message: "User created successfully", status: 201, data: { user }, success: true })

})

export const login = asyncHandler(async (req, res, next) => {


    const {
        email,
        password,
    } = req.body




    if (!await DBService.findOne({ model: UserModel, filter: { email } })) {
        return next(new Error("User not found", { cause: 404 }))
    }





    const user = await DBService.findOne({
        model: UserModel,
        filter: { email },

    })

    const isPasswordValid = await compareHash({ plaintext: password, hashedText: user.password })

    if (!isPasswordValid) {
        return next(new Error("Invalid email or password", { cause: 404 }))
    }



    const newCredentials = await generateNewCredentials({ user })



    successHandler({ res, message: "User logged in successfully", data: { newCredentials }, success: true })

})


async function verifyGoogleToken({ idToken } = {}) {


    const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

    const ticket = await client.verifyIdToken({
        idToken: idToken,
        audience: process.env.GOOGLE_CLIENT_ID,  // Specify the WEB_CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[WEB_CLIENT_ID_1, WEB_CLIENT_ID_2, WEB_CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    return payload


}

export const signupWithGoogle = asyncHandler(
    async (req, res, next) => {
        const { idToken } = req.body
        const { email, email_verified } = await verifyGoogleToken({ idToken })

        if (!email_verified) {
            return next(new Error("Email not verified", { cause: 400 }))
        }

        const user = await DBService.findOne({
            model: UserModel,
            filter: { email }
        })
        if (!user) {
            return next(new Error("User not found", { cause: 404 }))
        }

        if (user) {
            if (user.provider === provider.google) {
                const credentials = await generateNewCredentials({ user })


                return successHandler({ res, message: "User logged in successfully", data: { credentials }, success: true })

            }





            const newUser = await DBService.create({
                model: UserModel,
                data: [{
                    email,
                    firstName: name,
                    picture,
                    role: role.user,
                    provider: provider.google,
                    confirmEmail: Date.now(),
                    provider: provider.system,
                }]
            })



            return successHandler({ res, message: "User logged in successfully", data: { newUser }, success: true })

        }
    })
export const loginWithGoogle = asyncHandler(
    async (req, res, next) => {
        const { idToken } = req.body
        const { email, name, picture, email_verified } = await verifyGoogleToken({ idToken })

        if (!email_verified) {
            return next(new Error("Email not verified", { cause: 400 }))
        }

        const user = await DBService.findOne({
            model: UserModel,
            filter: { email, provider: provider.google }
        })
        if (!user) {
            return next(new Error("User not found", { cause: 404 }))
        }


        const credentials = await generateNewCredentials({ user })


        return successHandler({ res, message: "User logged in successfully", data: { credentials }, success: true })


    })



