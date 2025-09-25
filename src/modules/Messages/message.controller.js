import { Router } from "express";
import * as messageService from "./message.service.js"
import { fileValidations } from "../../utils/multer/local.multer.js";
import { cloudFileUpload } from "../../utils/multer/cloud.multer.js";
import validation from "../../middleware/validation.meddleware.js";
import * as validators from "./message.validators.js";
import { authenticationMiddleware } from "../../middleware/authentication.middleware.js";
const router = Router()


router.post("/:receiverId",
    

    cloudFileUpload({ validation: fileValidations.image }).array("attachments", 2),
    validation(validators.createMessageSchema),


    messageService.createMessage)
router.post("/:receiverId/sender",
    
authenticationMiddleware(),
    cloudFileUpload({ validation: fileValidations.image }).array("attachments", 2),
    validation(validators.createMessageSchema),


    messageService.createMessage)
// router.get("/", messageService.getMessages)

// router.get("/:receiverId", messageService.getMessage)

// router.put("/:receiverId", messageService.updateMessage)

// router.delete("/:receiverId", messageService.deleteMessage)

export default router