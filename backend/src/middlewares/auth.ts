import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import pool from "../config/db";

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    name: string;
    email: string;
    role: "visitor" | "admin";
    cpf: string;
    profilePic?: string;
  };
}

export async function protect(req: AuthenticatedRequest, res: Response, next: NextFunction) {
  try {
    let token = "";

    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }

    if (!token) {
      return res.status(401).json({ message: "Acesso negado. Token não fornecido." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || "tereverde_jwt_secret_token_security_key_2026") as { id: string };

    // Buscar o usuário no banco de dados MySQL
    const [rows]: any = await pool.execute(
      "SELECT id, name, email, role, cpf, profile_pic as profilePic FROM users WHERE id = ?",
      [decoded.id]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: "Usuário associado a este token não existe mais." });
    }

    req.user = rows[0];
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido ou expirado." });
  }
}

export function restrictTo(...roles: ("visitor" | "admin")[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    if (!req.user || !roles.includes(req.user.role)) {
      return res.status(403).json({ message: "Você não tem permissão para realizar esta ação." });
    }
    next();
  };
}
