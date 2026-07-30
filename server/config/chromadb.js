import { ChromaClient } from 'chromadb';

let client;
let collection;

/**
 * Initializes the ChromaDB ephemeral (in-memory) client and creates or
 * retrieves the fitness_chat_memory collection.
 *
 * The collection stores conversation messages as embeddings so the chatbot
 * can retrieve relevant past context when answering follow-up questions.
 */
const initChromaDB = async () => {
  try {
    client = new ChromaClient();

    // Get or create the memory collection
    collection = await client.getOrCreateCollection({
      name: 'fitness_chat_memory',
      metadata: {
        description: 'Stores fitness chatbot conversation memory for context retrieval',
      },
    });

    console.log('✅ ChromaDB initialized (ephemeral mode)');
    return collection;
  } catch (error) {
    console.error('⚠️  ChromaDB initialization failed:', error.message);
    console.log('   Chat memory will be unavailable. The app will still work.');
    return null;
  }
};

/**
 * Returns the active ChromaDB collection instance.
 */
const getCollection = () => collection;

export { initChromaDB, getCollection };
