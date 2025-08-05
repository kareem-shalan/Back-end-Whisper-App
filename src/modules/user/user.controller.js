import { Router } from "express";
import * as userService from "./user.service.js"
import { authenticationMiddleware } from "../../middleware/authentication.middleware.js"
import { tokenType } from "../../utils/security/token.security.js"
const router = Router()


router.get("/", authenticationMiddleware(), userService.getUser) 
router.get("/refresh-token", authenticationMiddleware({tokenType:tokenType.refresh}), userService.newUserCredentials) 


router.put("/password", authenticationMiddleware(), userService.updateUserPassword)

export default router
