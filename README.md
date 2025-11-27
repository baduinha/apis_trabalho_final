
# 🚗 API Loja de Carros

## 📋 Sobre o Projeto
Sistema de API para gerenciamento de uma loja de carros, cadastro de clientes, login, implementação de JWTOKEN, middleware, sendmail, backup, log service.

## ✨ Funcionalidades Principais
- 🔍 Consulta de veículos disponíveis
- ➕ Adição de novos carros ao catálogo
- ✏️ Atualização de informações de veículos
- 🗑️ Remoção de carros do estoque
- 💰 Gestão de preços e promoções
- 👤 Gerenciamento de clientes
- 🙅‍♂️ Backup e Recuperação do Banco de dados
- 💡 Autenticação de Middleware
- 🤼‍♂️ Relacionamento Entre as Models Usuario e Carro.
- 🗝️ Criptografia de senha via JWTOKEN.
- ✅ Criação da rota de login com geração de token.
- ⬆️ Desenvolvimento da model e tabela de logs relacionada com a tabela de Usuários.
- 🪙 Acrescentado as rotas para realização de backup das tabelas do sistema.
- ➡️ Adicionado Recurso de Páginação da rota carro

## 📚 Endpoints Principais
- `GET /carros` - Lista todos os carros
- `POST /carros` - Cria novo carro
- `PUT /carros/:id` - Atualiza carro
- `DELETE /carros/:id` - Remove carro

## 👨‍💻 Autor
Claudio Roberto Oliveira Volz

## 🔐 Rotas de Autenticação

### Login
- `POST /auth/login` - Autentica usuário e retorna JWT token
    - Body: `{ email, password }`
    - Response: `{ token, user }`

### LogService
- `GET /auth/logs` - Recupera logs de autenticação
- `POST /auth/logs` - Registra evento de autenticação

### Backup
- `POST /auth/backup` - Cria backup de dados autenticados
- `GET /auth/backup/:id` - Recupera backup específico

### Middleware de Autenticação
Todas as rotas protegidas utilizam middleware JWT que valida o token no header:
```
Authorization: Bearer <token>
```

### JWT Token
- Gerado automaticamente no login
- Validade: 24 horas
- Contém: userId, email, permissions
