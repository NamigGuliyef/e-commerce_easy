import { Router } from "express";
import { forgotPasswordController, loginController, recoveryController, registerController, verifyController } from "../controllers/authController.js";
const r = Router()

//REGISTER || method => POST
r.post('/register', registerController)
//LOGIN || method => POST
r.post('/login', loginController)
//Forgot Password => POST
r.post('/forgot-password', forgotPasswordController)
//Verify Code => POST
r.post('/verify', verifyController)
//Recovery password => POST
r.post('/recovery/:token',recoveryController)

export default r
