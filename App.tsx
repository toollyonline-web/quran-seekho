
import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Home from './pages/Home';
import SurahReader from './pages/SurahReader';
import JuzReader from './pages/JuzReader';
import Duas from './pages/Duas';
import NamesOfAllah from './pages/NamesOfAllah';
import Tasbeeh from './pages/Tasbeeh';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

const App: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  // Scroll to top on route change
  useEffect(() => {
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar isOpen={isMenuOpen} setIsOpen={setIsMenuOpen} />
      
      <main className="flex-grow container mx-auto px-4 py-8 max-w-7xl">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/surah/:number" element={<SurahReader />} />
          <Route path="/juz/:number" element={<JuzReader />} />
          <Route path="/duas" element={<Duas />} />
          <Route path="/names-of-allah" element={<NamesOfAllah />} />
          <Route path="/tasbeeh" element={<Tasbeeh />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
};

export default App;
