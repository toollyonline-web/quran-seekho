
import React, { useState } from 'react';
import { AllahName } from '../types';

const NAMES_DATA: AllahName[] = [
  { number: 1, name: "ٱلرَّحْمَٰنُ", transliteration: "Ar-Rahmaan", meaning_en: "The Most Gracious", meaning_ur: "نہایت مہربان" },
  { number: 2, name: "ٱلرَّحِيمُ", transliteration: "Ar-Raheem", meaning_en: "The Most Merciful", meaning_ur: "بہت رحم والا" },
  { number: 3, name: "ٱلْمَلِكُ", transliteration: "Al-Malik", meaning_en: "The Sovereign", meaning_ur: "حقیقی بادشاہ" },
  { number: 4, name: "ٱلْقُدُّوسُ", transliteration: "Al-Quddus", meaning_en: "The Pure", meaning_ur: "نہایت پاک" },
  { number: 5, name: "ٱلسَّلَٰمُ", transliteration: "As-Salaam", meaning_en: "The Giver of Peace", meaning_ur: "سلامتی والا" },
  { number: 6, name: "ٱلْمُؤْمِنُ", transliteration: "Al-Mu'min", meaning_en: "The Bestower of Faith", meaning_ur: "ایمان دینے والا" },
  { number: 7, name: "ٱلْمُهَيْمِنُ", transliteration: "Al-Muhaymin", meaning_en: "The Guardian", meaning_ur: "نگہبان" },
  { number: 8, name: "ٱلْعَزِيزُ", transliteration: "Al-Azeez", meaning_en: "The Almighty", meaning_ur: "غالب" },
  { number: 9, name: "ٱلْجَبَّارُ", transliteration: "Al-Jabbaar", meaning_en: "The Compeller", meaning_ur: "زبردست" },
  { number: 10, name: "ٱلْمُتَكَبِّرُ", transliteration: "Al-Mutakabbir", meaning_en: "The Supreme", meaning_ur: "بزرگی والا" },
  { number: 11, name: "ٱلْخَٰلِقُ", transliteration: "Al-Khaliq", meaning_en: "The Creator", meaning_ur: "پیدا کرنے والا" },
  { number: 12, name: "ٱلْبَارِئُ", transliteration: "Al-Baari", meaning_en: "The Evolver", meaning_ur: "ٹھیک کرنے والا" },
  { number: 13, name: "ٱلْمُصَوِّرُ", transliteration: "Al-Musawwir", meaning_en: "The Fashioner", meaning_ur: "صورت بنانے والا" },
  { number: 14, name: "ٱلْغَفَّٰرُ", transliteration: "Al-Ghaffar", meaning_en: "The Forgiver", meaning_ur: "بڑا بخشنے والا" },
  { number: 15, name: "ٱلْقَهَّٰرُ", transliteration: "Al-Qahhar", meaning_en: "The Subduer", meaning_ur: "سب پر غالب" },
  { number: 16, name: "ٱلْوَهَّابُ", transliteration: "Al-Wahhab", meaning_en: "The Bestower", meaning_ur: "سب کچھ عطا کرنے والا" },
  { number: 17, name: "ٱلرَّزَّاقُ", transliteration: "Ar-Razzaq", meaning_en: "The Provider", meaning_ur: "رزق دینے والا" },
  { number: 18, name: "ٱلْفَتَّاحُ", transliteration: "Al-Fattah", meaning_en: "The Opener", meaning_ur: "مشکل کشا" },
  { number: 19, name: "ٱلْعَلِيمُ", transliteration: "Al-Alim", meaning_en: "The All-Knowing", meaning_ur: "سب کچھ جاننے والا" },
  { number: 20, name: "ٱلْقَابِضُ", transliteration: "Al-Qabid", meaning_en: "The Withholder", meaning_ur: "تنگی کرنے والا" },
  { number: 21, name: "ٱلْبَاسِطُ", transliteration: "Al-Basit", meaning_en: "The Expander", meaning_ur: "فراخی کرنے والا" },
  { number: 22, name: "ٱلْخَافِضُ", transliteration: "Al-Khafid", meaning_en: "The Abaser", meaning_ur: "پست کرنے والا" },
  { number: 23, name: "ٱلرَّافِعُ", transliteration: "Ar-Rafi", meaning_en: "The Exalter", meaning_ur: "بلند کرنے والا" },
  { number: 24, name: "ٱلْمُعِزُّ", transliteration: "Al-Mu'izz", meaning_en: "The Bestower of Honors", meaning_ur: "عزت دینے والا" },
  { number: 25, name: "ٱلْمُذِلُّ", transliteration: "Al-Mudhill", meaning_en: "The Humiliator", meaning_ur: "ذلت دینے والا" },
  { number: 26, name: "ٱلسَّمِيعُ", transliteration: "As-Sami", meaning_en: "The All-Hearing", meaning_ur: "سب کچھ سننے والا" },
  { number: 27, name: "ٱلْبَصِيرُ", transliteration: "Al-Basir", meaning_en: "The All-Seeing", meaning_ur: "سب کچھ دیکھنے والا" },
  { number: 28, name: "ٱلْحَكَمُ", transliteration: "Al-Hakam", meaning_en: "The Judge", meaning_ur: "فیصلہ کرنے والا" },
  { number: 29, name: "ٱلْعَدْلُ", transliteration: "Al-Adl", meaning_en: "The Just", meaning_ur: "انصاف کرنے والا" },
  { number: 30, name: "ٱللَّطِيفُ", transliteration: "Al-Latif", meaning_en: "The Subtle One", meaning_ur: "مہربان" },
  { number: 31, name: "ٱلْخَبِيرُ", transliteration: "Al-Khabir", meaning_en: "The All-Aware", meaning_ur: "خبردار" },
  { number: 32, name: "ٱلْحَلِيمُ", transliteration: "Al-Halim", meaning_en: "The Forbearing One", meaning_ur: "بردبار" },
  { number: 33, name: "ٱلْعَظِيمُ", transliteration: "Al-Azeem", meaning_en: "The Magnificent", meaning_ur: "بڑی عظمت والا" },
  { number: 34, name: "ٱلْغَفُورُ", transliteration: "Al-Ghafur", meaning_en: "The Forgiving One", meaning_ur: "معاف کرنے والا" },
  { number: 35, name: "ٱلشَّكُورُ", transliteration: "Ash-Shakur", meaning_en: "The Grateful", meaning_ur: "قدردان" },
  { number: 36, name: "ٱلْعَلِيُّ", transliteration: "Al-Ali", meaning_en: "The Most High", meaning_ur: "سب سے بلند" },
  { number: 37, name: "ٱلْكَبِيرُ", transliteration: "Al-Kabir", meaning_en: "The Greatest", meaning_ur: "بہت بڑا" },
  { number: 38, name: "ٱلْحَفِيظُ", transliteration: "Al-Hafiz", meaning_en: "The Preserver", meaning_ur: "حفاظت کرنے والا" },
  { number: 39, name: "ٱلْمُقِيتُ", transliteration: "Al-Muqit", meaning_en: "The Sustainer", meaning_ur: "قوت دینے والا" },
  { number: 40, name: "ٱلْحَسِيبُ", transliteration: "Al-Hasib", meaning_en: "The Reckoner", meaning_ur: "حساب لینے والا" },
  { number: 41, name: "ٱلْجَلِيلُ", transliteration: "Al-Jalil", meaning_en: "The Majestic", meaning_ur: "بزرگی والا" },
  { number: 42, name: "ٱلْكَرِيمُ", transliteration: "Al-Karim", meaning_en: "The Generous One", meaning_ur: "کرم کرنے والا" },
  { number: 43, name: "ٱلرَّقِيبُ", transliteration: "Ar-Raqib", meaning_en: "The Watchful", meaning_ur: "نگہبان" },
  { number: 44, name: "ٱلْمُجِيبُ", transliteration: "Al-Mujib", meaning_en: "The Responsive", meaning_ur: "قبول کرنے والا" },
  { number: 45, name: "ٱلْوَٰسِعُ", transliteration: "Al-Wasi", meaning_en: "The All-Pervading", meaning_ur: "وسعت والا" },
  { number: 46, name: "ٱلْحَكِيمُ", transliteration: "Al-Hakim", meaning_en: "The Wise", meaning_ur: "حکمت والا" },
  { number: 47, name: "ٱلْوَدُودُ", transliteration: "Al-Wadud", meaning_en: "The Loving One", meaning_ur: "محبت کرنے والا" },
  { number: 48, name: "ٱلْمَجِيدُ", transliteration: "Al-Majid", meaning_en: "The Glorious One", meaning_ur: "بزرگی والا" },
  { number: 49, name: "ٱلْبَاعِثُ", transliteration: "Al-Ba'ith", meaning_en: "The Resurrector", meaning_ur: "اٹھانے والا" },
  { number: 50, name: "ٱلشَّهِيدُ", transliteration: "Ash-Shahid", meaning_en: "The Witness", meaning_ur: "حاضر و ناظر" },
];

const NamesOfAllah: React.FC = () => {
  const [search, setSearch] = useState('');

  const filteredNames = NAMES_DATA.filter(n => 
    n.transliteration.toLowerCase().includes(search.toLowerCase()) || 
    n.meaning_en.toLowerCase().includes(search.toLowerCase()) ||
    n.meaning_ur.includes(search)
  );

  return (
    <div className="max-w-6xl mx-auto space-y-12 pb-12">
      <header className="text-center py-10">
        <h1 className="text-5xl font-black text-amber-600 mb-4 tracking-tight">Asma-ul-Husna</h1>
        <p className="text-slate-500 max-w-xl mx-auto text-lg leading-relaxed">
          "And to Allah belong the best names, so invoke Him by them." (7:180)
        </p>
        
        <div className="mt-10 relative max-w-md mx-auto">
          <input 
            type="text" 
            placeholder="Search by name or meaning..."
            className="w-full bg-white border border-amber-100 rounded-2xl px-6 py-4 pl-12 focus:outline-none focus:ring-4 focus:ring-amber-500/10 focus:border-amber-500 transition shadow-sm"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredNames.map((item) => (
          <div key={item.number} className="group bg-white p-8 rounded-[2.5rem] border border-amber-50 shadow-sm hover:shadow-2xl hover:border-amber-300 transition-all duration-500 text-center relative overflow-hidden">
            <span className="absolute top-4 left-6 text-xs font-black text-amber-500/30 group-hover:text-amber-500 transition duration-500">#{item.number}</span>
            <div className="mb-6">
              <p className="arabic-text text-5xl text-amber-600 mb-4 group-hover:scale-110 transition duration-500">{item.name}</p>
              <h3 className="text-xl font-black text-slate-800">{item.transliteration}</h3>
            </div>
            <div className="space-y-3 pt-4 border-t border-amber-50">
              <p className="text-slate-600 font-bold text-sm tracking-wide group-hover:text-amber-700 transition uppercase">{item.meaning_en}</p>
              <p className="urdu-text text-xl text-slate-500">{item.meaning_ur}</p>
            </div>
            <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-amber-50 rounded-full opacity-0 group-hover:opacity-100 transition scale-0 group-hover:scale-150 duration-700"></div>
          </div>
        ))}
      </div>
      
      {filteredNames.length === 0 && (
        <div className="text-center py-20 bg-slate-50 rounded-[3rem] border-2 border-dashed border-slate-200">
          <p className="text-slate-400 font-bold">No names match your search.</p>
        </div>
      )}

      <footer className="text-center pt-8">
        <p className="text-slate-400 text-sm font-medium">More names being added. Stay connected.</p>
      </footer>
    </div>
  );
};

export default NamesOfAllah;
