import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';

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

export default pageRouter;
