import { Router } from 'express';
import { asyncHandler } from '../middleware/errorHandler.js';
import {
  sendMessage,
  getConversations,
  getConversation,
  deleteConversation,
} from '../controllers/chatController.js';

const router = Router();

// Send a message (creates conversation if needed)
router.post('/message', asyncHandler(sendMessage));

// List all conversations
router.get('/conversations', asyncHandler(getConversations));

// Get a single conversation with messages
router.get('/conversations/:id', asyncHandler(getConversation));

// Delete a conversation
router.delete('/conversations/:id', asyncHandler(deleteConversation));

export default router;
