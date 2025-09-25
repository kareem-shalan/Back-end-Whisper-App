import { asyncHandler, successHandler } from "../../utils/response.js"
import { MessageModel } from "../../db/models/Mesage.model.js"
import * as DBService from "../../db/db.service.js"
import { uploadMultipleToCloudinary } from "../../utils/multer/cloudinary.js"
import UserModel from "../../db/models/User.model.js"


export const createMessage = asyncHandler(
    async (req, res, next) => {
        const { receiverId } = req.params
        if (! await DBService.findOne({ model: UserModel, filter: { _id: receiverId, deletedAt: null, confirmEmail: { $exists: true } } })) {
            return next(new Error("Receiver not found", { cause: 404 }))
        }
        const { content } = req.body
        
        let attachmentsData = []
        if (req.files) {
            attachmentsData = await uploadMultipleToCloudinary({ files: req.files, path: `messages/attachments/${receiverId}` })
        }

        const [message] = await DBService.create({
            model: MessageModel,
            data: [{
                content,
                
                receiver: receiverId,
                attachments: attachmentsData,
                sender: req.user?._id
            }]
        })



        return successHandler({ res, message: "Message created successfully", status: 201, data: { message }, success: true })
    }
)

