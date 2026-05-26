import { Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import pool from "../config/db";
import { AuthenticatedRequest } from "../middlewares/auth";

const JWT_SECRET = process.env.JWT_SECRET || "tereverde_jwt_secret_token_security_key_2026";
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || "7d";

// 1. Cadastrar Usuário (Visitante)
export async function register(req: AuthenticatedRequest, res: Response) {
  try {
    const { name, email, password, cpf } = req.body;

    if (!name || !email || !password || !cpf) {
      return res.status(400).json({ message: "Por favor, preencha todos os campos obrigatórios." });
    }

    // Verificar se o e-mail ou CPF já existem
    const [existingUsers]: any = await pool.execute(
      "SELECT id FROM users WHERE email = ? OR cpf = ?",
      [email, cpf]
    );

    if (existingUsers && existingUsers.length > 0) {
      return res.status(400).json({ message: "E-mail ou CPF já cadastrado no sistema." });
    }

    // Gerar ID do usuário e hash da senha
    const id = `user-${crypto.randomUUID().slice(0, 8)}`;
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    
    // Imagem de perfil padrão
    const profilePic = `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100`;

    // Inserir no MySQL
    await pool.execute(
      "INSERT INTO users (id, name, email, password_hash, role, cpf, profile_pic) VALUES (?, ?, ?, ?, ?, ?, ?)",
      [id, name, email, passwordHash, "visitor", cpf, profilePic]
    );

    // Gerar token
    const token = jwt.sign({ id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    return res.status(201).json({
      token,
      user: { id, name, email, role: "visitor", cpf, profilePic }
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor ao cadastrar usuário." });
  }
}

// 2. Fazer Login
export async function login(req: AuthenticatedRequest, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Preencha o e-mail e a senha." });
    }

    // Buscar no MySQL
    const [rows]: any = await pool.execute(
      "SELECT id, name, email, password_hash as passwordHash, role, cpf, profile_pic as profilePic FROM users WHERE email = ?",
      [email]
    );

    if (!rows || rows.length === 0) {
      return res.status(401).json({ message: "E-mail ou senha incorretos." });
    }

    const user = rows[0];

    // Verificar senha
    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ message: "E-mail ou senha incorretos." });
    }

    // Gerar token
    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN as any });

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        cpf: user.cpf,
        profilePic: user.profilePic
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro interno no servidor ao fazer login." });
  }
}

// 3. Obter Perfil
export async function getProfile(req: AuthenticatedRequest, res: Response) {
  return res.json({ user: req.user });
}

// 4. Atualizar Perfil
export async function updateProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const { name, profilePic } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    await pool.execute(
      "UPDATE users SET name = ?, profile_pic = ? WHERE id = ?",
      [name || req.user?.name, profilePic || req.user?.profilePic, userId]
    );

    return res.json({
      message: "Perfil atualizado com sucesso!",
      user: {
        ...req.user,
        name: name || req.user?.name,
        profilePic: profilePic || req.user?.profilePic
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar perfil." });
  }
}
