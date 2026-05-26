"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getComments = getComments;
exports.addComment = addComment;
exports.moderateComment = moderateComment;
exports.deleteComment = deleteComment;
exports.getReviews = getReviews;
exports.addReview = addReview;
const db_1 = __importDefault(require("../config/db"));
const crypto_1 = __importDefault(require("crypto"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
// ==========================================
// 💬 CONTROLADORES DE COMENTÁRIOS / DEPOIMENTOS
// ==========================================
// 1. Obter Comentários (Aprovados se público, todos se Admin para moderação)
async function getComments(req, res) {
    try {
        let role = undefined;
        // Tenta ler o token de forma opcional (sem travar se não for fornecido) para diferenciar visitantes de admins
        if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
            const token = req.headers.authorization.split(" ")[1];
            try {
                const decoded = jsonwebtoken_1.default.verify(token, process.env.JWT_SECRET || "tereverde_jwt_secret_token_security_key_2026");
                const [userRows] = await db_1.default.execute("SELECT role FROM users WHERE id = ?", [decoded.id]);
                if (userRows && userRows.length > 0) {
                    role = userRows[0].role;
                }
            }
            catch (err) {
                // Ignora silenciosamente tokens inválidos ou expirados
            }
        }
        const { targetName, targetType } = req.query;
        let query = `
      SELECT id, user_id as userId, user_name as userName, user_pic as userPic, 
             target_name as targetName, target_type as targetType, content, status, 
             created_at as createdAt 
      FROM comments
    `;
        let params = [];
        // Se não for admin, filtra apenas por comentários aprovados
        if (role !== "admin") {
            query += " WHERE status = 'Aprovado'";
            if (targetName && targetType) {
                query += " AND target_name = ? AND target_type = ?";
                params.push(targetName, targetType);
            }
        }
        else {
            // Se for admin e passou filtros de busca
            if (targetName && targetType) {
                query += " WHERE target_name = ? AND target_type = ?";
                params.push(targetName, targetType);
            }
        }
        query += " ORDER BY created_at DESC";
        const [rows] = await db_1.default.execute(query, params);
        return res.json(rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar depoimentos." });
    }
}
// 2. Adicionar Comentário (Fica pendente de moderação - RN01)
async function addComment(req, res) {
    try {
        const { targetName, targetType, content } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Usuário não autenticado." });
        }
        if (!targetName || !targetType || !content) {
            return res.status(400).json({ message: "Por favor, preencha todos os dados do comentário." });
        }
        const id = `comment-${crypto_1.default.randomUUID().slice(0, 8)}`;
        const userName = req.user.name;
        const userPic = req.user.profilePic || "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100";
        const status = "Pendente"; // Moderação ativa
        await db_1.default.execute("INSERT INTO comments (id, user_id, user_name, user_pic, target_name, target_type, content, status) VALUES (?, ?, ?, ?, ?, ?, ?, ?)", [id, userId, userName, userPic, targetName, targetType, content, status]);
        return res.status(201).json({
            message: "Seu comentário foi enviado para moderação e ficará visível em breve!",
            comment: { id, userId, userName, userPic, targetName, targetType, content, status }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao publicar comentário." });
    }
}
// 3. Moderar Comentário (Aprovar/Reprovar - Admin)
async function moderateComment(req, res) {
    try {
        const { id } = req.params;
        const { status } = req.body; // 'Aprovado' ou 'Reprovado'
        if (!status || !["Aprovado", "Reprovado"].includes(status)) {
            return res.status(400).json({ message: "Status de moderação inválido." });
        }
        await db_1.default.execute("UPDATE comments SET status = ? WHERE id = ?", [status, id]);
        return res.json({ message: `Comentário ${status.toLowerCase()} com sucesso.` });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao moderar depoimento." });
    }
}
// 4. Excluir Comentário (Admin)
async function deleteComment(req, res) {
    try {
        const { id } = req.params;
        await db_1.default.execute("DELETE FROM comments WHERE id = ?", [id]);
        return res.json({ message: "Comentário excluído com sucesso." });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao excluir depoimento." });
    }
}
// ==========================================
// ⭐️ CONTROLADORES DE AVALIAÇÕES (1-5 ESTRELAS)
// ==========================================
// 5. Listar Avaliações por Destino
async function getReviews(req, res) {
    try {
        const { targetId, targetType } = req.query;
        if (!targetId || !targetType) {
            return res.status(400).json({ message: "Preencha o targetId e o targetType." });
        }
        const [rows] = await db_1.default.execute("SELECT id, user_id as userId, user_name as userName, target_id as targetId, target_type as targetType, rating, comment, created_at as createdAt FROM reviews WHERE target_id = ? AND target_type = ? ORDER BY created_at DESC", [targetId, targetType]);
        return res.json(rows);
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao buscar avaliações." });
    }
}
// 6. Criar Avaliação (1 a 5 estrelas - RN02) com Recálculo de Média automático
async function addReview(req, res) {
    try {
        const { targetId, targetType, rating, comment } = req.body;
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({ message: "Usuário não autenticado." });
        }
        if (!targetId || !targetType || !rating) {
            return res.status(400).json({ message: "Campos obrigatórios ausentes." });
        }
        const ratingVal = parseInt(rating);
        if (ratingVal < 1 || ratingVal > 5) {
            return res.status(400).json({ message: "A nota deve estar entre 1 e 5 estrelas." });
        }
        // 1. Evitar múltiplas avaliações do mesmo usuário no mesmo destino
        const [existingReviews] = await db_1.default.execute("SELECT id FROM reviews WHERE user_id = ? AND target_id = ?", [userId, targetId]);
        if (existingReviews && existingReviews.length > 0) {
            return res.status(400).json({ message: "Você já avaliou este estabelecimento." });
        }
        const reviewId = `review-${crypto_1.default.randomUUID().slice(0, 8)}`;
        const userName = req.user.name;
        // 2. Inserir avaliação
        await db_1.default.execute("INSERT INTO reviews (id, user_id, user_name, target_id, target_type, rating, comment) VALUES (?, ?, ?, ?, ?, ?, ?)", [reviewId, userId, userName, targetId, targetType, ratingVal, comment || ""]);
        // 3. Recalcular a média e contagem de avaliações para o destino
        const [statsRows] = await db_1.default.execute("SELECT COUNT(id) as contagem, AVG(rating) as media FROM reviews WHERE target_id = ?", [targetId]);
        const contagem = parseInt(statsRows[0].contagem || "0");
        const media = parseFloat(statsRows[0].media || "5.00").toFixed(2);
        // 4. Atualizar no banco de dados do estabelecimento (Restaurante ou Hospedagem)
        if (targetType === "Restaurante") {
            await db_1.default.execute("UPDATE restaurants SET nota_media = ?, avaliacoes_contagem = ? WHERE id = ?", [media, contagem, targetId]);
        }
        else if (targetType === "Hospedagem") {
            await db_1.default.execute("UPDATE lodgings SET nota_media = ?, avaliacoes_contagem = ? WHERE id = ?", [media, contagem, targetId]);
        }
        return res.status(201).json({
            message: "Avaliação publicada com sucesso!",
            review: { id: reviewId, userId, userName, targetId, targetType, rating: ratingVal, comment },
            stats: { contagem, media: parseFloat(media) }
        });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Erro ao registrar avaliação." });
    }
}
