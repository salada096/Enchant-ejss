import express from 'express';
import multer from 'multer';
import { 
  registerUserDoador, 
  registerUserDonatario 
} from '../controllers/registerUser.controller.js';
import { login } from '../controllers/userLogin.controller.js';
import { 
  handleRequestReset, 
  handleVerifyCode, 
  handleCompleteReset
} from '../controllers/forgotPassword.controller.js';

const userRouter = express.Router();
const upload = multer();

userRouter.post('/cadastrar/doador', upload.none(), registerUserDoador);

userRouter.post('/cadastrar/donatario', upload.none(), registerUserDonatario);

userRouter.post('/login', upload.none(), login);

userRouter.post('/forgotPassword', upload.none(), handleRequestReset)

userRouter.post('/verifyCode', upload.none(), handleVerifyCode);

userRouter.post('/resetPassword', upload.none(), handleCompleteReset);

export default userRouter;
