import pool from '../db/pool.db.js';

async function userRegisterDoador( { } ) {
    
    try{

        

    }catch (error){
        console.error(`❌   Erro na transação: ${error}`);
        throw new Error('➡️   Erro ao registrar usuário Doador   ⬅️');
    }

}

async function userRegisterDonatario( { } ) {
    
    try{



    }catch (error){
        console.error(`❌   Erro na transação: ${error}`);
        throw new Error('➡️   Erro ao registrar usuário Doador   ⬅️');
    }
}

async function userRegisterInstituicao( { } ) {
    
    try{
    
        

    }catch (error){
        console.error(`❌   Erro na transação: ${error}`);
        throw new Error('➡️   Erro ao registrar usuário Doador   ⬅️');
    }

}

async function userRegisterOng( { } ) {
    
    try{

        

    }catch (error){
        console.error(`❌   Erro na transação: ${error}`);
        throw new Error('➡️   Erro ao registrar usuário Doador   ⬅️');
    }

}

export { userRegisterDoador, userRegisterDonatario, userRegisterInstituicao, userRegisterOng };