
import { SurahData, PrayerTimes } from '../types';

const QURAN_API_BASE = 'https://api.alquran.cloud/v1';
const PRAYER_API_BASE = 'https://api.aladhan.com/v1';

export const fetchSurah = async (number: number): Promise<SurahData> => {
  // We fetch Arabic, English, and Urdu editions in one go
  const response = await fetch(`${QURAN_API_BASE}/surah/${number}/editions/quran-uthmani,en.sahih,ur.jalandhry`);
  const data = await response.json();
  
  if (data.code !== 200) throw new Error('Failed to fetch surah');
  
  const [arabic, english, urdu] = data.data;
  
  const ayahs = arabic.ayahs.map((ayah: any, index: number) => ({
    number: ayah.number,
    text: ayah.text,
    numberInSurah: ayah.numberInSurah,
    juz: ayah.juz,
    translation_en: english.ayahs[index].text,
    translation_ur: urdu.ayahs[index].text,
  }));

  return {
    ...arabic,
    ayahs
  };
};

export const fetchPrayerTimes = async (latitude: number, longitude: number): Promise<PrayerTimes> => {
  const date = new Date().toISOString().split('T')[0];
  const response = await fetch(`${PRAYER_API_BASE}/timings/${date}?latitude=${latitude}&longitude=${longitude}&method=4`);
  const data = await response.json();
  
  if (data.code !== 200) throw new Error('Failed to fetch prayer times');
  
  return data.data.timings;
};

export const fetchSurahsList = async () => {
  const response = await fetch(`${QURAN_API_BASE}/surah`);
  const data = await response.json();
  return data.data;
};

export const fetchJuz = async (number: number): Promise<any> => {
    const response = await fetch(`${QURAN_API_BASE}/juz/${number}/editions/quran-uthmani,en.sahih,ur.jalandhry`);
    const data = await response.json();
    if (data.code !== 200) throw new Error('Failed to fetch juz');
    
    const [arabic, english, urdu] = data.data;
    const ayahs = arabic.ayahs.map((ayah: any, index: number) => ({
        number: ayah.number,
        text: ayah.text,
        surah: ayah.surah,
        numberInSurah: ayah.numberInSurah,
        translation_en: english.ayahs[index].text,
        translation_ur: urdu.ayahs[index].text,
    }));
    return { number, ayahs };
};
