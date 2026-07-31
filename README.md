# Fitness Bot 🏋️

An AI-powered fitness chatbot built with React, Node.js, Google Gemini, SQLite, and ChromaDB.

## Features

- 💬 **AI Chat** — Ask fitness-related questions powered by Google Gemini
- 🏋️ **Workout Plans** — Generate personalized workout plans based on your goals
- 🥗 **Diet Plans** — Get customized meal plans and nutrition advice
- 📊 **BMI Calculator** — Calculate BMI, daily calories, and macronutrient needs
- 🧠 **Chat Memory** — ChromaDB-powered context-aware conversations
- 💾 **Chat History** — SQLite-persisted conversation logs

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS 3 |
| Backend | Node.js, Express.js |
| AI | Google Gemini API (gemini-2.0-flash) |
| Database | SQLite (via better-sqlite3) |
| Memory | ChromaDB (in-memory embeddings) |

## Quick Start

### Prerequisites

- Node.js 18+
- A Google Gemini API key ([Get one here](https://aistudio.google.com/apikey))

### 1. Setup Backend

```bash
cd server
npm install
```

Edit `server/.env` and add your Gemini API key:

```
GEMINI_API_KEY=your_actual_key_here
```

Start the server:

```bash
npm run dev
```

### 2. Setup Frontend

```bash
cd client
npm install
npm run dev
```

### 3. Open the App

Navigate to [http://localhost:3000](http://localhost:3000)

## Project Structure

```
├── client/                 # React Frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page-level components
│   │   ├── services/       # API client
│   │   └── context/        # React Context (chat state)
│   └── ...
│
├── server/                 # Node.js Backend (Express)
│   ├── config/             # Database configurations
│   ├── controllers/        # Route handlers
│   ├── routes/             # API route definitions
│   ├── services/           # Business logic (Gemini, ChromaDB)
│   └── middleware/         # Error handling
│
└── README.md
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |
| POST | `/api/chat/message` | Send a chat message |
| GET | `/api/chat/conversations` | List all conversations |
| GET | `/api/chat/conversations/:id` | Get conversation messages |
| DELETE | `/api/chat/conversations/:id` | Delete a conversation |
| POST | `/api/workout/generate` | Generate workout plan |
| POST | `/api/diet/generate` | Generate diet plan |
| POST | `/api/bmi/calculate` | Calculate BMI & calories |

## 🚀 Deploying to Render

> [!IMPORTANT]
> **Why did `npm ERR! enoent Could not read package.json` occur?**  
> This error happens when Render tries to build from a directory that does not contain a `package.json` file.  
> **Fix**: Make sure to commit and push all newly created files (`package.json`, `render.yaml`, etc.) to GitHub before deploying:
> ```bash
> git add .
> git commit -m "Configure project for Render deployment"
> git push origin main
> ```

---

### Option 1: Single Web Service (Unified Frontend + Backend - Recommended)

This option serves the React frontend statically from the Node.js Express backend using **1 free Render Web Service**.

#### Render Dashboard Settings:
- **Service Type**: Web Service
- **Name**: `fitness-bot`
- **Environment**: `Node`
- **Region**: Select your preferred region
- **Branch**: `main`
- **Root Directory**: *(Leave blank or set to `.`)*
- **Build Command**: `npm run build`
- **Start Command**: `npm start`

#### Environment Variables:
- `NODE_ENV`: `production`
- `GEMINI_API_KEY`: *Your Google Gemini API Key*
- `JWT_SECRET`: *A secure random string*
- `JWT_EXPIRES_IN`: `7d`
- `DB_PATH`: `./data/fitness_bot.db`
- `CORS_ORIGIN`: `*`

---

### Option 2: Two Render Services (Backend Web Service + Frontend Static Site)

If you prefer deploying the Backend and Frontend as two distinct Render services:

#### 1️⃣ Backend Service (Web Service)
- **Service Type**: Web Service
- **Name**: `fitness-bot-backend`
- **Environment**: `Node`
- **Root Directory**: `server`
- **Build Command**: `npm install`
- **Start Command**: `npm start` (or `node server.js`)
- **Environment Variables**:
  - `NODE_ENV`: `production`
  - `GEMINI_API_KEY`: *Your Google Gemini API Key*
  - `JWT_SECRET`: *A secure random string*
  - `JWT_EXPIRES_IN`: `7d`
  - `DB_PATH`: `./data/fitness_bot.db`
  - `CORS_ORIGIN`: `https://fitness-bot-frontend.onrender.com` *(your frontend Render URL)*

#### 2️⃣ Frontend Service (Static Site)
- **Service Type**: Static Site
- **Name**: `fitness-bot-frontend`
- **Root Directory**: `client`
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Environment Variables**:
  - `VITE_API_BASE_URL`: `https://fitness-bot-backend.onrender.com/api` *(your backend Render URL + `/api`)*

---

### Option 3: Render Blueprint (1-Click Automated Setup)

1. Commit & push code to GitHub: `git add . && git commit -m "Deploy setup" && git push`
2. Go to [Render Dashboard](https://dashboard.render.com/) -> **New +** -> **Blueprint**.
3. Select your repository. Render automatically reads `render.yaml`.
4. Enter your `GEMINI_API_KEY` when prompted and click **Apply**.

## License


MIT

