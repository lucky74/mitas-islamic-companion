export interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export interface QuranAyah {
  number: number;
  text: string;
  numberInSurah: number;
  juz: number;
  page: number;
  surah: {
    number: number;
    name: string;
    englishName: string;
  };
}

export interface QuranEdition {
  identifier: string;
  language: string;
  name: string;
  englishName: string;
  format: string;
  type: string;
}

export async function fetchAllSurahs(): Promise<QuranSurah[]> {
  try {
    const response = await fetch('https://api.alquran.cloud/v1/surah');
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching surahs:', error);
    return [];
  }
}

export async function fetchSurah(surahNumber: number) {
  try {
    const [arabicRes, indonesianRes] = await Promise.all([
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}`),
      fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/id.indonesian`),
    ]);
    
    const arabicData = await arabicRes.json();
    const indonesianData = await indonesianRes.json();
    
    return {
      arabic: arabicData.data,
      indonesian: indonesianData.data,
    };
  } catch (error) {
    console.error('Error fetching surah:', error);
    return null;
  }
}

export async function fetchSurahAudio(surahNumber: number) {
  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error fetching audio:', error);
    return null;
  }
}

export async function searchQuran(query: string, language: string = 'id.indonesian') {
  try {
    const response = await fetch(
      `https://api.alquran.cloud/v1/search/${encodeURIComponent(query)}/all/${language}`
    );
    const data = await response.json();
    return data.data;
  } catch (error) {
    console.error('Error searching Quran:', error);
    return null;
  }
}

export interface PrayerTimesData {
  timings: {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Sunset: string;
    Maghrib: string;
    Isha: string;
  };
  date: {
    readable: string;
    hijri: {
      day: string;
      month: {
        number: number;
        en: string;
        ar: string;
      };
      year: string;
      weekday: {
        en: string;
        ar: string;
      };
    };
    gregorian: {
      day: string;
      month: {
        number: number;
        en: string;
      };
      year: string;
      weekday: {
        en: string;
      };
    };
  };
  meta?: {
    timezone?: string;
  };
}

export interface GeolocationCoords {
  latitude: number;
  longitude: number;
}

function isInIndonesia(latitude: number, longitude: number): boolean {
  return latitude >= -11 && latitude <= 6 && longitude >= 95 && longitude <= 141;
}

function applyKemenagAdjustment(timings: PrayerTimesData['timings'], latitude: number, longitude: number): PrayerTimesData['timings'] {
  if (!isInIndonesia(latitude, longitude)) {
    return timings;
  }

  const adjustTime = (timeStr: string, minutesOffset: number): string => {
    const [hours, minutes] = timeStr.split(':').map(Number);
    const date = new Date();
    date.setHours(hours, minutes + minutesOffset, 0, 0);
    return `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`;
  };

  return {
    ...timings,
    Fajr: adjustTime(timings.Fajr, 2),
    Isha: adjustTime(timings.Isha, 2),
  };
}

export async function fetchPrayerTimes(city: string, country: string = 'Indonesia', method: number = 4) {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timingsByCity?city=${encodeURIComponent(city)}&country=${encodeURIComponent(country)}&method=${method}`
    );
    const data = await response.json();
    return data.data as PrayerTimesData;
  } catch (error) {
    console.error('Error fetching prayer times:', error);
    return null;
  }
}

export async function fetchPrayerTimesByCoordinates(latitude: number, longitude: number, method: number = 4) {
  try {
    const response = await fetch(
      `https://api.aladhan.com/v1/timings?latitude=${latitude}&longitude=${longitude}&method=${method}`
    );
    const data = await response.json();
    
    if (data.code === 200 && data.data) {
      const prayerData = data.data as PrayerTimesData;
      if (isInIndonesia(latitude, longitude)) {
        prayerData.timings = applyKemenagAdjustment(prayerData.timings, latitude, longitude);
      }
      return prayerData;
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching prayer times by coordinates:', error);
    return null;
  }
}

export async function getCurrentLocation(): Promise<GeolocationCoords | null> {
  return new Promise((resolve) => {
    if (!('geolocation' in navigator)) {
      console.error('Geolocation not supported');
      resolve(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (error) => {
        console.error('Error getting location:', error);
        resolve(null);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  });
}

export function getNextPrayer(timings: PrayerTimesData['timings']) {
  const now = new Date();
  const currentTime = now.getHours() * 60 + now.getMinutes();
  
  const prayers = [
    { name: 'Subuh', time: timings.Fajr },
    { name: 'Dzuhur', time: timings.Dhuhr },
    { name: 'Ashar', time: timings.Asr },
    { name: 'Maghrib', time: timings.Maghrib },
    { name: 'Isya', time: timings.Isha },
  ];
  
  for (const prayer of prayers) {
    const [hours, minutes] = prayer.time.split(':').map(Number);
    const prayerTime = hours * 60 + minutes;
    
    if (prayerTime > currentTime) {
      return prayer;
    }
  }
  
  return { name: 'Subuh', time: timings.Fajr };
}

export function getTimeUntilPrayer(prayerTime: string): string {
  const now = new Date();
  const [hours, minutes] = prayerTime.split(':').map(Number);
  
  const prayer = new Date();
  prayer.setHours(hours, minutes, 0, 0);
  
  if (prayer < now) {
    prayer.setDate(prayer.getDate() + 1);
  }
  
  const diff = prayer.getTime() - now.getTime();
  const hoursLeft = Math.floor(diff / (1000 * 60 * 60));
  const minutesLeft = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
  
  return `${hoursLeft}j ${minutesLeft}m`;
}

export interface Mosque {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  distance: number;
  walkingTime: number;
}

function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371e3;
  const φ1 = (lat1 * Math.PI) / 180;
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c;
}

function calculateWalkingTime(distanceInMeters: number): number {
  const walkingSpeedMetersPerMinute = 83.33;
  return Math.ceil(distanceInMeters / walkingSpeedMetersPerMinute);
}

export async function fetchNearbyMosques(
  latitude: number,
  longitude: number,
  radiusMeters: number = 500
): Promise<Mosque[]> {
  try {
    const query = `
      [out:json][timeout:25];
      (
        node["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters},${latitude},${longitude});
        way["amenity"="place_of_worship"]["religion"="muslim"](around:${radiusMeters},${latitude},${longitude});
      );
      out body;
      >;
      out skel qt;
    `;

    const response = await fetch(
      `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`
    );

    if (!response.ok) {
      throw new Error('Failed to fetch mosques from Overpass API');
    }

    const data = await response.json();

    if (!data.elements || data.elements.length === 0) {
      return [];
    }

    const mosques: Mosque[] = [];
    const processedIds = new Set<string>();

    for (const element of data.elements) {
      if (processedIds.has(element.id.toString()) || element.type === 'node' && !element.tags) {
        continue;
      }

      let lat: number;
      let lon: number;

      if (element.type === 'node') {
        lat = element.lat;
        lon = element.lon;
      } else if (element.type === 'way' && element.center) {
        lat = element.center.lat;
        lon = element.center.lon;
      } else {
        continue;
      }

      const rawName = element.tags?.name || element.tags?.['name:id'];
      const name = rawName && rawName.trim().length > 0 ? rawName : 'Masjid tanpa nama';

      const distance = calculateDistance(latitude, longitude, lat, lon);

      if (distance <= radiusMeters) {
        const walkingTime = calculateWalkingTime(distance);

        mosques.push({
          id: element.id.toString(),
          name,
          latitude: lat,
          longitude: lon,
          distance: Math.round(distance),
          walkingTime,
        });

        processedIds.add(element.id.toString());
      }
    }

    mosques.sort((a, b) => a.distance - b.distance);

    return mosques;
  } catch (error) {
    console.error('Error fetching nearby mosques:', error);
    return [];
  }
}
