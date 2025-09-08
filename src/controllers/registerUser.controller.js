import { userRegisterDoador, userRegisterDonatario, userRegisterInstituicao, userRegisterOng } from "../services/registerUser.service.js";

async function registerUserDoador(req, res) {
    
    console.log(`📦   Dados recebidos: ${JSON.stringify(req.body)}`);

    try{

        const {} = req.body;

    }catch (error){
        console.error(`❌   Erro na transação: ${error}   ❌`);
        throw new Error('➡️   Erro ao registrar usuário Doador   ⬅️');
    };

};

async function registerUserDonatario(req, res) {
    
    console.log(`📦   Dados recebidos: ${JSON.stringify(req.body)}`);

    try{

        const {} = req.body;

    }catch (error){
        console.error(`❌   Erro na transação: ${error}   ❌`);
        throw new Error('➡️   Erro ao registrar usuário Doador   ⬅️');
    };

};

export { registerUserDoador, registerUserDonatario };