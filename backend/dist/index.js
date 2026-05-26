"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = __importDefault(require("./config/db"));
// Importar rotas
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const parkRoutes_1 = __importDefault(require("./routes/parkRoutes"));
const trailRoutes_1 = __importDefault(require("./routes/trailRoutes"));
const commentRoutes_1 = __importDefault(require("./routes/commentRoutes"));
const miscRoutes_1 = __importDefault(require("./routes/miscRoutes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middlewares Globais
app.use((0, cors_1.default)());
app.use(express_1.default.json());
const bcryptjs_1 = __importDefault(require("bcryptjs"));
// Testar Conexão com o Banco de Dados MySQL na inicialização e semear usuários padrões
async function testDbConnection() {
    try {
        const connection = await db_1.default.getConnection();
        console.log("✅ Conexão com o Banco de Dados MySQL bem-sucedida!");
        // Seed dos usuários padrão se não existirem
        try {
            const [visitorRows] = await connection.query("SELECT id FROM users WHERE email = 'visitante@tereverde.com'");
            if (visitorRows.length === 0) {
                const hash = await bcryptjs_1.default.hash("SenhaSegura123", 10);
                await connection.query("INSERT INTO users (id, name, email, password_hash, role, cpf, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?)", ["user-visitor-default", "Visitante Padrão", "visitante@tereverde.com", hash, "visitor", "111.111.111-11", "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100"]);
                console.log("🌱 Usuário de teste 'visitante@tereverde.com' semeado com sucesso (Senha: SenhaSegura123)!");
            }
            const [adminRows] = await connection.query("SELECT id FROM users WHERE email = 'admin@tereverde.com'");
            if (adminRows.length === 0) {
                const hash = await bcryptjs_1.default.hash("SenhaSegura123", 10);
                await connection.query("INSERT INTO users (id, name, email, password_hash, role, cpf, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?)", ["user-admin-default", "Administrador Terê", "admin@tereverde.com", hash, "admin", "000.000.000-00", "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=100"]);
                console.log("🌱 Usuário de teste 'admin@tereverde.com' semeado com sucesso (Senha: SenhaSegura123)!");
            }
        }
        catch (seedErr) {
            console.warn("⚠️ Aviso: Falha ao semear usuários de teste automáticos:", seedErr.message);
        }
        connection.release();
    }
    catch (error) {
        console.error("❌ ERRO: Não foi possível conectar ao banco de dados MySQL.");
        console.error(`Mensagem de erro: ${error.message}`);
        console.log("👉 Certifique-se de que o MySQL está ativo localmente e que o banco de dados 'tere_verde' foi criado.");
    }
}
testDbConnection();
// Vincular Rotas da API
app.use("/api/auth", authRoutes_1.default);
app.use("/api/parks", parkRoutes_1.default);
app.use("/api/trails", trailRoutes_1.default);
app.use("/api", commentRoutes_1.default); // /comments e /reviews
app.use("/api", miscRoutes_1.default); // /events, /restaurants, /lodgings
// Rota de status simples
app.get("/health", (req, res) => {
    res.json({ status: "OK", timestamp: new Date().toISOString() });
});
// Middleware Global de Tratamento de Erros
app.use((err, req, res, next) => {
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
