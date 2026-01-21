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

## 🔐 Autenticação

O sistema utiliza autenticação via JWT.

Endpoints principais: - POST /auth/register - POST /auth/login - GET /me

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
