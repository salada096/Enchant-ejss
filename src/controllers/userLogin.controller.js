import { encontrarEmail } from '../services/userLogin.service.js';

async function login(req, res) {
    console.log("Dados recebidos:", req.body);
    const { email, senha } = req.body;

    try {
        const user = await encontrarEmail(email);

        if (!user) {
            return res.status(401).json({ error: 'E-mail inválido' });
        }

        // compara a senha enviada com a senha criptografada
        // const isMatch = await bcrypt.compare(senha, user.senha);
        const isMatch = (senha === user.senha);

        if (!isMatch) {
            return res.status(401).json({ error: 'Senha inválida' });
        }
        
        res.status(200).json({
            message: 'Login bem-sucedido!',
            user: {
                id: user.id,
                email: user.email
            },
            redirectUrl: '/'
        });

    } catch (error) {
        console.error('Erro ao fazer login:', error);
        res.status(500).json({ error: 'Ocorreu um erro interno no servidor.' });
    }
}

export { login };