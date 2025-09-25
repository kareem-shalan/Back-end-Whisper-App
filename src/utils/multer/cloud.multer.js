
let limits = {
    fileSize: 1024 * 1024 * 10, // 10MB
}
import multer from "multer"

export const fileValidations = {
    image: ["image/jpeg", "image/png", "image/jpg", "image/webp"],
    document: ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "application/vnd.ms-powerpoint", "application/vnd.openxmlformats-officedocument.presentationml.presentation"]

}

export const cloudFileUpload = ({  validation = [] } = {}) => {


    let storage = multer.diskStorage({} )

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
           
            fileFilter,
            limits,
            storage
        }
    )
}