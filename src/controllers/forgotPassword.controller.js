import pool from "../db/pool.db.js";
import path from "path";
import { 
  startPasswordReset, 
  verifyResetCode, 
  completePasswordReset 
} from '../services/forgotPassword.service.js';

async function handleRequestReset(req, res){

  console.log(`❗   Entrando na rota POST /forgotPassword`);
  console.log(`📦   Dados recebidos: `, JSON.stringify(req.body, null, 2));

  try {

    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'O e-mail é obrigatório.' });
    }

    await startPasswordReset(email);

    res.status(201).json({
        message: 'Código enviado com sucesso.',
        redirectTo: '/esqueci/verificar'
    });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Erro interno.' });
  }

};

async function handleVerifyCode(req, res){

  console.log(`❗   Entrando na rota POST /verifyCode`);
  console.log(`📦   Dados recebidos: `, JSON.stringify(req.body, null, 2));

    try {
        const { email, code } = req.body;
        if (!email || !code) {
            return res.status(400).json({ message: 'E-mail e código são obrigatórios.' });
        }
        const result = await verifyResetCode(email, code);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }

};

async function handleCompleteReset(req, res){

  console.log(`❗   Entrando na rota POST /resetPassword`);
  console.log(`📦   Dados recebidos: `, JSON.stringify(req.body, null, 2));

    try {
        const { token, newPassword } = req.body;
        if (!token || !newPassword) {
            return res.status(400).json({ message: 'O token e a nova senha são obrigatórios.' });
        }
        const result = await completePasswordReset(token, newPassword);
        res.status(200).json(result);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

export { handleRequestReset, handleVerifyCode, handleCompleteReset}