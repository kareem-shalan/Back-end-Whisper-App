import joi from "joi";

export const loginSchema = {
    body: joi.object({
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net', 'org', 'eg'] } }).required().messages({
            "string.empty": "Email is required",
            "any.required": "Email is required",
            "string.email": "Invalid email address"
        }),
        password: joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required().messages({
            "string.empty": "Password is required",
            "any.required": "Password is required",
            "string.pattern.base": "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
        }),
    })
}

export const forgotPasswordSchema = {
    body: joi.object({
        email: joi.string().email().required().messages({
            "string.empty": "Email is required",
            "any.required": "Email is required",
            "string.email": "Invalid email address"
        }),
    })
}
export const verifyForgotPasswordSchema = {
    body: forgotPasswordSchema.body.append({
        otp: joi.string().required().messages({
            "string.empty": "OTP is required",
            "any.required": "OTP is required"
        })
    })


}

export const resetForgotPasswordSchema = {
    body: forgotPasswordSchema.body.append({
        password: joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required().messages({
            "string.empty": "Password is required",
            "any.required": "Password is required",
            "string.pattern.base": "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
        }),
        confirmPassword: joi.string().required().messages({
            "string.empty": "Confirm password is required",
            "any.required": "Confirm password is required"
        }),

        otp: joi.string().required().messages({
            "string.empty": "OTP is required",
            "any.required": "OTP is required"
        }),
        email: joi.string().email().required().messages({
            "string.empty": "Email is required",
            "any.required": "Email is required",
            "string.email": "Invalid email address"
        }),
    })
}

export const signupSchema = {
    body: joi.object({
        email: joi.string().email().required().messages({
            "string.empty": "Email is required",
            "any.required": "Email is required",
            "string.email": "Invalid email address"
        }),
        password: joi.string().pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&])[A-Za-z\\d@$!%*?&]{8,}$')).required().messages({
            "string.empty": "Password is required",
            "any.required": "Password is required",
            "string.pattern.base": "Password must contain at least 8 characters, one uppercase letter, one lowercase letter, one number and one special character"
        }),
        firstName: joi.string().required().messages({
            "string.empty": "First name is required",
            "any.required": "First name is required"
        }),
        lastName: joi.string().required().messages({
            "string.empty": "Last name is required",
            "any.required": "Last name is required"
        }),
        phone: joi.string().pattern(/^(?:010|011|012|015)\d{8}$/).required().messages({
            "string.empty": "Phone is required",
            "any.required": "Phone is required",
            "string.pattern.base": "Invalid Egyptian phone number. Format: +201XXXXXXXX or 01XXXXXXXX"
        }),
        gender: joi.string().required().messages({
            "string.empty": "Gender is required",
            "any.required": "Gender is required"
        })
    })
}
