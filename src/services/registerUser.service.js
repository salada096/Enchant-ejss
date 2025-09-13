import pool from '../db/pool.db.js';

async function userRegisterPessoaFisica( { nomeCompleto, email, tipo_doador, senha, pessoaCpf, pessoaRg, pessoaTelefone } ) {
    
    try{

        const usuarioResult = await pool.query(
            `INSERT INTO usuario (nome, email, senha, documento_numero, documento_tipo, tipo_usuario) 
            VALUES ($1, $2, $3, $4, 'CPF', $5)
            RETURNING id`,
            [nomeCompleto, email, senha, pessoaCpf, tipo_doador]
        );
        
        const usuarioId = usuarioResult.rows[0].id;
        console.log(`Usuário criado com sucesso. ID: ${usuarioId}`);

        await pool.query(
            `INSERT INTO usuario_doador (usuario_id, rg) 
            VALUES ($1, $2)`,
            [usuarioId, pessoaRg]
        );

        await pool.query(
            `INSERT INTO endereco (cep, bairro, cidade, usuario_id) 
            VALUES ('000000-000', 'Lugar Nenhum', 'Lugar Nenhum', $1)`,
            [usuarioId]
        );

        await pool.query(
            `INSERT INTO telefone (telefone, usuario_id)
            VALUES ($1, $2)`,
            [pessoaTelefone, usuarioId]
        )

        return usuarioResult.rows[0];

    }catch (error){
        console.error(`❌   Erro na transação: ${error}`);
        throw new Error('➡️   Erro ao registrar usuário Pessoa Física   ⬅️');
    }

}

async function userRegisterInstituicao( { nomeCompleto, email, tipo_doador, senha, instituicaoTipo, instituicaoCnpj, instituicaoTelefone, instituicaoCep, instituicaoBairro } ) {
    
    try{
    
        const usuarioResult = await pool.query(
            `INSERT INTO usuario (nome, email, senha, documento_numero, documento_tipo, tipo_usuario) 
            VALUES ($1, $2, $3, $4, 'CNPJ', 'instituicao')
            RETURNING id`,
            [nomeCompleto, email, senha, instituicaoCnpj]
        );
        
        const usuarioId = usuarioResult.rows[0].id;
        console.log(`Usuário criado com sucesso. ID: ${usuarioId}`);

        await pool.query(
            `INSERT INTO usuario_instituicao (usuario_id, tipo_instituicao) 
            VALUES ($1, $2)`,
            [usuarioId, instituicaoTipo]
        );

        await pool.query(
            `INSERT INTO endereco (cep, bairro, cidade, usuario_id) 
            VALUES ($1, $2, 'Lugar Nenhum', $3)`,
            [instituicaoCep, instituicaoBairro, usuarioId]
        );

        await pool.query(
            `INSERT INTO telefone (telefone, usuario_id)
            VALUES ($1, $2)`,
            [instituicaoTelefone, usuarioId]
        )

        return usuarioResult.rows[0];

    }catch (error){
        console.error(`❌   Erro na transação: ${error}`);
        throw new Error('➡️   Erro ao registrar usuário Doador   ⬅️');
    }

}

async function userRegisterOng( { nomeCompleto, email, tipo_doador, senha, ongCnpj, ongTelefone, ongAno } ) {
    
    try{

        const usuarioResult = await pool.query(
            `INSERT INTO usuario (nome, email, senha, documento_numero, documento_tipo, tipo_usuario) 
            VALUES ($1, $2, $3, $4, 'CNPJ', $5)
            RETURNING id`,
            [nomeCompleto, email, senha, ongCnpj, tipo_doador]
        );
        
        const usuarioId = usuarioResult.rows[0].id;
        console.log(`Usuário criado com sucesso. ID: ${usuarioId}`);

        await pool.query(
            `INSERT INTO usuario_ong (usuario_id, data_fundacao, certificado_ong) 
            VALUES ($1, $2, 'TRUE')`,
            [usuarioId, ongAno]
        );

        await pool.query(
            `INSERT INTO endereco (cep, bairro, cidade, usuario_id) 
            VALUES ('000000-000', 'Lugar Nenhum', 'Lugar Nenhum', $1)`,
            [usuarioId]
        );

        await pool.query(
            `INSERT INTO telefone (telefone, usuario_id)
            VALUES ($1, $2)`,
            [ongTelefone, usuarioId]
        )

        return usuarioResult.rows[0];

    }catch (error){
        console.error(`❌   Erro na transação: ${error}`);
        throw new Error('➡️   Erro ao registrar usuário Doador   ⬅️');
    }

}


async function userRegisterDonatario( { nomeCompleto, email, senha, telefone, endereco, cpf, rg, cep, obvdon, estadoCivil, numerodepessoas, residente_especial, ocupacao } ) {
    
    try{
    
        const usuarioResult = await pool.query(
            `INSERT INTO usuario (nome, email, senha, documento_numero, documento_tipo, tipo_usuario) 
            VALUES ($1, $2, $3, $4, 'CPF', 'donatario')
            RETURNING id`,
            [nomeCompleto, email, senha, cpf]

        );

        const usuarioId = usuarioResult.rows[0].id;
        console.log(`Usuário criado com sucesso. ID: ${usuarioId}`);

        await pool.query(
            `INSERT INTO usuario_donatario (usuario_id, rg, genero, descricao, estado_civil, numero_residente, residente_especial, status_ocupacao) 
            VALUES ($1, $2, 'Masculino', $3, $4, $5, $6, $7)`,
            [usuarioId, rg, obvdon, estadoCivil, numerodepessoas, residente_especial, ocupacao]
        );

        await pool.query(
            `INSERT INTO endereco (cep, bairro, cidade, usuario_id) 
            VALUES ($1, 'Lugar Nenhum', 'Lugar Nenhum', $2)`,
            [cep, usuarioId]
        );

        await pool.query(
            `INSERT INTO telefone (telefone, usuario_id)
            VALUES ($1, $2)`,
            [telefone, usuarioId]
        )

        return usuarioResult.rows[0];

    }catch (error){
        console.error(`❌   Erro na transação: ${error}`);
        throw new Error('➡️   Erro ao registrar usuário Donatario   ⬅️');
    }
}

export { userRegisterPessoaFisica, userRegisterDonatario, userRegisterInstituicao, userRegisterOng };