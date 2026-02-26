# AdotaPet 🐾

O **AdotaPet** é uma plataforma web para adoção de pets desenvolvida como Trabalho de Conclusão de Curso da Pós-Graduação em Desenvolvimento Full Stack. A iniciativa nasceu após as enchentes de maio de 2024 no Rio Grande do Sul, com o objetivo de reconectar famílias e animais perdidos, além de ampliar a divulgação de pets disponíveis para adoção em Rio Grande/RS.

---

## 📌 Descrição do Projeto

- Centraliza cadastros de animais para adoção e registros de pets perdidos/encontrados.
- Facilita o contato seguro entre tutores e adotantes por meio de solicitações de visita intermediadas pela plataforma.
- Combina uma UI mobile-first com recursos de autenticação, moderação e notificações por e-mail.

---

## 🏗️ Arquitetura

| Camada         | Tecnologia |
| -------------- | ---------- |
| Frontend       | React + Vite + React Router + Tailwind CSS |
| Backend        | Node.js + Express |
| Banco de Dados | PostgreSQL |
| Autenticação   | JWT |
| Upload         | Cloudinary |
| Infraestrutura | AWS (conteinerização com Docker, definições ECS/Fargate e integração via task definitions) |

---

## ⚙️ Funcionalidades Principais

- Cadastro de usuários, login e recuperação de senha.
- CRUD completo de anúncios (adoção ou perdido/encontrado) com múltiplas fotos e definição de capa.
- Upload de imagens com envio direto ao Cloudinary.
- Filtros por espécie e bairro, além de ordenação e destaques visuais.
- Proteção do número de WhatsApp, liberado somente após aprovação de solicitações de visita.
- Alteração de senha diretamente pelo perfil autenticado.
- Layout responsivo com foco mobile-first e feedbacks em tempo real.

---

## 🔐 Segurança

- Autenticação JWT com middleware de proteção de rotas e renovação controlada.
- Senhas persistidas com bcrypt.
- Validação de dados em middleware e validators específicos (ex.: `pet-posts.validators.js`, `visit-requests.validators.js`).
- Separação de variáveis sensíveis em arquivos `.env` e manifestos específicos (`api-env.json`, `secret-api-env.json`).

---

## 🚀 Como rodar o projeto localmente

### 1. Pré-requisitos

- Node.js 18+
- PostgreSQL 14+
- Conta Cloudinary (para testes de upload)
- Git

### 2. Backend (`server/`)

1. `cd server`
2. `npm install`
3. Configure `.env` seguindo o modelo (`DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_*`, `APP_URL`, etc.).
4. `npm run dev` → API em http://localhost:3001.

Scripts relevantes no [server/package.json](server/package.json):
- `npm run dev`: nodemon + ts-node para desenvolvimento.
- `npm run test`: Vitest cobrindo controllers, middlewares e utils.

### 3. Banco de Dados

- Utilize `docker compose up db` conforme [server/docker-compose.yml](server/docker-compose.yml) ou configure um PostgreSQL local.
- Para dados iniciais, importe `backup_adotapet.dump` ou rode scripts em [server/src/db](server/src/db).
- Seeds auxiliares: `seed_neighborhoods.sql`.

### 4. Frontend (`client/`)

1. `cd client`
2. `npm install`
3. Copie `.env.example` (ou `env.development`) para `.env.local` configurando `VITE_API_URL`, `VITE_CLOUDINARY_*`, etc.
4. `npm run dev` → aplicativo em http://localhost:5173.

Scripts em [client/package.json](client/package.json):
- `npm run dev`: Vite em modo HMR.
- `npm run build`: bundle de produção.
- `npm run test`: Vitest + Testing Library para componentes e páginas.

---

## ☁️ Deploy

- O backend é empacotado via `Dockerfile` e possui definições ECS em `taskdef*.json`, com políticas de confiança (`ecs-trust.json`, `task-role-trust.json`).
- Variáveis de ambiente são injetadas por `api-env.json` e `secret-api-env.json` antes do registro do task definition.
- A execução acontece em AWS ECS/Fargate (ou semelhante), com logs e permissões definidos por IAM.
- O frontend pode ser publicado em S3 + CloudFront ou integrado ao mesmo pipeline após `npm run build`.

---

## 📁 Estrutura de Pastas

```
adotapet/
├── client/        # Aplicação React (Vite, Tailwind, Vitest)
│   └── src/
│       ├── api/      # Clientes HTTP e adapters (auth, posts, neighborhoods, etc.)
│       ├── components/ # UI compartilhada (Brand, Layout, Posts, ProtectedRoute, Toast)
│       ├── pages/      # Telas (Login, Register, Home, Perfil, Solicitações, etc.)
│       └── store/      # Zustand stores (auth)
├── server/        # API Node/Express
│   └── src/
│       ├── controllers/  # Casos de uso: auth, favorites, pet-posts, visit-requests
│       ├── middleware/   # Auth, upload via multer/cloudinary, validação
│       ├── routes/       # Endpoints REST agrupados
│       ├── validators/   # Schemas Joi/Yup para entrada
│       ├── utils/        # JWT, HTTP helpers, envio de e-mail
│       └── db/           # Conexão PostgreSQL, schema SQL e seeds
├── NextSteps/     # Planos e anotações futuras
└── README.md / ...
```

---

## 🧪 Testes

- **Frontend:** Vitest + @testing-library/react cobrindo `ProtectedRoute`, `Logo`, `Login`, `Register` e fluxos principais. Execute `npm run test` dentro de `client/`.
- **Backend:** Vitest valida utilitários (`jwt`, `http`), validators e `auth.controller`. Execute `npm run test` dentro de `server/`.

---

## 🤝 Contribuição

- Abra issues descrevendo contexto, passos para reproduzir e prints/logs.
- Siga o padrão de lint configurado em `client/eslint.config.js` e scripts equivalentes no backend.
- Sugestões e PRs são bem-vindos para ampliar filtros, internacionalização e monitoramento.
