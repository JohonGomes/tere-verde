# Terê Verde - Documentação Oficial do Projeto

Bem-vindo à documentação oficial do **Terê Verde**, um portal completo de turismo, preservação ecológica, agendamento de visitas e exploração de parques, trilhas e atrações na região de Teresópolis, RJ.

Este documento detalha toda a arquitetura, modelo de dados, rotas de API, estrutura de código e fluxo de execução do sistema para desenvolvedores e mantenedores.

---

## 📸 Sumário
1. [Visão Geral](#1-visão-geral)
2. [Arquitetura Geral](#2-arquitetura-geral)
3. [Estrutura de Diretórios](#3-estrutura-de-diretórios)
4. [Banco de Dados (MySQL)](#4-banco-de-dados-mysql)
5. [Rotas e Endpoints da API (Backend)](#5-rotas-e-endpoints-da-api-backend)
6. [Frontend (React + Vite)](#6-frontend-react--vite)
7. [Regras de Negócio Implementadas](#7-regras-de-negócio-implementadas)
8. [Configuração e Execução Local](#8-configuração-e-execução-local)

---

## 1. Visão Geral

O **Terê Verde** foi concebido como um portal integrado para conectar turistas, montanhistas e moradores de Teresópolis às maravilhas naturais da região. O sistema atende a três perfis de usuários principais:
- **Visitante Anônimo**: Navega pelas informações dos parques, trilhas, eventos locais, restaurantes e opções de hospedagem.
- **Visitante Autenticado**: Consegue curtir trilhas, registrar depoimentos (sujeitos a moderação), avaliar estabelecimentos com estrelas, e agendar/comprar ingressos com controle de capacidade e geração de QR Code.
- **Administrador**: Gerencia a capacidade dos parques, modera depoimentos, cadastra/edita atrações (parques, trilhas, eventos, etc.), e realiza o check-in de ingressos na recepção dos parques pesquisando por CPF ou escaneando o QR Code.

---

## 2. Arquitetura Geral

O projeto segue um modelo de arquitetura **Cliente-Servidor de Duas Camadas** (Frontend SPA + API Backend RESTful):

```
┌────────────────────────┐         HTTP / JSON          ┌────────────────────────┐
│     Frontend SPA       │ ───────────────────────────> │      Backend API       │
│     (React, Vite,      │ <─────────────────────────── │   (Express, Node, TS)  │
│    Tailwind CSS v4)    │      Tokens JWT / Dados      └────────────────────────┘
└────────────────────────┘                                          │
                                                                    │ Conexão Pool (mysql2)
                                                                    ▼
                                                        ┌────────────────────────┐
                                                        │   Banco de Dados       │
                                                        │        MySQL           │
                                                        └────────────────────────┘
```

### Tecnologias Utilizadas

#### Frontend:
- **Core**: React 18, TypeScript, Vite.
- **Estilização**: Tailwind CSS v4 + Tailwind Vite Plugin, Radix UI (primitivos de acessibilidade) e shadcn/ui.
- **Animações**: Framer Motion / Motion.
- **Icons**: Lucide React.
- **Notificações**: Sonner.
- **Navegação**: Roteador baseado em estado customizado (`currentPage` no [App.tsx](file:///c:/Users/087774/www/projetos/johon/projetos/tere-verde/src/app/App.tsx)).

#### Backend:
- **Plataforma**: Node.js com TypeScript.
- **Framework**: Express.js.
- **Banco de Dados**: MySQL 8.0+ (com suporte a colunas JSON para metadados).
- **Segurança**: Criptografia de senhas com `bcryptjs` e autenticação baseada em JWT (`jsonwebtoken`).
- **Execução**: `ts-node-dev` para ambiente de desenvolvimento ágil.

---

## 3. Estrutura de Diretórios

O repositório é dividido em dois diretórios principais: a raiz (Frontend) e a subpasta `/backend` (API).

```
tere-verde/
├── backend/                  # Código Fonte do Backend
│   ├── src/
│   │   ├── config/           # Configurações globais (Banco de Dados)
│   │   │   └── db.ts         # Conexão Pool do MySQL
│   │   ├── controllers/      # Controladores com a lógica de negócio
│   │   │   ├── authController.ts
│   │   │   ├── commentController.ts
│   │   │   ├── miscController.ts
│   │   │   ├── parkController.ts
│   │   │   └── trailController.ts
│   │   ├── middlewares/      # Middlewares do Express
│   │   │   └── auth.ts       # Validação de JWT e roles de usuário
│   │   ├── routes/           # Mapeamento de rotas da API REST
│   │   │   ├── authRoutes.ts
│   │   │   ├── commentRoutes.ts
│   │   │   ├── miscRoutes.ts
│   │   │   ├── parkRoutes.ts
│   │   │   └── trailRoutes.ts
│   │   ├── index.ts          # Arquivo de entrada do servidor Express e Seeder inicial
│   │   └── test_api.ts       # Script de testes de integração automáticos
│   ├── schema.sql            # Definição e Seed físico do Banco de Dados
│   ├── tsconfig.json         # Configuração do compilador TypeScript
│   └── package.json          # Dependências do backend
│
├── src/                      # Código Fonte do Frontend
│   ├── app/
│   │   ├── components/       # Componentes React
│   │   │   ├── pages/        # Telas completas da aplicação
│   │   │   │   ├── AdminDashboardPage.tsx   # Painel Admin (Gráficos, CRUDs, Moderação)
│   │   │   │   ├── ParqueDetalhePage.tsx    # Detalhes, trilhas, fotos, compra de ingressos
│   │   │   │   ├── ReceptionPage.tsx        # Leitor e validador de QR Code de tickets
│   │   │   │   ├── UserProfilePage.tsx      # Dashboard do usuário e histórico de ingressos
│   │   │   │   └── ... (Trilhas, Eventos, Hospedagens, Restaurantes, Sobre)
│   │   │   ├── sections/     # Seções modulares da Landing Page
│   │   │   ├── ui/           # Componentes base reutilizáveis (shadcn/ui e Radix)
│   │   │   ├── AuthModal.tsx # Modal unificado de Login/Registro
│   │   │   ├── Header.tsx    # Cabeçalho adaptável com menu e perfil do usuário
│   │   │   ├── LandingPage.tsx
│   │   │   └── ...
│   │   ├── contexts/         # Contextos globais do React
│   │   │   ├── AuthContext.tsx  # Estado global de autenticação
│   │   │   └── ThemeContext.tsx # Estado global de visualização (Tema Escuro / Acessibilidade)
│   │   ├── services/         # Camada de comunicação com a API Backend
│   │   │   └── api.ts        # Métodos de chamada HTTP (Fetch API) com token JWT
│   │   ├── types/            # Definição de interfaces TypeScript
│   │   └── App.tsx           # Entrada de controle de páginas e inicialização de Contexts
│   ├── styles/
│   ├── main.tsx              # Ponto de entrada do React
│   └── imports/              # Anexos físicos (imagens e PDF de especificações do projeto)
├── package.json              # Dependências do frontend
└── vite.config.ts            # Configuração do bundler Vite
```

---

## 4. Banco de Dados (MySQL)

O banco de dados se chama `tere_verde`. O arquivo [backend/schema.sql](file:///c:/Users/087774/www/projetos/johon/projetos/tere-verde/backend/schema.sql) contém a criação e seed de todas as tabelas.

### Modelagem Relacional

Abaixo estão listadas as 12 tabelas do banco de dados, seus propósitos e principais relacionamentos:

1. **`users`**: Armazena as contas de visitantes e administradores.
   - `id` (PK), `name`, `email` (Unique), `password_hash`, `role` (Enum: 'visitor', 'admin'), `cpf` (Unique), `profile_pic`, `created_at`.
2. **`parks`**: Cadastro dos três parques naturais da região serrana.
   - `id` (PK), `nome`, `descricao`, `altitude`, `area`, `imagem`, `limite_capacidade_diaria`, `funcionamento`, `ingresso_base`, `video` (Embed do YouTube), `principais_trilhas` (JSON), `cachoeiras` (JSON), `galeria_fotos` (JSON), `como_chegar` (JSON).
3. **`trails`**: Catálogo de trilhas associadas a cada parque.
   - `id` (PK), `park_id` (FK -> `parks.id`), `nome`, `dificuldade`, `duracao`, `distancia`, `descricao`, `imagem`, `likes`.
4. **`trail_details`**: Informações ricas estendidas de cada trilha (imagens, recomendações).
   - `trail_id` (PK, FK -> `trails.id`), `descricao_completa`, `dificuldade_detalhes`, `recomendacoes` (JSON), `fotos` (JSON).
5. **`events`**: Eventos agendados nos parques ecológicos.
   - `id` (PK), `park_id` (FK -> `parks.id`), `nome`, `descricao`, `data`, `preco`, `limite_capacidade_diaria`, `imagem`.
6. **`restaurants`**: Opções gastronômicas sugeridas no guia urbano de Teresópolis.
   - `id` (PK), `nome`, `tipo`, `descricao`, `imagem`, `nota_media`, `avaliacoes_contagem`.
7. **`lodgings`**: Hotéis, chalés e pousadas recomendadas.
   - `id` (PK), `nome`, `tipo`, `descricao`, `imagem`, `nota_media`, `avaliacoes_contagem`.
8. **`comments`**: Depoimentos ou avaliações sob moderação.
   - `id` (PK), `user_id` (FK -> `users.id`), `user_name`, `user_pic`, `target_name`, `target_type` (Enum: 'park', 'trail', 'event'), `content`, `status` (Enum: 'Pendente', 'Aprovado', 'Reprovado'), `imagem`, `created_at`.
9. **`user_likes`**: Tabela de junção para registrar as curtidas únicas dos usuários em trilhas/parques.
   - `user_id` (FK -> `users.id`), `target_name`, `target_type` (Composta PK).
10. **`reviews`**: Avaliações de estrelas associadas a restaurantes e hotéis.
    - `id` (PK), `user_id` (FK -> `users.id`), `user_name`, `target_id` (ID da hospedagem/restaurante), `target_type` (String), `rating` (1 a 5), `comment`, `created_at`.
11. **`tickets`**: Ingressos emitidos para entrada nos parques ou participação em eventos.
    - `id` (PK), `user_id` (FK -> `users.id`), `target_id` (ID do parque ou evento), `target_type` (Enum: 'park', 'event'), `date`, `quantity`, `total_price`, `status` ('active', 'cancelled'), `qr_code` (Unique), `checked_in` (Booleano), `checked_in_at` (Timestamp), `created_at`.
12. **`settings`**: Parâmetros e textos dinâmicos do sistema gerenciados pelo Admin (ex: história da cidade e telefones úteis).
    - `key_name` (PK), `value_text` (TEXT / JSON).

---

## 5. Rotas e Endpoints da API (Backend)

Todos os endpoints da API estão sob o prefixo `/api`. A autenticação é realizada enviando o cabeçalho `Authorization: Bearer <TOKEN_JWT>`.

### Autenticação (`/api/auth`)
- **`POST /register`**: Cria um novo usuário. Retorna o token JWT e dados públicos do usuário.
- **`POST /login`**: Autentica o usuário por e-mail e senha. Retorna o token JWT.
- **`GET /profile`**: Obtém os dados do perfil logado (Requer Token).
- **`PUT /profile/update`**: Atualiza nome e CPF do perfil logado (Requer Token).

### Parques e Ingressos (`/api/parks`)
- **`GET /`**: Retorna a lista de todos os parques ecológicos cadastrados.
- **`POST /`**: Cadastra um novo parque (Requer Token + Perfil `admin`).
- **`PUT /:id`**: Atualiza dados de um parque (Requer Token + Perfil `admin`).
- **`DELETE /:id`**: Remove um parque (Requer Token + Perfil `admin`).
- **`POST /tickets/buy`**: Compra/Agenda ingressos para um parque ou evento (Requer Token). Valida limite de capacidade.
- **`GET /tickets`**: Lista ingressos (Retorna todos para o `admin`, ou apenas os próprios para o `visitor`).
- **`POST /tickets/check-in/:ticketId`**: Realiza o check-in de entrada e marca o ingresso como utilizado (Requer Token).

### Trilhas (`/api/trails`)
- **`GET /`**: Retorna o catálogo de trilhas.
- **`GET /:id`**: Retorna detalhes adicionais e recomendações de uma trilha.
- **`POST /like/:id`**: Curte/Descurte uma trilha (Requer Token).
- **`POST /`**: Cria uma nova trilha (Requer Token + Perfil `admin`).
- **`PUT /:id`**: Edita uma trilha (Requer Token + Perfil `admin`).
- **`DELETE /:id`**: Remove uma trilha (Requer Token + Perfil `admin`).

### Depoimentos & Avaliações (`/api`)
- **`GET /comments`**: Retorna depoimentos. Visitantes comuns só recebem depoimentos com status `"Aprovado"`. Administradores recebem todos (inclusive `"Pendente"`).
- **`POST /comments`**: Envia um novo depoimento que entra com status `"Pendente"` para moderação (Requer Token).
- **`PATCH /comments/moderate/:id`**: Altera status de moderação para `"Aprovado"` ou `"Reprovado"` (Requer Token + Perfil `admin`).
- **`DELETE /comments/:id`**: Remove um comentário (Requer Token + Perfil `admin`).
- **`GET /reviews`**: Lista as avaliações por estrelas filtrando por `targetId` e `targetType` (hospedagem ou restaurante).
- **`POST /reviews`**: Registra uma nova avaliação por estrelas (Requer Token). Recalcula e atualiza a média física do estabelecimento correspondente no banco.

### Recursos Diversos & Configurações (`/api`)
- **`GET /events`**, **`POST /events`**, **`PUT /events/:id`**, **`DELETE /events/:id`**: CRUD e listagem de Eventos Ecológicos.
- **`GET /restaurants`**, **`POST /restaurants`**, **`PUT /restaurants/:id`**, **`DELETE /restaurants/:id`**: CRUD e listagem de Restaurantes.
- **`GET /lodgings`**, **`POST /lodgings`**, **`PUT /lodgings/:id`**, **`DELETE /lodgings/:id`**: CRUD e listagem de Hospedagens.
- **`GET /settings/:key`**: Obtém configurações globais de texto (ex: história de Teresópolis).
- **`PUT /settings/:key`**: Atualiza textos globais gerenciados pelo painel admin (Requer Token + Perfil `admin`).

---

## 6. Frontend (React + Vite)

A aplicação do lado do cliente foi desenhada para ser rápida, acessível e responsiva.

### Gerenciamento de Estado Global

#### 1. Autenticação ([AuthContext.tsx](file:///c:/Users/087774/www/projetos/johon/projetos/tere-verde/src/app/contexts/AuthContext.tsx))
Gerencia as credenciais do usuário. Ao efetuar login, armazena o token JWT no `localStorage` com a chave `tere_verde_token` e o objeto `user` no estado do React. Expõe funções úteis:
- `login(email, password)`
- `register(name, email, cpf)`
- `logout()`
- `updateUser(name, cpf)`

#### 2. Visual & Acessibilidade ([ThemeContext.tsx](file:///c:/Users/087774/www/projetos/johon/projetos/tere-verde/src/app/contexts/ThemeContext.tsx))
Responsável pelas preferências de visualização do visitante:
- **Modo Escuro / Claro**: Toggles de classe `.dark` injetados no documento root do HTML.
- **Tamanho do Texto**: Ajuste dinâmico de fontes (pequena, média, grande).
- **Alto Contraste**: Suporte a folhas de estilo otimizadas para pessoas com baixa visão ou daltonismo.

### Roteador Personalizado
Para manter a simplicidade e a portabilidade dentro de pacotes de testes do Figma, o controle de telas é gerenciado via estado `currentPage` em [App.tsx](file:///c:/Users/087774/www/projetos/johon/projetos/tere-verde/src/app/App.tsx). Isso elimina dependências complexas de histórico do navegador (History API) ao mesmo tempo em que fornece um fluxo fluído de navegação entre as telas.

---

## 7. Regras de Negócio Implementadas

### RN01: Moderação de Depoimentos
Os comentários deixados pelos usuários nas trilhas e nos parques não aparecem instantaneamente. 
1. Eles entram na tabela `comments` com o status `'Pendente'`.
2. Ficam ocultos de outros usuários.
3. Aparecem em uma lista de alerta no **AdminDashboardPage** (`Painel de Moderação`).
4. O administrador pode clicar em **Aprovar** (muda o status para `'Aprovado'`, tornando-o visível a todos) ou **Reprovar** (muda o status para `'Reprovado'` e oculta da visualização geral).

### RN02: Média de Avaliações em Estrelas
Nas seções de Restaurantes e Hospedagens, os usuários avaliam os locais dando notas de 1 a 5 estrelas e um comentário opcional.
1. Ao enviar, a rota `POST /reviews` adiciona a linha correspondente.
2. Uma query subsequente no banco do backend calcula a nova média aritmética (`AVG(rating)`) e a quantidade total de avaliações (`COUNT(*)`).
3. O registro do restaurante ou hotel é atualizado fisicamente nas tabelas `restaurants` ou `lodgings` (`nota_media` e `avaliacoes_contagem`), garantindo máxima performance de leitura.

### RN03: Controle de Capacidade Diária de Ingressos
Parques e eventos têm um limite físico de visitas por dia para preservar o bioma local.
1. Ao preencher o modal de compras de ingresso, o usuário escolhe a data.
2. O backend faz um somatório de todos os ingressos ativos já comprados para aquela mesma data e aquele mesmo parque/evento (`SELECT SUM(quantity) FROM tickets WHERE target_id = ? AND date = ? AND status = 'active'`).
3. Se a quantidade solicitada ultrapassar a capacidade diária restante (`limite_capacidade_diaria - quantidade_já_reservada`), a API rejeita a compra com uma mensagem de erro apropriada, impedindo o *overbooking*.
4. Em caso de sucesso, gera-se um hash único representando o QR Code (ex: `TV-TICKET-ABCD1234`), que é exibido visualmente em formato de código de barras bidimensional no perfil do usuário.

---

## 8. Configuração e Execução Local

### Pré-requisitos
- **Node.js** (v18+)
- **NPM** ou **PNPM**
- **MySQL** (v8.0+) rodando localmente

### 1. Configurando o Banco de Dados
Abra o console ou o seu cliente MySQL (ex: DBeaver, MySQL Workbench) e execute o script [backend/schema.sql](file:///c:/Users/087774/www/projetos/johon/projetos/tere-verde/backend/schema.sql) para criar o banco de dados `tere_verde`, criar as tabelas e semear os dados de parques e trilhas iniciais:
```bash
mysql -u root -p < backend/schema.sql
```

### 2. Configurando as Variáveis de Ambiente do Backend
Crie um arquivo `.env` na pasta `/backend/` (copiando os dados abaixo e ajustando as credenciais de acesso ao seu MySQL):
```env
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=SUA_SENHA_AQUI
DB_NAME=tere_verde
JWT_SECRET=tereverde_jwt_secret_token_security_key_2026
```

### 3. Rodando o Backend
Abra um terminal no diretório `/backend/` e execute:
```bash
# Instalar as dependências
npm install

# Iniciar o servidor em modo de desenvolvimento
npm run dev
```
O console confirmará o sucesso da inicialização:
```
✅ Conexão com o Banco de Dados MySQL bem-sucedida!
✅ Tabela 'settings' verificada/criada!
🌱 Usuário de teste 'visitante@tereverde.com' semeado com sucesso (Senha: SenhaSegura123)!
🌱 Usuário de teste 'admin@tereverde.com' semeado com sucesso (Senha: SenhaSegura123)!
🚀 Servidor Terê Verde Backend rodando na porta 3000
```

### 4. Rodando o Frontend
Em outro terminal, no diretório raiz do projeto (`/`), execute:
```bash
# Instalar as dependências do frontend
npm install

# Iniciar o servidor de desenvolvimento Vite
npm run dev
```
O portal estará disponível no navegador através do endereço local indicado no terminal (normalmente `http://localhost:5173`).

### 5. Executando os Testes de Integração
Para rodar os testes de rotas da API e certificar-se de que a comunicação com o banco está 100% funcional, acesse a pasta `/backend` e execute:
```bash
npx ts-node src/test_api.ts
```
O script simulará cadastro de usuário, likes em trilhas, criação de depoimentos e fará a validação diretamente nas tabelas físicas do banco de dados, imprimindo o relatório de sucesso.

---

*Documentação elaborada para o projeto Terê Verde. Dúvidas ou melhorias, consulte o time de desenvolvimento ou abra uma Issue no repositório.*
