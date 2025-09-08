import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';
import pool from '../db/pool.db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pageRouter = express.Router();

// ROTA PRINCIPAL ALTERADA
pageRouter.get('/', (req, res) => {
    console.log(`⬆️   Rota / acessada.`);
    // A linha abaixo foi modificada para carregar a index.html
    res.sendFile(path.join(__dirname, '..', 'views', 'index.html'));
});

// ROTA DE TESTE DO BANCO DE DADOS (mantida como estava)
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
