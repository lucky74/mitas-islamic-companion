import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Moon, Sun } from 'lucide-react';
import {
  fetchPrayerTimes,
  getNextPrayer,
  getTimeUntilPrayer,
  type PrayerTimesData,
} from '@/lib/api';
import { useAppStore } from '@/lib/store';
import { useI18n } from '@/lib/i18n';
import { Skeleton } from '@/components/ui/skeleton';
import { useTheme } from 'next-themes';
import { toast } from 'sonner';
import { LanguageSelector } from '@/components/LanguageSelector';

export function Home() {
  const { selectedCity, setCurrentPage, prayerMethod } = useAppStore();
  const { t } = useI18n();
  const [prayerData, setPrayerData] = useState<PrayerTimesData | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentTime, setCurrentTime] = useState(new Date());
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    const loadPrayerTimes = async () => {
      try {
        setLoading(true);

        const data = await fetchPrayerTimes(selectedCity, 'Indonesia', prayerMethod);
        if (data) {
          setPrayerData(data);
        } else {
          toast.error(t.messages.prayerTimesFailed);
        }
      } catch (error) {
        console.error('Error loading prayer times:', error);
        toast.error(t.messages.prayerTimesFailed);
      } finally {
        setLoading(false);
      }
    };

    loadPrayerTimes();
  }, [selectedCity, prayerMethod, t]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const nextPrayer = prayerData ? getNextPrayer(prayerData.timings) : null;
  const timeUntil = nextPrayer ? getTimeUntilPrayer(nextPrayer.time) : '';

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-background to-amber-50/30 dark:from-emerald-950/20 dark:via-background dark:to-amber-950/10">
      <header className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-teal-600 px-6 pb-24 pt-6 text-white shadow-lg">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/generated/islamic-pattern-bg.dim_800x600.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative">
          <div className="mb-6 flex items-center justify-between">
            <div className="flex min-w-0 flex-1 items-center gap-2">
              <MapPin className="h-4 w-4 flex-shrink-0" />
              <span className="truncate text-sm font-medium">{selectedCity}</span>
            </div>
            <div className="flex flex-shrink-0 items-center gap-1">
              <LanguageSelector />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="h-9 w-9 text-white hover:bg-white/20"
              >
                {theme === 'dark' ? (
                  <Sun className="h-4 w-4" />
                ) : (
                  <Moon className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div className="mb-4 flex items-center justify-center gap-3">
            <img
              src="/mitas-logo.png"
              alt="MITAS Logo"
              className="h-12 w-12 rounded-full border-2 border-emerald-700 object-contain shadow-lg"
            />
            <div className="text-center">
              <h1 className="mb-1 text-3xl font-bold tracking-wide">{t.home.title}</h1>
              <p className="text-sm opacity-90">{t.home.subtitle}</p>
            </div>
          </div>

          <div className="text-center">
            <div className="mb-1 text-5xl font-bold tabular-nums tracking-tight">
              {currentTime.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <div className="text-sm opacity-90">
              {currentTime.toLocaleDateString('id-ID', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </div>
          </div>
        </div>
      </header>

      <div className="relative -mt-16 mb-4 px-6">
        {loading ? (
          <Card className="border-emerald-700 bg-emerald-900 dark:border-emerald-600 dark:bg-emerald-950">
            <CardContent className="p-4 text-center">
              <Skeleton className="mx-auto mb-2 h-4 w-32 bg-emerald-700" />
              <Skeleton className="mx-auto h-6 w-48 bg-emerald-700" />
            </CardContent>
          </Card>
        ) : prayerData ? (
          <Card className="border-emerald-700 bg-emerald-900 shadow-lg dark:border-emerald-600 dark:bg-emerald-950">
            <CardContent className="p-4 text-center">
              <p className="text-sm font-medium text-emerald-200">{t.home.hijriDate}</p>
              <p className="text-lg font-semibold text-white">
                {prayerData.date.hijri.day} {prayerData.date.hijri.month.en}{' '}
                {prayerData.date.hijri.year}
              </p>
            </CardContent>
          </Card>
        ) : null}
      </div>

      <div className="mb-6 px-6">
        <Card className="overflow-hidden border-emerald-200 bg-white shadow-xl dark:border-emerald-800 dark:bg-card">
          <CardContent className="p-6">
            {loading ? (
              <div className="space-y-3">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-8 w-24" />
                <Skeleton className="h-4 w-40" />
              </div>
            ) : nextPrayer ? (
              <div className="flex items-center justify-between gap-4">
                <div className="min-w-0 flex-1">
                  <p className="mb-1 text-sm text-muted-foreground">
                    {t.home.nextPrayer}
                  </p>
                  <h2 className="mb-1 truncate text-3xl font-bold text-emerald-600 dark:text-emerald-400">
                    {nextPrayer.name}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {t.home.in} {timeUntil}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {t.home.at} {nextPrayer.time}
                  </p>
                </div>
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500 to-teal-500">
                  <Clock className="h-10 w-10 text-white" />
                </div>
              </div>
            ) : (
              <p className="text-center text-muted-foreground">
                {t.messages.prayerTimesFailed}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="px-6 pb-8">
        <h3 className="mb-4 text-lg font-semibold text-foreground">
          {t.home.mainMenu}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Card
            className="group cursor-pointer overflow-hidden border-emerald-200 bg-gradient-to-br from-white to-emerald-50/50 shadow-md transition-all hover:scale-105 hover:shadow-xl dark:border-emerald-800 dark:from-card dark:to-emerald-950/20"
            onClick={() => setCurrentPage('prayer')}
          >
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 shadow-md transition-transform group-hover:scale-110">
                <img
                  src="/assets/generated/mosque-silhouette.dim_400x300.png"
                  alt=""
                  className="h-9 w-9 brightness-0 invert"
                />
              </div>
              <CardTitle className="text-base font-semibold text-emerald-900 dark:text-emerald-100">
                {t.home.prayerTimes}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card
            className="group cursor-pointer overflow-hidden border-emerald-200 bg-gradient-to-br from-white to-teal-50/50 shadow-md transition-all hover:scale-105 hover:shadow-xl dark:border-emerald-800 dark:from-card dark:to-teal-950/20"
            onClick={() => setCurrentPage('quran')}
          >
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-md transition-transform group-hover:scale-110">
                <img
                  src="/assets/generated/quran-icon-transparent.dim_64x64.png"
                  alt=""
                  className="h-9 w-9 brightness-0 invert"
                />
              </div>
              <CardTitle className="text-base font-semibold text-teal-900 dark:text-teal-100">
                {t.home.alQuran}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card
            className="group cursor-pointer overflow-hidden border-amber-200 bg-gradient-to-br from-white to-amber-50/50 shadow-md transition-all hover:scale-105 hover:shadow-xl dark:border-amber-800 dark:from-card dark:to-amber-950/20"
            onClick={() => setCurrentPage('doa')}
          >
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 to-yellow-600 shadow-md transition-transform group-hover:scale-110">
                <img
                  src="/assets/generated/kaaba-icon-transparent.dim_64x64.png"
                  alt=""
                  className="h-9 w-9 brightness-0 invert"
                />
              </div>
              <CardTitle className="text-base font-semibold text-amber-900 dark:text-amber-100">
                {t.home.doaHadith}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card
            className="group cursor-pointer overflow-hidden border-emerald-200 bg-gradient-to-br from-white to-emerald-50/50 shadow-md transition-all hover:scale-105 hover:shadow-xl dark:border-emerald-800 dark:from-card dark:to-emerald-950/20"
            onClick={() => setCurrentPage('tasbih')}
          >
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-600 to-teal-600 shadow-md transition-transform group-hover:scale-110">
                <img
                  src="/assets/generated/tasbih-icon.dim_64x64.png"
                  alt=""
                  className="h-9 w-9 brightness-0 invert"
                />
              </div>
              <CardTitle className="text-base font-semibold text-emerald-900 dark:text-emerald-100">
                {t.home.digitalTasbih}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
