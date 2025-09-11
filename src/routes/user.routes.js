import express from 'express';
import multer from 'multer';
import { registerUserDoador, registerUserDonatario } from '../controllers/registerUser.controller.js';
import { login } from '../controllers/userLogin.controller.js';

const userRouter = express.Router();
const upload = multer();

userRouter.post('/cadastrar/doador', upload.none(), registerUserDoador);

userRouter.post('/cadastrar/donatario', upload.none(), registerUserDonatario);

userRouter.post('/login', login);

//Esqueciasenha

userRouter.post('/forgot-password', async (req, res, next) => {
  const { handleForgotPassword } = await import('../controllers/forgotPassword.controller.js');
  return handleForgotPassword(req, res, next);
});

userRouter.post('/verify-code', async (req, res, next) => {
  const { handleVerifyCode } = await import('../controllers/forgotPassword.controller.js');
  return handleVerifyCode(req, res, next);
});

userRouter.post('/resend-code', async (req, res, next) => {
  const { handleResendCode } = await import('../controllers/forgotPassword.controller.js');
  return handleResendCode(req, res, next);
});

userRouter.post('/reset-password', async (req, res, next) => {
  const { handleResetPassword } = await import('../controllers/forgotPassword.controller.js');
  return handleResetPassword(req, res, next);
});

export default userRouter;
