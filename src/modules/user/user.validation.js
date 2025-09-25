import joi from "joi";
import { isValidObjectId } from "mongoose";
import { logoutEnum } from "../../utils/security/token.security.js";

export const shareProfileSchema = {

    params: joi.object().keys(
        {
            userId: joi.string().custom((value, helpers) => {
                if (!isValidObjectId(value)) {
                    return helpers.error('any.invalid', { message: 'Invalid ObjectId' });
                }
                return value;
            }).length(24).required()
        }
    )

}
export const updateUserSchema = {
    body: joi.object().keys(
        {
            fullName: joi.string().required(),
            email: joi.string().email().required(),
            phone: joi.string().required(),

        }
    )
}


export const freezeAccountSchema = {
    params: joi.object().keys(
        {
            userId: joi.string().custom((value, helpers) => {
                if (!isValidObjectId(value)) {
                    return helpers.error('any.invalid', { message: 'Invalid ObjectId' });
                }
                return value;
            }).length(24)
        }



    )
}


export const restoreAccountSchema = {
    params: joi.object().keys(
        {
            userId: joi.string().custom((value, helpers) => {
                if (!isValidObjectId(value)) {
                    return helpers.error('any.invalid', { message: 'Invalid ObjectId' });
                }
                return value;
            }).length(24)
        }
    )
}

export const deleteUserSchema = {
    params: joi.object().keys(
        {
            userId: joi.string().custom((value, helpers) => {
                if (!isValidObjectId(value)) {
                    return helpers.error('any.invalid', { message: 'Invalid ObjectId' });
                }
                return value;
            }).length(24)
        }
    )
}

export const updatePasswordSchema = {
    body: joi.object({
        newPassword: joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required().messages({
            "string.empty": "New password is required",
            "any.required": "New password is required",
            "string.pattern.base": "New password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
        }).not(joi.ref('oldPassword')).messages({
            "any.only": "New password cannot be the same as the old password"
        }),
        oldPassword: joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required().messages({
            "string.empty": "Old password is required",
            "any.required": "Old password is required",
            "string.pattern.base": "Old password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
        }),
        confirmPassword: joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required().messages({
            "string.empty": "Confirm password is required",
            "any.required": "Confirm password is required",
            "string.pattern.base": "Confirm password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
        }).valid(joi.ref('newPassword')).messages({
            "any.only": "Confirm password cannot be the same as the new password"
        })
    })
}

export const logoutSchema = {
    body: joi.object().keys(
        {
            flag: joi.string().valid(logoutEnum.signoutFromAll, logoutEnum.signoutFromDevice, logoutEnum.stayLoggedIn).default(logoutEnum.stayLoggedIn).required()
        }
    )
}