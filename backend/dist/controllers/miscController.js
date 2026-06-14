"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEvents = getEvents;
exports.addEvent = addEvent;
exports.updateEvent = updateEvent;
exports.deleteEvent = deleteEvent;
exports.getRestaurants = getRestaurants;
exports.addRestaurant = addRestaurant;
exports.updateRestaurant = updateRestaurant;
exports.deleteRestaurant = deleteRestaurant;
exports.getLodgings = getLodgings;
exports.addLodging = addLodging;
exports.updateLodging = updateLodging;
exports.deleteLodging = deleteLodging;
exports.getSettings = getSettings;
exports.updateSetting = updateSetting;
const db_1 = __importDefault(require("../config/db"));
const crypto_1 = __importDefault(require("crypto"));
// ==========================================
// 📅 EVENTOS
// ==========================================
async function getEvents(req, res) {
    try {
        const [rows] = await db_1.default.execute("SELECT id, park_id as parkId, nome, descricao, data, preco, limite_capacidade_diaria as limiteCapacidadeDiaria, imagem FROM events ORDER BY data ASC");
        return res.json(rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar eventos." });
    }
}
async function addEvent(req, res) {
    try {
        const { parkId, nome, descricao, data, preco, limiteCapacidadeDiaria, imagem } = req.body;
        const id = `evento-${crypto_1.default.randomUUID().slice(0, 8)}`;
        await db_1.default.execute("INSERT INTO events (id, park_id, nome, descricao, data, preco, limite_capacidade_diaria, imagem) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [
            id,
            parkId || null,
            nome,
            descricao,
            data,
            preco !== undefined ? preco : 0.00,
            limiteCapacidadeDiaria !== undefined ? limiteCapacidadeDiaria : 50,
            imagem || null
        ]);
        return res.status(201).json({ id, parkId, nome, descricao, data, preco, limiteCapacidadeDiaria, imagem });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao adicionar evento." });
    }
}
async function updateEvent(req, res) {
    try {
        const { id } = req.params;
        const { parkId, nome, descricao, data, preco, limiteCapacidadeDiaria, imagem } = req.body;
        await db_1.default.execute("UPDATE events SET park_id = ?, nome = ?, descricao = ?, data = ?, preco = ?, limite_capacidade_diaria = ?, imagem = ? WHERE id = ?", [
            parkId || null,
            nome,
            descricao,
            data,
            preco !== undefined ? preco : 0.00,
            limiteCapacidadeDiaria !== undefined ? limiteCapacidadeDiaria : 50,
            imagem || null,
            id
        ]);
        return res.json({ message: "Evento atualizado com sucesso!" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar evento." });
    }
}
async function deleteEvent(req, res) {
    try {
        const { id } = req.params;
        await db_1.default.execute("DELETE FROM events WHERE id = ?", [id]);
        return res.json({ message: "Evento excluído com sucesso!" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao excluir evento." });
    }
}
// ==========================================
// 🍕 RESTAURANTES
// ==========================================
async function getRestaurants(req, res) {
    try {
        const [rows] = await db_1.default.execute("SELECT id, nome, tipo, descricao, imagem, nota_media as notaMedia, avaliacoes_contagem as avaliacoesContagem FROM restaurants");
        return res.json(rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar restaurantes." });
    }
}
async function addRestaurant(req, res) {
    try {
        const { nome, tipo, descricao, imagem } = req.body;
        const id = `restaurante-${crypto_1.default.randomUUID().slice(0, 8)}`;
        await db_1.default.execute("INSERT INTO restaurants (id, nome, tipo, descricao, imagem, nota_media, avaliacoes_contagem) VALUES (?, ?, ?, ?, ?, 5.00, 0)", [id, nome, tipo, descricao, imagem || null]);
        return res.status(201).json({ id, nome, tipo, descricao, imagem, notaMedia: 5.00, avaliacoesContagem: 0 });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao adicionar restaurante." });
    }
}
async function updateRestaurant(req, res) {
    try {
        const { id } = req.params;
        const { nome, tipo, descricao, imagem } = req.body;
        await db_1.default.execute("UPDATE restaurants SET nome = ?, tipo = ?, descricao = ?, imagem = ? WHERE id = ?", [nome, tipo, descricao, imagem || null, id]);
        return res.json({ message: "Restaurante atualizado com sucesso!" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar restaurante." });
    }
}
async function deleteRestaurant(req, res) {
    try {
        const { id } = req.params;
        await db_1.default.execute("DELETE FROM restaurants WHERE id = ?", [id]);
        return res.json({ message: "Restaurante excluído com sucesso!" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao excluir restaurante." });
    }
}
// ==========================================
// 🏨 HOSPEDAGENS
// ==========================================
async function getLodgings(req, res) {
    try {
        const [rows] = await db_1.default.execute("SELECT id, nome, tipo, descricao, imagem, nota_media as notaMedia, avaliacoes_contagem as avaliacoesContagem FROM lodgings");
        return res.json(rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar hospedagens." });
    }
}
async function addLodging(req, res) {
    try {
        const { nome, tipo, descricao, imagem } = req.body;
        const id = `hospedagem-${crypto_1.default.randomUUID().slice(0, 8)}`;
        await db_1.default.execute("INSERT INTO lodgings (id, nome, tipo, descricao, imagem, nota_media, avaliacoes_contagem) VALUES (?, ?, ?, ?, ?, 5.00, 0)", [id, nome, tipo, descricao, imagem || null]);
        return res.status(201).json({ id, nome, tipo, descricao, imagem, notaMedia: 5.00, avaliacoesContagem: 0 });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao adicionar hospedagem." });
    }
}
async function updateLodging(req, res) {
    try {
        const { id } = req.params;
        const { nome, tipo, descricao, imagem } = req.body;
        await db_1.default.execute("UPDATE lodgings SET nome = ?, tipo = ?, descricao = ?, imagem = ? WHERE id = ?", [nome, tipo, descricao, imagem || null, id]);
        return res.json({ message: "Hospedagem atualizada com sucesso!" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar hospedagem." });
    }
}
async function deleteLodging(req, res) {
    try {
        const { id } = req.params;
        await db_1.default.execute("DELETE FROM lodgings WHERE id = ?", [id]);
        return res.json({ message: "Hospedagem excluída com sucesso!" });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao excluir hospedagem." });
    }
}
// ==========================================
// ⚙️ SETTINGS / CONFIGURAÇÕES
// ==========================================
async function getSettings(req, res) {
    try {
        const { key } = req.params;
        const [rows] = await db_1.default.execute("SELECT value_text as valueText FROM settings WHERE key_name = ?", [key]);
        if (rows.length === 0) {
            return res.status(404).json({ message: "Configuração não encontrada." });
        }
        return res.json({ key, value: rows[0].valueText });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar configuração." });
    }
}
async function updateSetting(req, res) {
    try {
        const { key } = req.params;
        const { value } = req.body;
        // Upsert em settings
        await db_1.default.execute("INSERT INTO settings (key_name, value_text) VALUES (?, ?) ON DUPLICATE KEY UPDATE value_text = ?", [key, value, value]);
        return res.json({ message: "Configuração atualizada com sucesso!", key, value });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao atualizar configuração." });
    }
}
