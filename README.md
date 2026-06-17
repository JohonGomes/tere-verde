# Terê Verde 🌲 - Guia de Inicialização do Projeto

Este é o repositório do portal **Terê Verde**, uma aplicação para exploração de parques, trilhas, hospedagens e restaurantes da região de Teresópolis, RJ, incluindo agendamento de ingressos com controle de capacidade.

Abaixo, você encontrará o guia passo a passo para configurar o banco de dados e iniciar tanto o **Backend (API)** quanto o **Frontend (Web)** localmente.

---

## 📋 Pré-requisitos

Antes de iniciar, certifique-se de ter instalado em sua máquina:
1. **Node.js** (versão 18 ou superior)
2. **NPM** (gerenciador de pacotes padrão do Node) ou **PNPM**
3. **MySQL Server** (versão 8.0 ou superior) ativo e rodando

---

## 🚀 Como Iniciar a Aplicação

Siga os passos abaixo na ordem indicada:

### Passo 1: Configurar o Banco de Dados (MySQL)

O projeto necessita de uma instância MySQL.
1. Abra o seu cliente MySQL preferido (DBeaver, MySQL Workbench, ou terminal).
2. Execute o script contido em `backend/schema.sql` para criar o banco de dados `tere_verde`, criar as tabelas necessárias e popular os dados iniciais dos parques e trilhas:
   ```bash
   mysql -u seu_usuario_mysql -p < backend/schema.sql
   ```
   *Nota: Substitua `seu_usuario_mysql` pelo seu usuário do banco (geralmente `root`).*

---

### Passo 2: Configurar o Servidor (Backend)

1. Entre no diretório `backend`:
   ```bash
   cd backend
   ```
2. Crie um arquivo chamado `.env` na raiz do diretório `backend` e configure as credenciais do seu banco de dados MySQL local. Exemplo de conteúdo do `.env`:
   ```env
   PORT=3000
   DB_HOST=localhost
   DB_PORT=3306
   DB_USER=seu_usuario_mysql
   DB_PASSWORD=sua_senha_mysql
   DB_NAME=tere_verde
   JWT_SECRET=tereverde_jwt_secret_token_security_key_2026
   ```
   *(Substitua `seu_usuario_mysql` e `sua_senha_mysql` pelos seus dados reais do MySQL)*

3. Instale as dependências do backend:
   ```bash
   npm install
   ```

4. Inicie o servidor em modo de desenvolvimento:
   ```bash
   npm run dev
   ```
   O console exibirá mensagens confirmando a conexão com o banco e a criação/semeadura dos usuários de teste. O backend rodará por padrão na porta **3000** (`http://localhost:3000`).

---

### Passo 3: Configurar o Cliente (Frontend)

1. Em um **novo terminal**, navegue até a raiz do projeto:
   ```bash
   # Certifique-se de estar na pasta raiz 'tere-verde'
   ```
2. Instale as dependências do frontend:
   ```bash
   npm install
   ```
3. Inicie o servidor de desenvolvimento Vite:
   ```bash
   npm run dev
   ```
4. O Vite indicará a URL local para acessar o projeto no navegador (geralmente `http://localhost:5173`). Abra o endereço no seu navegador.

---

## 🔑 Credenciais de Teste

Para testar as funcionalidades protegidas e o painel administrativo, o banco de dados é automaticamente semeado com dois usuários padrão:

| Perfil | E-mail | Senha |
| :--- | :--- | :--- |
| **Visitante** (Compra ingressos, curte trilhas, avalia) | `visitante@tereverde.com` | `SenhaSegura123` |
| **Administrador** (Moderação, check-in na recepção, CRUD) | `admin@tereverde.com` | `SenhaSegura123` |

---

## 🧪 Rodando Testes de Integração da API

Para verificar se a comunicação do Backend com o seu banco MySQL local está 100% funcional, você pode rodar um script de teste de integração que realiza requisições reais nos endpoints da API:

1. Acesse o diretório `backend`:
   ```bash
   cd backend
   ```
2. Execute o comando de teste:
   ```bash
   npx ts-node src/test_api.ts
   ```
3. O script criará um usuário de teste temporário, dará like em uma trilha, postará um comentário e validará a inserção física das linhas no MySQL.

---

## 📖 Informações Técnicas Detalhadas

Se você deseja compreender a fundo a arquitetura do sistema, o diagrama de tabelas, todos os endpoints RESTful mapeados e as regras de negócio implementadas (moderação de depoimentos, controle de capacidade contra *overbooking*, etc.), consulte o documento complementar:

👉 **[Acesse a Documentação Técnica Completa (DOCUMENTACAO.md)](DOCUMENTACAO.md)**