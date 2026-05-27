import { Response } from "express";
import pool from "../config/db";
import { AuthenticatedRequest } from "../middlewares/auth";
import crypto from "crypto";

// ==========================================
// 📅 EVENTOS
// ==========================================
export async function getEvents(req: AuthenticatedRequest, res: Response) {
  try {
    const [rows] = await pool.execute("SELECT id, park_id as parkId, nome, descricao, data, preco, limite_capacidade_diaria as limiteCapacidadeDiaria, imagem FROM events ORDER BY data ASC");
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar eventos." });
  }
}

export async function addEvent(req: AuthenticatedRequest, res: Response) {
  try {
    const { parkId, nome, descricao, data, preco, limiteCapacidadeDiaria, imagem } = req.body;
    const id = `evento-${crypto.randomUUID().slice(0, 8)}`;

    await pool.execute(
      "INSERT INTO events (id, park_id, nome, descricao, data, preco, limite_capacidade_diaria, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        parkId || null,
        nome,
        descricao,
        data,
        preco !== undefined ? preco : 0.00,
        limiteCapacidadeDiaria !== undefined ? limiteCapacidadeDiaria : 50,
        imagem || null
      ]
    );

    return res.status(201).json({ id, parkId, nome, descricao, data, preco, limiteCapacidadeDiaria, imagem });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao adicionar evento." });
  }
}

export async function updateEvent(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { parkId, nome, descricao, data, preco, limiteCapacidadeDiaria, imagem } = req.body;

    await pool.execute(
      "UPDATE events SET park_id = ?, nome = ?, descricao = ?, data = ?, preco = ?, limite_capacidade_diaria = ?, imagem = ? WHERE id = ?",
      [
        parkId || null,
        nome,
        descricao,
        data,
        preco !== undefined ? preco : 0.00,
        limiteCapacidadeDiaria !== undefined ? limiteCapacidadeDiaria : 50,
        imagem || null,
        id
      ]
    );

    return res.json({ message: "Evento atualizado com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar evento." });
  }
}

export async function deleteEvent(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    await pool.execute("DELETE FROM events WHERE id = ?", [id]);
    return res.json({ message: "Evento excluído com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao excluir evento." });
  }
}

// ==========================================
// 🍕 RESTAURANTES
// ==========================================
export async function getRestaurants(req: AuthenticatedRequest, res: Response) {
  try {
    const [rows] = await pool.execute("SELECT id, nome, tipo, descricao, imagem, nota_media as notaMedia, avaliacoes_contagem as avaliacoesContagem FROM restaurants");
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar restaurantes." });
  }
}

export async function addRestaurant(req: AuthenticatedRequest, res: Response) {
  try {
    const { nome, tipo, descricao, imagem } = req.body;
    const id = `restaurante-${crypto.randomUUID().slice(0, 8)}`;

    await pool.execute(
      "INSERT INTO restaurants (id, nome, tipo, descricao, imagem, nota_media, avaliacoes_contagem) VALUES (?, ?, ?, ?, ?, 5.00, 0)",
      [id, nome, tipo, descricao, imagem || null]
    );

    return res.status(201).json({ id, nome, tipo, descricao, imagem, notaMedia: 5.00, avaliacoesContagem: 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao adicionar restaurante." });
  }
}

export async function updateRestaurant(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { nome, tipo, descricao, imagem } = req.body;

    await pool.execute(
      "UPDATE restaurants SET nome = ?, tipo = ?, descricao = ?, imagem = ? WHERE id = ?",
      [nome, tipo, descricao, imagem || null, id]
    );

    return res.json({ message: "Restaurante atualizado com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar restaurante." });
  }
}

export async function deleteRestaurant(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    await pool.execute("DELETE FROM restaurants WHERE id = ?", [id]);
    return res.json({ message: "Restaurante excluído com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao excluir restaurante." });
  }
}

// ==========================================
// 🏨 HOSPEDAGENS
// ==========================================
export async function getLodgings(req: AuthenticatedRequest, res: Response) {
  try {
    const [rows] = await pool.execute("SELECT id, nome, tipo, descricao, imagem, nota_media as notaMedia, avaliacoes_contagem as avaliacoesContagem FROM lodgings");
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar hospedagens." });
  }
}

export async function addLodging(req: AuthenticatedRequest, res: Response) {
  try {
    const { nome, tipo, descricao, imagem } = req.body;
    const id = `hospedagem-${crypto.randomUUID().slice(0, 8)}`;

    await pool.execute(
      "INSERT INTO lodgings (id, nome, tipo, descricao, imagem, nota_media, avaliacoes_contagem) VALUES (?, ?, ?, ?, ?, 5.00, 0)",
      [id, nome, tipo, descricao, imagem || null]
    );

    return res.status(201).json({ id, nome, tipo, descricao, imagem, notaMedia: 5.00, avaliacoesContagem: 0 });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao adicionar hospedagem." });
  }
}

export async function updateLodging(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { nome, tipo, descricao, imagem } = req.body;

    await pool.execute(
      "UPDATE lodgings SET nome = ?, tipo = ?, descricao = ?, imagem = ? WHERE id = ?",
      [nome, tipo, descricao, imagem || null, id]
    );

    return res.json({ message: "Hospedagem atualizada com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar hospedagem." });
  }
}

export async function deleteLodging(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    await pool.execute("DELETE FROM lodgings WHERE id = ?", [id]);
    return res.json({ message: "Hospedagem excluída com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao excluir hospedagem." });
  }
}
