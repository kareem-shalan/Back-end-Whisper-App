import { Router } from "express";
import * as authService from "./auth.service.js";
import validation from "../../middleware/validation.meddleware.js";
import * as authValidators from "./auth.validators.js";

const router = Router()

router.post('/signup', validation(authValidators.signupSchema), authService.signup)
router.post('/login', validation(authValidators.loginSchema), authService.login)
router.patch('/forgot-password', validation(authValidators.forgotPasswordSchema), authService.forgotPassword)
router.patch('/verify-forgot-password', validation(authValidators.verifyForgotPasswordSchema), authService.verifyForgotPassword)
router.patch('/reset-forgot-password', validation(authValidators.resetForgotPasswordSchema), authService.resetForgotPassword)
router.patch('/confirm-email', authService.confirmEmail)
router.post('/login/google', authService.loginWithGoogle)
router.post('/signup/google',  authService.signupWithGoogle)


export default router