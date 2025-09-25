import { asyncHandler } from "../utils/response.js"

const validation = (schema) => {
    return asyncHandler(
        async (req, res, next) => {

            const validationErrors = []
            for (const key of Object.keys(schema)) {
                const validationResult = schema[key].validate(req[key], { abortEarly: false })
                if (validationResult.error) {
                    validationErrors.push(
                        {
                            key: validationResult.error.details[0].path[0],
                            message: validationResult.error.details.map(detail => {
                                return {
                                    key: detail.path[0],
                                    message: detail.message
                                }
                            })
                        })
                }
            }
            console.log(validationErrors)
            if (validationErrors.length > 0) {
                // Format the error messages properly
                const formattedErrors = validationErrors.map(error => {
                    if (Array.isArray(error.message)) {
                        return error.message.map(msg => msg.message).join(', ')
                    }
                    return error.message
                }).join('; ')

                return res.status(400).json({
                    success: false,
                    message: formattedErrors,
                    errors: validationErrors, // Keep detailed errors for debugging
                    status: 400
                })
            }
            next()
        }
    )
}

export default validation