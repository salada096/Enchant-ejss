import express from 'express';
import path from 'path';
import {fileURLToPath} from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const pageRouter = express.Router();

pageRouter.get('/', (req, res) => {
    console.log(`
⬆️   Rota / acessada.`);
    res.render('index');
});

pageRouter.get('/quemsomos', (req, res) => {
    console.log(`
⬆️   Rota /quemsomos acessada.`);
    res.render('enchant/quemsomos1');
})

pageRouter.get('/saibamais', (req, res) => {
    console.log(`
⬆️   Rota /saibamais acessada.`);
    res.render('enchant/saibamais1');
});

pageRouter.get('/suporte', (req, res) => {
    console.log(`
⬆️   Rota /suporte acessada.`);
    res.render('enchant/suporte');
});

pageRouter.get('/politica', (req, res) => {
    console.log(`
⬆️   Rota /politica acessada.`);
    res.render('enchant/privacidade1');
});

pageRouter.get('/cadastro/doador', (req, res) => {
    console.log(`
⬆️   Rota /cadastro/doador acessada.`);
    res.render('comprador/cadastrodoador');
});

pageRouter.get('/cadastro/donatario', (req, res) => {

    console.log(`
⬆️   Rota /cadastro/donatario acessada.`);
    res.render('comprador/cadastrodonatario1');

});

pageRouter.get('/login', (req, res) => {

    console.log(`
⬆️   Rota /login acessada.`);
    res.render('enchant/entrar1');

});

pageRouter.get('/esqueci', (req, res) => {

    console.log(`
⬆️   Rota /esqueci acessada.`);
    res.render('enchant/esqueciasenha1');

});
pageRouter.get('/esqueci/verificar', (req, res) => {

    console.log(`
⬆️   Rota /esqueci/verificar acessada.`);
    res.render('enchant/esqueciasenha2');

});

pageRouter.get('/esqueci/redefinir', (req, res) => {

    console.log(`
⬆️   Rota /esqueci/redifinir acessada.`);
    res.render('enchant/esqueciasenha3');

});

export default pageRouter;