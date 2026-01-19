import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, MapPin, Moon, Sun, BookOpen, Heart, CircleDot } from 'lucide-react';
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

type HilalCity = {
  name: string;
  lat: number;
  lon: number;
  type: string;
};

type HilalMonitor = HilalCity & {
  alt: number;
  elong: number;
  label: string;
  color: string;
  unity: boolean;
};

const hilalCities: HilalCity[] = [
  { name: 'Jayapura, ID', lat: -2.5, lon: 140.7, type: 'East' },
  { name: 'Jakarta, ID', lat: -6.2, lon: 106.8, type: 'East' },
  { name: 'Makkah, SA', lat: 21.4, lon: 39.8, type: 'West-Center' },
  { name: 'Istanbul, TR', lat: 41.0, lon: 28.9, type: 'West-Center' },
  { name: 'Casablanca, MA', lat: 33.5, lon: -7.5, type: 'West' },
  { name: 'New York, US', lat: 40.7, lon: -74.0, type: 'West' },
];

type Equatorial = {
  ra: number;
  dec: number;
};

function toJulian(date: Date) {
  return date.getTime() / 86400000 - date.getTimezoneOffset() / 1440 + 2440587.5;
}

function normalizeAngle(deg: number) {
  return ((deg % 360) + 360) % 360;
}

function sunEclipticPosition(jd: number) {
  const T = (jd - 2451545.0) / 36525;
  const M = normalizeAngle(357.52911 + 35999.05029 * T - 0.0001537 * T * T);
  const L0 = normalizeAngle(280.46646 + 36000.76983 * T + 0.0003032 * T * T);
  const Mrad = (Math.PI / 180) * M;
  const C =
    (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(Mrad) +
    (0.019993 - 0.000101 * T) * Math.sin(2 * Mrad) +
    0.000289 * Math.random() * 0 + 0.000289 * Math.sin(3 * Mrad);
  const trueLon = normalizeAngle(L0 + C);
  return { lon: trueLon, lat: 0 };
}

function moonEclipticPosition(jd: number) {
  const T = (jd - 2451545.0) / 36525;
  const L0 = normalizeAngle(218.3164477 + 481267.88123421 * T);
  const D = normalizeAngle(297.8501921 + 445267.1114034 * T);
  const M = normalizeAngle(357.5291092 + 35999.0502909 * T);
  const Mprime = normalizeAngle(134.9633964 + 477198.8675055 * T);
  const F = normalizeAngle(93.272095 + 483202.0175233 * T);
  const RAD = Math.PI / 180;
  const Dr = D * RAD;
  const Mr = M * RAD;
  const Mpr = Mprime * RAD;
  const Fr = F * RAD;
  const lon =
    L0 +
    6.289 * Math.sin(Mpr) +
    1.274 * Math.sin(2 * Dr - Mpr) +
    0.658 * Math.sin(2 * Dr) +
    0.214 * Math.sin(2 * Mpr) +
    0.11 * Math.sin(Dr);
  const lat =
    5.128 * Math.sin(Fr) +
    0.28 * Math.sin(Mpr + Fr) +
    0.277 * Math.sin(Mpr - Fr) +
    0.173 * Math.sin(2 * Dr - Fr);
  return { lon: normalizeAngle(lon), lat };
}

function eclipticToEquatorial(lonDeg: number, latDeg: number): Equatorial {
  const RAD = Math.PI / 180;
  const eps = 23.439291 * RAD;
  const lonRad = lonDeg * RAD;
  const latRad = latDeg * RAD;
  const sinDec =
    Math.sin(latRad) * Math.cos(eps) +
    Math.cos(latRad) * Math.sin(eps) * Math.sin(lonRad);
  const dec = Math.asin(sinDec);
  const y =
    Math.sin(lonRad) * Math.cos(eps) -
    Math.tan(latRad) * Math.sin(eps);
  const x = Math.cos(lonRad);
  const ra = Math.atan2(y, x);
  return { ra, dec };
}

function angularSeparation(a: Equatorial, b: Equatorial) {
  const cosD =
    Math.sin(a.dec) * Math.sin(b.dec) +
    Math.cos(a.dec) * Math.cos(b.dec) * Math.cos(a.ra - b.ra);
  const d = Math.acos(Math.min(1, Math.max(-1, cosD)));
  return (180 / Math.PI) * d;
}

function calculateHilalAstro(city: HilalCity) {
  const now = new Date();
  const jd = toJulian(now);
  const sunEcl = sunEclipticPosition(jd);
  const moonEcl = moonEclipticPosition(jd);
  const sunEq = eclipticToEquatorial(sunEcl.lon, sunEcl.lat);
  const moonEq = eclipticToEquatorial(moonEcl.lon, moonEcl.lat);
  const elong = angularSeparation(sunEq, moonEq);
  const RAD = Math.PI / 180;
  const alt0 = -0.833 * RAD;
  const phi = city.lat * RAD;
  const sinAlt0 = Math.sin(alt0);
  const sinPhi = Math.sin(phi);
  const cosPhi = Math.cos(phi);
  const sinDecSun = Math.sin(sunEq.dec);
  const cosDecSun = Math.cos(sunEq.dec);
  const cosH0 =
    (sinAlt0 - sinPhi * sinDecSun) / (cosPhi * cosDecSun || 1e-9);
  const clippedCosH0 = Math.min(1, Math.max(-1, cosH0));
  const H0 = Math.acos(clippedCosH0);
  const deltaRa = sunEq.ra - moonEq.ra;
  const Hmoon = H0 + deltaRa;
  const sinDecMoon = Math.sin(moonEq.dec);
  const cosDecMoon = Math.cos(moonEq.dec);
  const sinAltMoon =
    sinPhi * sinDecMoon + cosPhi * cosDecMoon * Math.cos(Hmoon);
  const altMoon = Math.asin(sinAltMoon);
  const altDeg = (180 / Math.PI) * altMoon;
  return {
    alt: parseFloat(altDeg.toFixed(2)),
    elong: parseFloat(elong.toFixed(2)),
  };
}

function getHilalVisStatus(alt: number, elong: number) {
  if (alt >= 3 && elong >= 6.4) return { label: 'TERLIHAT', color: '#00ff88', unity: true };
  if (alt > 0) return { label: 'PERLU ALAT', color: '#ffcc00', unity: false };
  return { label: 'ISTIKMAL', color: '#ff4d4d', unity: false };
}

function HilalStatusCard() {
  const { t } = useI18n();
  const [monitorData, setMonitorData] = useState<HilalMonitor[]>([]);
  const [globalUnityActive, setGlobalUnityActive] = useState(false);

  useEffect(() => {
    const results: HilalMonitor[] = hilalCities.map((city) => {
      const astro = calculateHilalAstro(city);
      const status = getHilalVisStatus(astro.alt, astro.elong);
      return { ...city, ...astro, ...status };
    });

    setMonitorData(results);

    const isVisibleInWest = results.some((d) => d.lon <= 45 && d.label === 'TERLIHAT');
    if (isVisibleInWest) {
      setGlobalUnityActive(true);
    }
  }, []);

  if (!monitorData.length) {
    return null;
  }

  return (
    <div className="mt-4 space-y-3 text-left">
      <div className="rounded-lg bg-black/40 p-3 text-xs text-emerald-100">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-emerald-200">
          {t.home.hilalStatusTitle}
        </p>
        <p className="mt-1 text-[11px] font-semibold">
          {globalUnityActive ? t.home.hilalUnityHeading : t.home.hilalWaitingHeading}
        </p>
        <p className="mt-1 text-[11px] text-emerald-200/90">
          {globalUnityActive ? t.home.hilalUnityStatus : t.home.hilalWaitingStatus}
        </p>
        <p className="mt-2 text-[11px] text-emerald-200/80">
          Berdasarkan hisab ketinggian dan elongasi bulan, bukan penetapan resmi awal bulan.
        </p>
        <p className="mt-1 text-[11px] text-emerald-200/80">
          Untuk ibadah puasa dan hari raya, sebagian ulama berpendapat bahwa rukyat di satu wilayah dapat berlaku global.
        </p>
        <p className="mt-1 text-[10px] leading-relaxed text-emerald-200/70">
          "Apabila bulan telah masuk kedua puluh sembilan malam (dari bulan Sya&apos;ban). Maka janganlah kalian berpuasa hingga melihat Hilal. Dan apabila mendung, sempurnakanlah bulan Sya&apos;ban menjadi tiga puluh hari" (HR. Bukhari no. 1907 - Muslim no. 1080)
        </p>
      </div>
      <div className="overflow-x-auto rounded-lg border border-emerald-500/30 bg-black/40">
        <table className="min-w-full text-[11px]">
          <thead>
            <tr className="border-b border-emerald-500/40 bg-emerald-900/60 text-emerald-100">
              <th className="px-2 py-1 text-left">Location</th>
              <th className="px-2 py-1 text-center">Alt</th>
              <th className="px-2 py-1 text-center">Elong</th>
              <th className="px-2 py-1 text-center">Status</th>
            </tr>
          </thead>
          <tbody>
            {monitorData.map((loc) => (
              <tr key={loc.name} className="border-b border-emerald-800/40 last:border-b-0">
                <td className="px-2 py-1 text-emerald-100">{loc.name}</td>
                <td className="px-2 py-1 text-center text-emerald-100">
                  {loc.alt.toFixed(2)}°
                </td>
                <td className="px-2 py-1 text-center text-emerald-100">
                  {loc.elong.toFixed(2)}°
                </td>
                <td className="px-2 py-1 text-center font-semibold" style={{ color: loc.color }}>
                  {loc.label}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

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
    <div className="min-h-screen bg-gradient-to-b from-black/40 via-slate-950/70 to-emerald-950/60">
      <header className="relative overflow-hidden border-b border-amber-500/40 bg-gradient-to-br from-black via-emerald-950 to-emerald-800 px-6 pb-24 pt-6 text-amber-100 shadow-2xl ornament-header-arch">
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
              <MapPin className="h-4 w-4 flex-shrink-0 text-amber-300" />
              <span className="truncate text-sm font-medium text-amber-100">
                {selectedCity}
              </span>
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
              className="h-12 w-12 rounded-full border-2 border-amber-500/80 object-contain shadow-lg"
            />
            <div className="text-center">
              <h1 className="mb-1 text-3xl font-bold tracking-wide text-amber-100">
                {t.home.title}
              </h1>
              <p className="text-sm text-emerald-100/90">{t.home.subtitle}</p>
            </div>
          </div>

          <div className="text-center">
            <div className="mb-1 text-5xl font-bold tabular-nums tracking-tight text-amber-100">
              {currentTime.toLocaleTimeString('id-ID', {
                hour: '2-digit',
                minute: '2-digit',
              })}
            </div>
            <div className="text-sm text-emerald-100/90">
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
          <Card className="ornament-card">
            <CardContent className="p-4 text-center">
              <Skeleton className="mx-auto mb-2 h-4 w-32 bg-emerald-700/70" />
              <Skeleton className="mx-auto h-6 w-48 bg-emerald-700/70" />
            </CardContent>
          </Card>
        ) : prayerData ? (
          <Card className="ornament-card">
            <CardContent className="space-y-3 p-4">
              <div className="text-center">
                <p className="text-sm font-medium text-amber-200">{t.home.hijriDate}</p>
                <p className="text-lg font-semibold text-amber-50">
                  {prayerData.date.hijri.day} {prayerData.date.hijri.month.en}{' '}
                  {prayerData.date.hijri.year}
                </p>
              </div>
              <HilalStatusCard />
            </CardContent>
          </Card>
        ) : null}
      </div>

      <div className="mb-6 px-6">
        <Card className="overflow-hidden ornament-card ornament-inner-border">
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
                  <p className="mb-1 text-sm text-emerald-100/80">{t.home.nextPrayer}</p>
                  <h2 className="mb-1 truncate text-3xl font-bold text-amber-300">
                    {nextPrayer.name}
                  </h2>
                  <p className="text-sm text-emerald-100/80">
                    {t.home.in} {timeUntil}
                  </p>
                  <p className="mt-1 text-xs text-emerald-100/80">
                    {t.home.at} {nextPrayer.time}
                  </p>
                </div>
                <div className="flex h-20 w-20 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-amber-500 via-emerald-500 to-emerald-700 shadow-lg">
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
        <h3 className="mb-4 text-lg font-semibold text-amber-100">
          {t.home.mainMenu}
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <Card
            className="group cursor-pointer overflow-hidden border border-amber-500/40 bg-gradient-to-br from-black/80 via-emerald-950/95 to-emerald-900/90 shadow-xl transition-all hover:-translate-y-1 hover:border-amber-400 hover:shadow-emerald-500/40"
            onClick={() => setCurrentPage('prayer')}
          >
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-emerald-500 to-emerald-700 shadow-md transition-transform group-hover:scale-110">
                <Clock className="h-8 w-8 text-black" />
              </div>
              <CardTitle className="text-base font-semibold text-amber-100">
                {t.home.prayerTimes}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card
            className="group cursor-pointer overflow-hidden border border-amber-500/40 bg-gradient-to-br from-black/80 via-emerald-950/95 to-emerald-900/90 shadow-xl transition-all hover:-translate-y-1 hover:border-amber-400 hover:shadow-emerald-500/40"
            onClick={() => setCurrentPage('quran')}
          >
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-emerald-500 to-teal-600 shadow-md transition-transform group-hover:scale-110">
                <BookOpen className="h-8 w-8 text-black" />
              </div>
              <CardTitle className="text-base font-semibold text-amber-100">
                {t.home.alQuran}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card
            className="group cursor-pointer overflow-hidden border border-amber-500/40 bg-gradient-to-br from-black/80 via-emerald-950/95 to-emerald-900/90 shadow-xl transition-all hover:-translate-y-1 hover:border-amber-400 hover:shadow-emerald-500/40"
            onClick={() => setCurrentPage('doa')}
          >
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-emerald-500 to-amber-600 shadow-md transition-transform group-hover:scale-110">
                <Heart className="h-8 w-8 text-black" />
              </div>
              <CardTitle className="text-base font-semibold text-amber-100">
                {t.home.doaHadith}
              </CardTitle>
            </CardHeader>
          </Card>

          <Card
            className="group cursor-pointer overflow-hidden border border-amber-500/40 bg-gradient-to-br from-black/80 via-emerald-950/95 to-emerald-900/90 shadow-xl transition-all hover:-translate-y-1 hover:border-amber-400 hover:shadow-emerald-500/40"
            onClick={() => setCurrentPage('tasbih')}
          >
            <CardHeader className="pb-3">
              <div className="mb-2 flex h-14 w-14 items-center justify-center rounded-xl bg-gradient-to-br from-amber-500 via-emerald-500 to-teal-600 shadow-md transition-transform group-hover:scale-110">
                <CircleDot className="h-8 w-8 text-black" />
              </div>
              <CardTitle className="text-base font-semibold text-amber-100">
                {t.home.digitalTasbih}
              </CardTitle>
            </CardHeader>
          </Card>
        </div>
      </div>
    </div>
  );
}
