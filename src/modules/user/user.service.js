import { asyncHandler, successHandler } from "../../utils/response.js";
import { decrypt, encrypt } from "../../utils/security/encryption.security.js";
import { generateNewCredentials, generateToken, logoutEnum, revokeTokenForAll } from "../../utils/security/token.security.js";
import { compareHash, generateHash } from "../../utils/security/hash.security.js";
import { create, deleteOne, findById, findOne, findOneAndUpdate } from "../../db/db.service.js";
import UserModel from "../../db/models/User.model.js";
import { customAlphabet } from "nanoid";
import emailEvent from "../../utils/email/email.event.js";
import BlackListModel from "../../db/models/blackList.model.js";
import * as DBService from "../../db/db.service.js";
import { cloud, deleteResourcesFromCloudinary, deleteResourcesFromCloudinaryByPrefix, destroyFromCloudinary, uploadMultipleToCloudinary, uploadToCloudinary } from "../../utils/multer/cloudinary.js";
import { MessageModel } from "../../db/models/Mesage.model.js";


export const getUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params
    const user = await findById({
        model: UserModel,
        id: userId,
        confirmEmail: { $exists: true },
        select: "firstName lastName email phone gender role provider "
    })
    if (!user) {
        return res.status(404).json({
            success: false,
            message: "User not found",
            status: 404
        })
    }

    return successHandler({ res, message: "User fetched successfully", status: 200, data: { user }, success: true })
})
export const profile = asyncHandler(async (req, res, next) => {
    const { user } = req

    user.messages = await MessageModel.find({ receiver: user._id }).populate("sender", "firstName lastName picture")

    user.phone = await decrypt({ encryptedText: user.phone, secretKey: process.env.ENCRYPTION_SECRET })

    return successHandler({ res, message: "User fetched successfully", status: 200, data: { user }, success: true })
})
export const logout = asyncHandler(async (req, res, next) => {
    const { flag = logoutEnum.signoutFromAll } = req.body
    const expirationTime = new Date(Date.now() + (Number(process.env.JWT_REVOKE_EXPIRES_IN || 31536000) * 1000));
    let status = 200
    switch (flag) {
        case logoutEnum.signoutFromAll:
            await DBService.updateOne({
                model: UserModel,
                filter: { _id: req.decoded.id },
                data: { changeCredintialsTime: expirationTime }
            })

            break
        default:
            await revokeTokenForAll({ req })


            status = 201





            break
    }

    // Remove current device from user's devices array on logout
    const deviceId = req.headers["x-device-id"]
    if (deviceId) {
        const deviceIndex = req.user.devices.findIndex(device => device.deviceId === deviceId)
        if (deviceIndex !== -1) {
            req.user.devices.splice(deviceIndex, 1)
            await req.user.save()
        }
    }

    return successHandler({ res, message: "User logged out successfully", data: {}, status: status, success: true })
})
export const updateUser = asyncHandler(async (req, res, next) => {
    const { user } = req
    if (req.body.phone) {
        req.body.phone = await encrypt({ plaintext: req.body.phone, secretKey: process.env.ENCRYPTION_SECRET })
    }

    const updatedUser = await findOneAndUpdate({
        model: UserModel,
        filter: { _id: user._id },
        data: req.body,
        select: "firstName lastName email phone gender role provider "
    })

    return successHandler({ res, message: "User updated successfully", status: 200, data: { user }, success: true })
})

export const uploadProfileImage = asyncHandler(
    async (req, res, next) => {
        


        const { public_id, secure_url } = await uploadToCloudinary(
            {
                path: req.file.path,
                folder: `users/profileImages/${req.user._id}/${req.user.firstName + "_" + req.user.lastName}`
            }
        )

        const user = await findOneAndUpdate(
            {
                model: UserModel,
                filter: { _id: req.user._id },
                data: { picture: { public_id, secure_url } },
                options: { new: false }
            }
        )

        if (user?.picture?.public_id) {
            await destroyFromCloudinary({ public_id: user.picture.public_id })

        }




        return successHandler({ res, message: "Profile image uploaded successfully", status: 200, data: { user }, success: true })
    })
export const uploadCoverImage = asyncHandler(async (req, res, next) => {
    const attachments = await uploadMultipleToCloudinary({ files: req.files, path: `users/coverImages/${req.user._id}/${req.user.firstName + "_" + req.user.lastName}` })


    const user = await DBService.findOneAndUpdate(
        {
            model: UserModel,
            filter: { _id: req.user._id },
            data: { coverImages: attachments },
            options: { new: false }

        }

    )

    if (user?.coverImages?.length) {
        for (const image of user.coverImages) {
            if (image.public_id) {
                await destroyFromCloudinary({ public_id: image.public_id })
            }

        }
    }




    return successHandler({ res, message: "Cover image uploaded successfully", status: 200, data: { user }, success: true })
})

export const freezeAccount = asyncHandler(async (req, res, next) => {
    const { userId } = req.params
    const user = await findById({
        model: UserModel,
        id: userId,
        confirmEmail: { $exists: true },
        select: "firstName lastName email phone gender role provider "
    })


    if (!user || user.isFreeze) {
        return next(new Error("User not found or already frozen", { cause: 404 }))
    }
    if (user.deletedAt !== null || user.deletedBy !== null) {
        return next(new Error("User already deleted", { cause: 400 }))
    }


    const updatedUser = await findOneAndUpdate({
        model: UserModel,
        filter: {
            _id: user._id,
            isFreeze: false,


        },
        data: {
            isFreeze: true,
            deletedBy: user._id,
            deletedAt: new Date(),
            restoreAt: null,
            restoreBy: null,
            changeCredintialsTime: new Date()
        },
        select: "firstName lastName email phone gender role provider ",


    })

    return successHandler({ res, message: "User frozen successfully", status: 200, data: { updatedUser }, success: true })

})

export const restoreAccount = asyncHandler(async (req, res, next) => {
    const { userId } = req.params
    const user = await findById({
        model: UserModel,
        id: userId,
        confirmEmail: { $exists: true },
        select: "firstName lastName email phone gender role provider "
    })


    if (!user || user.isFreeze) {
        return next(new Error("User not found or already frozen", { cause: 404 }))
    }
    if (user.deletedAt === null || user.deletedBy === null) {
        return next(new Error("User not deleted", { cause: 400 }))
    }




    const updatedUser = await findOneAndUpdate({
        model: UserModel,
        filter: {
            _id: user._id,
            isFreeze: true,
        },
        data: {
            isFreeze: false,
            restoreAt: new Date(),
            restoreBy: user._id,
            deletedAt: null,
            deletedBy: null
        },
        select: "firstName lastName email phone gender role provider ",


    })

    return successHandler({ res, message: "User restored successfully", status: 200, data: { updatedUser }, success: true })

})


export const updateUserPassword = asyncHandler(async (req, res, next) => {
    const { user } = req
    const { oldPassword, newPassword, flag } = req.body

    // Compare plaintext oldPassword with the hashed password from database
    const isPasswordValid = await compareHash({ plaintext: oldPassword, hashedText: user.password })

    if (!isPasswordValid) {
        return next(new Error("Invalid password", { cause: 400 }))
    }
    if (oldPassword === newPassword) {
        return next(new Error("New password cannot be the same as the old password", { cause: 400 }))
    }
    let updatedDate = {}
    switch (flag) {
        case logoutEnum.signoutFromAll:
            updatedDate.changeCredintialsTime = new Date();

        case logoutEnum.signout:
            await revokeTokenForAll({ req })


            break;
        default:
            break;
    }


    // Hash the new password (consistent with signup process)
    const hashedNewPassword = await generateHash({ plaintext: newPassword, saltRound: process.env.SALT_ROUND })
    user.password = hashedNewPassword
    await user.save()

    // Generate token with proper secretKey
    const token = await generateToken({
        payload: { id: user._id },
        secretKey: process.env.ENCRYPTION_SECRET,
        options: {
            expiresIn: "1h",

        }
    })

    return successHandler({ res, message: "Password updated successfully", status: 200, data: { user, token }, success: true })
})


export const newUserCredentials = asyncHandler(async (req, res, next) => {
    const { user } = req
    // Generate Tokens
    const newCredentials = await generateNewCredentials({ user })


    return successHandler({ res, message: "User logged in successfully", data: { newCredentials }, success: true })





})


export const deleteUser = asyncHandler(async (req, res, next) => {
    const { userId } = req.params
    const user = await findById({
        model: UserModel,
        id: userId,
        confirmEmail: { $exists: true },
        select: "firstName lastName email phone gender role provider "
    })
    if (!user) {
        return next(new Error("User not found", { cause: 404 }))
    }


    await deleteOne({
        model: UserModel,
        filter: { _id: user._id }
    })
    if (user?.picture?.public_id) {
        await deleteResourcesFromCloudinaryByPrefix({ prefix: `users/profileImages/${userId}/${user.firstName + "_" + user.lastName}` })
    }
    if (user?.coverImages?.length) {
        await deleteResourcesFromCloudinaryByPrefix({ prefix: `users/coverImages/${userId}/${user.firstName + "_" + user.lastName}` })

    }
    return successHandler({ res, message: "User deleted successfully", status: 200, data: { user }, success: true })
})

export const updatePassword = asyncHandler(async (req, res, next) => {
    const { user } = req
    const { newPassword, oldPassword, confirmPassword } = req.body
    const isPasswordValid = await compareHash({ plaintext: oldPassword, hashedText: user.password })
    if (!isPasswordValid) {
        return next(new Error("Invalid password", { cause: 400 }))
    }

    if (newPassword !== confirmPassword) {
        return next(new Error("New password and confirm password do not match", { cause: 400 }))
    }
    if (oldPassword === newPassword) {
        return next(new Error("New password cannot be the same as the old password", { cause: 400 }))
    }

    const history = Array.isArray(req.user.oldPasswords)
        ? req.user.oldPasswords.slice(-5)
        : []

    for (const hashed of history) {
        const isPasswordReused = await compareHash({ plaintext: newPassword, hashedText: hashed })
        if (isPasswordReused) {
            return next(new Error("New password is used before  please use a different password", { cause: 400 }))
        }
    }







    const updatedUser = await findOneAndUpdate({
        model: UserModel,
        filter: { _id: user._id },
        data: {
            $set: { password: await generateHash({ plaintext: newPassword, saltRound: process.env.SALT_ROUND }) },
            $push: {
                oldPasswords: { $each: [req.user.password], $slice: -5 }
            }
        },
        select: "firstName lastName email phone gender role provider "
    })




    return successHandler({ res, message: "Password updated successfully", status: 200, data: { updatedUser }, success: true })
})



