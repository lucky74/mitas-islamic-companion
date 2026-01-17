import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Navigation, Clock, Footprints } from 'lucide-react';
import {
  fetchPrayerTimes,
  fetchPrayerTimesByCoordinates,
  getCurrentLocation,
  getNextPrayer,
  fetchNearbyMosques,
  type PrayerTimesData,
  type Mosque,
} from '@/lib/api';
import { useAppStore } from '@/lib/store';
import { useI18n } from '@/lib/i18n';
import { Skeleton } from '@/components/ui/skeleton';
import { QiblaCompass } from '@/components/QiblaCompass';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { toast } from 'sonner';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { LanguageSelector } from '@/components/LanguageSelector';
import { PrayerSourceSelector } from '@/components/PrayerSourceSelector';

const INDONESIAN_CITIES = [
  'Jakarta',
  'Surabaya',
  'Bandung',
  'Medan',
  'Semarang',
  'Makassar',
  'Palembang',
  'Tangerang',
  'Depok',
  'Bekasi',
  'Yogyakarta',
  'Malang',
  'Bogor',
];

export function Prayer() {
  const {
    selectedCity,
    setSelectedCity,
    geolocation,
    setGeolocation,
    useGeolocation,
    setUseGeolocation,
    prayerMethod,
  } = useAppStore();
  const { t } = useI18n();
  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationName, setLocationName] = useState<string>('');
  const [nearbyMosques, setNearbyMosques] = useState<Mosque[]>([]);
  const [mosquesLoading, setMosquesLoading] = useState(false);

  const loadNearbyMosques = async (latitude: number, longitude: number) => {
    try {
      setMosquesLoading(true);
      const mosques = await fetchNearbyMosques(latitude, longitude, 500);
      setNearbyMosques(mosques);
      if (mosques.length === 0) {
        console.log('No mosques found within 500m radius');
      }
    } catch (error) {
      console.error('Error loading nearby mosques:', error);
      toast.error('Gagal memuat data masjid terdekat');
    } finally {
      setMosquesLoading(false);
    }
  };

  useEffect(() => {
    const loadPrayerTimes = async () => {
      try {
        setLoading(true);
        
        if (useGeolocation && geolocation) {
          const isRecent = Date.now() - geolocation.timestamp < 3600000;
          if (isRecent) {
            const data = await fetchPrayerTimesByCoordinates(
              geolocation.latitude,
              geolocation.longitude,
              prayerMethod
            );
            if (data) {
              setPrayerData(data);
              setLocationName(`${geolocation.latitude.toFixed(4)}, ${geolocation.longitude.toFixed(4)}`);
              // Load nearby mosques when using geolocation
              await loadNearbyMosques(geolocation.latitude, geolocation.longitude);
            } else {
              toast.error(t.messages.prayerTimesFailed);
              const cityData = await fetchPrayerTimes(selectedCity, 'Indonesia', prayerMethod);
              if (cityData) {
                setPrayerData(cityData);
                setLocationName(selectedCity);
              }
            }
            setLoading(false);
            return;
          }
        }
        
        if (useGeolocation) {
          const coords = await getCurrentLocation();
          if (coords) {
            setGeolocation(coords);
            const data = await fetchPrayerTimesByCoordinates(coords.latitude, coords.longitude, prayerMethod);
            if (data) {
              setPrayerData(data);
              setLocationName(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
              // Load nearby mosques when using geolocation
              await loadNearbyMosques(coords.latitude, coords.longitude);
            } else {
              toast.error(t.messages.prayerTimesFailed);
              const cityData = await fetchPrayerTimes(selectedCity, 'Indonesia', prayerMethod);
              if (cityData) {
                setPrayerData(cityData);
                setLocationName(selectedCity);
              }
            }
          } else {
            toast.error(t.messages.locationDenied);
            setUseGeolocation(false);
            const data = await fetchPrayerTimes(selectedCity, 'Indonesia', prayerMethod);
            if (data) {
              setPrayerData(data);
              setLocationName(selectedCity);
            }
          }
        } else {
          const data = await fetchPrayerTimes(selectedCity, 'Indonesia', prayerMethod);
          if (data) {
            setPrayerData(data);
            setLocationName(selectedCity);
          } else {
            toast.error(t.messages.prayerTimesFailed);
          }
          // Clear mosques when not using geolocation
          setNearbyMosques([]);
        }
      } catch (error) {
        console.error('Error loading prayer times:', error);
        toast.error(t.messages.prayerTimesFailed);
      } finally {
        setLoading(false);
      }
    };

    loadPrayerTimes();
  }, [selectedCity, useGeolocation, geolocation, setGeolocation, setUseGeolocation, prayerMethod, t]);

  const handleToggleGeolocation = async (enabled: boolean) => {
    try {
      if (enabled) {
        setLocationLoading(true);
        const coords = await getCurrentLocation();
        
        if (coords) {
          setGeolocation(coords);
          setUseGeolocation(true);
          toast.success(t.messages.locationEnabled);
          
          const data = await fetchPrayerTimesByCoordinates(coords.latitude, coords.longitude, prayerMethod);
          if (data) {
            setPrayerData(data);
            setLocationName(`${coords.latitude.toFixed(4)}, ${coords.longitude.toFixed(4)}`);
            // Load nearby mosques when enabling geolocation
            await loadNearbyMosques(coords.latitude, coords.longitude);
          } else {
            toast.error(t.messages.prayerTimesFailed);
          }
        } else {
          toast.error(t.messages.locationFailed);
        }
        
        setLocationLoading(false);
      } else {
        setUseGeolocation(false);
        setLocationName(selectedCity);
        setNearbyMosques([]);
        toast.info(t.messages.usingSelectedCity);
      }
    } catch (error) {
      console.error('Error toggling geolocation:', error);
      toast.error(t.common.error);
      setLocationLoading(false);
    }
  };

  const nextPrayer = prayerData ? getNextPrayer(prayerData.timings) : null;

  const prayerTimes = prayerData
    ? [
        { name: t.prayer.fajr, time: prayerData.timings.Fajr, icon: '🌅', isNext: nextPrayer?.name === t.prayer.fajr },
        { name: t.prayer.sunrise, time: prayerData.timings.Sunrise, icon: '☀️', isNext: false },
        { name: t.prayer.dhuhr, time: prayerData.timings.Dhuhr, icon: '🌤️', isNext: nextPrayer?.name === t.prayer.dhuhr },
        { name: t.prayer.asr, time: prayerData.timings.Asr, icon: '🌥️', isNext: nextPrayer?.name === t.prayer.asr },
        { name: t.prayer.maghrib, time: prayerData.timings.Maghrib, icon: '🌆', isNext: nextPrayer?.name === t.prayer.maghrib },
        { name: t.prayer.isha, time: prayerData.timings.Isha, icon: '🌙', isNext: nextPrayer?.name === t.prayer.isha },
      ]
    : [];

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-background to-amber-50/30 dark:from-emerald-950/20 dark:via-background dark:to-amber-950/10">
      {/* Header with gradient and controls */}
      <header className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 px-6 pb-8 pt-6 text-white shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/generated/islamic-pattern-bg.dim_800x600.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
        
        <div className="relative">
          {/* Top bar with title and controls */}
          <div className="mb-6 flex items-center justify-between">
            <h1 className="text-2xl font-bold">{t.prayer.title}</h1>
            <div className="flex items-center gap-2">
              <LanguageSelector />
              <PrayerSourceSelector />
            </div>
          </div>

          {/* GPS Toggle */}
          <div className="mb-4 flex items-center justify-between rounded-lg bg-white/10 p-3 backdrop-blur-sm">
            <Label htmlFor="use-gps" className="flex-1 text-sm font-medium">
              {t.prayer.useGPS}
            </Label>
            <Switch
              id="use-gps"
              checked={useGeolocation}
              onCheckedChange={handleToggleGeolocation}
              disabled={locationLoading}
              className="data-[state=checked]:bg-amber-500"
            />
          </div>

          {/* City Selector or GPS Coordinates */}
          {!useGeolocation ? (
            <div>
              <label className="mb-2 block text-sm font-medium">{t.prayer.selectCity}</label>
              <Select value={selectedCity} onValueChange={setSelectedCity}>
                <SelectTrigger className="border-white/20 bg-white/10 text-white hover:bg-white/20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="border-emerald-700 bg-emerald-900 dark:border-slate-700 dark:bg-slate-900">
                  {INDONESIAN_CITIES.map((city) => (
                    <SelectItem 
                      key={city} 
                      value={city}
                      className="text-white hover:bg-emerald-800 focus:bg-emerald-800 dark:text-gray-100 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
                    >
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4 flex-shrink-0" />
                        <span>{city}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : geolocation ? (
            <div className="rounded-lg bg-white/10 p-3 text-center backdrop-blur-sm">
              <div className="flex items-center justify-center gap-2">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <p className="text-sm">
                  {locationName}
                </p>
              </div>
            </div>
          ) : null}

          {/* Hijri Date */}
          {prayerData && (
            <div className="mt-4 rounded-lg bg-amber-500/20 p-3 text-center backdrop-blur-sm">
              <p className="mb-1 text-xs font-medium opacity-90">{t.prayer.hijriDate}</p>
              <p className="text-base font-semibold">
                {prayerData.date.hijri.day} {prayerData.date.hijri.month.en} {prayerData.date.hijri.year}
              </p>
            </div>
          )}
        </div>
      </header>

      {/* Prayer Times List */}
      <div className="px-6 py-6">
        <Card className="border-emerald-200 bg-emerald-900/95 shadow-lg dark:border-emerald-800 dark:bg-emerald-950/95">
          <CardHeader className="border-b border-emerald-700 dark:border-emerald-900">
            <CardTitle className="text-white dark:text-emerald-100">{t.prayer.todaySchedule}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 p-4">
            {loading ? (
              <>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-center justify-between rounded-lg bg-accent/50 p-4">
                    <Skeleton className="h-6 w-20" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                ))}
              </>
            ) : (
              prayerTimes.map((prayer, index) => (
                <div
                  key={index}
                  className={`flex items-center justify-between gap-3 rounded-lg p-4 transition-all ${
                    prayer.isNext
                      ? 'bg-gradient-to-r from-amber-500/30 to-amber-600/30 ring-2 ring-amber-400'
                      : 'bg-emerald-800/50 hover:bg-emerald-700/50'
                  }`}
                >
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <span className="flex-shrink-0 text-2xl">{prayer.icon}</span>
                    <div className="min-w-0">
                      <span className={`block truncate font-semibold text-white ${prayer.isNext ? 'text-amber-100' : ''}`}>
                        {prayer.name}
                      </span>
                      {prayer.isNext && (
                        <div className="flex items-center gap-1 text-xs text-amber-200">
                          <Clock className="h-3 w-3 flex-shrink-0" />
                          <span>{t.prayer.next}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <span className={`flex-shrink-0 text-lg font-bold tabular-nums text-white ${
                    prayer.isNext ? 'text-amber-100' : ''
                  }`}>
                    {prayer.time}
                  </span>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        {/* Nearby Mosques Section - Only show when using geolocation */}
        {useGeolocation && geolocation && (
          <Card className="mt-6 border-emerald-200 bg-emerald-900/95 shadow-lg dark:border-emerald-800 dark:bg-emerald-950/95">
            <CardHeader className="border-b border-emerald-700 dark:border-emerald-900">
              <CardTitle className="flex items-center gap-2 text-white dark:text-emerald-100">
                <MapPin className="h-5 w-5" />
                {t.prayer.nearbyMosques}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 p-4">
              {mosquesLoading ? (
                <>
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="flex items-center justify-between rounded-lg bg-emerald-800/50 p-4">
                      <Skeleton className="h-6 w-32 bg-emerald-700/50" />
                      <Skeleton className="h-6 w-20 bg-emerald-700/50" />
                    </div>
                  ))}
                </>
              ) : nearbyMosques.length > 0 ? (
                nearbyMosques.map((mosque) => (
                  <div
                    key={mosque.id}
                    className="flex items-center justify-between gap-3 rounded-lg bg-emerald-800/50 p-4 transition-all hover:bg-emerald-700/50"
                  >
                    <div className="flex min-w-0 flex-1 items-center gap-3">
                      <span className="flex-shrink-0 text-2xl">🕌</span>
                      <div className="min-w-0">
                        <span className="block truncate font-semibold text-white">
                          {mosque.name}
                        </span>
                        <div className="flex items-center gap-3 text-xs text-emerald-200">
                          <span>{mosque.distance}m</span>
                          <div className="flex items-center gap-1">
                            <Footprints className="h-3 w-3" />
                            <span>~{mosque.walkingTime} {t.prayer.minutes}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="py-6 text-center text-emerald-200">
                  <p>{t.prayer.noMosquesFound}</p>
                </div>
              )}
            </CardContent>
          </Card>
        )}

        {/* Qibla Direction Button */}
        <div className="mt-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:from-emerald-700 hover:to-teal-700" size="lg">
                <Navigation className="mr-2 h-5 w-5" />
                {t.prayer.qiblaDirection}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md border-emerald-200 bg-white dark:border-emerald-800 dark:bg-slate-900">
              <DialogHeader>
                <DialogTitle className="text-emerald-900 dark:text-emerald-100">{t.prayer.qiblaDirection}</DialogTitle>
              </DialogHeader>
              <QiblaCompass />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

