import pool from "../db/pool.db.js";
import path from "path";
import { userRegisterPessoaFisica, userRegisterDonatario, userRegisterInstituicao, userRegisterOng } from "../services/registerUser.service.js";

async function registerUserDoador(req, res) {

    try{

        console.log(`📦   Dados recebidos: ${JSON.stringify(req.body, null, 2)}`);

        const { 
            nomeCompleto, 
            email, 
            tipo_doador, 
            senha, 
            pessoaCpf, 
            pessoaRg, 
            pessoaTelefone, 
            ongCnpj, 
            ongTelefone, 
            ongAno,
            instituicaoTipo,
            instituicaoCnpj, 
            instituicaoTelefone, 
            instituicaoCep, 
            instituicaoBairro
        } = req.body;

        await pool.query('BEGIN');

        if(tipo_doador === "pessoa_fisica"){
            
            console.log(`\n⌛   Iniciando o cadastro de Pessoa Física   ⌛\n`);

            const novoDoador = await userRegisterPessoaFisica({ nomeCompleto, email, tipo_doador, senha, pessoaCpf, pessoaRg, pessoaTelefone });

        }else if(tipo_doador === "ong"){

            console.log(`\n⌛   Iniciando o cadastro de Organização Não Governamental (ONG)   ⌛\n`);

            const novoDoador = await userRegisterOng({ nomeCompleto, email, tipo_doador, senha, ongCnpj, ongTelefone, ongAno });

        }else{

            console.log(`\n⌛   Iniciando o cadastro de Instituição   ⌛\n`);

            const novoDoador = await userRegisterInstituicao({ nomeCompleto, email, tipo_doador, senha, instituicaoTipo, instituicaoCnpj, instituicaoTelefone, instituicaoCep, instituicaoBairro });

        }

        await pool.query('COMMIT');
        console.log(`\n✅   Cadastro de ${tipo_doador} realizado com sucesso   ✅\n`);
        
        res.status(201).json({
            message: `Cadastro de ${tipo_doador} realizado com sucesso`,
            redirectTo: '/login'
        });


    }catch (error){

        await pool.query('ROLLBACK');
        console.error(`❌   Erro na transação: ${error}   ❌`);
        throw error;

    };

};

async function registerUserDonatario(req, res) {

    try {

        console.log(`📦   Dados recebidos: ${JSON.stringify(req.body, null, 2)}`);

        const { 
            nomeCompleto, 
            email, 
            senha, 
            telefone, 
            endereco, 
            cpf, 
            rg, 
            cep, 
            obvdon, 
            estadoCivil, 
            numerodepessoas, 
            pessoas, 
            ocupacao, 
            termos 
        } = req.body;

        const files = req.files;

        if (files) {
            console.log('\n🖼️   Arquivos recebidos:');
            console.log('\n👤   Foto de Perfil:', files['fileDon']);
            console.log('\n🎬   Vídeo Esclarecedor:', files['videoDon']);
        }

        const residente_especial = pessoas ? true : false;

        await pool.query('BEGIN');

        console.log(`\n⌛   Iniciando o cadastro de Donatário   ⌛\n`);

        const novoDonatario = await userRegisterDonatario({ nomeCompleto, email, senha, telefone, endereco, cpf, rg, cep, obvdon, estadoCivil, numerodepessoas, residente_especial, ocupacao });

        await pool.query('COMMIT');
        console.log(`\n✅   Cadastro de donatario realizado com sucesso   ✅\n`);

        res.status(201).json({
            message: `Cadastro realizado com sucesso`,
            redirectTo: '/login'
        });

    } catch (error) {

        await pool.query('ROLLBACK');
        console.error(`❌ Erro na transação: ${error} ❌`);
        throw error;

    };
};

export { registerUserDoador, registerUserDonatario };