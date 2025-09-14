import pool from '../db/pool.db.js';
import nodemailer from 'nodemailer';
import 'dotenv/config';
import crypto from 'crypto';

console.log(`\n🔃   Ambiente carregado. SMTP_HOST: ${process.env.SMTP_HOST}`);
console.log(`\n🔃   Ambiente carregado. SMTP_PORT: ${process.env.SMTP_PORT}`);
console.log(`\n🔃   Ambiente carregado. SMTP_USER: ${process.env.SMTP_USER}`);
console.log(`\n🔃   Ambiente carregado. SMTP_PASS: ${process.env.SMTP_PASS}`);

// Transporter SMTP (Mailtrap)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT || 587),
  secure: false, // para Mailtrap a porta 2525 não usa SSL/TLS
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

function sixDigits() {
  return ('' + Math.floor(100000 + Math.random() * 900000));
}

async function ensureResetTable() {

  await pool.query(`
    CREATE TABLE IF NOT EXISTS password_resets (
      id SERIAL PRIMARY KEY,
      email TEXT NOT NULL,
      code TEXT,
      token TEXT,
      expires_at TIMESTAMP NOT NULL,
      used BOOLEAN DEFAULT FALSE,
      created_at TIMESTAMP DEFAULT NOW()
    );
  `);

}

// A sua função startPasswordReset completa
async function startPasswordReset(email) {
  
  console.log(`\n🔎   Email recebido para busca: ${email}`);
  const sanitizedEmail = email.toLowerCase().trim();

  console.log(`\n🔎   Email sanitizado para busca: ${sanitizedEmail}`);

  const u = await pool.query(`SELECT id, email FROM usuario WHERE email = $1`, [sanitizedEmail]);

  console.log(`\n🔎   Resultado da busca (linhas encontradas): ${u.rows.length}`);

  // ❗ MUDANÇA AQUI: Mensagem de segurança mais genérica
  if (u.rows.length === 0) {
    console.log(`\n❌   Nenhum e-mail encontrado.❌   `);
    return { message: 'Nenhum e-mail encontrado.' };
  }

  await ensureResetTable();

  const code = sixDigits();
  console.log(`\n#️⃣   Código gerado: ${code}`);

  const token = crypto.randomBytes(24).toString('hex');
  console.log(`\n#️⃣   Token gerado: ${token}`);

  const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
  console.log(`\n#️⃣   Data de expiração: ${expiresAt}`);

  await pool.query(` UPDATE password_resets SET used = TRUE WHERE email = $1 AND used = FALSE`, [sanitizedEmail]);

  await pool.query(`INSERT INTO password_resets (email, code, token, expires_at, used) VALUES ($1, $2, $3, $4, FALSE)`, [sanitizedEmail, code, token, expiresAt]);

  const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3005'}/reset-password.html?token=${token}&email=${encodeURIComponent(sanitizedEmail)}`;

  await transporter.sendMail({
    from: process.env.MAIL_FROM || process.env.SMTP_USER,
    to: sanitizedEmail,
    subject: 'Código de verificação - Redefinição de senha',
    html: `
      <p>Use o código abaixo para continuar a redefinição da sua senha (válido por 15 minutos):</p>
      <p style="font-size:20px; font-weight:700; letter-spacing:2px;">${code}</p>
      <p>Ou se preferir, clique no link:</p>
      <p><a href="${resetLink}">${resetLink}</a></p>
    `,
  });

  return { message: 'Enviamos um código para seu e-mail.', flowToken: token };

}

async function verifyResetCode(token, code) { // <-- MUDANÇA 1: Recebe 'token', não 'email'

  await ensureResetTable();

  // <-- MUDANÇA 2: A consulta agora busca pelo TOKEN, que é único para a tentativa.
  const { rows } = await pool.query(
    `SELECT * FROM password_resets WHERE token = $1 AND code = $2 AND used = FALSE ORDER BY created_at DESC LIMIT 1`, 
    [token, code] // <-- MUDANÇA 3: Usa os novos parâmetros na consulta
  );

  if (rows.length === 0) {
    throw new Error('Código inválido.');
  }
  const row = rows[0];

  if (new Date(row.expires_at) < new Date()) {
    throw new Error('Código expirado.');
  }

  return { ok: true, resetToken: row.token };
}

export async function resendResetCode(email) {

  return startPasswordReset(email);
  
}

async function completePasswordReset({ token, newPassword }) {
  await ensureResetTable();

  // 1. Valida o token
  const { rows } = await pool.query(
    'SELECT * FROM password_resets WHERE token = $1 AND used = FALSE ORDER BY created_at DESC LIMIT 1',
    [token]
  );

  if (rows.length === 0) {
    throw new Error('Token de redefinição inválido ou já utilizado.');
  }
  const resetRequest = rows[0];
  if (new Date(resetRequest.expires_at) < new Date()) {
    throw new Error('O token de redefinição de senha expirou.');
  }

  // 2. Atualiza a senha na tabela de usuários (salvando em texto puro)
  // Usamos o email que estava salvo junto com o token
  await pool.query('UPDATE usuario SET senha = $1 WHERE email = $2', [
    newPassword, // <-- MUDANÇA: A senha é salva diretamente como veio
    resetRequest.email,
  ]);

  // 3. Invalida o token para que não possa ser usado novamente
  await pool.query('UPDATE password_resets SET used = TRUE WHERE id = $1', [resetRequest.id]);

  return { message: 'Senha redefinida com sucesso!' };
}

export { startPasswordReset, verifyResetCode, completePasswordReset };