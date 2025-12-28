
import React, { useState, useEffect } from 'react';

const Tasbeeh: React.FC = () => {
  const [count, setCount] = useState(0);
  const [goal, setGoal] = useState(33);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const savedTotal = localStorage.getItem('tasbeeh_total');
    if (savedTotal) setTotal(parseInt(savedTotal));
  }, []);

  const increment = () => {
    if ('vibrate' in navigator) {
      navigator.vibrate(50);
    }
    
    const newCount = count + 1;
    const newTotal = total + 1;
    
    if (newCount === goal) {
      if ('vibrate' in navigator) {
        navigator.vibrate([100, 50, 100]);
      }
      setCount(0);
    } else {
      setCount(newCount);
    }
    
    setTotal(newTotal);
    localStorage.setItem('tasbeeh_total', newTotal.toString());
  };

  const reset = () => {
    if (confirm('Reset your current session count?')) {
      setCount(0);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-12 flex flex-col items-center py-10">
      <header className="text-center space-y-4">
        <h1 className="text-5xl font-black text-islamic-800 tracking-tight">Digital Tasbeeh</h1>
        <p className="text-slate-500 font-medium">Simplify your daily Dhikr with a modern touch.</p>
      </header>

      <div className="bg-white w-full rounded-[3rem] p-10 md:p-16 shadow-2xl border border-slate-100 flex flex-col items-center relative overflow-hidden">
        <div className="flex justify-between w-full mb-10 text-xs font-black uppercase tracking-widest text-slate-400 px-4">
          <div className="flex flex-col">
            <span>Goal</span>
            <select 
              value={goal} 
              onChange={(e) => {setGoal(parseInt(e.target.value)); setCount(0);}}
              className="bg-slate-50 border-none text-islamic-800 font-black focus:ring-0 cursor-pointer p-0 mt-1"
            >
              <option value={33}>33</option>
              <option value={100}>100</option>
              <option value={1000}>Infinity</option>
            </select>
          </div>
          <div className="flex flex-col text-right">
            <span>Life Total</span>
            <span className="text-islamic-700 font-black mt-1">{total}</span>
          </div>
        </div>

        {/* Counter Display */}
        <div className="relative mb-16">
          <div className="w-64 h-64 md:w-80 md:h-80 rounded-full border-[16px] border-emerald-50 flex items-center justify-center relative shadow-inner">
            <div className="text-center">
               <span className="text-8xl md:text-9xl font-black text-islamic-800 leading-none">{count}</span>
               <div className="text-slate-300 font-bold mt-4 uppercase tracking-[0.3em] text-[10px]">RECITATIONS</div>
            </div>
            {/* Progress Ring Overlay (Simplified visual) */}
            <div 
              className="absolute inset-0 rounded-full border-[16px] border-emerald-500 border-t-transparent border-r-transparent transition-all duration-300" 
              style={{ transform: `rotate(${(count / goal) * 360}deg)` }}
            ></div>
          </div>
        </div>

        {/* Main Interaction Button */}
        <button 
          onClick={increment}
          className="w-32 h-32 md:w-40 md:h-40 bg-islamic-800 text-white rounded-full shadow-[0_20px_50px_rgba(6,95,70,0.3)] hover:shadow-[0_10px_30px_rgba(6,95,70,0.4)] active:scale-90 active:bg-islamic-900 transition-all duration-300 flex items-center justify-center group mb-12"
        >
          <div className="bg-white/10 w-24 h-24 md:w-32 md:h-32 rounded-full flex items-center justify-center group-active:scale-110 transition">
             <span className="text-4xl">👆</span>
          </div>
        </button>

        <div className="flex gap-6 w-full max-w-xs">
          <button 
            onClick={reset}
            className="flex-1 bg-slate-100 text-slate-600 font-bold py-4 rounded-2xl hover:bg-red-50 hover:text-red-600 transition shadow-sm"
          >
            Reset Count
          </button>
        </div>

        {/* Floating Beads Decor */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 opacity-5 pointer-events-none">
           <div className="space-y-4">
              {[1,2,3,4,5].map(i => <div key={i} className="w-8 h-8 rounded-full bg-islamic-800 ml-4"></div>)}
           </div>
        </div>
      </div>
      
      <div className="text-center bg-emerald-50 p-8 rounded-[2rem] border border-emerald-100 w-full max-w-lg">
        <p className="text-islamic-800 font-bold italic mb-2">"Remember Me; I will remember you."</p>
        <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">Surah Al-Baqarah 2:152</p>
      </div>
    </div>
  );
};

export default Tasbeeh;
