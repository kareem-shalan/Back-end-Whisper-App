import { Router } from "express";
import * as authService from "./auth.service.js";

const router = Router()

router.post('/signup', authService.signup)
router.post('/login',  authService.login)
router.post('/login/google', authService.loginWithGoogle)
router.post('/signup/google', authService.signupWithGoogle)

export default router