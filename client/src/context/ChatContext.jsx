import { createContext, useContext, useState, useCallback } from 'react';
import * as api from '../services/api';

const ChatContext = createContext();

/**
 * Global chat state provider.
 * Manages conversations list, active conversation, messages, and loading state.
 */
export function ChatProvider({ children }) {
  const [conversations, setConversations] = useState([]);
  const [activeConversation, setActiveConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  /** Fetch all conversations from the backend. */
  const fetchConversations = useCallback(async () => {
    try {
      const { data } = await api.getConversations();
      if (data.success) setConversations(data.data);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  }, []);

  /** Load a specific conversation's messages. */
  const loadConversation = useCallback(async (id) => {
    try {
      setLoading(true);
      const { data } = await api.getConversation(id);
      if (data.success) {
        setActiveConversation(data.data);
        setMessages(data.data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  /** Start a new empty conversation. */
  const startNewConversation = useCallback(() => {
    setActiveConversation(null);
    setMessages([]);
  }, []);

  /**
   * Send a message in the current (or new) conversation.
   * Optimistically adds the user message, then appends the AI response.
   */
  const sendMessage = useCallback(async (message) => {
    const userMsg = { role: 'user', content: message, timestamp: new Date().toISOString() };
    setMessages((prev) => [...prev, userMsg]);
    setLoading(true);

    try {
      const { data } = await api.sendMessage(
        activeConversation?.id || null,
        message
      );

      if (data.success) {
        const assistantMsg = {
          ...data.data.message,
          timestamp: new Date().toISOString(),
        };
        setMessages((prev) => [...prev, assistantMsg]);

        // If this was a new conversation, update the active conversation
        if (!activeConversation) {
          setActiveConversation({ id: data.data.conversationId });
        }

        // Refresh conversations list (title may have been set)
        fetchConversations();
      }
    } catch (err) {
      console.error('Failed to send message:', err);
      const errorMsg = {
        role: 'assistant',
        content: 'Sorry, I encountered an error. Please try again.',
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  }, [activeConversation, fetchConversations]);

  /** Delete a conversation. */
  const removeConversation = useCallback(async (id) => {
    try {
      await api.deleteConversation(id);
      setConversations((prev) => prev.filter((c) => c.id !== id));
      if (activeConversation?.id === id) {
        setActiveConversation(null);
        setMessages([]);
      }
    } catch (err) {
      console.error('Failed to delete conversation:', err);
    }
  }, [activeConversation]);

  const value = {
    conversations,
    activeConversation,
    messages,
    loading,
    fetchConversations,
    loadConversation,
    startNewConversation,
    sendMessage,
    removeConversation,
  };

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export const useChat = () => {
  const ctx = useContext(ChatContext);
  if (!ctx) throw new Error('useChat must be used within a ChatProvider');
  return ctx;
};
