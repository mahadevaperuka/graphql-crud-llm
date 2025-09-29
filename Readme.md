GraphQL CRUD + LLM Query Generator
=================================

Overview
--------
This project demonstrates a GraphQL CRUD API backend by MongoDB and a lightweight LLM service that translates natural language requests into executable GraphQL operations. A small React frontend sends a user prompt to the LLM service, which returns a GraphQL query and variables; the LLM service then executes the query against the GraphQL API and returns formatted results to the UI.

Stack
-----
- Backend API: Apollo Server (Node.js)
- Database: MongoDB via Mongoose
- LLM Service: Express + Axios
- Frontend: React (Vite)

Repository Layout
-----------------
- `backend/`
  - `index.js`: Starts GraphQL server (Apollo)
  - `llm.js`: LLM bridge server (POST /chat)
- `frontend/llm-frontend/`: React UI (Vite)

Quick Start
-----------
1) Install dependencies

```bash
cd backend && npm install
cd ../frontend/llm-frontend && npm install
```

2) Start services (3 terminals)

```bash
# Terminal 1: GraphQL API and LLM (port 4000)
cd backend
npm run start:all

# Terminal 2: Frontend (port 5173)
cd frontend/llm-frontend
npm run dev
```

Configuration
-------------
- LLM local endpoint used by `backend/llm.js` (default): `http://localhost:12434/engines/llama.cpp/v1/chat/completions`
- GraphQL API: `http://localhost:4000/graphql`
- LLM bridge: `http://localhost:3001/chat`

You can change ports/hosts in `backend/llm.js` and `frontend/llm-frontend/src/App.tsx` if needed.

Notes
-----
- The API expects Mongo-style filters as a string. If you prefer typed filter inputs, extend the schema with input types and adjust resolvers accordingly.
- The UI is optimized for reading queries, variables, and results with clear sectioning and styling.

