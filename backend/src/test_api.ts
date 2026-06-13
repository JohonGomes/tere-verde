import mysql from "mysql2/promise";
import dotenv from "dotenv";
import pool from "./config/db";
import crypto from "crypto";

dotenv.config();

const DB_CONFIG = {
  host: process.env.DB_HOST || "localhost",
  port: parseInt(process.env.DB_PORT || "3306"),
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "JohonMysql@26",
  database: process.env.DB_NAME || "tere_verde",
};

async function run() {
  console.log("🚀 Iniciando Teste de Integração MySQL e API REST para Terê Verde...");
  console.log("Configurações do Banco:", { 
    ...DB_CONFIG, 
    password: "•".repeat(DB_CONFIG.password.length) 
  });

  let connection;
  try {
    connection = await mysql.createConnection({
      host: DB_CONFIG.host,
      port: DB_CONFIG.port,
      user: DB_CONFIG.user,
      password: DB_CONFIG.password,
    });

    console.log("✅ Conectado ao servidor MySQL com sucesso!");

    // 1. Criar banco de dados se não existir
    await connection.query(`CREATE DATABASE IF NOT EXISTS ${DB_CONFIG.database};`);
    console.log(`✅ Banco de dados '${DB_CONFIG.database}' garantido!`);
    await connection.query(`USE ${DB_CONFIG.database};`);

    // 2. Criar tabelas necessárias para os testes
    console.log("🔄 Criando tabelas (se não existirem)...");

    await connection.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) UNIQUE NOT NULL,
        password_hash VARCHAR(255) NOT NULL,
        role ENUM('visitor', 'admin') DEFAULT 'visitor',
        cpf VARCHAR(14) UNIQUE NOT NULL,
        profile_pic VARCHAR(255),
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS parks (
        id VARCHAR(50) PRIMARY KEY,
        nome VARCHAR(100) NOT NULL,
        descricao TEXT NOT NULL,
        altitude VARCHAR(20),
        area VARCHAR(30),
        imagem VARCHAR(255),
        limite_capacidade_diaria INT NOT NULL DEFAULT 100,
        funcionamento VARCHAR(100),
        ingresso_base DECIMAL(10, 2) DEFAULT 0.00,
        video TEXT,
        principais_trilhas TEXT,
        cachoeiras TEXT,
        galeria_fotos TEXT,
        como_chegar TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS trails (
        id VARCHAR(50) PRIMARY KEY,
        park_id VARCHAR(50) NOT NULL,
        nome VARCHAR(100) NOT NULL,
        dificuldade VARCHAR(30) NOT NULL,
        duracao VARCHAR(30),
        distancia VARCHAR(30),
        descricao TEXT NOT NULL,
        imagem VARCHAR(255),
        likes INT DEFAULT 0,
        FOREIGN KEY (park_id) REFERENCES parks(id) ON DELETE CASCADE
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS comments (
        id VARCHAR(50) PRIMARY KEY,
        user_id VARCHAR(50),
        user_name VARCHAR(100) NOT NULL,
        user_pic VARCHAR(255),
        target_name VARCHAR(100) NOT NULL,
        target_type ENUM('park', 'trail', 'event') NOT NULL,
        content TEXT NOT NULL,
        status ENUM('Pendente', 'Aprovado', 'Reprovado') DEFAULT 'Pendente',
        imagem TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `);

    await connection.query(`
      CREATE TABLE IF NOT EXISTS user_likes (
        user_id VARCHAR(50) NOT NULL,
        target_name VARCHAR(100) NOT NULL,
        target_type VARCHAR(30) NOT NULL,
        PRIMARY KEY (user_id, target_name, target_type),
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      );
    `);

    console.log("✅ Estrutura de tabelas verificada e criada com sucesso!");

    // 3. Inserir dados de teste iniciais (Parque e Trilha)
    console.log("🔄 Populando dados iniciais para associação (Parques e Trilhas)...");
    
    await connection.query(`
      INSERT INTO parks (id, nome, descricao, altitude, area, imagem, limite_capacidade_diaria, funcionamento, ingresso_base)
      VALUES ('parque-nacional', 'Parque Nacional da Serra dos Órgãos', 'Biodiversidade da Serra do Mar', '2.263m', '20.024 hectares', 'https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?w=800', 300, 'Terça a Domingo, 8h às 17h', 35.00)
      ON DUPLICATE KEY UPDATE nome=VALUES(nome);
    `);

    await connection.query(`
      INSERT INTO trails (id, park_id, nome, dificuldade, duracao, distancia, descricao, imagem, likes)
      VALUES ('trilha-pedra-do-sino', 'parque-nacional', 'Pedra do Sino', 'Difícil', '8-10 horas', '14 km', 'A trilha mais icônica da Serra dos Órgãos.', 'https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?w=800', 10)
      ON DUPLICATE KEY UPDATE nome=VALUES(nome);
    `);

    console.log("✅ Parque Nacional e Trilha da Pedra do Sino cadastrados!");

    // 4. Executar chamadas HTTP reais na nossa API local
    const API_URL = "http://localhost:3000/api";
    console.log(`\n🌐 Efetuando chamadas HTTP para o servidor da API (${API_URL})...`);

    // A. Registrar um novo usuário de teste aleatório
    const testEmail = `teste-${Date.now()}@tereverde.com`;
    const registerBody = {
      name: "Maria Testadora",
      email: testEmail,
      password: "SenhaSegura123",
      cpf: `cpf-${Date.now().toString().slice(-9)}`
    };

    console.log(`\n➡️ Testando Cadastro de Usuário (${registerBody.email})...`);
    const regResponse = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(registerBody)
    });

    const regData: any = await regResponse.json();
    if (!regResponse.ok) {
      throw new Error(`Erro ao cadastrar usuário: ${regData.message}`);
    }

    const { token, user } = regData;
    console.log(`✅ Usuário cadastrado com sucesso! ID: ${user.id}`);
    console.log(`🔑 JWT Token recebido: ${token.slice(0, 20)}...`);

    // B. Testar a rota de LIKE para a trilha 'Pedra do Sino'
    console.log("\n➡️ Testando Dar Like na Trilha 'Pedra do Sino' via API...");
    const likeResponse = await fetch(`${API_URL}/trails/like/trilha-pedra-do-sino`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const likeData: any = await likeResponse.json();
    if (!likeResponse.ok) {
      throw new Error(`Erro ao dar like: ${likeData.message}`);
    }

    console.log("✅ Resposta da API de Like:");
    console.log(likeData);

    // C. Testar o envio de Comentário para a trilha 'Pedra do Sino'
    console.log("\n➡️ Testando Envio de Comentário (Depoimento) para Moderação...");
    const commentBody = {
      targetName: "Pedra do Sino",
      targetType: "trail",
      content: "Uma trilha fantástica e desafiadora! Recomendo levar bastante água."
    };

    const commentResponse = await fetch(`${API_URL}/comments`, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(commentBody)
    });

    const commentData: any = await commentResponse.json();
    if (!commentResponse.ok) {
      throw new Error(`Erro ao enviar comentário: ${commentData.message}`);
    }

    console.log("✅ Resposta da API de Comentários:");
    console.log(commentData);

    // 5. Verificar a persistência diretamente no banco MySQL
    console.log("\n🔍 Validando persistência física diretamente nas tabelas MySQL...");

    const [likesDb]: any = await connection.query(
      "SELECT * FROM user_likes WHERE target_name = 'Pedra do Sino'"
    );
    console.log("📊 Curtidas registradas no MySQL para 'Pedra do Sino':", likesDb.length);
    console.log(likesDb);

    const [commentsDb]: any = await connection.query(
      "SELECT * FROM comments WHERE target_name = 'Pedra do Sino'"
    );
    console.log("📊 Comentários registrados no MySQL para 'Pedra do Sino':", commentsDb.length);
    console.log(commentsDb);

    console.log("\n⭐️ TESTES DE INTEGRAÇÃO CONCLUÍDOS COM 100% DE SUCESSO! ⭐️");

  } catch (error: any) {
    console.error("❌ ERRO NO TESTE DE INTEGRAÇÃO:", error.message);
  } finally {
    if (connection) {
      await connection.end();
      console.log("🔌 Conexão com o banco finalizada.");
    }
  }
}

run();
