import { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ProtectedRoute from './components/ProtectedRoute';
import ChatPage from './pages/ChatPage';
import WorkoutPage from './pages/WorkoutPage';
import DietPage from './pages/DietPage';
import BMIPage from './pages/BMIPage';
import ProfilePage from './pages/ProfilePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';

/**
 * Root application shell — ChatGPT/Claude style 100vh flexbox interface.
 */
export default function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <Routes>
      {/* ── Public Unauthenticated Auth Routes ───────────────────────── */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />

      {/* ── Protected Authenticated App Routes ──────────────────────── */}
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <div className="flex h-screen max-h-screen overflow-hidden bg-dark-950 glow-bg">
              {/* Collapsible Left Sidebar (~300px) */}
              <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

              {/* Main App Container */}
              <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative z-10">
                {/* Top Navbar Header */}
                <Header onOpenSidebar={() => setSidebarOpen(true)} />

                {/* Main View Area */}
                <main className="flex-1 overflow-hidden relative">
                  <Routes>
                    <Route path="/" element={<ChatPage />} />
                    <Route path="/workout" element={<WorkoutPage />} />
                    <Route path="/diet" element={<DietPage />} />
                    <Route path="/bmi" element={<BMIPage />} />
                    <Route path="/profile" element={<ProfilePage />} />
                  </Routes>
                </main>
              </div>
            </div>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
