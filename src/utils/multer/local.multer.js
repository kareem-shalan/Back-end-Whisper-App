import path from "node:path"
import fs from "node:fs"
let limits = {
    fileSize: 1024 * 1024 * 10, // 10MB
}
import multer from "multer"

export const fileValidations = {
    image: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
    document: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]

}

export const localFileUpload = ({ customPath = "general", validation = [] } = {}) => {
    let basePath = (`uploads/${customPath}`)

    let storage = multer.diskStorage(
        {
            destination: function (req, file, cb) {

                if (req.user._id) {
                    basePath += `/${req.user._id}`
                }
                let fullPath = path.resolve(`./src/${basePath}`)

                if (!fs.existsSync(fullPath)) {
                    fs.mkdirSync(fullPath, { recursive: true })
                }


                cb(null, path.resolve(fullPath))
            },
            filename: function (req, file, cb) {


                const uniqueSuffix = `${Date.now().toString(36).substring(2, 7)}-${Math.random().toString(36).substring(2, 7)}-${file.originalname}`
                file.finalPath = `${basePath}/${uniqueSuffix}`
                cb(null, uniqueSuffix)
            }
        }
    )

    let fileFilter = (req, file, cb) => {

        if (file.size > limits.fileSize) {
            return cb(new Error(`File size is too large, max size is ${limits.fileSize / 1024 / 1024}MB`), false)
        }
        if (validation.includes(file.mimetype)) {
            cb(null, true)
        } else {
            cb(new Error(`Invalid file type ${file.mimetype} is not allowed`), false)
        }
    }





    return multer(
        {
            dest: "./temp",
            fileFilter,
            limits,
            storage
        }
    )
}