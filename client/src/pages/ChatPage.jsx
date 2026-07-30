import { useEffect, useRef } from 'react';
import { useChat } from '../context/ChatContext';
import ChatMessage from '../components/ChatMessage';
import ChatInput from '../components/ChatInput';
import Loader from '../components/Loader';

/**
 * Main chat page — ChatGPT / Claude style interface.
 * Independent scroll area for messages, pinned bottom input, and prompt chips.
 */
export default function ChatPage() {
  const { messages, loading, sendMessage } = useChat();
  const containerRef = useRef(null);

  // Auto-scroll inner message container directly to bottom
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTop = containerRef.current.scrollHeight;
    }
  }, [messages, loading]);

  return (
    <div className="flex flex-col h-full overflow-hidden bg-dark-950/60">
      {/* ── Independent Chat Messages Container ─────────────────────── */}
      <div ref={containerRef} className="flex-1 overflow-y-auto space-y-2 py-4">
        {messages.length === 0 && !loading && (
          <div className="flex flex-col items-center justify-center min-h-[70vh] p-6 text-center animate-fade-in max-w-2xl mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-3xl mb-4 shadow-xl shadow-primary-500/20">
              🏋️
            </div>
            <h2 className="text-2xl font-bold gradient-text mb-2">
              Welcome to FitBot AI!
            </h2>
            <p className="text-sm text-gray-400 leading-relaxed mb-6">
              Your intelligent fitness & nutrition assistant. Choose a prompt below or ask any question to start your personal coaching session!
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full text-left">
              {[
                { title: '💪 Build Muscle', desc: 'Custom hypertrophy routines & progression guidelines' },
                { title: '🥗 Nutrition & Diet', desc: 'Macros, meal plans, and protein calculations' },
                { title: '🏃 Cardio & Stamina', desc: 'HIIT vs LISS cardio strategies for fat loss' },
                { title: '😴 Recovery Protocol', desc: 'DOMS relief, sleep optimization & mobility' },
              ].map((item) => (
                <button
                  key={item.title}
                  onClick={() => sendMessage(item.desc)}
                  className="glass-light p-4 rounded-xl text-left hover:border-primary-500/40 hover:bg-dark-800/80 transition-all group"
                >
                  <p className="text-xs font-bold text-gray-200 group-hover:text-primary-300 transition-colors">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-gray-400 mt-1">{item.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((msg, idx) => (
          <ChatMessage
            key={idx}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
          />
        ))}

        {loading && (
          <div className="px-6 py-2">
            <Loader text="FitBot is crafting your answer..." />
          </div>
        )}
      </div>

      {/* ── Fixed Chat Input Container ─────────────────────────────── */}
      <ChatInput
        onSend={sendMessage}
        disabled={loading}
        showQuickPrompts={messages.length === 0}
      />
    </div>
  );
}
