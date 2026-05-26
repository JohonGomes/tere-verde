"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.protect = protect;
exports.restrictTo = restrictTo;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../config/db"));
async function protect(req, res, next) {
    try {
        let token = "";
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            token = req.headers.authorization.split(" ")[1];
        }
        if (!token) {
            return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
        }
        const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "tereverde_jwt_secret_token_security_key_2026");
        // Buscar o usuário no banco de dados MySQL
        const [rows] = await db_1.default.execute("SELECT id, name, email, role, cpf, profile_pic as profilePic FROM users WHERE id = ?", [decoded.id]);
        if (!rows || rows.length === 0) {
            return res.status(401).json({ message: "Usuário associado a este token não existe mais." });
        }
        req.user = rows[0];
        next();
    }
    catch (error) {
        return res.status(401).json({ message: "Token inválido ou expirado." });
    }
}
function restrictTo(...roles) {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: "Você não tem permissão para realizar esta ação." });
        }
        next();
    };
}
