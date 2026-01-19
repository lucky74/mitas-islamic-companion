import type { Bookmark, Doa, UserPreferences, CityData, DoaType } from '@/backend';

type BackendActor = {
  getPrayerTimes(cityId: string): Promise<CityData>;
  getCachedPrayerTimes(): Promise<CityData[]>;
  getBookmarkedVerses(): Promise<Bookmark[]>;
  addBookmark(surah: bigint, ayah: bigint, description: string): Promise<void>;
  removeBookmark(surah: bigint, ayah: bigint): Promise<void>;
  getAllDoa(): Promise<Doa[]>;
  getAllDoaByType(doaType: DoaType): Promise<Doa[]>;
  getPreferences(): Promise<UserPreferences | null>;
  savePreferences(prefs: UserPreferences): Promise<void>;
};

type UseActorResult = {
  actor: BackendActor | null;
  isFetching: boolean;
  error: unknown;
};

export function useActor(): UseActorResult {
  return {
    actor: null,
    isFetching: false,
    error: null,
  };
}
