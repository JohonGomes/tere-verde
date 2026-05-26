import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import pool from "./config/db";

// Importar rotas
import authRoutes from "./routes/authRoutes";
import parkRoutes from "./routes/parkRoutes";
import trailRoutes from "./routes/trailRoutes";
import commentRoutes from "./routes/commentRoutes";
import miscRoutes from "./routes/miscRoutes";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares Globais
app.use(cors());
app.use(express.json());

import bcrypt from "bcryptjs";

// Testar Conexão com o Banco de Dados MySQL na inicialização e semear usuários padrões
async function testDbConnection() {
  try {
    const connection = await pool.getConnection();
    console.log("✅ Conexão com o Banco de Dados MySQL bem-sucedida!");

    // Seed dos usuários padrão se não existirem
    try {
      const [visitorRows]: any = await connection.query("SELECT id FROM users WHERE email = 'visitante@tereverde.com'");
      if (visitorRows.length === 0) {
        const hash = await bcrypt.hash("SenhaSegura123", 10);
        await connection.query(
          "INSERT INTO users (id, name, email, password_hash, role, cpf, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?)",
          ["user-visitor-default", "Visitante Padrão", "visitante@tereverde.com", hash, "visitor", "111.111.111-11", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"]
        );
        console.log("🌱 Usuário de teste 'visitante@tereverde.com' semeado com sucesso (Senha: SenhaSegura123)!");
      }

      const [adminRows]: any = await connection.query("SELECT id FROM users WHERE email = 'admin@tereverde.com'");
      if (adminRows.length === 0) {
        const hash = await bcrypt.hash("SenhaSegura123", 10);
        await connection.query(
          "INSERT INTO users (id, name, email, password_hash, role, cpf, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?)",
          ["user-admin-default", "Administrador Terê", "admin@tereverde.com", hash, "admin", "000.000.000-00", "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100"]
        );
        console.log("🌱 Usuário de teste 'admin@tereverde.com' semeado com sucesso (Senha: SenhaSegura123)!");
      }
    } catch (seedErr: any) {
      console.warn("⚠️ Aviso: Falha ao semear usuários de teste automáticos:", seedErr.message);
    }

    connection.release();
  } catch (error: any) {
    console.error("❌ ERRO: Não foi possível conectar ao banco de dados MySQL.");
    console.error(`Mensagem de erro: ${error.message}`);
    console.log("👉 Certifique-se de que o MySQL está ativo localmente e que o banco de dados 'tere_verde' foi criado.");
  }
}
testDbConnection();

// Vincular Rotas da API
app.use("/api/auth", authRoutes);
app.use("/api/parks", parkRoutes);
app.use("/api/trails", trailRoutes);
app.use("/api", commentRoutes); // /comments e /reviews
app.use("/api", miscRoutes); // /events, /restaurants, /lodgings

// Rota de status simples
app.get("/health", (req: Request, res: Response) => {
  res.json({ status: "OK", timestamp: new Date().toISOString() });
});

// Middleware Global de Tratamento de Erros
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error("💥 Erro capturado pelo middleware global:", err);
  res.status(err.status || 500).json({
    message: err.message || "Ocorreu um erro interno inesperado no servidor."
  });
});

// Iniciar o Servidor Express
app.listen(PORT, () => {
  console.log(`🚀 Servidor Terê Verde Backend rodando na porta ${PORT}`);
  console.log(`👉 Link de verificação local: http://localhost:${PORT}/health`);
});
