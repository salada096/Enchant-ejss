import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import pool from '../db/pool.db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pageRouter = express.Router();

pageRouter.get('/', (req, res) => {

    console.log(`⬆️   Rota / acessada.`);
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
    
});

pageRouter.get('/cadastro/doador', (req, res) => {

    console.log(`⬆️   Rota /cadastro/doador acessada.`);
    res.sendFile(path.join(__dirname, '..', 'views', 'comprador', 'cadastrodoador.html'));

});

pageRouter.get('/cadastro/donatario', (req, res) => {

    console.log(`⬆️   Rota /cadastro/donatario acessada.`);
    res.sendFile(path.join(__dirname, '..', 'views', 'comprador', 'cadastrodonatario1.html'));

});

pageRouter.get('/login', (req, res) => {

    console.log(`⬆️   Rota /login acessada.`);
    res.sendFile(path.join(__dirname, '..', 'views', 'enchant', 'entrar1.html'));

});

pageRouter.get('/esqueci', (req, res) => {

    console.log(`⬆️   Rota /esqueci acessada.`);
    res.sendFile(path.join(__dirname, '..', 'views', 'enchant', 'esqueciasenha1.html'));

});
pageRouter.get('/esqueci/verificar', (req, res) => {

    console.log(`⬆️   Rota /esqueci/verificar acessada.`);
    res.sendFile(path.join(__dirname, '..', 'views', 'enchant', 'esqueciasenha2.html'));

});

pageRouter.get('/esqueci/redefinir', (req, res) => {

    console.log(`⬆️   Rota /esqueci/redifinir acessada.`);
    res.sendFile(path.join(__dirname, '..', 'views', 'enchant', 'esqueciasenha3.html'));

});

pageRouter.get('/test-db', async (req, res) => {

    console.log(`🔃   Iniciando o teste de conexão com o Banco de dados   🔃`)

    try {
        const result = await pool.query('SELECT NOW() as current_time');
        console.log('✅   Teste de conexão bem-sucedido   ✅');
        res.status(200).json({ 
            success: true, 
            message: 'Conexão com banco OK',
            time: result.rows[0].current_time 
        });
    } catch (error) {
        console.error(`❌   Erro no teste de conexão: ${error}   ❌`);
        res.status(500).json({ 
            success: false,
            error: 'Erro na conexão com o banco',
            details: error.message 
        });
    }

});

export default pageRouter;
