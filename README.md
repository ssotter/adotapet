# AdotaPet 🐾

Sistema web para cadastro de pets para adoção e animais
encontrados/perdidos, desenvolvido como Trabalho de Conclusão de Curso
(TCC) da Pós-Graduação em Desenvolvimento Full Stack.

O projeto tem como objetivo facilitar a divulgação de animais para
adoção e ajudar na localização de tutores de animais perdidos ou
encontrados na cidade de Rio Grande/RS.

------------------------------------------------------------------------

## 🎯 Objetivo

Criar uma plataforma web que permita:

-   Cadastro de usuários
-   Publicação de anúncios de pets para adoção
-   Publicação de anúncios de animais encontrados/perdidos
-   Busca com filtros (cor, idade, peso e bairro)
-   Solicitação de visita e contato entre usuários autenticados

------------------------------------------------------------------------

## 🛠 Tecnologias Utilizadas

### Frontend

-   React (Vite)
-   Axios
-   React Router

### Backend

-   Node.js
-   Express
-   PostgreSQL
-   JWT (autenticação)
-   Cloudinary (upload de imagens)

### Infra

-   GitHub (versionamento)
-   Banco de dados PostgreSQL
-   API REST

------------------------------------------------------------------------

## 📂 Estrutura do Projeto

adotapet/ 
  client/ \# Frontend React 
  server/ \# Backend Node + Express
    src/ 
    controllers/ 
    routes/ 
    middleware/ 
    db/ 
    utils/

------------------------------------------------------------------------

## 🚀 Como executar o projeto localmente

### Pré-requisitos

-   Node.js 18+
-   PostgreSQL 18+
-   Git

------------------------------------------------------------------------

### 2️⃣ Backend

cd server npm install npm run dev

A API estará disponível em: http://localhost:3001

------------------------------------------------------------------------

### 3️⃣ Frontend

cd client npm install npm run dev

O frontend estará disponível em: http://localhost:5173

------------------------------------------------------------------------

## 🧪 Testes Automatizados

O projeto agora conta com suítes unitárias para front-end e back-end,
garantindo que os fluxos críticos continuem funcionando conforme o
esperado.

### Frontend (React + Vitest)

- `ProtectedRoute`, `Logo` e as páginas de **Login** e **Register**
  possuem testes cobrindo estados de carregamento, feedback visual,
  redirecionamentos e tratamento de erros vindos da API.
- Os formulários utilizam `useId` para manter acessibilidade e evitar
  divergência entre labels e inputs durante as simulações.
- Como executar:

```
cd client
npm run test
```

### Backend (Node + Vitest)

- Utilitários (`jwt`, `http`, `validate`) e os validators de anúncios
  possuem cobertura completa.
- O controlador de autenticação (`register`, `login`, `forgotPassword`)
  é testado com doubles para banco, bcrypt, envio de e-mail e geração de
  JWT.
- Alguns exemplos verificados: conflito de e-mail, hash/compare de
  senha, geração de token de recuperação e resposta neutra para e-mails
  inexistentes.
- Como executar:

```
cd server
npm run test
```

Os testes rodam em ambiente Node/JS DOM e podem ser integrados facilmente
à pipeline de CI para evitar regressões.

------------------------------------------------------------------------

## 🔐 Autenticação

O sistema utiliza autenticação via JWT.

Endpoints principais: - POST /auth/register - POST /auth/login - GET /me

------------------------------------------------------------------------

## 🔐 Funcionalidades de Autenticação

### ✅ Cadastro e Login
- Registro de usuários com senha criptografada (bcrypt)
- Login com geração de token JWT
- Persistência de sessão via `localStorage`

### ✅ Proteção de Rotas
- Rotas sensíveis protegidas via `ProtectedRoute`
- Redirecionamento automático para `/login` quando não autenticado
- Retorno ao fluxo correto após login

### ✅ Troca de Senha (Usuário Logado)
- Tela dedicada `/change-password`
- Confirmação da senha atual
- Validação de nova senha
- Logout automático após troca (segurança)

### ✅ Reset de Senha (Esqueci minha senha)
- Solicitação de reset via e-mail
- Geração de token temporário
- Redefinição segura de senha
- Redirecionamento automático após sucesso

------------------------------------------------------------------------

## 🐶 Funcionalidades de Anúncios

### 📌 Cadastro de Pet
- Tipo: **Adoção** ou **Encontrado/Perdido**
- Espécie: Cão ou Gato
- Informações completas (idade, peso, cor, porte, etc.)
- Upload de múltiplas fotos
- Definição de foto de capa

### 📌 Listagem e Visualização
- Home com cards padronizados
- Badges visuais para tipo do anúncio
- Página de detalhe com carrossel de fotos
- Layout responsivo

### 📌 Meus Anúncios
- Listagem exclusiva do usuário logado
- Ordenação por status e data
- Edição e encerramento de anúncios

------------------------------------------------------------------------

## 🤝 Solicitação de Visita

- Usuários podem solicitar visita a um pet
- Modal com mensagem personalizada
- **Usuário não logado:**  
  - Tooltip informativo  
  - Redirecionamento para login  
- Anunciante pode aprovar ou rejeitar solicitações
- Contato liberado apenas após aprovação

------------------------------------------------------------------------

## 👤 Perfil do Usuário

- Visualização de dados pessoais
- Upload e atualização de avatar
- Avatar refletido imediatamente no Navbar
- Inicial gerada automaticamente quando não há foto

------------------------------------------------------------------------

## 🗄️ Modelagem de Dados (Resumo)

- **users**
- **pet_posts**
- **pet_photos**
- **visit_requests**
- **neighborhoods**
- **password_reset_tokens**

Banco normalizado com chaves estrangeiras e constraints de integridade.

------------------------------------------------------------------------

## 🗺️ Escopo inicial

Cidade atendida: - Rio Grande / RS

------------------------------------------------------------------------

## 📌 Status do projeto

Em desenvolvimento --- MVP em construção

------------------------------------------------------------------------

## 🎓 Contexto acadêmico

Projeto desenvolvido como Trabalho de Conclusão de Curso (TCC) da
Pós-Graduação em Desenvolvimento Full Stack, com foco em impacto social,
arquitetura web moderna e boas práticas de engenharia de software.
