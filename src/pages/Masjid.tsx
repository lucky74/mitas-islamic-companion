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
    500
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
    <div className="min-h-screen bg-gradient-to-b from-emerald-950 via-emerald-900 to-slate-950">
      <header className="sticky top-0 z-40 border-b border-emerald-800/30 bg-gradient-to-r from-emerald-900/95 to-teal-900/95 backdrop-blur supports-[backdrop-filter]:bg-emerald-900/80">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-emerald-700/30 backdrop-blur-sm">
              <MapPin className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">{t.masjid.title}</h1>
              <p className="text-xs text-emerald-200">{t.masjid.subtitle}</p>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 pb-24">
        {isLoadingLocation && (
          <Card className="border-emerald-800/50 bg-emerald-900/50 backdrop-blur-sm">
            <CardContent className="flex items-center justify-center gap-3 py-8">
              <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
              <p className="text-emerald-100">{t.masjid.searchingLocation}</p>
            </CardContent>
          </Card>
        )}

        {locationError && !isLoadingLocation && (
          <Alert className="border-red-800/50 bg-red-900/30 backdrop-blur-sm">
            <AlertCircle className="h-5 w-5 text-red-400" />
            <AlertDescription className="text-red-100">
              {locationError}
              <Button
                onClick={requestLocation}
                variant="outline"
                size="sm"
                className="ml-4 border-red-700 bg-red-800/50 text-red-100 hover:bg-red-700/50"
              >
                <Navigation className="mr-2 h-4 w-4" />
                {t.masjid.enableLocation}
              </Button>
            </AlertDescription>
          </Alert>
        )}

        {location && isLoadingMosques && (
          <Card className="mt-4 border-emerald-800/50 bg-emerald-900/50 backdrop-blur-sm">
            <CardContent className="flex items-center justify-center gap-3 py-8">
              <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
              <p className="text-emerald-100">{t.masjid.fetchingMosques}</p>
            </CardContent>
          </Card>
        )}

        {mosquesError && location && !isLoadingMosques && (
          <Alert className="mt-4 border-amber-800/50 bg-amber-900/30 backdrop-blur-sm">
            <AlertCircle className="h-5 w-5 text-amber-400" />
            <AlertDescription className="text-amber-100">
              {t.masjid.apiError}
            </AlertDescription>
          </Alert>
        )}

        {location && !isLoadingMosques && mosques && mosques.length > 0 && (
          <div className="mt-4 space-y-3">
            {mosques.map((mosque) => (
              <Card
                key={mosque.id}
                className="border-emerald-800/50 bg-emerald-900/50 backdrop-blur-sm transition-all hover:bg-emerald-800/50"
              >
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-start gap-3 text-lg">
                    <MapPin className="mt-1 h-5 w-5 flex-shrink-0 text-amber-400" />
                    <span className="text-emerald-50">{mosque.name}</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-2 pt-0">
                  <div className="flex items-center gap-2 text-sm text-emerald-200">
                    <Navigation className="h-4 w-4 text-emerald-400" />
                    <span>
                      {t.masjid.distance}: <span className="font-semibold text-amber-300">{mosque.distance}m</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-emerald-200">
                    <Clock className="h-4 w-4 text-emerald-400" />
                    <span>
                      {t.masjid.walkingTime}: <span className="font-semibold text-amber-300">{mosque.walkingTime} {t.masjid.minutes}</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {location && !isLoadingMosques && mosques && mosques.length === 0 && !mosquesError && (
          <Card className="mt-4 border-emerald-800/50 bg-emerald-900/50 backdrop-blur-sm">
            <CardContent className="flex flex-col items-center justify-center gap-3 py-8 text-center">
              <MapPin className="h-12 w-12 text-emerald-600" />
              <p className="text-emerald-200">{t.masjid.noMosquesFound}</p>
            </CardContent>
          </Card>
        )}
      </main>

      <footer className="fixed bottom-16 left-0 right-0 border-t border-emerald-800/30 bg-emerald-950/80 py-3 text-center backdrop-blur-sm">
        <p className="text-xs text-emerald-300">{t.about.copyright}</p>
      </footer>
    </div>
  );
}

