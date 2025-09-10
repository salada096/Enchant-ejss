import pool from '../db/pool.db.js';
/**
 * Busca um usuário pelo email no banco de dados.
 * @param {string} email - O email do usuário a ser buscado.
 * @returns {Promise<object|null>} O objeto do usuário se encontrado, ou null.
 */
async function encontrarEmail(email) {
    const result = await pool.query('SELECT * FROM usuario WHERE email = $1', [email]);
    
    if (result.rows.length > 0) {
        return result.rows[0]; // Retorna o primeiro usuário encontrado
    }
    
    return null; // Retorna nulo se nenhum usuário for encontrado
}

// Exporta as funções do serviço
export { encontrarEmail };