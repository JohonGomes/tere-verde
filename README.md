# 🌲 Terê Verde - Portal de Ecoturismo de Teresópolis

O **Terê Verde** é um portal completo de turismo ecológico para a cidade de Teresópolis, RJ. A plataforma foi desenvolvida para ajudar visitantes a explorar as riquezas naturais da região serrana, com informações detalhadas sobre parques ecológicos, trilhas, calendário de eventos, previsão do tempo, além de um sistema integrado de simulação para reserva e compra de ingressos.

##Documentação completa

Link : https://docs.google.com/document/d/12arS2K1YCh_qPvGpCbOPQdpnVtJCjc_EAFd5AnCy3CM/edit?usp=sharing

---

## 🛠️ Tecnologias e Arquitetura

O projeto utiliza uma arquitetura desacoplada (monorepo/pastas divididas) contendo:

### **Frontend**
*   **Core**: React + TypeScript + Vite
*   **Estilização**: Tailwind CSS + CSS Vanilla (para máxima flexibilidade e consistência visual)
*   **Animações**: Framer Motion + micro-animações customizadas
*   **Componentes UI**: Componentes baseados em Radix UI (Dialog, Select, Tabs, etc.)
*   **Ícones**: Lucide React
*   **Carrossel**: Embla Carousel

### **Backend**
*   **Core**: Node.js + TypeScript + Express
*   **Banco de Dados**: MySQL (conexão via `mysql2/promise`)
*   **Segurança**: Criptografia de senhas com `bcryptjs` e autenticação via tokens JWT (`jsonwebtoken`)

---

## 🚀 Como Iniciar o Projeto

Siga as instruções abaixo para rodar a aplicação em seu ambiente de desenvolvimento local.

### **Pré-requisitos**
*   **Node.js** (versão 18 ou superior recomendado)
*   **MySQL Server** em execução local ou remoto

---

### **1. Configuração do Banco de Dados**

1. Acesse o seu servidor MySQL e crie o banco de dados principal do projeto:
   ```sql
   CREATE DATABASE tere_verde;
   ```
2. As tabelas necessárias (como `users`, `parks`, `comments`, `events`, `tickets`, `settings`) serão criadas e populadas automaticamente pelo backend na primeira inicialização.

---

### **2. Inicializando o Backend (Servidor de API)**

1. Abra um terminal e navegue até a pasta do backend:
   ```bash
   cd backend
   ```
2. Instale as dependências necessárias:
   ```bash
   npm install
   ```
3. Crie e configure o arquivo `.env` na raiz da pasta `backend/` com as credenciais do seu banco de dados:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_USER=seu_usuario_mysql
   DB_PASS=sua_senha_mysql
   DB_NAME=tere_verde
   JWT_SECRET=chave_secreta_jwt_para_tokens
   ```
4. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   *O backend estará rodando por padrão em `http://localhost:3000`.*

---

### **3. Inicializando o Frontend**

1. Abra um novo terminal na raiz do projeto (fora da pasta `backend/`):
   ```bash
   npm install
   ```
2. Inicie o servidor de desenvolvimento do Vite:
   ```bash
   npm run dev
   ```
   *O frontend estará rodando por padrão em `http://localhost:5173`.*

---

## 🔑 Credenciais de Teste

Para navegar e validar as funcionalidades protegidas (como a compra de ingressos), você pode utilizar a seguinte credencial pré-cadastrada no banco de dados:

*   **E-mail**: `visitante@tereverde.com`
*   **Senha**: `SenhaSegura123`

---

## 🌟 Principais Funcionalidades

1.  **Exploração de Parques e Trilhas**: Lista detalhada das unidades de conservação com nível de dificuldade das trilhas, altitude máxima, taxas de entrada e rotas.
2.  **Agenda de Eventos e Previsão do Tempo**: Calendário com as próximas oficinas e programações culturais na cidade aliadas a uma visualização meteorológica semanal ilustrada.
3.  **Compra de Ingressos**: Fluxo interativo de reserva e checkout simulado (Pix com QR Code copia-e-cola, Boleto Bancário e formulário de Cartão de Crédito) com emissão de QR Code e limite de capacidade máxima diária do parque (RN03).
4.  **Perfil do Visitante**: Área exclusiva para visualizar ingressos ativos, histórico de check-ins realizados e informações do perfil.
5.  **História Local e Utilidades**: Seção informativa sobre a origem histórica de Teresópolis e dicas úteis para ecoturistas.
