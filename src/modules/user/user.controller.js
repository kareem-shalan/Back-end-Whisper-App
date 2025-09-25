import { Router } from "express";
import * as userService from "./user.service.js"
import { authenticationMiddleware } from "../../middleware/authentication.middleware.js"
import { tokenType } from "../../utils/security/token.security.js"
import * as validators from "./user.validation.js";
import validation from "../../middleware/validation.meddleware.js";
import { localFileUpload, fileValidations } from "../../utils/multer/local.multer.js";
import { cloudFileUpload } from "../../utils/multer/cloud.multer.js";

const router = Router(
    {
        caseSensitive: true,
        strict: true,
    }
)

router.post("/logout", authenticationMiddleware(), validation(validators.logoutSchema), userService.logout)
router.get("/profile", authenticationMiddleware(), userService.profile)
router.get("/:userId", validation(validators.shareProfileSchema), userService.getUser)
router.patch("/update-profile", authenticationMiddleware(), validation(validators.updateUserSchema), userService.updateUser)
router.patch("/upload-profile-image", authenticationMiddleware(), cloudFileUpload({validation: fileValidations.image }).single("image"), userService.uploadProfileImage)
router.patch("/upload-cover-image", authenticationMiddleware(), cloudFileUpload({  validation: [...fileValidations.image, ...fileValidations.document] }).array("images", 3), userService.uploadCoverImage)


router.delete("/freeze-account/:userId", authenticationMiddleware(), validation(validators.freezeAccountSchema), userService.freezeAccount)
router.patch("/restore-account/:userId", authenticationMiddleware(), validation(validators.restoreAccountSchema), userService.restoreAccount)
router.get("/refresh-token", authenticationMiddleware({ tokenType: tokenType.refresh }), userService.newUserCredentials)
router.put("/password", authenticationMiddleware(), userService.updateUserPassword)
router.delete("/delete-account/:userId", authenticationMiddleware(), validation(validators.deleteUserSchema), userService.deleteUser)
router.post("/update-password", authenticationMiddleware(), validation(validators.updatePasswordSchema), userService.updatePassword)

export default router
