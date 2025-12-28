
export interface SurahMetadata {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface Ayah {
  number: number;
  text: string;
  translation_en?: string;
  translation_ur?: string;
  numberInSurah: number;
  juz: number;
  surahName?: string;
}

export interface SurahData {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  revelationType: string;
  numberOfAyahs: number;
  ayahs: Ayah[];
}

export interface PrayerTimes {
  Fajr: string;
  Dhuhr: string;
  Asr: string;
  Maghrib: string;
  Isha: string;
  Sunrise: string;
}

export interface Dua {
  id: string;
  title: string;
  arabic: string;
  english: string;
  urdu: string;
  category: string;
}

export interface AllahName {
  number: number;
  name: string;
  transliteration: string;
  meaning_en: string;
  meaning_ur: string;
}

export interface Bookmark {
  surahNumber: number;
  ayahNumber: number;
  surahName: string;
  text: string;
}
