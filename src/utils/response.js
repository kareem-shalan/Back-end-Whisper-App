export const asyncHandler = (fn) => {
    return async (req, res, next) => {



        return await fn(req, res, next).catch((error) => {
            return next(error, { cause: 500 })
        })




        
    }
}

export const errorHandler = (err, req, res, next) => {
    res.status(err.cause || 400).json({
        success: false,
        message: err.message,
        error: process.env.MOOD === "DEV" ? err.stack : undefined
    })
}


export const successHandler = ({ res, message = "Done", status = 200, data = {}, success = true } = {}) => {
    res.status(status).json({
        success: true,
        message,
        data,
        success
    })
}