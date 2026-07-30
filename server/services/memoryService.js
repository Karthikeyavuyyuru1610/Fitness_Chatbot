import { GoogleGenerativeAI } from '@google/generative-ai';

let genAI = null;
if (process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your_gemini_api_key_here') {
  try {
    genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
  } catch (e) {
    // Ignore init error
  }
}

/**
 * In-memory vector store for context memory.
 * Uses Gemini text-embedding if valid key exists, or a local word-token overlap vectorizer
 * when running offline without an API key.
 */
const memoryStore = new Map();

/**
 * Generates simple word frequency vector for local fallback embeddings.
 */
const getLocalEmbedding = (text) => {
  const words = text.toLowerCase().match(/\w+/g) || [];
  const freqMap = {};
  words.forEach((w) => {
    freqMap[w] = (freqMap[w] || 0) + 1;
  });
  return freqMap;
};

/**
 * Computes word overlap / Jaccard similarity for local frequency maps.
 */
const getLocalSimilarity = (mapA, mapB) => {
  if (!mapA || !mapB) return 0;
  let intersection = 0;
  let union = 0;

  const keys = new Set([...Object.keys(mapA), ...Object.keys(mapB)]);
  keys.forEach((key) => {
    const valA = mapA[key] || 0;
    const valB = mapB[key] || 0;
    intersection += Math.min(valA, valB);
    union += Math.max(valA, valB);
  });

  return union === 0 ? 0 : intersection / union;
};

/**
 * Generates an embedding vector using Gemini or local tokenizer.
 */
const getEmbedding = async (text) => {
  if (genAI) {
    try {
      const model = genAI.getGenerativeModel({ model: 'text-embedding-004' });
      const result = await model.embedContent(text);
      return { type: 'gemini', vector: result.embedding.values };
    } catch (error) {
      // Fallback to local
    }
  }
  return { type: 'local', vector: getLocalEmbedding(text) };
};

/**
 * Computes cosine similarity between two numeric vectors.
 */
const cosineSimilarity = (a, b) => {
  if (!a || !b || a.length !== b.length) return 0;
  let dot = 0, magA = 0, magB = 0;
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i];
    magA += a[i] * a[i];
    magB += b[i] * b[i];
  }
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
};

/**
 * Adds a message to the in-memory vector store.
 */
const addToMemory = async (conversationId, role, content) => {
  try {
    const embeddingData = await getEmbedding(content);

    if (!memoryStore.has(conversationId)) {
      memoryStore.set(conversationId, []);
    }

    memoryStore.get(conversationId).push({
      id: `${conversationId}-${Date.now()}`,
      text: content,
      embedding: embeddingData,
      metadata: { role, timestamp: new Date().toISOString() },
    });
  } catch (error) {
    console.error('⚠️ Failed to add to memory:', error.message);
  }
};

/**
 * Queries the vector store for messages that are semantically relevant
 * to the current prompt within a specific conversation.
 */
const getRelevantContext = async (conversationId, query, nResults = 5) => {
  try {
    const entries = memoryStore.get(conversationId);
    if (!entries || entries.length === 0) return [];

    const queryEmbeddingData = await getEmbedding(query);

    const scored = entries.map((entry) => {
      let score = 0;
      if (queryEmbeddingData.type === 'gemini' && entry.embedding.type === 'gemini') {
        score = cosineSimilarity(queryEmbeddingData.vector, entry.embedding.vector);
      } else {
        const mapA = queryEmbeddingData.type === 'local' ? queryEmbeddingData.vector : getLocalEmbedding(query);
        const mapB = entry.embedding.type === 'local' ? entry.embedding.vector : getLocalEmbedding(entry.text);
        score = getLocalSimilarity(mapA, mapB);
      }
      return { text: entry.text, score };
    });

    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, nResults).map((s) => s.text);
  } catch (error) {
    console.error('⚠️ Failed to query memory:', error.message);
    return [];
  }
};

/**
 * Deletes all memories associated with a given conversation.
 */
const clearConversationMemory = async (conversationId) => {
  memoryStore.delete(conversationId);
};

export { addToMemory, getRelevantContext, clearConversationMemory };
