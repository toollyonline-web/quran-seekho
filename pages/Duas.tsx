
import React from 'react';
import { Dua } from '../types';

const DUA_DATA: Dua[] = [
  {
    id: '1',
    category: 'Morning',
    title: 'Waking Up',
    arabic: 'الْحَمْدُ للهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    urdu: 'تمام تعریفیں اللہ کے لیے ہیں جس نے ہمیں مارنے کے بعد زندہ کیا اور اسی کی طرف لوٹ کر جانا ہے۔',
    english: 'Praise is to Allah who gave us life after he had caused us to die and to Him is the return.'
  },
  {
    id: '2',
    category: 'Protection',
    title: 'Entering Home',
    arabic: 'بِسْمِ اللَّهِ وَلَجْنَا، وَبِسْمِ اللَّهِ خَرَجْنَا، وَعَلَى اللَّهِ رَبِّنَا تَوَكَّلْنَا',
    urdu: 'اللہ کے نام سے ہم داخل ہوئے، اور اللہ ہی کے نام سے ہم نکلے، اور اپنے رب اللہ ہی پر ہم نے بھروسہ کیا۔',
    english: 'In the name of Allah we enter and in the name of Allah we leave, and upon our Lord we place our trust.'
  },
  {
    id: '3',
    category: 'Daily',
    title: 'Eating',
    arabic: 'بِسْمِ اللَّهِ وَعَلَى بَرَكَةِ اللَّهِ',
    urdu: 'اللہ کے نام سے اور اللہ کی برکت پر (شروع کرتا ہوں)۔',
    english: 'In the name of Allah and with the blessings of Allah.'
  }
];

const Duas: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <header className="text-center py-8">
        <h1 className="text-4xl font-bold text-islamic-800 mb-2">Daily Duas</h1>
        <p className="text-slate-500">Essential supplications for every Muslim's daily life.</p>
      </header>

      <div className="grid gap-6">
        {DUA_DATA.map(dua => (
          <div key={dua.id} className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 hover:shadow-md transition">
            <div className="flex items-center space-x-3 mb-6">
              <span className="bg-emerald-100 text-islamic-800 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
                {dua.category}
              </span>
              <h3 className="text-xl font-bold text-slate-800">{dua.title}</h3>
            </div>
            
            <p className="arabic-text text-3xl mb-8 text-center text-islamic-900 leading-loose">
              {dua.arabic}
            </p>

            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-slate-50">
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">Urdu Meaning</span>
                <p className="urdu-text text-lg text-slate-700">{dua.urdu}</p>
              </div>
              <div className="space-y-2">
                <span className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">English Meaning</span>
                <p className="text-slate-600 font-medium leading-relaxed">{dua.english}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Duas;
