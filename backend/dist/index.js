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
            // 1. Verificar e criar colunas adicionais na tabela parks se não existirem
            const [columns] = await connection.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'parks'", [process.env.DB_NAME || "tere_verde"]);
            const colNames = columns.map((c) => c.COLUMN_NAME.toLowerCase());
            const requiredCols = [
                { name: "video", type: "TEXT" },
                { name: "principais_trilhas", type: "TEXT" },
                { name: "cachoeiras", type: "TEXT" },
                { name: "galeria_fotos", type: "TEXT" },
                { name: "como_chegar", type: "TEXT" }
            ];
            for (const col of requiredCols) {
                if (!colNames.includes(col.name)) {
                    await connection.query(`ALTER TABLE parks ADD COLUMN ${col.name} ${col.type}`);
                    console.log(`➕ Coluna '${col.name}' adicionada à tabela parks`);
                }
            }
            // 1.2 Verificar e criar colunas adicionais na tabela comments se não existirem
            const [commentColumns] = await connection.query("SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'comments'", [process.env.DB_NAME || "tere_verde"]);
            const commentColNames = commentColumns.map((c) => c.COLUMN_NAME.toLowerCase());
            if (!commentColNames.includes("imagem")) {
                await connection.query("ALTER TABLE comments ADD COLUMN imagem TEXT");
                console.log("➕ Coluna 'imagem' adicionada à tabela comments");
            }
            // 1.3 Verificar e criar a tabela settings se não existir
            await connection.query(`
        CREATE TABLE IF NOT EXISTS settings (
          key_name VARCHAR(50) PRIMARY KEY,
          value_text TEXT
        )
      `);
            console.log("✅ Tabela 'settings' verificada/criada!");
            // Seed dos valores padrão para a história da cidade
            const [historyTitleRows] = await connection.query("SELECT key_name FROM settings WHERE key_name = 'city_history_title'");
            if (historyTitleRows.length === 0) {
                await connection.query("INSERT INTO settings (key_name, value_text) VALUES (?, ?)", [
                    "city_history_title",
                    "Breve História de Teresópolis"
                ]);
            }
            const [historyParagraphsRows] = await connection.query("SELECT key_name FROM settings WHERE key_name = 'city_history_paragraphs'");
            if (historyParagraphsRows.length === 0) {
                const defaultParagraphs = [
                    "Fundada formalmente em 1891, a cidade deve seu nome a uma homenagem direta à imperatriz Dona Teresa Cristina, esposa de Dom Pedro II. A Família Imperial brasileira costumava subir a serra para desfrutar do clima agradável e das paisagens espetaculares durante os quentes verões fluminenses.",
                    "Com o passar das décadas, Teresópolis tornou-se mundialmente famosa como o berço do montanhismo nacional, impulsionada pelo icônico pico Dedo de Deus, conquistado pela primeira vez em 1912. Desde então, montanhistas e escaladores de todos os continentes visitam a região serrana para testar seus limites em paredões rochosos históricos e trilhas exuberantes.",
                    "Hoje, além das exuberantes florestas e reservas da biosfera, a cidade se destaca pela alta gastronomia serrana, produção de cervejas artesanais premiadas, agricultura familiar orgânica de ponta e infraestrutura aconchegante para receber casais, famílias e aventureiros de fim de semana."
                ];
                await connection.query("INSERT INTO settings (key_name, value_text) VALUES (?, ?)", [
                    "city_history_paragraphs",
                    JSON.stringify(defaultParagraphs)
                ]);
                console.log("🌱 Configurações padrão de história da cidade semeadas!");
            }
            const [servicesRows] = await connection.query("SELECT key_name FROM settings WHERE key_name = 'city_services'");
            if (servicesRows.length === 0) {
                const defaultServices = [
                    {
                        categoria: "Saúde & Hospitais",
                        nome: "Hospital das Clínicas de Teresópolis (HCTCO)",
                        endereco: "Av. Delfim Moreira, 2011 - Vale do Paraíso",
                        telefone: "(21) 2741-5000",
                        emergencia: "192 (SAMU)"
                    },
                    {
                        categoria: "Segurança & Emergência",
                        nome: "30º Batalhão da Polícia Militar",
                        endereco: "Rua Tenente Luiz Meirelles, s/n - Bom Retiro",
                        telefone: "(21) 2742-7000",
                        emergencia: "190 (Polícia Militar) / 193 (Bombeiros)"
                    },
                    {
                        categoria: "Bancos & Câmbio",
                        nome: "Agências do Centro (Banco do Brasil, Itaú, Bradesco)",
                        endereco: "Av. Feliciano Sodré - Várzea",
                        telefone: "Atendimento comercial local",
                        emergencia: "Disponível caixas 24 horas no Centro"
                    },
                    {
                        categoria: "Turismo & Informações",
                        nome: "Centro de Atendimento ao Turista (CAT Soberbo)",
                        endereco: "Av. Rotariana, s/n (Mirante do Soberbo)",
                        telefone: "(21) 2742-3352 - Ramal 204",
                        emergencia: "Atendimento Diário: 09h às 17h"
                    }
                ];
                await connection.query("INSERT INTO settings (key_name, value_text) VALUES (?, ?)", [
                    "city_services",
                    JSON.stringify(defaultServices)
                ]);
                console.log("🌱 Guia de utilidade pública semeado com sucesso!");
            }
            // Seed dos parques padrão se não existirem ou se precisarem de atualização dos novos campos
            const defaultParksData = [
                {
                    id: "parque-nacional",
                    nome: "Parque Nacional da Serra dos Órgãos",
                    descricao: "O Parque Nacional da Serra dos Órgãos é uma das unidades de conservação mais importantes do Brasil, criado em 1939. Localizado na Serra do Mar, abriga a famosa Pedra do Sino (2.263m), o Dedo de Deus e outras formações rochosas icônicas.\n\nO parque preserva importantes remanescentes de Mata Atlântica, com rica biodiversidade incluindo espécies endêmicas e ameaçadas de extinção.",
                    altitude: "2.263m",
                    area: "20.024 hectares",
                    imagem: "https://images.unsplash.com/photo-1682347810591-be423d4ad8ba?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
                    limite_capacidade_diaria: 300,
                    funcionamento: "Terça a Domingo, 8h às 17h",
                    ingresso_base: 35.00,
                    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    como_chegar: {
                        carro: "Pela BR-116, sentido Teresópolis. A entrada principal fica na Av. Rotariana, s/n, Soberbo. Distância aproximada: 90 km (1h30 de viagem).",
                        onibus: "A partir da Rodoviária Novo Rio, diversas empresas operam a linha Rio-Teresópolis. Do centro de Teresópolis, táxi ou aplicativo até a entrada do parque (aproximadamente 15 minutos)."
                    },
                    galeria_fotos: [
                        "https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?w=400",
                        "https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?w=400",
                        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400",
                        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
                        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
                        "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
                        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400"
                    ],
                    cachoeiras: [
                        { nome: "Véu da Noiva", altura: "40m", descricao: "Cachoeira com piscina natural e fácil acesso" },
                        { nome: "Cachoeira Itaporani", altura: "60m", descricao: "Queda d'água impressionante em meio à mata fechada" },
                        { nome: "Poço do Castelo", altura: "25m", descricao: "Piscina natural cristalina ideal para banho" }
                    ],
                    principais_trilhas: [
                        {
                            nome: "Pedra do Sino",
                            dificuldade: "Difícil",
                            duracao: "8-10 horas",
                            distancia: "14 km",
                            descricao: "Trilha icônica com vista panorâmica da região serrana. O ponto culminante do parque oferece uma das vistas mais espetaculares da Serra dos Órgãos, com 360° de paisagens montanhosas.",
                            imagem: "https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?w=800",
                            detalhes: {
                                descricaoCompleta: "A Pedra do Sino, com 2.263 metros de altitude, é o ponto culminante do Parque Nacional da Serra dos Órgãos. A trilha é considerada uma das mais desafiadoras e recompensadoras do parque, oferecendo vistas panorâmicas incomparáveis da região serrana. O percurso passa por diferentes altitudes e ecossistemas, desde a floresta atlântica até os campos de altitude.",
                                dificuldadeDetalhes: "Trilha de nível difícil que exige bom condicionamento físico. Inclui trechos íngremes, escalaminhadas em pedras e passagens por correntes metálicas. Altitude elevada pode causar desconforto em algumas pessoas.",
                                recomendacoes: [
                                    "Começar a trilha bem cedo, preferencialmente às 6h da manhã",
                                    "Levar no mínimo 3 litros de água por pessoa",
                                    "Protetor solar, boné e óculos de sol são essenciais",
                                    "Calçado de trekking com boa aderência",
                                    "Lanches energéticos e frutas",
                                    "Agasalho para o topo (temperatura pode cair significativamente)"
                                ],
                                fotos: [
                                    "https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?w=600",
                                    "https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?w=600",
                                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600"
                                ]
                            }
                        },
                        {
                            nome: "Travessia Petrópolis-Teresópolis",
                            dificuldade: "Muito Difícil",
                            duracao: "3 dias",
                            distancia: "30 km",
                            descricao: "Uma das trilhas mais clássicas e desafiadoras do Brasil. Percurso atravessa montanhas, florestas densas e oferece experiência completa de imersão na natureza selvagem da Serra dos Órgãos.",
                            imagem: "https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?w=800",
                            detalhes: {
                                descricaoCompleta: "Considerada uma das travessias mais icônicas do Brasil, a Petrópolis-Teresópolis atravessa 30 km de montanhas, campos de altitude e mata atlântica. Durante três dias, os aventureiros passam por paisagens espetaculares incluindo a Pedra do Sino, Morro do Açu, Pedra do Queijo e inúmeros outros pontos panorâmicos.",
                                dificuldadeDetalhes: "Travessia de nível muito difícil que exige excelente condicionamento físico e experiência prévia em trilhas de montanha. Inclui trechos técnicos com uso de cordas, grandes variações de altitude e necessidade de pernoite em abrigos rústicos ou camping.",
                                recomendacoes: [
                                    "Obrigatório reservar os abrigos com antecedência junto ao ICMBio",
                                    "Experiência prévia em trilhas longas é fundamental",
                                    "Equipamento completo de camping e trekking",
                                    "Guia experiente é altamente recomendado para iniciantes na travessia",
                                    "Preparação física com antecedência mínima de 3 meses",
                                    "Verificar previsão do tempo - evitar períodos chuvosos"
                                ],
                                fotos: [
                                    "https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?w=600",
                                    "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600",
                                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600"
                                ]
                            }
                        },
                        {
                            nome: "Cachoeira Véu da Noiva",
                            dificuldade: "Fácil",
                            duracao: "2 horas",
                            distancia: "3 km",
                            descricao: "Trilha leve com cachoeira de 40 metros. Ideal para famílias e iniciantes, oferece banho em piscinas naturais e mirantes para contemplação da queda d'água.",
                            imagem: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800",
                            detalhes: {
                                descricaoCompleta: "A trilha até a Cachoeira Véu da Noiva é uma das mais acessíveis do parque, perfeita para famílias com crianças e pessoas que estão começando no trekking. A cachoeira tem aproximadamente 40 metros de altura e forma piscinas naturais ideais para banho. O caminho é bem sinalizado e passa por trechos de mata atlântica preservada.",
                                dificuldadeDetalhes: "Trilha de nível fácil, com poucos trechos de subida. O caminho é bem marcado e mantido. Adequada para todas as idades, desde que com mínimo de condicionamento físico.",
                                recomendacoes: [
                                    "Levar roupa de banho e toalha",
                                    "Protetor solar e repelente",
                                    "Água e lanches leves",
                                    "Calçado confortável que possa molhar",
                                    "Chegada cedo evita aglomeração",
                                    "Respeitar as placas de segurança próximas à cachoeira"
                                ],
                                fotos: [
                                    "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600",
                                    "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600",
                                    "https://images.unsplash.com/photo-1520218508822-998633d997e6?w=600"
                                ]
                            }
                        }
                    ]
                },
                {
                    id: "parque-municipal",
                    nome: "Parque Natural Municipal Montanhas de Teresópolis",
                    descricao: "O Parque Natural Municipal Montanhas de Teresópolis, criado em 2009, é uma unidade de conservação municipal que protege importantes áreas de Mata Atlântica no entorno da cidade. Com trilhas bem sinalizadas e infraestrutura preparada para visitação.\n\nIdeal para famílias, idosos e iniciantes, oferece trilhas leves, cachoeiras acessíveis, áreas de piquenique e mirantes com vistas espetaculares.",
                    altitude: "1.200m",
                    area: "3.568 hectares",
                    imagem: "https://images.unsplash.com/photo-1604990830224-5aeb2863fbbe?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
                    limite_capacidade_diaria: 150,
                    funcionamento: "Quarta a Segunda, 9h às 16h",
                    ingresso_base: 0.00,
                    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    como_chegar: {
                        carro: "Do centro de Teresópolis, seguir pela Av. Lúcio Meira em direção a Nova Friburgo. Estrada Teresópolis-Friburgo (RJ-130), km 6, Albuquerque. Estacionamento gratuito disponível na entrada.",
                        onibus: "Ônibus da linha 'Albuquerque' sai do terminal rodoviário de Teresópolis. Descer no km 6 da RJ-130."
                    },
                    galeria_fotos: [
                        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
                        "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400",
                        "https://images.unsplash.com/photo-1511497584788-876760111969?w=400",
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400",
                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
                        "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
                        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
                        "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=400"
                    ],
                    cachoeiras: [
                        { nome: "Cachoeira do Imbuí", altura: "30m", descricao: "Cachoeira com acesso fácil e piscina natural" },
                        { nome: "Cascata dos Fetos", altura: "12m", descricao: "Pequena cascata cercada por samambaias" },
                        { nome: "Poço Verde", altura: "8m", descricao: "Piscina natural com água cristalina e verde" }
                    ],
                    principais_trilhas: [
                        {
                            nome: "Trilha da Primavera",
                            dificuldade: "Fácil",
                            duracao: "1-2 horas",
                            distancia: "2 km",
                            descricao: "Trilha leve ideal para famílias e iniciantes. Percurso bem sinalizado através de mata nativa com mirantes naturais e áreas de descanso, perfeito para observação de aves e flora local.",
                            imagem: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800",
                            detalhes: {
                                descricaoCompleta: "A Trilha da Primavera é perfeita para quem está começando no trekking ou para famílias com crianças. O percurso de 2 km é totalmente sinalizado e passa por diversos pontos de interesse da mata atlântica. Durante a primavera (setembro a dezembro), o caminho fica repleto de flores silvestres, daí o nome da trilha.",
                                dificuldadeDetalhes: "Trilha de nível fácil, praticamente plana, com piso bem mantido. Adequada para todas as idades. Não requer equipamentos especiais além de calçado confortável.",
                                recomendacoes: [
                                    "Ideal para crianças a partir de 4 anos",
                                    "Levar água e lanche leve",
                                    "Binóculos para observação de aves",
                                    "Repelente e protetor solar",
                                    "Câmera fotográfica - ótimas oportunidades",
                                    "Melhor época: primavera (setembro a dezembro)"
                                ],
                                fotos: [
                                    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600",
                                    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600",
                                    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600"
                                ]
                            }
                        },
                        {
                            nome: "Cartão Postal",
                            dificuldade: "Moderado",
                            duracao: "3 horas",
                            distancia: "4 km",
                            descricao: "Vista panorâmica da cidade de Teresópolis. Trilha moderada que leva ao principal mirante do parque, oferecendo vista 180° da cidade e montanhas ao redor, especialmente bonita ao pôr do sol.",
                            imagem: "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=800",
                            detalhes: {
                                descricaoCompleta: "A trilha Cartão Postal recebe este nome devido à vista espetacular que proporciona de Teresópolis e região. É uma das trilhas mais procuradas do parque, especialmente no final da tarde quando o pôr do sol cria um espetáculo de cores sobre as montanhas. O mirante no topo tem estrutura com bancos para descanso e contemplação.",
                                dificuldadeDetalhes: "Trilha de nível moderado com alguns trechos de subida mais acentuada. Requer condicionamento físico básico. Nos últimos 500 metros há degraus construídos em pedra.",
                                recomendacoes: [
                                    "Chegar 1 hora antes do pôr do sol para melhores fotos",
                                    "Levar lanterna para o retorno se for no fim de tarde",
                                    "Mínimo 1,5 litros de água por pessoa",
                                    "Agasalho leve para o mirante (venta bastante)",
                                    "Evitar em dias nublados - visibilidade prejudicada",
                                    "Respeitar horário de fechamento do parque"
                                ],
                                fotos: [
                                    "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=600",
                                    "https://images.unsplash.com/photo-1511497584788-876760111969?w=600",
                                    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600"
                                ]
                            }
                        },
                        {
                            nome: "Pedra da Tartaruga",
                            dificuldade: "Moderado",
                            duracao: "4 horas",
                            distancia: "5 km",
                            descricao: "Formação rochosa com mirante natural. A trilha serpenteia por mata atlântica bem preservada até uma formação rochosa que lembra uma tartaruga, com vista privilegiada do vale.",
                            imagem: "https://images.unsplash.com/photo-1511497584788-876760111969?w=800",
                            detalhes: {
                                descricaoCompleta: "A Pedra da Tartaruga é uma formação rochosa natural que, vista de determinado ângulo, lembra o casco de uma tartaruga gigante. A trilha até lá é uma das mais bonitas do parque, atravessando áreas densas de mata atlântica com rica biodiversidade. O topo da formação oferece vista de 270° do vale e das montanhas circundantes.",
                                dificuldadeDetalhes: "Trilha de nível moderado com variação de altitude de aproximadamente 300 metros. Alguns trechos exigem uso das mãos para apoio em pedras. Recomendado para pessoas com experiência básica em trilhas.",
                                recomendacoes: [
                                    "Calçado de trekking com boa aderência",
                                    "Bastões de caminhada são úteis nas subidas",
                                    "Levar 2 litros de água por pessoa",
                                    "Lanche energético para consumir no topo",
                                    "Evitar em dias chuvosos - pedras ficam escorregadias",
                                    "Cuidado extra na descida - maioria dos acidentes ocorre nesta fase"
                                ],
                                fotos: [
                                    "https://images.unsplash.com/photo-1511497584788-876760111969?w=600",
                                    "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=600",
                                    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600"
                                ]
                            }
                        }
                    ]
                },
                {
                    id: "parque-tres-picos",
                    nome: "Parque Estadual dos Três Picos",
                    descricao: "O Parque Estadual dos Três Picos é a maior unidade de conservação integral do Estado do Rio de Janeiro, criado em 2002. O parque protege importante área de Mata Atlântica, com altitude variando de 300m a 2.310m no Pico do Açu.\n\nCom paisagens deslumbrantes, abriga nascentes de rios importantes, cachoeiras espetaculares e uma biodiversidade única da Serra dos Órgãos.",
                    altitude: "2.366m",
                    area: "46.350 hectares",
                    imagem: "https://images.unsplash.com/photo-1682347813709-e0e59e834b04?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&q=80&w=600",
                    limite_capacidade_diaria: 250,
                    funcionamento: "Todos os dias, 8h às 17h",
                    ingresso_base: 0.00,
                    video: "https://www.youtube.com/embed/dQw4w9WgXcQ",
                    como_chegar: {
                        carro: "Pela RJ-116, sentido Nova Friburgo/Cachoeiras de Macacu. Acesso principal pela Estrada RJ-116, km 57. Distância aproximada: 100 km (2h de viagem).",
                        onibus: "Seguir pela RJ-130 até Cachoeiras de Macacu, depois RJ-116. Aproximadamente 50 km (1h15)."
                    },
                    galeria_fotos: [
                        "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400",
                        "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=400",
                        "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400",
                        "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=400",
                        "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=400",
                        "https://images.unsplash.com/photo-1511497584788-876760111969?w=400",
                        "https://images.unsplash.com/photo-1426604966848-d7adac402bff?w=400",
                        "https://images.unsplash.com/photo-1501785888041-af3ef285b470?w=400"
                    ],
                    cachoeiras: [
                        { nome: "Cachoeira do Salomão", altura: "80m", descricao: "Queda d'água impressionante com piscina natural" },
                        { nome: "Cachoeira da Grama", altura: "35m", descricao: "Cachoeira de fácil acesso em meio à vegetação nativa" },
                        { nome: "Poço do Marimbondo", altura: "15m", descricao: "Piscina natural cristalina cercada por pedras" }
                    ],
                    principais_trilhas: [
                        {
                            nome: "Pico do Açu",
                            dificuldade: "Muito Difícil",
                            duracao: "10-12 horas",
                            distancia: "16 km",
                            descricao: "Trilha técnica para o pico mais alto do parque, com altitude de 2.310m. Exige preparo físico e experiência em montanhismo, oferecendo vistas panorâmicas incomparáveis da região serrana.",
                            imagem: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
                            detalhes: {
                                descricaoCompleta: "O Pico do Açu, com 2.310 metros de altitude, é o ponto mais alto do Parque Estadual dos Três Picos. A trilha é extremamente desafiadora e requer experiência prévia em montanhismo e escalada. O percurso inclui trechos técnicos com uso de cordas e equipamentos de segurança, atravessando formações rochosas impressionantes e campos de altitude.",
                                dificuldadeDetalhes: "Trilha de nível muito difícil, classificada como técnica. Requer conhecimentos de escalada, uso de equipamentos de segurança (cordas, mosquetões) e excelente condicionamento físico. Não recomendada para iniciantes.",
                                recomendacoes: [
                                    "Obrigatória a presença de guia experiente e certificado",
                                    "Equipamentos de escalada e segurança são essenciais",
                                    "Preparo físico específico com antecedência de 6 meses",
                                    "Autorização prévia do INEA necessária",
                                    "Partir antes do amanhecer (recomendado às 4h)",
                                    "Condições climáticas devem ser perfeitas - sem previsão de chuva"
                                ],
                                fotos: [
                                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
                                    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600",
                                    "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600"
                                ]
                            }
                        },
                        {
                            nome: "Pedra da Cabeça do Dragão",
                            dificuldade: "Difícil",
                            duracao: "6-8 horas",
                            distancia: "10 km",
                            descricao: "Formação rochosa com vista espetacular. A trilha passa por mata densa e trechos rochosos, culminando em um dos mirantes mais impressionantes do parque com vista 360°.",
                            imagem: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800",
                            detalhes: {
                                descricaoCompleta: "A Pedra da Cabeça do Dragão é uma formação rochosa única que se destaca na paisagem. A trilha oferece uma combinação perfeita de mata atlântica preservada e trechos rochosos desafiadores. O mirante no topo proporciona vista 360° de toda a região, incluindo outros picos da Serra dos Órgãos.",
                                dificuldadeDetalhes: "Trilha de nível difícil com trechos íngremes e passagens rochosas que exigem uso das mãos. Boa experiência em trilhas de montanha é recomendada.",
                                recomendacoes: [
                                    "Guia local é altamente recomendado",
                                    "Calçado apropriado com excelente aderência",
                                    "Luvas para proteção nas passagens rochosas",
                                    "Mínimo de 2,5 litros de água por pessoa",
                                    "Evitar em dias de chuva - pedras ficam escorregadias",
                                    "Começar cedo para evitar o sol forte"
                                ],
                                fotos: [
                                    "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600",
                                    "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600",
                                    "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600"
                                ]
                            }
                        },
                        {
                            nome: "Cachoeira do Salomão",
                            dificuldade: "Moderado",
                            duracao: "4 horas",
                            distancia: "6 km",
                            descricao: "Trilha até cachoeira com piscina natural. Percurso moderado por mata atlântica preservada, culminando em queda d'água de 80 metros com área para banho.",
                            imagem: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800",
                            detalhes: {
                                descricaoCompleta: "A Cachoeira do Salomão é uma das mais impressionantes do Parque Estadual dos Três Picos. Com 80 metros de altura, forma um poço profundo ideal para banho. A trilha atravessa mata atlântica bem preservada, com diversos pontos de observação da fauna e flora locais.",
                                dificuldadeDetalhes: "Trilha de nível moderado com alguns trechos de subida. Caminho bem marcado, mas com pequenas travessias de riachos e trechos úmidos que exigem atenção.",
                                recomendacoes: [
                                    "Levar roupa de banho, toalha e roupa extra",
                                    "Calçado que possa molhar (papete de trekking ideal)",
                                    "Saco impermeável para proteger pertences",
                                    "Repelente natural e protetor solar",
                                    "Não pular das pedras próximas à cachoeira",
                                    "Respeitar sinalização de segurança"
                                ],
                                fotos: [
                                    "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600",
                                    "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600",
                                    "https://images.unsplash.com/photo-1520218508822-998633d997e6?w=600"
                                ]
                            }
                        }
                    ]
                }
            ];
            for (const park of defaultParksData) {
                const [existing] = await connection.query("SELECT id FROM parks WHERE id = ?", [park.id]);
                if (existing.length === 0) {
                    await connection.query("INSERT INTO parks (id, nome, descricao, altitude, area, imagem, limite_capacidade_diaria, funcionamento, ingresso_base, video, principais_trilhas, cachoeiras, galeria_fotos, como_chegar) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)", [
                        park.id,
                        park.nome,
                        park.descricao,
                        park.altitude,
                        park.area,
                        park.imagem,
                        park.limite_capacidade_diaria,
                        park.funcionamento,
                        park.ingresso_base,
                        park.video,
                        JSON.stringify(park.principais_trilhas),
                        JSON.stringify(park.cachoeiras),
                        JSON.stringify(park.galeria_fotos),
                        JSON.stringify(park.como_chegar)
                    ]);
                    console.log(`🌱 Parque ${park.nome} semeado com sucesso!`);
                }
                else {
                    await connection.query("UPDATE parks SET video = IFNULL(video, ?), principais_trilhas = IFNULL(principais_trilhas, ?), cachoeiras = IFNULL(cachoeiras, ?), galeria_fotos = IFNULL(galeria_fotos, ?), como_chegar = IFNULL(como_chegar, ?) WHERE id = ?", [
                        park.video,
                        JSON.stringify(park.principais_trilhas),
                        JSON.stringify(park.cachoeiras),
                        JSON.stringify(park.galeria_fotos),
                        JSON.stringify(park.como_chegar),
                        park.id
                    ]);
                    console.log(`🌱 Parque ${park.nome} atualizado com os novos campos (se eram nulos)!`);
                }
            }
        }
        catch (seedErr) {
            console.warn("⚠️ Aviso: Falha ao semear dados de teste automáticos:", seedErr.message);
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
