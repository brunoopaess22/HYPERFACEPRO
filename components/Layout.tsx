
import React from 'react';
import { Camera, User, LogOut, Zap } from 'lucide-react';
import { AppView } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  currentView: AppView;
  onNavigate: (view: AppView) => void;
  isLoggedIn: boolean;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ 
  children, 
  currentView, 
  onNavigate,
  isLoggedIn,
  onLogout
}) => {
  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto md:max-w-2xl lg:max-w-5xl bg-hyper-black md:my-4 md:rounded-[2rem] md:border md:border-hyper-gray md:shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden text-hyper-white">
      {/* Header */}
      <header className="p-5 flex items-center justify-between border-b border-hyper-gray bg-hyper-black/90 backdrop-blur-md sticky top-0 z-50">
        <div 
          className="flex items-center gap-3 cursor-pointer group" 
          onClick={() => onNavigate(AppView.WELCOME)}
        >
          <div className="relative">
            <div className="absolute -inset-1 bg-gradient-to-r from-hyper-blue to-hyper-purple rounded-lg blur opacity-40 group-hover:opacity-100 transition duration-200"></div>
            <div className="relative bg-black p-2 rounded-lg border border-gray-800">
              <Zap className="w-5 h-5 text-hyper-blue" />
            </div>
          </div>
          <span className="font-heading font-bold text-xl tracking-tighter text-white">
            HYPERFACE <span className="text-transparent bg-clip-text bg-gradient-to-r from-hyper-blue to-hyper-purple">PRO</span>
          </span>
        </div>

        {isLoggedIn && (
          <nav className="flex items-center gap-2">
            <button 
              onClick={() => onNavigate(AppView.PROFILE)}
              className={`p-2 rounded-full transition ${currentView === AppView.PROFILE ? 'bg-hyper-card text-hyper-blue border border-hyper-blue' : 'text-gray-400 hover:text-white hover:bg-hyper-card'}`}
              title="Galeria"
            >
              <User className="w-5 h-5" />
            </button>
            <button 
              onClick={onLogout}
              className="p-2 rounded-full text-gray-500 hover:bg-red-900/20 hover:text-red-500 transition"
              title="Sair"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </nav>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative overflow-y-auto overflow-x-hidden bg-[#080808] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#121212] via-[#080808] to-black">
        {children}
      </main>

      {/* Footer (Minimal) */}
      <footer className="p-4 text-center text-[10px] uppercase tracking-widest text-gray-600 bg-hyper-black border-t border-hyper-gray">
        <p>HYPERFACE PRO © {new Date().getFullYear()} • ENGINE v3.0 • 16K READY</p>
      </footer>
    </div>
  );
};

export default Layout;