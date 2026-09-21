# Help Now

Plataforma interna de chamados desenvolvida para comunicação rápida em redes locais, com atualização em tempo real via **WebSockets**.

O projeto separa a experiência entre quem solicita suporte e a central responsável pelo atendimento, mantendo persistência local e comunicação direta entre os pontos da rede.

## Stack

- Node.js
- Express
- WebSockets (`ws`)
- Prisma ORM
- SQLite
- Joi
- Express Session
- HTML/CSS/JavaScript no frontend

## Principais recursos

- abertura e acompanhamento de chamados;
- comunicação em tempo real entre usuário e host;
- backend HTTP com Express;
- persistência via Prisma + SQLite;
- validação de dados com Joi;
- execução voltada a ambientes de rede local.

## Estrutura

```text
.
├── backend/
├── frontend/
├── shared/
├── init.js
└── package.json
```

## Instalação

```bash
git clone https://github.com/eded001/help-now.git
cd help-now
npm install
npm run init
```

## Execução

```bash
npm start
```

Durante desenvolvimento:

```bash
npm run dev
```

Para abrir o Prisma Studio:

```bash
npm run db
```

## Objetivo técnico

Além do uso como sistema de chamados, o projeto demonstra integração entre **API HTTP, WebSockets, ORM e banco relacional** em uma aplicação full stack orientada a um problema operacional real.
