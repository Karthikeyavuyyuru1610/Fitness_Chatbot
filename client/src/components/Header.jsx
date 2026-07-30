import { useState, useEffect } from 'react';
import { useLocation, NavLink } from 'react-router-dom';
import { IoMenu, IoSunny, IoMoon, IoPerson } from 'react-icons/io5';
import { useAuth } from '../context/AuthContext';

const PAGE_TITLES = {
  '/': 'AI Fitness Chat',
  '/workout': 'Workout Generator',
  '/diet': 'Diet Plan Generator',
  '/bmi': 'BMI & Calorie Calculator',
  '/profile': 'User Profile',
};

export default function Header({ onOpenSidebar }) {
  const location = useLocation();
  const { user } = useAuth();

  // Dark/Light Theme state
  const [theme, setTheme] = useState(() => localStorage.getItem('fitbot_theme') || 'dark');

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('light-mode');
    } else {
      root.classList.remove('light-mode');
    }
    localStorage.setItem('fitbot_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const currentTitle = PAGE_TITLES[location.pathname] || 'FitBot AI';

  return (
    <header className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-dark-700/50 bg-dark-900/80 backdrop-blur-xl shrink-0 z-30">
      {/* Left section */}
      <div className="flex items-center gap-3">
        <button
          onClick={onOpenSidebar}
          className="lg:hidden p-2 rounded-xl bg-dark-800/80 hover:bg-dark-700/80 text-gray-300 transition-colors"
          title="Open Menu"
        >
          <IoMenu className="text-xl" />
        </button>

        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-accent-500 flex items-center justify-center text-sm shadow-md">
            🏋️
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-bold gradient-text leading-tight">FitBot AI</h1>
            <p className="text-[10px] text-gray-400 leading-tight">{currentTitle}</p>
          </div>
          <span className="sm:hidden text-xs font-semibold text-gray-200 truncate max-w-[140px]">
            {currentTitle}
          </span>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center gap-2">
        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl bg-dark-800/80 border border-dark-700/50 text-gray-400 hover:text-yellow-400 hover:bg-dark-700/80 transition-all text-base"
          title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
        >
          {theme === 'dark' ? <IoSunny /> : <IoMoon />}
        </button>

        {/* User profile button */}
        {user && (
          <NavLink
            to="/profile"
            className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-dark-800/80 border border-dark-700/50 hover:bg-dark-700/80 transition-colors text-xs font-medium text-gray-200"
          >
            <div className="w-5 h-5 rounded-full bg-gradient-to-r from-primary-500 to-accent-500 flex items-center justify-center text-[10px] font-bold text-white">
              {user.name ? user.name.charAt(0).toUpperCase() : <IoPerson />}
            </div>
            <span className="hidden sm:inline truncate max-w-[100px]">{user.name}</span>
          </NavLink>
        )}
      </div>
    </header>
  );
}
