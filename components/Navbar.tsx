
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

interface NavbarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

const Navbar: React.FC<NavbarProps> = ({ isOpen, setIsOpen }) => {
  const location = useLocation();
  
  const navLinks = [
    { name: 'Home', path: '/', icon: '🏠' },
    { name: 'Duas', path: '/duas', icon: '🤲' },
    { name: '99 Names', path: '/names-of-allah', icon: '✨' },
    { name: 'Tasbeeh', path: '/tasbeeh', icon: '📿' },
  ];

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-islamic-800 text-white shadow-lg sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center py-4">
          <Link to="/" className="text-xl md:text-2xl font-bold flex items-center space-x-2">
            <span className="bg-white text-islamic-800 p-1.5 rounded-xl shadow-inner">📖</span>
            <span className="tracking-tight">Quran Seekho <span className="text-emerald-300">Online</span></span>
          </Link>

          {/* Desktop Links */}
          <div className="hidden lg:flex items-center space-x-1">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`px-4 py-2 rounded-xl transition-all duration-300 flex items-center gap-2 font-medium ${
                  isActive(link.path) 
                    ? 'bg-islamic-700 text-emerald-200 shadow-inner' 
                    : 'hover:bg-islamic-700/50 hover:text-emerald-100'
                }`}
              >
                <span>{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>

          <button 
            className="lg:hidden p-2 rounded-xl bg-islamic-700/50"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle Menu"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={isOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"} />
            </svg>
          </button>
        </div>

        {/* Mobile Sidebar/Menu */}
        {isOpen && (
          <div className="lg:hidden pb-6 pt-2 border-t border-islamic-700 mt-2 space-y-1 animate-in slide-in-from-top-4 duration-300">
            {navLinks.map((link) => (
              <Link 
                key={link.path}
                to={link.path} 
                className={`flex items-center gap-4 py-3 px-5 rounded-2xl transition ${
                  isActive(link.path) 
                    ? 'bg-islamic-700 text-emerald-200 font-bold' 
                    : 'text-slate-100 hover:bg-islamic-700/30'
                }`}
              >
                <span className="text-xl">{link.icon}</span>
                {link.name}
              </Link>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
