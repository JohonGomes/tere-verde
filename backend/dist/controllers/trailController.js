"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTrails = getTrails;
exports.getTrailDetails = getTrailDetails;
exports.toggleLikeTrail = toggleLikeTrail;
exports.addTrail = addTrail;
exports.updateTrail = updateTrail;
exports.deleteTrail = deleteTrail;
const db_1 = __importDefault(require("../config/db"));
const crypto_1 = __importDefault(require("crypto"));
// 1. Listar Trilhas
async function getTrails(req, res) {
    try {
        const [rows] = await db_1.default.execute("SELECT id, park_id as parkId, nome, dificuldade, duracao, distancia, descricao, imagem, likes FROM trails");
        return res.json(rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar trilhas." });
    }
}
// 2. Obter Detalhes da Trilha (incluindo Fotos, Recomendações e Descrição Completa)
async function getTrailDetails(req, res) {
    try {
        const { id } = req.params;
        // Obter dados básicos
        const [basicRows] = await db_1.default.execute("SELECT * FROM trails WHERE id = ?", [id]);
        if (!basicRows || basicRows.length === 0) {
            return res.status(404).json({ message: "Trilha não encontrada." });
        }
        const trail = basicRows[0];
        // Obter dados detalhados
        const [detailRows] = await db_1.default.execute("SELECT * FROM trail_details WHERE trail_id = ?", [id]);
        let detalhes = null;
        if (detailRows && detailRows.length > 0) {
            const d = detailRows[0];
            detalhes = {
                descricaoCompleta: d.descricao_completa,
                dificuldadeDetalhes: d.dificuldade_detalhes,
                recomendacoes: typeof d.recomendacoes === "string" ? JSON.parse(d.recomendacoes) : d.recomendacoes,
                fotos: typeof d.fotos === "string" ? JSON.parse(d.fotos) : d.fotos,
            };
        }
        return res.json({
            ...trail,
            parkId: trail.park_id,
            detalhes
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao carregar detalhes da trilha." });
    }
}
// 3. Dar Like / Retirar Like (Alternar curtida de forma segura)
async function toggleLikeTrail(req, res) {
    try {
        const { id } = req.params;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Usuário não autenticado." });
        }
        // 1. Obter nome da trilha
        const [trailRows] = await db_1.default.execute("SELECT nome, likes FROM trails WHERE id = ?", [id]);
        if (!trailRows || trailRows.length === 0) {
            return res.status(404).json({ message: "Trilha não encontrada." });
        }
        const trailName = trailRows[0].nome;
        let likes = parseInt(trailRows[0].likes || "0");
        // 2. Verificar se o usuário já deu like nesta trilha
        const [existingLikes] = await db_1.default.execute("SELECT user_id FROM user_likes WHERE user_id = ? AND target_name = ? AND target_type = 'trail'", [userId, trailName]);
        if (existingLikes && existingLikes.length > 0) {
            // Já curtiu -> Retirar Like
            await db_1.default.execute("DELETE FROM user_likes WHERE user_id = ? AND target_name = ? AND target_type = 'trail'", [userId, trailName]);
            likes = Math.max(0, likes - 1);
            await db_1.default.execute("UPDATE trails SET likes = ? WHERE id = ?", [likes, id]);
            return res.json({ liked: false, likes, message: "Curtida removida com sucesso." });
        }
        else {
            // Não curtiu -> Adicionar Like
            await db_1.default.execute("INSERT INTO user_likes (user_id, target_name, target_type) VALUES (?, ?, 'trail')", [userId, trailName]);
            likes += 1;
            await db_1.default.execute("UPDATE trails SET likes = ? WHERE id = ?", [likes, id]);
            return res.json({ liked: true, likes, message: "Trilha curtida com sucesso!" });
        }
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao registrar curtida na trilha." });
    }
}
// 4. CRUD de Trilhas (Admin)
async function addTrail(req, res) {
    try {
        const { parkId, nome, dificuldade, duracao, distancia, descricao, imagem, detalhes } = req.body;
        const id = `trilha-${crypto_1.default.randomUUID().slice(0, 8)}`;
        // Inserir tabela básica
        await db_1.default.execute("INSERT INTO trails (id, park_id, nome, dificuldade, duracao, distancia, descricao, imagem, likes) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 0)", [id, parkId, nome, dificuldade, duracao, distancia, descricao, imagem]);
        // Inserir tabela de detalhes (se fornecido)
        if (detalhes) {
            const recomendacoesJson = JSON.stringify(detalhes.recomendacoes || []);
            const fotosJson = JSON.stringify(detalhes.fotos || []);
            await db_1.default.execute("INSERT INTO trail_details (trail_id, descricao_completa, dificuldade_detalhes, recomendacoes, fotos) VALUES (?, ?, ?, ?, ?)", [id, detalhes.descricaoCompleta, detalhes.dificuldadeDetalhes, recomendacoesJson, fotosJson]);
        }
        return res.status(201).json({ id, parkId, nome, dificuldade, duracao, distancia, descricao, imagem, likes: 0 });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao adicionar trilha." });
    }
}
async function updateTrail(req, res) {
    try {
        const { id } = req.params;
        const { parkId, nome, dificuldade, duracao, distancia, descricao, imagem, detalhes } = req.body;
        // Atualizar tabela básica
        await db_1.default.execute("UPDATE trails SET park_id = ?, nome = ?, dificuldade = ?, duracao = ?, distancia = ?, descricao = ?, imagem = ? WHERE id = ?", [parkId, nome, dificuldade, duracao, distancia, descricao, imagem, id]);
        // Atualizar tabela de detalhes
        if (detalhes) {
            const recomendacoesJson = JSON.stringify(detalhes.recomendacoes || []);
            const fotosJson = JSON.stringify(detalhes.fotos || []);
            // Verificar se o detalhe já existe (UPSERT)
            const [existsRows] = await db_1.default.execute("SELECT trail_id FROM trail_details WHERE trail_id = ?", [id]);
            if (existsRows && existsRows.length > 0) {
                await db_1.default.execute("UPDATE trail_details SET descricao_completa = ?, dificuldade_detalhes = ?, recomendacoes = ?, fotos = ? WHERE trail_id = ?", [detalhes.descricaoCompleta, detalhes.dificuldadeDetalhes, recomendacoesJson, fotosJson, id]);
            }
            else {
                await db_1.default.execute("INSERT INTO trail_details (trail_id, descricao_completa, dificuldade_detalhes, recomendacoes, fotos) VALUES (?, ?, ?, ?, ?)", [id, detalhes.descricaoCompleta, detalhes.dificuldadeDetalhes, recomendacoesJson, fotosJson]);
            }
        }
        return res.json({ message: "Trilha atualizada com sucesso!" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar trilha." });
    }
}
async function deleteTrail(req, res) {
    try {
        const { id } = req.params;
        await db_1.default.execute("DELETE FROM trails WHERE id = ?", [id]);
        return res.json({ message: "Trilha excluída com sucesso!" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao excluir trilha." });
    }
}
