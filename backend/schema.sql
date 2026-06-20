-- =========================================================================
-- BANCO DE DADOS E TABELAS - TERÊ VERDE
-- Motor de Banco de Dados: MySQL (v8.0+ recomendado por suporte a campos JSON)
-- =========================================================================

-- 1. Criação do Banco de Dados
CREATE DATABASE IF NOT EXISTS tere_verde
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE tere_verde;

-- Desativar verificação de chaves estrangeiras temporariamente para evitar conflitos na criação
SET FOREIGN_KEY_CHECKS = 0;

-- 2. Tabela: users
DROP TABLE IF EXISTS users;
CREATE TABLE users (
  id VARCHAR(50) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  role ENUM('visitor', 'admin') DEFAULT 'visitor',
  cpf VARCHAR(14) UNIQUE NOT NULL,
  profile_pic VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 3. Tabela: parks
DROP TABLE IF EXISTS parks;
CREATE TABLE parks (
  id VARCHAR(50) PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  altitude VARCHAR(20),
  area VARCHAR(30),
  imagem VARCHAR(255),
  limite_capacidade_diaria INT NOT NULL DEFAULT 100,
  funcionamento VARCHAR(100),
  ingresso_base DECIMAL(10, 2) DEFAULT 0.00,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;

-- 4. Tabela: trails
DROP TABLE IF EXISTS trails;
CREATE TABLE trails (
  id VARCHAR(50) PRIMARY KEY,
  park_id VARCHAR(50) NOT NULL,
  nome VARCHAR(100) NOT NULL,
  dificuldade VARCHAR(30) NOT NULL,
  duracao VARCHAR(30),
  distancia VARCHAR(30),
  descricao TEXT NOT NULL,
  imagem VARCHAR(255),
  likes INT DEFAULT 0,
  CONSTRAINT fk_trails_parks FOREIGN KEY (park_id) REFERENCES parks(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 5. Tabela: trail_details
DROP TABLE IF EXISTS trail_details;
CREATE TABLE trail_details (
  trail_id VARCHAR(50) PRIMARY KEY,
  descricao_completa TEXT NOT NULL,
  dificuldade_detalhes TEXT,
  recomendacoes JSON NULL, -- Armazena array de strings como JSON
  fotos JSON NULL,         -- Armazena array de URLs de fotos como JSON
  CONSTRAINT fk_details_trails FOREIGN KEY (trail_id) REFERENCES trails(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 6. Tabela: events
DROP TABLE IF EXISTS events;
CREATE TABLE events (
  id VARCHAR(50) PRIMARY KEY,
  park_id VARCHAR(50) NULL,
  nome VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  data DATE NOT NULL,
  preco DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
  limite_capacidade_diaria INT NOT NULL DEFAULT 100,
  imagem VARCHAR(255),
  CONSTRAINT fk_events_parks FOREIGN KEY (park_id) REFERENCES parks(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 7. Tabela: restaurants
DROP TABLE IF EXISTS restaurants;
CREATE TABLE restaurants (
  id VARCHAR(50) PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  imagem VARCHAR(255),
  nota_media DECIMAL(3, 2) DEFAULT 5.00,
  avaliacoes_contagem INT DEFAULT 0
) ENGINE=InnoDB;

-- 8. Tabela: lodgings
DROP TABLE IF EXISTS lodgings;
CREATE TABLE lodgings (
  id VARCHAR(50) PRIMARY KEY,
  nome VARCHAR(100) NOT NULL,
  tipo VARCHAR(100) NOT NULL,
  descricao TEXT NOT NULL,
  imagem VARCHAR(255),
  nota_media DECIMAL(3, 2) DEFAULT 5.00,
  avaliacoes_contagem INT DEFAULT 0
) ENGINE=InnoDB;

-- 9. Tabela: comments (Depoimentos sob moderação)
DROP TABLE IF EXISTS comments;
CREATE TABLE comments (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NULL,
  user_name VARCHAR(100) NOT NULL,
  user_pic VARCHAR(255),
  target_name VARCHAR(100) NOT NULL,
  target_type ENUM('park', 'trail', 'event') NOT NULL,
  content TEXT NOT NULL,
  status ENUM('Pendente', 'Aprovado', 'Reprovado') DEFAULT 'Pendente',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_comments_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 10. Tabela: user_likes (Curtidas nas trilhas)
DROP TABLE IF EXISTS user_likes;
CREATE TABLE user_likes (
  user_id VARCHAR(50) NOT NULL,
  target_name VARCHAR(100) NOT NULL,
  target_type VARCHAR(30) NOT NULL,
  PRIMARY KEY (user_id, target_name, target_type),
  CONSTRAINT fk_likes_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- 11. Tabela: reviews (Avaliações estrelas para Restaurantes/Hospedagens)
DROP TABLE IF EXISTS reviews;
CREATE TABLE reviews (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NULL,
  user_name VARCHAR(100) NOT NULL,
  target_id VARCHAR(50) NOT NULL,
  target_type VARCHAR(30) NOT NULL,
  rating INT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_reviews_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB;

-- 12. Tabela: tickets (Ingressos com controle de capacidade)
DROP TABLE IF EXISTS tickets;
CREATE TABLE tickets (
  id VARCHAR(50) PRIMARY KEY,
  user_id VARCHAR(50) NOT NULL,
  target_id VARCHAR(50) NOT NULL,
  target_type VARCHAR(30) NOT NULL,
  date VARCHAR(20) NOT NULL,
  quantity INT NOT NULL,
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active',
  qr_code VARCHAR(100) UNIQUE NOT NULL,
  checked_in BOOLEAN DEFAULT FALSE,
  checked_in_at TIMESTAMP NULL DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT fk_tickets_users FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB;

-- Reativar verificação de chaves estrangeiras
SET FOREIGN_KEY_CHECKS = 1;

-- =========================================================================
-- SEED / POPULAÇÃO DOS DADOS INICIAIS DA APLICAÇÃO
-- =========================================================================

-- Parques
INSERT INTO parks (id, nome, descricao, altitude, area, imagem, limite_capacidade_diaria, funcionamento, ingresso_base) VALUES 
('parque-nacional', 'Parque Nacional da Serra dos Órgãos', 'Criado em 1939, protege a exuberante biodiversidade da Serra do Mar e formações rochosas icônicas como o Dedo de Deus e a Pedra do Sino.', '2.263m', '20.024 hectares', 'https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?w=800', 300, 'Terça a Domingo, das 8h às 17h', 35.00),
('parque-tres-picos', 'Parque Estadual dos Três Picos', 'O maior parque estadual do Rio de Janeiro, famoso pelos imponentes picos de granito e vales de tirar o fôlego.', '2.366m', '65.113 hectares', 'https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?w=800', 150, 'Diariamente, das 8h às 17h', 0.00),
('parque-municipal', 'Parque Natural Municipal Montanhas de Teresópolis', 'Área de conservação municipal perfeita para caminhadas leves, observação de aves e piqueniques em família, com vista para a Pedra da Tartaruga.', '1.160m', '4.397 hectares', 'https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=800', 200, 'Terça a Domingo, das 8h às 16h', 0.00);

-- Trilhas
INSERT INTO trails (id, park_id, nome, dificuldade, duracao, distancia, descricao, imagem, likes) VALUES
('trilha-pedra-do-sino', 'parque-nacional', 'Pedra do Sino', 'Difícil', '8-10 horas', '14 km', 'Trilha icônica com vista panorâmica da região serrana. O ponto culminante do parque oferece uma das vistas mais espetaculares da Serra dos Órgãos.', 'https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?w=800', 128),
('trilha-travessia', 'parque-nacional', 'Travessia Petrópolis-Teresópolis', 'Muito Difícil', '3 dias', '30 km', 'Uma das trilhas de montanhismo mais clássicas e espetaculares do Brasil, cruzando o coração da Serra dos Órgãos.', 'https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?w=800', 245),
('trilha-veu-noiva', 'parque-nacional', 'Cachoeira Véu da Noiva', 'Fácil', '2 horas', '3 km', 'Trilha leve com cachoeira de 40 metros. Ideal para famílias e iniciantes, oferece banho em piscinas naturais de águas cristalinas.', 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800', 89),
('trilha-cabeca-peixe', 'parque-tres-picos', 'Trilha do Cabeça de Peixe', 'Difícil', '6-7 horas', '8 km', 'Subida íngreme e desafiadora por floresta fechada, culminando em uma vista incrível dos Três Picos de Friburgo.', 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=800', 54),
('trilha-tartaruga', 'parque-municipal', 'Trilha da Pedra da Tartaruga', 'Fácil', '1.5 horas', '2 km', 'Trilha curta e leve que leva até o platô da Pedra da Tartaruga, famosa área para prática de rapel e camping familiar.', 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800', 92);

-- Detalhes das Trilhas (JSON de recomendações e fotos)
INSERT INTO trail_details (trail_id, descricao_completa, dificuldade_detalhes, recomendacoes, fotos) VALUES
('trilha-pedra-do-sino', 
 'A Pedra do Sino, com 2.263 metros de altitude, é o ponto culminante do Parque Nacional da Serra dos Órgãos. A trilha é considerada uma das mais desafiadoras e recompensadoras do parque, oferecendo vistas panorâmicas incomparáveis da região serrana.', 
 'Trilha de nível difícil que exige bom condicionamento físico. Inclui trechos íngremes, caminhadas longas em pedras e trechos com exposição à altura.',
 '["Começar a trilha bem cedo, preferencialmente às 6h da manhã", "Levar no mínimo 3 litros de água por pessoa", "Protetor solar, boné e agasalho para o topo (pode fazer frio)", "Calçado de trekking com boa aderência", "Lanches energéticos e frutas"]',
 '["https://images.unsplash.com/photo-1682347812423-45911f8e6ef1?w=600", "https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?w=600", "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600"]'),

('trilha-travessia', 
 'Considerada uma das travessias mais icônicas do Brasil, a Petrópolis-Teresópolis atravessa 30 km de montanhas, campos de altitude e mata atlântica. Durante três dias, os aventureiros passam por paisagens espetaculares incluindo o Morro do Açu e a Pedra do Sino.', 
 'Travessia de nível muito difícil. Exige excelente preparo físico, navegação e acampamento de alta montanha. Trechos expostos com cabos de aço.',
 '["Reserva obrigatória dos abrigos/camping com antecedência", "Contratar guia credenciado é altamente recomendado", "Equipamento de montanhismo e frio extremo", "Acompanhar atentamente a previsão do tempo"]',
 '["https://images.unsplash.com/photo-1604991274937-b93f0c37f5e9?w=600", "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?w=600"]'),

('trilha-veu-noiva', 
 'A trilha até a Cachoeira Véu da Noiva é uma das mais acessíveis do parque, perfeita para famílias e pessoas que estão começando no trekking. A cachoeira tem aproximadamente 40 metros de altura e forma piscinas naturais ideais para banho.', 
 'Trilha de nível fácil, com poucos trechos de subida leve. O caminho é bem marcado e mantido.',
 '["Levar roupa de banho e toalha", "Protetor solar e repelente contra insetos", "Calçado confortável que possa molhar"]',
 '["https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=600", "https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?w=600"]'),

('trilha-cabeca-peixe', 
 'A subida da Cabeça de Peixe é uma das trilhas mais técnicas dos Três Picos, passando por trechos de escalaminhada pesada e matas virgens.', 
 'Nível difícil. Exige força nos membros superiores nos trechos de corda/raiz e muita atenção.',
 '["Levar luvas para os trechos de cordas", "Hidratação reforçada", "Calçado profissional com excelente aderência"]',
 '["https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600"]'),

('trilha-tartaruga', 
 'Uma caminhada agradável por estradas de terra e caminhos sombreados no Parque Municipal, proporcionando visuais espetaculares da Serra e das formações rochosas locais.', 
 'Nível fácil. Ideal para iniciantes, crianças e idosos com mobilidade ativa.',
 '["Ótimo para observação do pôr do sol", "Levar lanche para piquenique no topo", "Uso de repelente recomendado"]',
 '["https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600", "https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?w=600"]');

-- Eventos
INSERT INTO events (id, park_id, nome, descricao, data, preco, limite_capacidade_diaria, imagem) VALUES
('event-inverno', 'parque-nacional', 'Festival de Inverno Terê Verde', 'Três dias de palestras sobre ecologia, apresentações acústicas ao pôr do sol e oficinas gastronômicas de culinária serrana.', '2026-07-15', 80.00, 100, 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800'),
('event-lua-cheia', 'parque-municipal', 'Trilha Noturna da Lua Cheia', 'Caminhada guiada sob a luz do luar até a Pedra da Tartaruga, com observação astronômica e lanche coletivo.', '2026-06-20', 40.00, 45, 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800');

-- Restaurantes
INSERT INTO restaurants (id, nome, tipo, descricao, imagem, nota_media, avaliacoes_contagem) VALUES
('rest-manjericao', 'Restaurante Manjericão', 'Culinária Saudável & Contemporânea', 'Pratos orgânicos e sofisticados preparados com ingredientes frescos cultivados localmente na região serrana.', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600', 4.80, 1),
('rest-viva-italia', 'Viva Itália Teresópolis', 'Massas & Gastronomia Italiana', 'Experiência italiana tradicional com massas artesanais feitas na casa, rodízio de pizzas no forno a lenha e gelateria própria.', 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600', 4.60, 0);

-- Hospedagens
INSERT INTO lodgings (id, nome, tipo, descricao, imagem, nota_media, avaliacoes_contagem) VALUES
('lodge-chale-vale', 'Chalé dos Frades Aconchegante', 'Chalé & Pousada Ecológica', 'Localizado no coração do Vale dos Frades, com lareira, banheira de hidromassagem externa e vista panorâmica incrível das montanhas.', 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=600', 4.90, 0),
('lodge-hotel-serrador', 'Hotel Recanto do Serrador', 'Hotel Fazenda', 'Estrutura completa com piscina aquecida, trilhas internas, passeios a cavalo e pensão completa ideal para fins de semana.', 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600', 4.50, 0);
