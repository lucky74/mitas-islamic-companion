export type DoaType = 'MORNING' | 'EVENING' | 'DAILY';

export interface Bookmark {
  surah: bigint | number | string;
  ayah: bigint | number | string;
  description: string;
}

export interface Doa {
  title: string;
  textArabic: string;
  latinTransliteration: string;
  translation: string;
  notes: string;
  doaType?: DoaType | null;
}

export interface CityData {
  id: string;
  name: string;
  country: string;
}

export interface UserPreferences {
  language: string;
  selectedCity: string;
  prayerMethod: number;
}

