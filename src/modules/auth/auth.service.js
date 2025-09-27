import UserModel, { role, provider } from "../../db/models/User.model.js"
import { asyncHandler, successHandler } from "../../utils/response.js"
import * as DBService from "../../db/db.service.js"
import { compareHash, generateHash } from "../../utils/security/hash.security.js"
import { encrypt } from "../../utils/security/encryption.security.js"
import { generateNewCredentials } from "../../utils/security/token.security.js"
import { OAuth2Client } from 'google-auth-library'
import emailEvent from "../../utils/email/email.event.js"
import { customAlphabet } from "nanoid"
import { v4 as uuidv4 } from 'uuid'




export const signup = asyncHandler(async (req, res, next) => {


    const { firstName,
        lastName,
        email,
        password,

        phone,
        gender } = req.body





    if (await DBService.findOne({ model: UserModel, filter: { email } })) {
        return next(new Error("User already exists", { cause: 400 }))
    }


    const hashedPassword = await generateHash({ plaintext: password, saltRound: 12 })


    const encryptedPhone = await encrypt({ plaintext: phone, secretKey: process.env.ENCRYPTION_SECRET })

    const otp = customAlphabet('0123456789', 6)()
    const confirmEmailOtp = await generateHash({ plaintext: otp })

    const [user] = await DBService.create({
        model: UserModel,
        data: [{ firstName, lastName, email, password: hashedPassword, confirmEmailOtp: confirmEmailOtp, phone: encryptedPhone, gender, role: role.user }],
        options: {
            validateBeforeSave: true,

        }
    })

    emailEvent.emit("confirmEmail", { email, firstName, otp })


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
    if (user.deletedAt !== null) {
        return next(new Error("User is deleted", { cause: 404 }))
    }

    if (!user.confirmEmailOtp, user.confirmEmailOtp === null) {
        return next(new Error("Email not verified", { cause: 400 }))
    }
  
    if (user.changeCredintialsTime) {
        await DBService.updateOne({
            model: UserModel,
            filter: { _id: user._id },
            data: { $unset: { changeCredintialsTime: 1 } }
        });
    }


    const isPasswordValid = await compareHash({ plaintext: password, hashedText: user.password })

    if (!isPasswordValid) {
        return next(new Error("Invalid email or password", { cause: 404 }))
    }

    // Device management logic
    const deviceId = req.headers["x-device-id"]
    const deviceName = req.headers["x-device-name"]
    const deviceType = req.headers["x-device-type"]
    const deviceOs = req.headers["x-device-os"]
    const deviceVersion = req.headers["x-device-version"]

    if (deviceId) {
        // Check if device already exists
        const existingDeviceIndex = user.devices.findIndex(device => device.deviceId === deviceId)

        if (existingDeviceIndex !== -1) {
            // Update existing device info
            user.devices[existingDeviceIndex] = {
                deviceId,
                deviceName,
                deviceType,
                deviceOs,
                deviceVersion


            }
        } else {
            // New device - check if user has reached the 2-device limit
            if (user.devices.length >= 2) {
                return next(new Error("You have reached the maximum number of devices", { cause: 400 }))

            }

            // Add new device
            user.devices.push({
                deviceId,
                deviceName,
                deviceType,
                deviceOs,
                deviceVersion
            })
        }
    }


    const newCredentials = await generateNewCredentials({ user })
    await user.save()


    successHandler({ res, message: "User logged in successfully", data: { newCredentials }, success: true })

})
export const confirmEmail = asyncHandler(async (req, res, next) => {
    const { email, otp } = req.body;

    const user = await DBService.findOne({
        model: UserModel,
        filter: { email }
    });


    if (!user || !user.confirmEmailOtp, user.confirmEmailOtp === null) {
        return next(new Error("User not found", { cause: 404 }));
    }


    if (user.otpBlockedUntil && user.otpBlockedUntil > Date.now()) {
        return next(new Error("You have reached the maximum number of attempts. Please try again after 5 minutes.", { cause: 429 }));
    }


    const isValid = await compareHash({ plaintext: otp, hashedText: user.confirmEmailOtp });

    if (!isValid) {
        const newCount = (user.otpUserCount || 0) + 1;
        const update = { otpUserCount: newCount };

        if (newCount >= 5) {
            update.otpBlockedUntil = Date.now() + 5 * 60 * 1000;
        }

        await DBService.updateOne({
            model: UserModel,
            filter: { email },
            data: update
        });

        return next(new Error("Invalid OTP", { cause: 400 }));
    }


    const updatedUser = await DBService.updateOne({
        model: UserModel,
        filter: { email },
        data: {
            confirmEmailOtp: Date.now(),
            otpUserCount: null,
            otpBlockedUntil: null,
            $inc: { __v: 1 }
        }
    });

    return updatedUser.matchedCount
        ? successHandler({
            res,
            message: "Email confirmed successfully",
            status: 200,
            data: {},
            success: true
        })
        : next(new Error("Something went wrong", { cause: 500 }));
});


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
                // Device management logic for Google login
                const deviceId = req.headers["x-device-id"]
                const deviceName = req.headers["x-device-name"]
                const deviceType = req.headers["x-device-type"]
                const deviceOs = req.headers["x-device-os"]
                const deviceVersion = req.headers["x-device-version"]

                if (deviceId) {
                    // Check if device already exists
                    const existingDeviceIndex = user.devices.findIndex(device => device.deviceId === deviceId)

                    if (existingDeviceIndex !== -1) {
                        // Update existing device info
                        user.devices[existingDeviceIndex] = {
                            deviceId,
                            deviceName,
                            deviceType,
                            deviceOs,
                            deviceVersion
                        }
                    } else {
                        // New device - check if user has reached the 2-device limit
                        if (user.devices.length >= 2) {
                            // Remove the oldest device (first in array) and add new one
                            user.devices.shift()
                        }

                        // Add new device
                        user.devices.push({
                            deviceId,
                            deviceName,
                            deviceType,
                            deviceOs,
                            deviceVersion
                        })
                    }

                    await user.save()
                }

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

        // Device management logic for Google login
        const deviceId = req.headers["x-device-id"]
        const deviceName = req.headers["x-device-name"]
        const deviceType = req.headers["x-device-type"]
        const deviceOs = req.headers["x-device-os"]
        const deviceVersion = req.headers["x-device-version"]

        if (deviceId) {
            // Check if device already exists
            const existingDeviceIndex = user.devices.findIndex(device => device.deviceId === deviceId)

            if (existingDeviceIndex !== -1) {
                // Update existing device info
                user.devices[existingDeviceIndex] = {
                    deviceId,
                    deviceName,
                    deviceType,
                    deviceOs,
                    deviceVersion
                }
            } else {
                // New device - check if user has reached the 2-device limit
                if (user.devices.length >= 2) {
                    // Remove the oldest device (first in array) and add new one
                    user.devices.shift()
                }

                // Add new device
                user.devices.push({
                    deviceId,
                    deviceName,
                    deviceType,
                    deviceOs,
                    deviceVersion
                })
            }

            await user.save()
        }

        const credentials = await generateNewCredentials({ user })

        return successHandler({ res, message: "User logged in successfully", data: { credentials }, success: true })


    })




export const forgotPassword = asyncHandler(
    async (req, res, next) => {
        const { email } = req.body
        const otp = customAlphabet('0123456789', 6)()

        const user = await DBService.findOneAndUpdate({
            model: UserModel,
            filter: {
                email,
                confirmEmailOtp: { $exists: true }
            },
            data: {
                confirmForgotPasswordOtp: await generateHash({ plaintext: otp }),
                changeCredintialsTime: new Date()

            },
            select: "firstName lastName email phone gender role provider "
        })
        if (!user) {
            return next(new Error("User not found", { cause: 404 }))
        }

        emailEvent.emit("forgotPassword", { email, firstName: user.firstName, otp })
        return successHandler({ res, message: "OTP sent to email successfully", status: 200, data: { user }, success: true })
    }
)
export const verifyForgotPassword = asyncHandler(
    async (req, res, next) => {

        const { email, otp } = req.body


        const user = await DBService.findOne({
            model: UserModel,
            filter: {
                email,
                confirmEmailOtp: { $exists: true },

                confirmForgotPasswordOtp: { $exists: true }
            },

        })



        if (!user) {
            return next(new Error("User not found", { cause: 404 }))
        }
        const isValid = await compareHash({ plaintext: otp, hashedText: user.confirmForgotPasswordOtp });
        if (!isValid) {
            return next(new Error("Invalid OTP", { cause: 400 }))
        }
        const updatedUser = await DBService.updateOne({
            model: UserModel,
            filter: { email },
            data: {
                confirmForgotPasswordOtp: null,
                $inc: { __v: 1 }
            },
        })



        return successHandler({ res, message: "OTP verified successfully", status: 200, data: { updatedUser }, success: true })

    }
)

export const resetForgotPassword = asyncHandler(

    async (req, res, next) => {

        const { email, password, confirmPassword, otp } = req.body
        if (password !== confirmPassword) {
            return next(new Error("Password and confirm password do not match", { cause: 400 }))
        }

        const user = await DBService.findOne({
            model: UserModel,
            filter: { email, confirmEmail: { $exists: true }, confirmForgotPasswordOtp: { $exists: true } },
        })
        if (!user) {
            return next(new Error("User not found", { cause: 404 }))
        }

        const updateUser = await DBService.updateOne({
            model: UserModel,
            filter: { email },
            data: { password: await generateHash({ plaintext: password, saltRound: process.env.SALT_ROUND }) },
            $inc: { __v: 1 }
        })
        return successHandler({ res, message: "Password verified successfully", status: 200, data: { updateUser }, success: true })
    }
)