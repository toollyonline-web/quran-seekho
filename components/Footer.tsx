
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  return (
    <footer className="bg-white border-t border-slate-100 py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-3 gap-8 mb-8">
          <div>
            <Link to="/" className="text-xl font-bold text-islamic-800 flex items-center space-x-2 mb-4">
              <span>📖</span>
              <span>Quran Seekho Online</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">
              An Islamic portal dedicated to making Quranic knowledge accessible to everyone, everywhere. Read, learn, and grow.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-slate-800 mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><Link to="/" className="hover:text-islamic-700 transition">Surah List</Link></li>
              <li><Link to="/duas" className="hover:text-islamic-700 transition">Daily Duas</Link></li>
              <li><a href="#" className="hover:text-islamic-700 transition">Prayer Times</a></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-800 mb-4">About</h4>
            <ul className="space-y-2 text-sm text-slate-500">
              <li><a href="#" className="hover:text-islamic-700 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-islamic-700 transition">Terms of Use</a></li>
              <li><a href="#" className="hover:text-islamic-700 transition">Contact Us</a></li>
            </ul>
          </div>
        </div>
        
        <div className="pt-8 border-t border-slate-50 flex flex-col md:flex-row justify-between items-center text-xs text-slate-400 space-y-4 md:space-y-0">
          <p>© {new Date().getFullYear()} Quran Seekho Online. All rights reserved.</p>
          <div className="flex space-x-4">
             <p>Built with ❤️ for the Ummah</p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
