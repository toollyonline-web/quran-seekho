
import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchSurah } from '../services/api';
import { SurahData, Bookmark, Ayah } from '../types';

const SurahReader: React.FC = () => {
  const { number } = useParams<{ number: string }>();
  const navigate = useNavigate();
  const [surah, setSurah] = useState<SurahData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [fontSize, setFontSize] = useState(28); // Base Arabic font size
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeAyah, setActiveAyah] = useState<number | null>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('quran_bookmarks');
    if (saved) setBookmarks(JSON.parse(saved));
    
    const loadSurah = async () => {
      setLoading(true);
      try {
        const data = await fetchSurah(parseInt(number || '1'));
        setSurah(data);
        setActiveAyah(null); // Reset focus on new surah
      } catch (err) {
        setError("Failed to load surah. Please check your connection.");
      } finally {
        setLoading(false);
      }
    };
    loadSurah();
  }, [number]);

  // Keyboard Navigation Logic
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!surah || loading) return;
      
      // Ignore if typing in search box
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) {
        // Allow Esc to blur search
        if (e.key === 'Escape') {
          searchInputRef.current?.blur();
        }
        return;
      }

      // Next Ayah
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        e.preventDefault();
        const next = (activeAyah === null) ? 1 : activeAyah + 1;
        if (next <= surah.numberOfAyahs) {
          setActiveAyah(next);
          const el = document.getElementById(`ayah-${next}`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (surah.number < 114) {
          navigate(`/surah/${surah.number + 1}`);
        }
      } 
      // Previous Ayah
      else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        e.preventDefault();
        const prev = (activeAyah === null) ? 1 : activeAyah - 1;
        if (prev >= 1) {
          setActiveAyah(prev);
          const el = document.getElementById(`ayah-${prev}`);
          el?.scrollIntoView({ behavior: 'smooth', block: 'center' });
        } else if (surah.number > 1) {
          navigate(`/surah/${surah.number - 1}`);
        }
      }
      // Focus Search
      else if (e.key === '/') {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [surah, activeAyah, loading, navigate]);

  const toggleBookmark = (ayah: Ayah) => {
    const newBookmark: Bookmark = {
      surahNumber: surah!.number,
      ayahNumber: ayah.numberInSurah,
      surahName: surah!.englishName,
      text: ayah.translation_en || ''
    };

    let updated;
    const exists = bookmarks.find(b => b.surahNumber === surah!.number && b.ayahNumber === ayah.numberInSurah);
    
    if (exists) {
      updated = bookmarks.filter(b => !(b.surahNumber === surah!.number && b.ayahNumber === ayah.numberInSurah));
    } else {
      updated = [newBookmark, ...bookmarks].slice(0, 20); // Keep last 20
    }

    setBookmarks(updated);
    localStorage.setItem('quran_bookmarks', JSON.stringify(updated));
  };

  const isBookmarked = (ayahNum: number) => {
    return bookmarks.some(b => b.surahNumber === surah?.number && b.ayahNumber === ayahNum);
  };

  const handleCopy = (ayah: Ayah) => {
    const textToCopy = `${ayah.text}\n\nEnglish: ${ayah.translation_en}\n\nUrdu: ${ayah.translation_ur}\n\n(Surah ${surah?.englishName}, Ayah ${ayah.numberInSurah}) - Shared via Quran Seekho Online`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopiedId(ayah.numberInSurah);
      setTimeout(() => setCopiedId(null), 2000);
    });
  };

  const filteredAyahs = useMemo(() => {
    if (!surah || !searchQuery.trim()) return surah?.ayahs || [];
    const query = searchQuery.toLowerCase();
    return surah.ayahs.filter(ayah => 
      ayah.text.includes(query) || 
      ayah.translation_en?.toLowerCase().includes(query) || 
      ayah.translation_ur?.includes(query)
    );
  }, [surah, searchQuery]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-32">
      <div className="w-20 h-20 border-8 border-islamic-100 border-t-islamic-700 rounded-full animate-spin"></div>
      <p className="mt-6 text-islamic-800 font-bold text-xl tracking-tight">Loading Divine Verses...</p>
    </div>
  );

  if (error) return (
    <div className="text-center py-20">
      <div className="bg-red-50 text-red-600 p-8 rounded-[2.5rem] inline-block shadow-lg border border-red-100">
        <span className="text-4xl mb-4 block">⚠️</span>
        <p className="font-bold text-lg mb-4">{error}</p>
        <Link to="/" className="bg-red-600 text-white px-8 py-3 rounded-2xl font-bold shadow-md hover:bg-red-700 transition block">Return Home</Link>
      </div>
    </div>
  );

  const urduFontSize = Math.max(16, fontSize * 0.8);
  const englishFontSize = Math.max(14, fontSize * 0.65);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* Header Section */}
      <div className="bg-white p-8 md:p-12 rounded-[3rem] border border-slate-100 text-center shadow-sm relative overflow-hidden">
        <div className="relative z-10">
          <h2 className="arabic-text text-6xl md:text-7xl mb-4 text-islamic-800">{surah?.name}</h2>
          <h1 className="text-3xl font-black text-slate-900 mb-1">{surah?.englishName}</h1>
          <p className="text-slate-400 font-bold uppercase tracking-[0.2em] text-[10px]">
            {surah?.englishNameTranslation} • {surah?.revelationType} • {surah?.numberOfAyahs} Ayahs
          </p>
          
          <div className="mt-8 flex flex-wrap items-center justify-center gap-4">
            {/* Font Controls */}
            <div className="flex items-center bg-slate-50 p-1 rounded-2xl border border-slate-100 shadow-inner">
              <button 
                onClick={() => setFontSize(Math.max(16, fontSize - 2))} 
                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-slate-100 transition font-bold"
              >
                A-
              </button>
              <div className="px-3 text-center min-w-[70px]">
                <span className="text-[10px] block font-black text-slate-400 uppercase leading-none">Size</span>
                <span className="text-xs font-bold text-islamic-800">{fontSize}px</span>
              </div>
              <button 
                onClick={() => setFontSize(Math.min(72, fontSize + 2))} 
                className="w-10 h-10 flex items-center justify-center bg-white rounded-xl shadow-sm hover:bg-slate-100 transition font-bold"
              >
                A+
              </button>
            </div>
            
            {/* Search Box */}
            <div className="relative w-full max-w-xs">
              <input 
                ref={searchInputRef}
                type="text" 
                placeholder="Search verse (press /)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-3 pl-11 focus:outline-none focus:ring-4 focus:ring-islamic-600/10 focus:border-islamic-600 transition shadow-sm font-medium text-sm"
              />
              <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>

            <Link to="/" className="text-sm font-bold text-islamic-700 hover:underline">← All Surahs</Link>
          </div>
        </div>
      </div>

      {/* Shortcuts Help - Desktop Only */}
      <div className="hidden lg:flex justify-center">
        <div className="bg-slate-100/50 px-4 py-1.5 rounded-full text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-6">
          <span className="flex items-center gap-2"><kbd className="bg-white border px-1.5 py-0.5 rounded shadow-sm text-slate-600">←/→</kbd> Nav Ayahs</span>
          <span className="flex items-center gap-2"><kbd className="bg-white border px-1.5 py-0.5 rounded shadow-sm text-slate-600">/</kbd> Search</span>
          <span className="flex items-center gap-2"><kbd className="bg-white border px-1.5 py-0.5 rounded shadow-sm text-slate-600">Esc</kbd> Exit Search</span>
        </div>
      </div>

      {/* Bismillah */}
      {surah?.number !== 1 && surah?.number !== 9 && !searchQuery && (
        <div className="text-center py-12">
          <p className="arabic-text text-5xl text-islamic-900 drop-shadow-sm">بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ</p>
        </div>
      )}

      {/* Ayahs Listing */}
      <div className="space-y-6">
        {filteredAyahs.length > 0 ? (
          filteredAyahs.map((ayah) => (
            <div 
              key={ayah.number} 
              id={`ayah-${ayah.numberInSurah}`}
              className={`group bg-white border rounded-[2.5rem] p-8 md:p-12 transition-all duration-500 relative scroll-mt-24 ${
                activeAyah === ayah.numberInSurah 
                ? 'border-islamic-500 shadow-xl ring-4 ring-islamic-500/5' 
                : 'border-slate-100 hover:border-emerald-200'
              }`}
            >
              <div className="flex justify-between items-start mb-8">
                <span className={`inline-flex items-center justify-center w-10 h-10 rounded-xl text-xs font-black transition-all duration-500 ${
                  activeAyah === ayah.numberInSurah ? 'bg-islamic-800 text-white' : 'bg-slate-50 text-slate-400 group-hover:bg-islamic-800 group-hover:text-white'
                }`}>
                  {ayah.numberInSurah}
                </span>
                
                <div className="flex items-center gap-2">
                   <button 
                    onClick={() => handleCopy(ayah)}
                    className={`p-2.5 rounded-xl transition shadow-sm border ${copiedId === ayah.numberInSurah ? 'bg-emerald-100 border-emerald-200 text-emerald-600' : 'bg-slate-50 border-slate-50 text-slate-400 hover:text-emerald-600'}`} 
                    title="Copy Ayah"
                   >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      {copiedId === ayah.numberInSurah ? (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      ) : (
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      )}
                    </svg>
                   </button>
                   <button 
                    onClick={() => toggleBookmark(ayah)}
                    className={`p-2.5 rounded-xl transition shadow-sm border ${isBookmarked(ayah.numberInSurah) ? 'bg-amber-100 border-amber-200 text-amber-600' : 'bg-slate-50 border-slate-50 text-slate-400 hover:text-amber-500'}`}
                   >
                      <svg className="w-5 h-5" fill={isBookmarked(ayah.numberInSurah) ? "currentColor" : "none"} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                      </svg>
                   </button>
                </div>
              </div>
              
              <p 
                className="arabic-text leading-[2.2] mb-10 text-right text-slate-800 group-hover:text-islamic-900 transition-colors" 
                style={{ fontSize: `${fontSize}px` }}
              >
                {ayah.text}
              </p>

              <div className="space-y-6 pl-4 border-l-2 border-emerald-50">
                <p className="urdu-text leading-relaxed text-slate-700" style={{ fontSize: `${urduFontSize}px` }}>
                  {ayah.translation_ur}
                </p>
                <p className="leading-relaxed font-medium text-slate-500" style={{ fontSize: `${englishFontSize}px` }}>
                  {ayah.translation_en}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-[3rem] border border-slate-100 shadow-sm">
            <p className="text-slate-400 font-bold">No matches found for "{searchQuery}"</p>
          </div>
        )}
      </div>
      
      {/* Navigation Footer */}
      {!searchQuery && (
        <div className="flex justify-between items-center bg-white p-6 rounded-[2rem] border border-slate-100">
          {surah?.number && surah.number > 1 ? (
            <Link to={`/surah/${surah.number - 1}`} className="px-6 py-3 rounded-xl font-bold text-islamic-800 hover:bg-slate-50 transition">← Previous</Link>
          ) : <div />}
          
          {surah?.number && surah.number < 114 ? (
            <Link to={`/surah/${surah.number + 1}`} className="bg-islamic-800 text-white px-8 py-3 rounded-xl font-bold hover:bg-islamic-900 transition shadow-lg">Next Surah →</Link>
          ) : <div />}
        </div>
      )}
    </div>
  );
};

export default SurahReader;
