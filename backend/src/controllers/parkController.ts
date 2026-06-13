import { Response } from "express";
import pool from "../config/db";
import { AuthenticatedRequest } from "../middlewares/auth";
import crypto from "crypto";

// 1. Listar Parques
export async function getParks(req: AuthenticatedRequest, res: Response) {
  try {
    const [rows] = await pool.execute("SELECT id, nome, descricao, altitude, area, imagem, limite_capacidade_diaria as limiteCapacidadeDiaria, funcionamento, ingresso_base as ingressoBase, video, principais_trilhas as principaisTrilhas, cachoeiras, galeria_fotos as galeriaFotos, como_chegar as comoChegar FROM parks");
    
    const parsedRows = (rows as any[]).map((row) => {
      let comoChegar = null;
      let principaisTrilhas = null;
      let cachoeiras = null;
      let galeriaFotos = null;

      try {
        comoChegar = row.comoChegar ? (typeof row.comoChegar === "string" ? JSON.parse(row.comoChegar) : row.comoChegar) : null;
      } catch (e) {
        comoChegar = row.comoChegar;
      }

      try {
        principaisTrilhas = row.principaisTrilhas ? (typeof row.principaisTrilhas === "string" ? JSON.parse(row.principaisTrilhas) : row.principaisTrilhas) : null;
      } catch (e) {
        principaisTrilhas = row.principaisTrilhas;
      }

      try {
        cachoeiras = row.cachoeiras ? (typeof row.cachoeiras === "string" ? JSON.parse(row.cachoeiras) : row.cachoeiras) : null;
      } catch (e) {
        cachoeiras = row.cachoeiras;
      }

      try {
        galeriaFotos = row.galeriaFotos ? (typeof row.galeriaFotos === "string" ? JSON.parse(row.galeriaFotos) : row.galeriaFotos) : null;
      } catch (e) {
        galeriaFotos = row.galeriaFotos;
      }

      return {
        ...row,
        comoChegar,
        principaisTrilhas,
        cachoeiras,
        galeriaFotos
      };
    });

    return res.json(parsedRows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar parques." });
  }
}

// 2. Comprar Ingresso com Validação de Capacidade (RN03)
export async function buyTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const { targetId, targetType, date, quantity, totalPrice } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    if (!targetId || !targetType || !date || !quantity || !totalPrice) {
      return res.status(400).json({ message: "Preencha todas as informações da reserva." });
    }

    // 1. Buscar limite de capacidade do alvo (Parque ou Evento)
    let limit = 100;
    let name = "";

    if (targetType === "park") {
      const [parkRows]: any = await pool.execute("SELECT nome, limite_capacidade_diaria FROM parks WHERE id = ?", [targetId]);
      if (!parkRows || parkRows.length === 0) {
        return res.status(404).json({ message: "Parque não encontrado." });
      }
      limit = parkRows[0].limite_capacidade_diaria;
      name = parkRows[0].nome;
    } else {
      const [eventRows]: any = await pool.execute("SELECT nome, limite_capacidade_diaria FROM events WHERE id = ?", [targetId]);
      if (!eventRows || eventRows.length === 0) {
        return res.status(404).json({ message: "Evento não encontrado." });
      }
      limit = eventRows[0].limite_capacidade_diaria;
      name = eventRows[0].nome;
    }

    // 2. Calcular total de ingressos já vendidos para a data selecionada
    const [soldRows]: any = await pool.execute(
      "SELECT SUM(quantity) as total FROM tickets WHERE target_id = ? AND date = ? AND status = 'active'",
      [targetId, date]
    );

    const soldCount = parseInt(soldRows[0].total || "0");

    if (soldCount + parseInt(quantity) > limit) {
      return res.status(400).json({
        message: `Capacidade diária esgotada para ${name} no dia ${date}. Vagas disponíveis: ${limit - soldCount}`
      });
    }

    // 3. Gerar ID do ticket e código QR fictício
    const ticketId = `ticket-${crypto.randomUUID().slice(0, 8)}`;
    const qrCode = `TV-${targetId.toUpperCase()}-${ticketId.toUpperCase()}`;

    // 4. Inserir no MySQL
    await pool.execute(
      "INSERT INTO tickets (id, user_id, target_id, target_type, date, quantity, total_price, status, qr_code) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [ticketId, userId, targetId, targetType, date, quantity, totalPrice, "active", qrCode]
    );

    return res.status(201).json({
      message: "Reserva/Compra realizada com sucesso!",
      ticket: {
        id: ticketId,
        userId,
        targetId,
        targetType,
        date,
        quantity,
        totalPrice,
        status: "active",
        qrCode,
        checkedIn: false
      }
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao processar compra de ingresso." });
  }
}

// 3. Listar Ingressos (Todos se admin, do usuário se visitante)
export async function getTickets(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.user?.id;
    const role = req.user?.role;

    if (!userId) {
      return res.status(401).json({ message: "Usuário não autenticado." });
    }

    let query = `
      SELECT t.id, t.user_id as userId, u.name as userName, u.cpf as userCpf, 
             t.target_id as targetId, t.target_type as targetType, t.date, 
             t.quantity, t.total_price as totalPrice, t.status, t.qr_code as qrCode, 
             t.checked_in as checkedIn, t.checked_in_at as checkedInAt 
      FROM tickets t
      JOIN users u ON t.user_id = u.id
    `;
    let params: any[] = [];

    if (role !== "admin") {
      query += " WHERE t.user_id = ?";
      params.push(userId);
    }

    query += " ORDER BY t.created_at DESC";

    const [rows] = await pool.execute(query, params);
    return res.json(rows);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao buscar ingressos." });
  }
}

// 4. Efetuar Check-in (Modo Recepção)
export async function checkInTicket(req: AuthenticatedRequest, res: Response) {
  try {
    const { ticketId } = req.params;

    if (!ticketId) {
      return res.status(400).json({ message: "ID do ingresso não fornecido." });
    }

    // Buscar ticket
    const [rows]: any = await pool.execute("SELECT id, checked_in FROM tickets WHERE id = ?", [ticketId]);

    if (!rows || rows.length === 0) {
      return res.status(404).json({ message: "Ingresso não encontrado." });
    }

    if (rows[0].checked_in) {
      return res.status(400).json({ message: "Este ingresso já passou pelo check-in!" });
    }

    const checkInTime = new Date().toISOString().slice(0, 19).replace('T', ' ');

    // Atualizar check-in
    await pool.execute(
      "UPDATE tickets SET checked_in = TRUE, checked_in_at = ? WHERE id = ?",
      [checkInTime, ticketId]
    );

    return res.json({
      message: "Check-in realizado com sucesso!",
      checkedIn: true,
      checkedInAt: checkInTime
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao realizar check-in." });
  }
}

// 5. CRUD de Parques (Admin)
export async function addPark(req: AuthenticatedRequest, res: Response) {
  try {
    const { nome, descricao, altitude, area, imagem, limiteCapacidadeDiaria, funcionamento, ingressoBase, video, principaisTrilhas, cachoeiras, galeriaFotos, comoChegar } = req.body;
    const id = `parque-${crypto.randomUUID().slice(0, 8)}`;

    const serialize = (val: any) => {
      if (val === null || val === undefined) return null;
      if (typeof val === "string") return val;
      return JSON.stringify(val);
    };

    await pool.execute(
      "INSERT INTO parks (id, nome, descricao, altitude, area, imagem, limite_capacidade_diaria, funcionamento, ingresso_base, video, principais_trilhas, cachoeiras, galeria_fotos, como_chegar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
      [
        id,
        nome,
        descricao,
        altitude || null,
        area || null,
        imagem || null,
        limiteCapacidadeDiaria !== undefined ? limiteCapacidadeDiaria : 100,
        funcionamento || null,
        ingressoBase !== undefined ? ingressoBase : 0.00,
        video || null,
        serialize(principaisTrilhas),
        serialize(cachoeiras),
        serialize(galeriaFotos),
        serialize(comoChegar)
      ]
    );

    return res.status(201).json({ id, nome, descricao, altitude, area, imagem, limiteCapacidadeDiaria, funcionamento, ingressoBase, video, principaisTrilhas, cachoeiras, galeriaFotos, comoChegar });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao adicionar parque." });
  }
}

export async function updatePark(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    const { nome, descricao, altitude, area, imagem, limiteCapacidadeDiaria, funcionamento, ingressoBase, video, principaisTrilhas, cachoeiras, galeriaFotos, comoChegar } = req.body;

    const serialize = (val: any) => {
      if (val === null || val === undefined) return null;
      if (typeof val === "string") return val;
      return JSON.stringify(val);
    };

    await pool.execute(
      "UPDATE parks SET nome = ?, descricao = ?, altitude = ?, area = ?, imagem = ?, limite_capacidade_diaria = ?, funcionamento = ?, ingresso_base = ?, video = ?, principais_trilhas = ?, cachoeiras = ?, galeria_fotos = ?, como_chegar = ? WHERE id = ?",
      [
        nome,
        descricao,
        altitude || null,
        area || null,
        imagem || null,
        limiteCapacidadeDiaria !== undefined ? limiteCapacidadeDiaria : 100,
        funcionamento || null,
        ingressoBase !== undefined ? ingressoBase : 0.00,
        video || null,
        serialize(principaisTrilhas),
        serialize(cachoeiras),
        serialize(galeriaFotos),
        serialize(comoChegar),
        id
      ]
    );

    return res.json({ message: "Parque atualizado com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao atualizar parque." });
  }
}

export async function deletePark(req: AuthenticatedRequest, res: Response) {
  try {
    const { id } = req.params;
    await pool.execute("DELETE FROM parks WHERE id = ?", [id]);
    return res.json({ message: "Parque excluído com sucesso!" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Erro ao excluir parque." });
  }
}
