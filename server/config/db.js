import initSqlJs from 'sql.js';
import path from 'path';
import fs from 'fs';

let db;
let dbPath;

/**
 * Initializes the SQLite database using sql.js.
 * Creates 'users', 'conversations', and 'messages' tables if they don't exist.
 */
const initDatabase = async () => {
  dbPath = process.env.DB_PATH || './data/fitness_bot.db';
  const dbDir = path.dirname(dbPath);

  if (!fs.existsSync(dbDir)) {
    fs.mkdirSync(dbDir, { recursive: true });
  }

  const SQL = await initSqlJs();

  if (fs.existsSync(dbPath)) {
    const fileBuffer = fs.readFileSync(dbPath);
    db = new SQL.Database(fileBuffer);
  } else {
    db = new SQL.Database();
  }

  // 1. Users table
  db.run(`
    CREATE TABLE IF NOT EXISTS users (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // 2. Conversations table (with user_id)
  db.run(`
    CREATE TABLE IF NOT EXISTS conversations (
      id TEXT PRIMARY KEY,
      user_id TEXT,
      title TEXT NOT NULL DEFAULT 'New Chat',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )
  `);

  // Migration: Add user_id column if existing table lacks it
  try {
    db.run(`ALTER TABLE conversations ADD COLUMN user_id TEXT`);
  } catch (e) {
    // Column already exists
  }

  // 3. Messages table
  db.run(`
    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      conversation_id TEXT NOT NULL,
      role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
      content TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (conversation_id) REFERENCES conversations(id) ON DELETE CASCADE
    )
  `);

  db.run(`
    CREATE INDEX IF NOT EXISTS idx_messages_conversation
      ON messages(conversation_id)
  `);

  try {
    db.run(`
      CREATE INDEX IF NOT EXISTS idx_conversations_user
        ON conversations(user_id)
    `);
  } catch (e) {
    // Ignore if index creation fails
  }

  saveDatabase();
  console.log('✅ SQLite database & Auth schema initialized (sql.js)');
  return db;
};

/**
 * Persists the in-memory database state to disk.
 */
const saveDatabase = () => {
  if (!db || !dbPath) return;
  const data = db.export();
  const buffer = Buffer.from(data);
  fs.writeFileSync(dbPath, buffer);
};

const getDb = () => {
  if (!db) throw new Error('Database not initialized. Call initDatabase() first.');
  return db;
};

const runQuery = (sql, params = []) => {
  db.run(sql, params);
  saveDatabase();
};

const allQuery = (sql, params = []) => {
  const stmt = db.prepare(sql);
  if (params.length > 0) stmt.bind(params);

  const rows = [];
  while (stmt.step()) {
    rows.push(stmt.getAsObject());
  }
  stmt.free();
  return rows;
};

const getQuery = (sql, params = []) => {
  const rows = allQuery(sql, params);
  return rows.length > 0 ? rows[0] : undefined;
};

export { initDatabase, getDb, saveDatabase, runQuery, allQuery, getQuery };
