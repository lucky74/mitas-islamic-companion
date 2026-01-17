import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from '@/hooks/useActor';
import type { Bookmark, Doa, UserPreferences, CityData, DoaType } from '@/backend';
import { fetchNearbyMosques, type Mosque } from '@/lib/api';

export function usePrayerTimes(cityId: string) {
  const { actor, isFetching } = useActor();

  return useQuery<CityData>({
    queryKey: ['prayerTimes', cityId],
    queryFn: async () => {
      if (!actor) throw new Error('Actor not initialized');
      return actor.getPrayerTimes(cityId);
    },
    enabled: !!actor && !isFetching && !!cityId,
    staleTime: 1000 * 60 * 60,
  });
}

export function useCachedPrayerTimes() {
  const { actor, isFetching } = useActor();

  return useQuery<CityData[]>({
    queryKey: ['cachedPrayerTimes'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getCachedPrayerTimes();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useBookmarks() {
  const { actor, isFetching } = useActor();

  return useQuery<Bookmark[] | null>({
    queryKey: ['bookmarks'],
    queryFn: async () => {
      if (!actor) return null;
      return actor.getBookmarkedVerses();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useAddBookmark() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ surah, ayah, description }: { surah: number; ayah: number; description: string }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.addBookmark(BigInt(surah), BigInt(ayah), description);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}

export function useRemoveBookmark() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ surah, ayah }: { surah: number; ayah: number }) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.removeBookmark(BigInt(surah), BigInt(ayah));
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookmarks'] });
    },
  });
}

export function useAllDoa() {
  const { actor, isFetching } = useActor();

  return useQuery<Doa[]>({
    queryKey: ['doa'],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDoa();
    },
    enabled: !!actor && !isFetching,
  });
}

export function useDoaByType(doaType: DoaType) {
  const { actor, isFetching } = useActor();

  return useQuery<Doa[]>({
    queryKey: ['doa', doaType],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getAllDoaByType(doaType);
    },
    enabled: !!actor && !isFetching,
    staleTime: 1000 * 60 * 60,
  });
}

export function usePreferences() {
  const { actor, isFetching } = useActor();

  return useQuery<UserPreferences | null>({
    queryKey: ['preferences'],
    queryFn: async () => {
      if (!actor) return null;
      try {
        return await actor.getPreferences();
      } catch {
        return null;
      }
    },
    enabled: !!actor && !isFetching,
  });
}

export function useSavePreferences() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (prefs: UserPreferences) => {
      if (!actor) throw new Error('Actor not initialized');
      await actor.savePreferences(prefs);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['preferences'] });
    },
  });
}

export function useNearbyMosques(latitude: number | null, longitude: number | null, radiusMeters: number = 500) {
  return useQuery<Mosque[]>({
    queryKey: ['nearbyMosques', latitude, longitude, radiusMeters],
    queryFn: async () => {
      if (latitude === null || longitude === null) {
        return [];
      }
      return fetchNearbyMosques(latitude, longitude, radiusMeters);
    },
    enabled: latitude !== null && longitude !== null,
    staleTime: 1000 * 60 * 10,
    retry: 2,
  });
}

