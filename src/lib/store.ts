import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type PageType = 'home' | 'prayer' | 'quran' | 'doa' | 'tasbih' | 'about' | 'masjid';
export type Language = 'id' | 'en' | 'zh' | 'ar';

interface TasbihCounter {
  id: string;
  name: string;
  count: number;
  target: number;
}

interface GeolocationData {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export interface PrayerMethod {
  id: number;
  name: string;
  description: string;
}

export const PRAYER_METHODS: PrayerMethod[] = [
  { id: 3, name: 'Muslim World League', description: 'Standar internasional' },
  { id: 4, name: 'Umm al-Qura, Makkah', description: 'Arab Saudi (default)' },
  { id: 11, name: 'Kemenag RI', description: 'Kementerian Agama Indonesia' },
  { id: 2, name: 'ISNA', description: 'Islamic Society of North America' },
  { id: 1, name: 'University of Islamic Sciences, Karachi', description: 'Pakistan' },
  { id: 5, name: 'Egyptian General Authority', description: 'Mesir' },
  { id: 7, name: 'Institute of Geophysics, Tehran', description: 'Iran' },
];

interface AudioState {
  isPlaying: boolean;
  isInitialized: boolean;
  currentAyahIndex: number;
  totalAyahs: number;
  surahName: string;
  audioUrls: string[];
}

interface AppState {
  currentPage: PageType;
  setCurrentPage: (page: PageType) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  selectedCity: string;
  setSelectedCity: (city: string) => void;
  prayerMethod: number;
  setPrayerMethod: (method: number) => void;
  geolocation: GeolocationData | null;
  setGeolocation: (coords: { latitude: number; longitude: number }) => void;
  useGeolocation: boolean;
  setUseGeolocation: (use: boolean) => void;
  currentSurah: number;
  currentAyah: number;
  setCurrentVerse: (surah: number, ayah: number) => void;
  tasbihCounters: TasbihCounter[];
  addTasbihCounter: (counter: TasbihCounter) => void;
  updateTasbihCount: (id: string, count: number) => void;
  resetTasbihCounter: (id: string) => void;
  removeTasbihCounter: (id: string) => void;
  audioState: AudioState;
  setAudioState: (state: Partial<AudioState>) => void;
  toggleAudio: () => void;
  resetAudio: () => void;
}

const initialAudioState: AudioState = {
  isPlaying: false,
  isInitialized: false,
  currentAyahIndex: 0,
  totalAyahs: 0,
  surahName: '',
  audioUrls: [],
};

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      currentPage: 'home',
      setCurrentPage: (page) => set({ currentPage: page }),
      language: 'id',
      setLanguage: (lang) => set({ language: lang }),
      selectedCity: 'Jakarta',
      setSelectedCity: (city) => set({ selectedCity: city }),
      prayerMethod: 4,
      setPrayerMethod: (method) => set({ prayerMethod: method }),
      geolocation: null,
      setGeolocation: (coords) =>
        set({
          geolocation: {
            latitude: coords.latitude,
            longitude: coords.longitude,
            timestamp: Date.now(),
          },
        }),
      useGeolocation: false,
      setUseGeolocation: (use) => set({ useGeolocation: use }),
      currentSurah: 1,
      currentAyah: 1,
      setCurrentVerse: (surah, ayah) => set({ currentSurah: surah, currentAyah: ayah }),
      tasbihCounters: [
        { id: '1', name: 'Subhanallah', count: 0, target: 33 },
        { id: '2', name: 'Alhamdulillah', count: 0, target: 33 },
        { id: '3', name: 'Allahu Akbar', count: 0, target: 34 },
      ],
      addTasbihCounter: (counter) =>
        set((state) => ({ tasbihCounters: [...state.tasbihCounters, counter] })),
      updateTasbihCount: (id, count) =>
        set((state) => ({
          tasbihCounters: state.tasbihCounters.map((c) =>
            c.id === id ? { ...c, count } : c
          ),
        })),
      resetTasbihCounter: (id) =>
        set((state) => ({
          tasbihCounters: state.tasbihCounters.map((c) =>
            c.id === id ? { ...c, count: 0 } : c
          ),
        })),
      removeTasbihCounter: (id) =>
        set((state) => ({
          tasbihCounters: state.tasbihCounters.filter((c) => c.id !== id),
        })),
      audioState: initialAudioState,
      setAudioState: (newState) =>
        set((state) => ({
          audioState: { ...state.audioState, ...newState },
        })),
      toggleAudio: () =>
        set((state) => ({
          audioState: { ...state.audioState, isPlaying: !state.audioState.isPlaying },
        })),
      resetAudio: () =>
        set({ audioState: initialAudioState }),
    }),
    {
      name: 'mitas-storage',
      partialize: (state) => ({
        currentPage: state.currentPage,
        language: state.language,
        selectedCity: state.selectedCity,
        prayerMethod: state.prayerMethod,
        geolocation: state.geolocation,
        useGeolocation: state.useGeolocation,
        currentSurah: state.currentSurah,
        currentAyah: state.currentAyah,
        tasbihCounters: state.tasbihCounters,
      }),
    }
  )
);

