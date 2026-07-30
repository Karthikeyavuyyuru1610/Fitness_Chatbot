import { useState, useEffect, useMemo } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import {
  IoChatbubbles,
  IoBarbell,
  IoNutrition,
  IoCalculator,
  IoPerson,
  IoAdd,
  IoSearch,
  IoTrash,
  IoClose,
  IoLogOut,
} from 'react-icons/io5';
import { useChat } from '../context/ChatContext';
import { useAuth } from '../context/AuthContext';

const NAV_ITEMS = [
  { path: '/',        icon: IoChatbubbles, label: 'Chat' },
  { path: '/workout', icon: IoBarbell,     label: 'Workout Generator' },
  { path: '/diet',    icon: IoNutrition,   label: 'Diet Plan' },
  { path: '/bmi',     icon: IoCalculator,  label: 'BMI Calculator' },
  { path: '/profile', icon: IoPerson,      label: 'My Profile' },
];

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');

  const {
    conversations,
    activeConversation,
    fetchConversations,
    loadConversation,
    startNewConversation,
    removeConversation,
  } = useChat();

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Filter conversations by live search input
  const filteredConversations = useMemo(() => {
    if (!searchTerm.trim()) return conversations;
    const term = searchTerm.toLowerCase();
    return conversations.filter((c) => c.title.toLowerCase().includes(term));
  }, [conversations, searchTerm]);

  const handleSelectConversation = (id) => {
    loadConversation(id);
    if (location.pathname !== '/') {
      navigate('/');
    }
    onClose?.();
  };

  const handleNewChat = () => {
    startNewConversation();
    if (location.pathname !== '/') {
      navigate('/');
    }
    onClose?.();
  };

  const handleLogout = () => {
    logout();
    onClose?.();
    navigate('/login');
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 w-[300px] flex flex-col overflow-hidden
                     bg-dark-900/95 backdrop-blur-2xl border-r border-dark-700/60
                     transform transition-transform duration-300 ease-in-out shrink-0
                     ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        {/* ── Brand Header ────────────────────────────────────────── */}
        <div className="p-4 border-b border-dark-700/50 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-lg shadow-md">
                🏋️
              </div>
              <div>
                <h1 className="text-base font-bold gradient-text">FitBot AI</h1>
                <p className="text-[10px] text-gray-400 uppercase tracking-wider font-medium">Personal Fitness Coach</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="lg:hidden p-1.5 rounded-lg hover:bg-dark-800 text-gray-400 transition-colors"
            >
              <IoClose className="text-xl" />
            </button>
          </div>

          {/* New Chat Button */}
          <button
            onClick={handleNewChat}
            className="w-full mt-4 py-2.5 px-4 rounded-xl bg-gradient-to-r from-primary-600/20 to-accent-600/20
                       border border-primary-500/30 hover:border-primary-500/60 text-primary-300
                       hover:bg-primary-500/15 font-semibold text-xs flex items-center justify-center gap-2
                       transition-all shadow-sm active:scale-[0.98]"
          >
            <IoAdd className="text-base" /> New Conversation
          </button>
        </div>

        {/* ── Main Nav Links ─────────────────────────────────────── */}
        <nav className="p-3 space-y-1 shrink-0 border-b border-dark-700/40">
          {NAV_ITEMS.map(({ path, icon: Icon, label }) => (
            <NavLink
              key={path}
              to={path}
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-500/15 text-primary-300 border border-primary-500/25 shadow-sm'
                    : 'text-gray-400 hover:bg-dark-800/80 hover:text-gray-200'
                }`
              }
            >
              <Icon className="text-base shrink-0" />
              <span className="truncate">{label}</span>
            </NavLink>
          ))}
        </nav>

        {/* ── Conversations History & Search Filter ───────────────── */}
        <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
          <div className="p-3 pb-2 space-y-2 shrink-0">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider">
                Recent Chats
              </span>
              <span className="text-[10px] bg-dark-800 px-2 py-0.5 rounded-full text-gray-400">
                {filteredConversations.length}
              </span>
            </div>

            {/* Live Search Input */}
            <div className="relative">
              <IoSearch className="absolute left-3 top-2.5 text-gray-500 text-xs" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search chats..."
                className="w-full pl-8 pr-3 py-1.5 bg-dark-800/80 border border-dark-700/50 rounded-lg text-xs text-gray-200 placeholder-gray-500 focus:outline-none focus:border-primary-500/40"
              />
            </div>
          </div>

          {/* Conversations list */}
          <div className="flex-1 overflow-y-auto px-3 pb-3 space-y-1">
            {filteredConversations.length === 0 ? (
              <p className="text-xs text-gray-500 text-center py-6">
                {searchTerm ? 'No chats match search' : 'No previous conversations'}
              </p>
            ) : (
              filteredConversations.map((conv) => {
                const isActive = activeConversation?.id === conv.id;
                return (
                  <div
                    key={conv.id}
                    className={`group flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer transition-all ${
                      isActive
                        ? 'bg-primary-500/20 text-primary-200 border border-primary-500/30 font-medium'
                        : 'text-gray-400 hover:bg-dark-800/70 hover:text-gray-200'
                    }`}
                    onClick={() => handleSelectConversation(conv.id)}
                  >
                    <IoChatbubbles className="text-xs shrink-0" />
                    <span className="text-xs truncate flex-1">{conv.title}</span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeConversation(conv.id);
                      }}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:text-red-400 transition-all text-xs"
                      title="Delete conversation"
                    >
                      <IoTrash />
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── User Footer Card ────────────────────────────────────── */}
        {user && (
          <div className="p-3 border-t border-dark-700/50 shrink-0 bg-dark-900/80">
            <div className="flex items-center justify-between gap-2 p-2 rounded-xl bg-dark-800/80 border border-dark-700/40">
              <NavLink
                to="/profile"
                onClick={onClose}
                className="flex items-center gap-2.5 min-w-0 flex-1 hover:opacity-80 transition-opacity"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-xs font-bold text-white shrink-0">
                  {user.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-gray-200 truncate">{user.name}</p>
                  <p className="text-[10px] text-gray-400 truncate">{user.email}</p>
                </div>
              </NavLink>
              <button
                onClick={handleLogout}
                className="p-2 rounded-lg text-gray-400 hover:text-red-400 hover:bg-dark-700/50 transition-colors"
                title="Sign Out"
              >
                <IoLogOut className="text-base" />
              </button>
            </div>
          </div>
        )}
      </aside>
    </>
  );
}
