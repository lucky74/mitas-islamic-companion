import { useState, useEffect } from 'react';
import { MapPin, Navigation, Clock, AlertCircle, Loader2 } from 'lucide-react';
import { useI18n } from '@/lib/i18n';
import { useNearbyMosques } from '@/hooks/useQueries';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { LanguageSelector } from '@/components/LanguageSelector';

export function Masjid() {
  const { t } = useI18n();
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const { data: mosques, isLoading: isLoadingMosques, error: mosquesError } = useNearbyMosques(
    location?.latitude ?? null,
    location?.longitude ?? null,
    1000
  );

  useEffect(() => {
    requestLocation();
  }, []);

  const requestLocation = () => {
    if (!('geolocation' in navigator)) {
      setLocationError(t.masjid.locationError);
      return;
    }

    setIsLoadingLocation(true);
    setLocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
        setIsLoadingLocation(false);
      },
      (error) => {
        if (error.code === error.PERMISSION_DENIED) {
          setLocationError(t.masjid.locationDenied);
        } else {
          setLocationError(t.masjid.locationError);
        }
        setIsLoadingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000,
      }
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-slate-950 to-emerald-950">
      <header className="sticky top-0 z-40 border-b border-amber-500/30 bg-gradient-to-r from-black/95 via-slate-950/95 to-emerald-950/95 backdrop-blur supports-[backdrop-filter]:bg-black/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-emerald-600 shadow-lg">
              <MapPin className="h-5 w-5 text-black" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-amber-300">{t.masjid.title}</h1>
              <p className="text-xs text-emerald-200">{t.masjid.subtitle}</p>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24">
        {isLoadingLocation && (
          <Card className="border-amber-500/40 bg-gradient-to-br from-emerald-950/70 via-slate-950/80 to-black/90 backdrop-blur-sm">
            <CardContent className="flex items-center justify-center gap-3 py-8">
              <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
              <p className="text-amber-100">{t.masjid.searchingLocation}</p>
            </CardContent>
          </Card>
        )}

        {locationError && !isLoadingLocation && (
          <Alert className="border-red-700/60 bg-gradient-to-r from-red-950/80 via-red-900/70 to-amber-900/60 backdrop-blur-sm">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            <AlertDescription className="text-amber-100">
              {locationError}
              <Button
                onClick={requestLocation}
                variant="outline"
                size="sm"
                className="ml-4 border-amber-500 bg-black/40 text-amber-100 hover:bg-amber-800/40"
              >
                <Navigation className="mr-2 h-4 w-4" />
                {t.masjid.enableLocation}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {location && isLoadingMosques && (
          <Card className="mt-4 border-amber-500/40 bg-gradient-to-br from-emerald-950/70 via-slate-950/80 to-black/90 backdrop-blur-sm">
            <CardContent className="flex items-center justify-center gap-3 py-8">
              <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
              <p className="text-amber-100">{t.masjid.fetchingMosques}</p>
            </CardContent>
          </Card>
        )}

        {mosquesError && location && !isLoadingMosques && (
          <Alert className="mt-4 border-amber-700/60 bg-gradient-to-r from-amber-950/80 via-amber-900/70 to-emerald-900/60 backdrop-blur-sm">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            <AlertDescription className="text-amber-100">
              {t.masjid.apiError}
            </AlertDescription>
          </Alert>
        )}

        {location && !isLoadingMosques && mosques && mosques.length > 0 && (
          <div className="mt-4 space-y-4">
            {mosques.map((mosque) => (
              <Card
                key={mosque.id}
                className="border-amber-500/30 bg-gradient-to-br from-black/90 via-slate-950/90 to-emerald-950/90 backdrop-blur-sm transition-all hover:border-amber-400/60 hover:shadow-xl"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-start gap-3 text-lg">
                    <div className="mt-1 flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 to-emerald-600">
                      <MapPin className="h-4 w-4 flex-shrink-0 text-black" />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const url = `https://www.google.com/maps/dir/?api=1&destination=${mosque.latitude},${mosque.longitude}`;
                        window.open(url, '_blank');
                      }}
                      className="text-left text-amber-100 underline decoration-amber-400/70 underline-offset-4 hover:text-amber-200"
                    >
                      {mosque.name}
                    </button>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <div className="flex items-center gap-2 text-sm text-emerald-200">
                    <Navigation className="h-4 w-4 text-amber-400" />
                    <span>
                      {t.masjid.distance}:{' '}
                      <span className="font-semibold text-amber-300">{mosque.distance}m</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-200">
                    <Clock className="h-4 w-4 text-amber-400" />
                    <span>
                      {t.masjid.walkingTime}:{' '}
                      <span className="font-semibold text-amber-300">
                        {mosque.walkingTime} {t.masjid.minutes}
                      </span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {location && !isLoadingMosques && mosques && mosques.length === 0 && !mosquesError && (
          <Card className="mt-4 border-amber-500/40 bg-gradient-to-br from-black/90 via-slate-950/90 to-emerald-950/90 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <MapPin className="h-12 w-12 text-amber-500" />
              <p className="text-amber-100">{t.masjid.noMosquesFound}</p>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="fixed bottom-16 left-0 right-0 border-t border-amber-500/30 bg-black/80 py-3 text-center backdrop-blur-sm">
        <p className="text-xs text-amber-200">{t.about.copyright}</p>
      </footer>
    </div>
  );
}
