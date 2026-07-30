import { v4 as uuidv4 } from 'uuid';
import { runQuery, allQuery, getQuery } from '../config/db.js';
import { chat } from '../services/geminiService.js';
import { addToMemory, getRelevantContext, clearConversationMemory } from '../services/memoryService.js';

/**
 * POST /api/chat/message
 * Sends a message within a conversation, retrieves relevant context from
 * ChromaDB, queries Gemini, and persists everything to SQLite.
 */
const sendMessage = async (req, res) => {
  const { conversationId, message } = req.body;

  if (!message || !message.trim()) {
    return res.status(400).json({ success: false, error: { message: 'Message is required' } });
  }

  let convId = conversationId;

  // Create a new conversation if one wasn't provided
  if (!convId) {
    convId = uuidv4();
    const title = message.substring(0, 50) + (message.length > 50 ? '...' : '');
    const userId = req.user ? req.user.id : null;
    runQuery('INSERT INTO conversations (id, user_id, title) VALUES (?, ?, ?)', [convId, userId, title]);
  }

  // Save the user message to SQLite
  runQuery(
    'INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)',
    [convId, 'user', message]
  );

  // Store in ChromaDB for future context retrieval
  await addToMemory(convId, 'user', message);

  // Retrieve semantically relevant past context
  const context = await getRelevantContext(convId, message);

  // Generate AI response
  const aiResponse = await chat(message, context);

  // Save assistant response to SQLite
  runQuery(
    'INSERT INTO messages (conversation_id, role, content) VALUES (?, ?, ?)',
    [convId, 'assistant', aiResponse]
  );

  // Store assistant response in ChromaDB
  await addToMemory(convId, 'assistant', aiResponse);

  // Update conversation timestamp
  runQuery(
    'UPDATE conversations SET updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [convId]
  );

  res.json({
    success: true,
    data: {
      conversationId: convId,
      message: { role: 'assistant', content: aiResponse },
    },
  });
};

/**
 * GET /api/chat/conversations
 * Lists all conversations, most recent first.
 */
const getConversations = (req, res) => {
  const userId = req.user ? req.user.id : null;
  let conversations;

  if (userId) {
    conversations = allQuery('SELECT * FROM conversations WHERE user_id = ? OR user_id IS NULL ORDER BY updated_at DESC', [userId]);
  } else {
    conversations = allQuery('SELECT * FROM conversations ORDER BY updated_at DESC');
  }

  res.json({ success: true, data: conversations });
};

/**
 * GET /api/chat/conversations/:id
 * Returns all messages for a single conversation.
 */
const getConversation = (req, res) => {
  const { id } = req.params;

  const conversation = getQuery('SELECT * FROM conversations WHERE id = ?', [id]);
  if (!conversation) {
    return res.status(404).json({ success: false, error: { message: 'Conversation not found' } });
  }

  const messages = allQuery(
    'SELECT * FROM messages WHERE conversation_id = ? ORDER BY timestamp ASC',
    [id]
  );

  res.json({ success: true, data: { ...conversation, messages } });
};

/**
 * DELETE /api/chat/conversations/:id
 * Deletes a conversation and its messages from both SQLite and ChromaDB.
 */
const deleteConversation = async (req, res) => {
  const { id } = req.params;

  runQuery('DELETE FROM messages WHERE conversation_id = ?', [id]);
  runQuery('DELETE FROM conversations WHERE id = ?', [id]);

  await clearConversationMemory(id);

  res.json({ success: true, message: 'Conversation deleted' });
};

export { sendMessage, getConversations, getConversation, deleteConversation };
