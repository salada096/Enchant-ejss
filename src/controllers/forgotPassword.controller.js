import { startPasswordReset, verifyResetCode, completePasswordReset } from '../services/forgot.Password.services.js';

// Controlador para a Rota 1: Solicitar o envio do código
export const handleRequestReset = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: 'O e-mail é obrigatório.' });
    }
    await startPasswordReset(email);
    res.json({ success: true, message: 'Código enviado com sucesso.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message || 'Erro interno.' });
  }
};

// Controlador para a Rota 2: Verificar o código
export const handleVerifyCode = async (req, res) => {
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

// Controlador para a Rota 3: Definir a nova senha
export const handleCompleteReset = async (req, res) => {
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
