import { useState, useRef, useEffect } from 'react';
import { IoSend } from 'react-icons/io5';

const QUICK_PROMPTS = [
  { icon: '💪', label: 'How to build muscle fast?' },
  { icon: '🏃', label: 'Best 20-min HIIT cardio routine' },
  { icon: '🥗', label: 'High protein meal plan for weight loss' },
  { icon: '😴', label: 'Optimal post-workout recovery tips' },
];

export default function ChatInput({ onSend, disabled, showQuickPrompts }) {
  const [message, setMessage] = useState('');
  const textareaRef = useRef(null);

  // Auto-resize textarea height as content grows up to 160px
  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea) return;
    textarea.style.height = 'auto';
    textarea.style.height = `${Math.min(textarea.scrollHeight, 160)}px`;
  }, [message]);

  const handleSubmit = (e) => {
    e?.preventDefault();
    if (!message.trim() || disabled) return;
    onSend(message.trim());
    setMessage('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleQuickPrompt = (label) => {
    if (disabled) return;
    onSend(label);
  };

  return (
    <div className="p-3 md:p-4 border-t border-dark-700/50 bg-dark-950/90 backdrop-blur-xl shrink-0">
      <div className="max-w-4xl mx-auto space-y-3">
        {/* Quick prompt chips */}
        {showQuickPrompts && (
          <div className="flex flex-wrap gap-2 animate-fade-in">
            {QUICK_PROMPTS.map(({ icon, label }) => (
              <button
                key={label}
                onClick={() => handleQuickPrompt(label)}
                disabled={disabled}
                className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-full
                           bg-dark-900/80 border border-dark-700/60 text-gray-300
                           hover:border-primary-500/50 hover:text-primary-300 hover:bg-dark-800/80
                           transition-all duration-200 disabled:opacity-50"
              >
                <span>{icon}</span>
                <span>{label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Input box form */}
        <form onSubmit={handleSubmit} className="relative flex items-end gap-2 bg-dark-900/90 border border-dark-700/70 rounded-2xl p-2 focus-within:border-primary-500/60 focus-within:ring-2 focus-within:ring-primary-500/20 transition-all">
          <textarea
            ref={textareaRef}
            rows={1}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask FitBot anything about fitness, workout, or diet... (Shift + Enter for line break)"
            disabled={disabled}
            className="w-full bg-transparent text-sm text-gray-100 placeholder-gray-500 px-3 py-2 focus:outline-none resize-none max-h-40 min-h-[40px] leading-relaxed"
          />

          <button
            type="submit"
            disabled={!message.trim() || disabled}
            className="p-2.5 rounded-xl bg-gradient-to-r from-primary-600 to-primary-500 text-white hover:from-primary-500 hover:to-primary-400 focus:outline-none focus:ring-2 focus:ring-primary-500/40 active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed shrink-0"
            title="Send message (Enter)"
          >
            <IoSend className="text-base" />
          </button>
        </form>
        <p className="text-[10px] text-center text-gray-500">
          FitBot AI provides fitness & nutrition suggestions. Consult a healthcare professional before starting any extreme program.
        </p>
      </div>
    </div>
  );
}
