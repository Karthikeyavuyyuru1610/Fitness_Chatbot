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

## License

MIT
