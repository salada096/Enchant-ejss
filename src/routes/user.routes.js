import express from 'express';
import multer from 'multer';
import { registerUserDoador, registerUserDonatario } from '../controllers/registerUser.controller.js';
import { login } from '../controllers/userLogin.controller.js';

const userRouter = express.Router();
const upload = multer();

userRouter.post('/cadastrar/doador', upload.none(), registerUserDoador);

userRouter.post('/cadastrar/donatario', upload.none(), registerUserDonatario);

userRouter.post('/login', login);

export default userRouter;