import type { ReactNode } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const { logout } = useAuth();
  const location = useLocation();

  const navItems = [
    { path: '/', icon: '🏠', label: 'Home' },
    { path: '/batches', icon: '🍺', label: 'Batches' },
    { path: '/recipes', icon: '📖', label: 'Recipes' },
    { path: '/calculator', icon: '🧮', label: 'Calc' },
    { path: '/settings', icon: '⚙️', label: 'Settings' },
  ];

  return (
    <div className="min-h-screen bg-cream grain-texture pb-20">
      {/* Header */}
      <header className="bg-gradient-to-r from-amber-600 to-amber-500 text-white p-4 shadow-lg sticky top-0 z-40">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <span className="text-2xl">🍺</span>
            <span className="font-bold text-lg">Brew Tracker</span>
          </Link>
          <button
            onClick={logout}
            className="flex items-center gap-1 bg-amber-700/50 hover:bg-amber-700 px-3 py-2 rounded-lg transition-colors"
            title="Lock"
          >
            <span>🔒</span>
            <span className="hidden sm:inline text-sm">Lock</span>
          </button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto p-4">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-amber-200 shadow-lg z-50">
        <div className="max-w-4xl mx-auto flex justify-around">
          {navItems.map((item) => {
            const isActive = location.pathname === item.path || 
              (item.path !== '/' && location.pathname.startsWith(item.path));
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center py-2 px-3 min-w-[64px] transition-colors ${
                  isActive 
                    ? 'text-amber-600' 
                    : 'text-amber-400 hover:text-amber-500'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs mt-1">{item.label}</span>
                {isActive && (
                  <div className="absolute bottom-0 w-12 h-1 bg-amber-500 rounded-t-full" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
