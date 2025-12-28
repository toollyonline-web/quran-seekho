
import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { fetchJuz } from '../services/api';
import { Ayah } from '../types';

const JuzReader: React.FC = () => {
  const { number } = useParams<{ number: string }>();
  const [ayahs, setAyahs] = useState<Ayah[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadJuz = async () => {
      setLoading(true);
      try {
        const data = await fetchJuz(parseInt(number || '1'));
        setAyahs(data.ayahs);
      } catch (err) {
        setError("Failed to load Juz. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    loadJuz();
  }, [number]);

  if (loading) return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="w-16 h-16 border-4 border-islamic-600 border-t-transparent rounded-full animate-spin"></div>
      <p className="mt-4 text-slate-500 font-medium text-lg">Loading Juz {number}...</p>
    </div>
  );

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-islamic-800 text-white p-8 rounded-3xl mb-8 text-center">
        <h1 className="text-3xl font-bold">Juz {number}</h1>
        <p className="text-emerald-100 opacity-80 mt-2">Sipara Number {number} of the Holy Quran</p>
      </div>

      <div className="space-y-4">
        {ayahs.map((ayah, i) => (
          <div key={i} className="bg-white p-8 rounded-2xl border border-slate-100 shadow-sm hover:border-emerald-100 transition">
             <div className="flex justify-between items-center mb-4">
                 <span className="text-xs font-bold text-slate-400">Ayah {ayah.numberInSurah}</span>
                 {/* This would show surah name change if implemented in data */}
             </div>
             <p className="arabic-text text-3xl leading-loose mb-6 text-slate-800">{ayah.text}</p>
             <div className="space-y-3">
                <p className="urdu-text text-xl text-slate-700">{ayah.translation_ur}</p>
                <p className="text-slate-600 text-sm italic">{ayah.translation_en}</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default JuzReader;
