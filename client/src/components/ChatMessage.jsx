import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import { IoCopyOutline, IoCheckmark } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

/**
 * Modern ChatGPT / Claude style chat message bubble.
 */
export default function ChatMessage({ role, content, timestamp }) {
  const isUser = role === 'user';
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);

  const formatTime = (ts) => {
    if (!ts) return '';
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch (e) {
      return '';
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <div className={`flex w-full gap-3 md:gap-4 p-4 md:px-6 animate-slide-up ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className="shrink-0 pt-0.5">
        {isUser ? (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white shadow-md">
            {userInitial}
          </div>
        ) : (
          <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-primary-600 to-accent-600 flex items-center justify-center text-sm shadow-md">
            🏋️
          </div>
        )}
      </div>

      {/* Message Bubble Container */}
      <div className={`group relative max-w-[88%] md:max-w-[80%] rounded-2xl px-4 py-3 border shadow-sm ${
        isUser
          ? 'bg-gradient-to-br from-primary-600 to-primary-700 text-white border-primary-500/30 rounded-tr-xs'
          : 'bg-dark-900/90 border-dark-700/60 text-gray-200 rounded-tl-xs backdrop-blur-md'
      }`}>
        {/* Header line: Role Name & Timestamp */}
        <div className={`flex items-center justify-between gap-3 text-[11px] mb-1.5 font-medium ${isUser ? 'text-primary-200' : 'text-accent-400'}`}>
          <span>{isUser ? (user?.name || 'You') : 'FitBot AI'}</span>
          {timestamp && (
            <span className="text-[10px] text-gray-400 font-normal">
              {formatTime(timestamp)}
            </span>
          )}
        </div>

        {/* Message Content */}
        {isUser ? (
          <p className="text-sm leading-relaxed whitespace-pre-wrap break-words">{content}</p>
        ) : (
          <div className="markdown-content text-sm">
            <ReactMarkdown>{content}</ReactMarkdown>
          </div>
        )}

        {/* Copy Button for Assistant messages */}
        {!isUser && (
          <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity">
            <button
              onClick={handleCopy}
              className="p-1 rounded-md bg-dark-800/80 hover:bg-dark-700 text-gray-400 hover:text-gray-200 transition-colors text-xs"
              title="Copy message"
            >
              {copied ? <IoCheckmark className="text-accent-400" /> : <IoCopyOutline />}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
