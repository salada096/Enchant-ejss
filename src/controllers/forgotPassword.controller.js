import { 
    startPasswordReset, 
    verifyResetCode, 
    completePasswordReset 
} from '../services/forgotPassword.service.js';

async function handleRequestReset(req, res){

  console.log(`\n❗   Entrando na rota POST /forgotPassword`);
  console.log(`\n📦   Dados recebidos: ${JSON.stringify(req.body, null, 2)}\n`);

  try {

    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({ message: 'O e-mail é obrigatório.' });
    }

    // ❗ MUDANÇA AQUI: Pegue o resultado da função
    const result = await startPasswordReset(email);

    // ❗ MUDANÇA AQUI: Verifique se o resultado tem o flowToken
    // Isso indica que o e-mail foi encontrado
    if (result.flowToken) {
        // Se o e-mail existe, retorne sucesso e os dados necessários para o front-end
        return res.status(200).json({
            message: 'Código enviado com sucesso.',
            redirectTo: '/esqueci/verificar',
            flowToken: result.flowToken // Adicione o token na resposta
        });
    } else {
        // Se o e-mail não existe, retorne a mensagem genérica
        return res.status(200).json({
            message: 'Nenhum e-mail encontrado.'
        });
    }
    
  } catch (error) {

    console.error('Erro no controller handleRequestReset:', error);
    res.status(500).json({ success: false, message: error.message || 'Erro interno.' });

  }

};

async function handleVerifyCode(req, res){

    console.log(`\n❗  Entrando na rota POST /verifyCode`);
    console.log(`\n📦  Dados recebidos: `, JSON.stringify(req.body, null, 2));

    try {
        // <-- MUDANÇA 1: Pega 'token' e 'code' do corpo da requisição.
        const { token, code } = req.body;

        if (!token || !code) { // <-- MUDANÇA 2: Validação atualizada
            return res.status(400).json({ message: 'Token e código são obrigatórios.' });
        }
        
        // <-- MUDANÇA 3: Passa 'token' e 'code' para o service.
        const result = await verifyResetCode(token, code);

        res.status(200).json(result);

    } catch (error) {
        console.log(`\n❌   Código inválido   ❌`);
        res.status(400).json({ message: error.message });
    }
};


async function handleCompleteReset(req, res){

    console.log(`\n❗   Entrando na rota POST /resetPassword`);
    console.log(`\n📦   Dados recebidos: `, JSON.stringify(req.body, null, 2));

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