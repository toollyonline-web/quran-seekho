
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import PrayerWidget from '../components/PrayerWidget';
import { fetchSurahsList } from '../services/api';
import { SurahMetadata, Bookmark } from '../types';
import { FEATURED_SURAH_NUMBERS } from '../constants';

const Home: React.FC = () => {
  const [surahs, setSurahs] = useState<SurahMetadata[]>([]);
  const [filteredSurahs, setFilteredSurahs] = useState<SurahMetadata[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'surah' | 'juz'>('surah');
  const [searchTerm, setSearchTerm] = useState('');
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const list = await fetchSurahsList();
        setSurahs(list);
        setFilteredSurahs(list);
        
        // Load Bookmarks
        const saved = localStorage.getItem('quran_bookmarks');
        if (saved) setBookmarks(JSON.parse(saved));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    const results = surahs.filter(s => 
      s.englishName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      s.number.toString() === searchTerm
    );
    setFilteredSurahs(results);
  }, [searchTerm, surahs]);

  const featuredSurahs = surahs.filter(s => FEATURED_SURAH_NUMBERS.includes(s.number));

  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-islamic-800 to-islamic-900 rounded-[2.5rem] p-8 md:p-14 text-white text-center relative overflow-hidden shadow-2xl border border-white/5">
        <div className="relative z-10">
          <span className="inline-block bg-white/10 backdrop-blur-md px-5 py-1.5 rounded-full text-xs font-bold tracking-widest uppercase mb-6 border border-white/20">
            بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
          </span>
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight">Learn. Recite. <br className="hidden md:block"/> Connect.</h1>
          <p className="text-emerald-100 text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed opacity-90 font-medium">
            Your gateway to understanding the Holy Quran with translations, daily dhikr tools, and prayer companions.
          </p>
          <div className="flex flex-wrap justify-center gap-5">
            <Link to="/surah/1" className="bg-white text-islamic-800 px-10 py-4 rounded-2xl font-bold hover:bg-emerald-50 transition-all shadow-xl hover:-translate-y-1 active:scale-95 flex items-center gap-3">
              <span>📖</span> Start Reading
            </Link>
            <Link to="/names-of-allah" className="bg-islamic-700/40 border border-white/20 backdrop-blur-sm text-white px-10 py-4 rounded-2xl font-bold hover:bg-islamic-700 transition shadow-xl hover:-translate-y-1 active:scale-95 flex items-center gap-3">
              <span>✨</span> 99 Names
            </Link>
          </div>
        </div>
        
        <div className="absolute -top-24 -right-24 w-96 h-96 bg-emerald-500/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-24 -left-24 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl"></div>
      </section>

      {/* Grid Layout for Widget & Ayah of Day */}
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <PrayerWidget />
          
          {/* Ayah of the Day */}
          <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="flex items-center gap-2 mb-6">
               <span className="text-xl">🌙</span>
               <h3 className="font-bold text-slate-800 uppercase tracking-widest text-sm">Ayah of the Day</h3>
            </div>
            <p className="arabic-text text-3xl md:text-4xl text-right text-islamic-900 leading-[1.8] mb-8">
              رَبَّنَا تَقَبَّلْ مِنَّا إِنَّكَ أَنْتَ السَّمِيعُ الْعَلِيمُ
            </p>
            <div className="border-t border-slate-50 pt-6">
              <p className="text-slate-700 font-medium italic text-lg mb-2">"Our Lord! Accept (this service) from us: For Thou art the All-Hearing, the All-knowing"</p>
              <p className="text-slate-400 text-sm font-bold">Al-Baqara 2:127</p>
            </div>
            <div className="absolute top-0 right-0 p-4 opacity-[0.03]">
              <svg width="120" height="120" viewBox="0 0 100 100" fill="currentColor"><path d="M50 0L100 50L50 100L0 50Z"/></svg>
            </div>
          </div>
        </div>

        {/* Bookmarks / Saved Sidebar */}
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm h-fit">
          <h3 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
            <span>🔖</span> Saved Ayahs
          </h3>
          {bookmarks.length > 0 ? (
            <div className="space-y-4">
              {bookmarks.map((bm, i) => (
                <Link key={i} to={`/surah/${bm.surahNumber}`} className="block p-4 bg-slate-50 rounded-2xl hover:bg-emerald-50 transition border border-transparent hover:border-emerald-100 group">
                  <p className="text-xs font-bold text-islamic-600 mb-1">{bm.surahName}</p>
                  <p className="text-sm text-slate-600 line-clamp-2 group-hover:text-slate-900 transition">{bm.text}</p>
                  <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">Ayah {bm.ayahNumber}</p>
                </Link>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 px-4 bg-slate-50 rounded-3xl">
              <p className="text-slate-400 text-sm font-medium">No bookmarks yet. Save ayahs while reading!</p>
            </div>
          )}
        </div>
      </div>

      {/* Main Listing Section */}
      <section>
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex bg-slate-100 p-1.5 rounded-[1.5rem] self-start shadow-inner">
            <button 
              onClick={() => setActiveTab('surah')}
              className={`px-10 py-3.5 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 ${activeTab === 'surah' ? 'bg-white text-islamic-800 shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <span className="text-xl">📖</span> Surahs
            </button>
            <button 
              onClick={() => setActiveTab('juz')}
              className={`px-10 py-3.5 rounded-2xl font-bold transition-all duration-300 flex items-center gap-3 ${activeTab === 'juz' ? 'bg-white text-islamic-800 shadow-xl scale-[1.02]' : 'text-slate-500 hover:text-slate-700'}`}
            >
              <span className="text-xl">📜</span> Juz
            </button>
          </div>

          <div className="relative w-full md:w-80 group">
            <input 
              type="text" 
              placeholder="Quick search surah..."
              className="w-full bg-white border border-slate-200 rounded-2xl px-6 py-4 pl-14 focus:outline-none focus:ring-4 focus:ring-islamic-600/10 focus:border-islamic-600 transition shadow-sm group-hover:shadow-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg className="w-6 h-6 absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-islamic-600 transition" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {activeTab === 'surah' ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              Array.from({length: 12}).map((_, i) => (
                <div key={i} className="h-32 bg-white/50 animate-pulse rounded-[2rem] border border-slate-100"></div>
              ))
            ) : (
              filteredSurahs.map(s => (
                <Link key={s.number} to={`/surah/${s.number}`} className="group bg-white p-6 rounded-[2rem] border border-slate-100 hover:border-islamic-600 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-5">
                      <div className="w-14 h-14 bg-emerald-50 flex items-center justify-center rounded-2xl text-islamic-900 font-extrabold group-hover:bg-islamic-800 group-hover:text-white transition-all duration-500 shadow-sm border border-emerald-100">
                        {s.number}
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 group-hover:text-islamic-800 transition text-lg">{s.englishName}</h4>
                        <p className="text-xs text-slate-400 uppercase font-bold tracking-widest">{s.numberOfAyahs} Ayahs • {s.revelationType}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="arabic-text text-3xl font-bold text-islamic-900 mb-1 group-hover:scale-110 transition duration-500">{s.name}</p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tight">{s.englishNameTranslation}</p>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6">
            {Array.from({length: 30}).map((_, i) => (
              <Link key={i+1} to={`/juz/${i+1}`} className="group bg-white p-10 text-center rounded-[2.5rem] border border-slate-100 hover:border-islamic-600 hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <span className="block text-4xl font-black text-islamic-900 mb-2 group-hover:scale-125 transition-transform duration-500">{i+1}</span>
                <span className="block text-xs text-slate-400 font-black uppercase tracking-[0.2em] mb-1">Juz</span>
                <span className="text-[10px] text-slate-300 font-bold">SIPARA {i+1}</span>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Interactive Utilities Section */}
      <section className="grid md:grid-cols-2 gap-8">
        <Link to="/tasbeeh" className="bg-gradient-to-r from-emerald-600 to-teal-700 p-10 rounded-[2.5rem] text-white shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-95 group overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-3xl font-extrabold mb-3">Digital Tasbeeh</h3>
            <p className="text-emerald-100 opacity-90 mb-6">Simple interactive counter for your daily dhikr and salawat.</p>
            <span className="bg-white/20 px-6 py-2 rounded-full font-bold text-sm backdrop-blur-sm group-hover:bg-white group-hover:text-emerald-800 transition">Try Now →</span>
          </div>
          <span className="absolute -bottom-10 -right-10 text-[10rem] opacity-10 group-hover:rotate-12 transition duration-700">📿</span>
        </Link>
        
        <Link to="/names-of-allah" className="bg-gradient-to-r from-amber-500 to-orange-600 p-10 rounded-[2.5rem] text-white shadow-xl hover:shadow-2xl transition-all hover:scale-[1.02] active:scale-95 group overflow-hidden relative">
          <div className="relative z-10">
            <h3 className="text-3xl font-extrabold mb-3">99 Names</h3>
            <p className="text-amber-100 opacity-90 mb-6">Explore the beautiful attributes of Allah with English & Urdu meanings.</p>
            <span className="bg-white/20 px-6 py-2 rounded-full font-bold text-sm backdrop-blur-sm group-hover:bg-white group-hover:text-amber-800 transition">View All →</span>
          </div>
          <span className="absolute -bottom-10 -right-10 text-[10rem] opacity-10 group-hover:-rotate-12 transition duration-700">✨</span>
        </Link>
      </section>
    </div>
  );
};

export default Home;
