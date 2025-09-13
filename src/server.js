import express from 'express';
import path from 'path';
import pool from './db/pool.db.js'
import {fileURLToPath} from 'url';
import pageRoutes from './routes/pages.routes.js';
import userRoutes from './routes/user.routes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3005;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, '..', 'public')));
    
app.use(pageRoutes);
app.use(userRoutes);

app.get('/test-db', async (req, res) => {

    console.log(`\n🔃   Iniciando o teste de conexão com o Banco de dados   🔃`)

    try {
        const result = await pool.query('SELECT NOW() as current_time');
        console.log('\n✅   Teste de conexão bem-sucedido   ✅');
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

app.listen(PORT, () => {
    console.log(`\n✅   Server running in http://localhost:${PORT}   ✅`);
});