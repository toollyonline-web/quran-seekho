
import React, { useState, useEffect } from 'react';
import { fetchPrayerTimes } from '../services/api';
import { PrayerTimes } from '../types';

const PrayerWidget: React.FC = () => {
  const [times, setTimes] = useState<PrayerTimes | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getTimes = async () => {
      try {
        navigator.geolocation.getCurrentPosition(
          async (pos) => {
            const data = await fetchPrayerTimes(pos.coords.latitude, pos.coords.longitude);
            setTimes(data);
            setLoading(false);
          },
          async () => {
            // Default to Makkah if permission denied
            const data = await fetchPrayerTimes(21.4225, 39.8262);
            setTimes(data);
            setLoading(false);
            setError("Using Makkah time (location access denied)");
          }
        );
      } catch (err) {
        setError("Could not load prayer times");
        setLoading(false);
      }
    };
    getTimes();
  }, []);

  if (loading) return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100 animate-pulse">
      <div className="h-6 bg-slate-200 w-1/3 mb-4 rounded"></div>
      <div className="grid grid-cols-3 gap-2">
        {[1,2,3,4,5].map(i => <div key={i} className="h-12 bg-slate-100 rounded"></div>)}
      </div>
    </div>
  );

  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-emerald-100">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-islamic-800 flex items-center">
          <span className="mr-2">🕌</span> Prayer Times
        </h3>
        {error && <span className="text-xs text-slate-400">{error}</span>}
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
        {times && Object.entries(times).filter(([k]) => ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha', 'Sunrise'].includes(k)).map(([name, time]) => (
          <div key={name} className="flex flex-col items-center p-2 rounded-xl bg-emerald-50 border border-emerald-100">
            <span className="text-xs text-islamic-700 font-medium">{name}</span>
            <span className="text-sm font-bold text-islamic-900">{time.split(' ')[0]}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PrayerWidget;
