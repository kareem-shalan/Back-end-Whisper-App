import { asyncHandler, successHandler } from "../../utils/response.js";
import { decrypt } from "../../utils/security/encryption.security.js";
import { generateNewCredentials, generateToken } from "../../utils/security/token.security.js";
import { compareHash, generateHash } from "../../utils/security/hash.security.js";
import { role } from "../../db/models/User.model.js";
export const getUser = asyncHandler(async (req, res, next) => {
    const { user } = req

    user.phone = await decrypt({ encryptedText: user.phone, secretKey: process.env.ENCRYPTION_SECRET })

    return successHandler({ res, message: "User fetched successfully", status: 200, data: { user }, success: true })
})



export const updateUserPassword = asyncHandler(async (req, res, next) => {
    const { user } = req
    const { oldPassword, newPassword } = req.body

    // Compare plaintext oldPassword with the hashed password from database
    const isPasswordValid = await compareHash({ plaintext: oldPassword, hashedText: user.password })

    if (!isPasswordValid) {
        return next(new Error("Invalid password", { cause: 400 }))
    }
    if (oldPassword === newPassword) {
        return next(new Error("New password cannot be the same as the old password", { cause: 400 }))
    }

    // Hash the new password (consistent with signup process)
    const hashedNewPassword = await generateHash({ plaintext: newPassword, saltRound: process.env.SALT_ROUND })
    user.password = hashedNewPassword
    await user.save()

    // Generate token with proper secretKey
    const token = await generateToken({
        payload: { id: user._id },
        secretKey: process.env.ENCRYPTION_SECRET,
        options: { expiresIn: "1h" }
    })

    return successHandler({ res, message: "Password updated successfully", status: 200, data: { user, token }, success: true })
})


export const newUserCredentials = asyncHandler(async (req, res, next) => {
    const { user } = req
        // Generate Tokens
 const  newCredentials = await generateNewCredentials({ user })


    return successHandler({ res, message: "User logged in successfully", data: { newCredentials }, success: true })





})
