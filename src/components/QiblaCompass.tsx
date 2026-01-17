import { useEffect, useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Navigation } from 'lucide-react';
import { calculateQiblaDirection, getUserLocation } from '@/lib/qibla';
import { toast } from 'sonner';

export function QiblaCompass() {
  const [qiblaDirection, setQiblaDirection] = useState<number | null>(null);
  const [deviceHeading, setDeviceHeading] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [permissionGranted, setPermissionGranted] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null);
  const orientationListenerRef = useRef<((event: DeviceOrientationEvent) => void) | null>(null);

  const requestPermissions = async () => {
    setLoading(true);

    try {
      const location = await getUserLocation();
      if (!location) {
        toast.error('Tidak dapat mengakses lokasi. Pastikan izin lokasi diaktifkan.');
        setLoading(false);
        return;
      }

      setUserLocation(location);

      const direction = calculateQiblaDirection(location.lat, location.lng);
      setQiblaDirection(direction);

      if (
        typeof DeviceOrientationEvent !== 'undefined' &&
        typeof (DeviceOrientationEvent as any).requestPermission === 'function'
      ) {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission();
          if (permission === 'granted') {
            setPermissionGranted(true);
            toast.success('Kompas kiblat aktif');
          } else {
            toast.error('Izin orientasi perangkat ditolak');
          }
        } catch (error) {
          console.error('Error requesting orientation permission:', error);
          toast.error('Gagal meminta izin orientasi perangkat');
        }
      } else {
        setPermissionGranted(true);
        toast.success('Kompas kiblat aktif');
      }
    } catch (error) {
      console.error('Error in requestPermissions:', error);
      toast.error('Terjadi kesalahan saat mengaktifkan kompas');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!permissionGranted) return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      if (typeof (event as any).webkitCompassHeading !== 'undefined') {
        setDeviceHeading((event as any).webkitCompassHeading);
      } else if (event.alpha !== null) {
        setDeviceHeading(360 - event.alpha);
      }
    };

    orientationListenerRef.current = handleOrientation;
    window.addEventListener('deviceorientation', handleOrientation);

    return () => {
      if (orientationListenerRef.current) {
        window.removeEventListener('deviceorientation', orientationListenerRef.current);
      }
    };
  }, [permissionGranted]);

  const relativeDirection =
    qiblaDirection !== null ? (qiblaDirection - deviceHeading + 360) % 360 : 0;

  return (
    <div className="flex flex-col items-center justify-center space-y-6 py-8">
      {!qiblaDirection ? (
        <div className="text-center">
          <div className="mx-auto mb-6 flex h-32 w-32 items-center justify-center rounded-full bg-emerald-900/80 dark:bg-emerald-950/80">
            <img
              src="/assets/generated/compass-rose.dim_200x200.png"
              alt="Compass"
              className="h-24 w-24 opacity-50"
            />
          </div>
          <p className="mb-4 text-sm text-muted-foreground">
            Izinkan akses lokasi dan orientasi perangkat untuk menampilkan arah kiblat
          </p>
          <Button onClick={requestPermissions} disabled={loading}>
            <Navigation className="mr-2 h-4 w-4" />
            {loading ? 'Memuat...' : 'Aktifkan Kompas'}
          </Button>
        </div>
      ) : (
        <div className="relative">
          <div className="relative h-64 w-64">
            <div className="absolute inset-0 rounded-full border-4 border-emerald-600/40 bg-gradient-to-br from-emerald-900/90 to-emerald-950/90 shadow-xl dark:from-emerald-950/95 dark:to-slate-950/95">
              <img
                src="/assets/generated/compass-rose.dim_200x200.png"
                alt="Compass"
                className="h-full w-full opacity-20"
                style={{
                  transform: `rotate(${-deviceHeading}deg)`,
                  transition: 'transform 0.3s ease-out',
                }}
              />
            </div>

            <div
              className="absolute inset-0 flex items-center justify-center transition-transform duration-300 ease-out"
              style={{ transform: `rotate(${relativeDirection}deg)` }}
            >
              <div className="absolute top-4 flex flex-col items-center">
                <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500 shadow-lg ring-2 ring-amber-300">
                  <img
                    src="/assets/generated/kaaba-icon-transparent.dim_64x64.png"
                    alt="Kaaba"
                    className="h-8 w-8"
                  />
                </div>
                <div className="h-20 w-1 bg-gradient-to-b from-amber-500 to-amber-600 shadow-lg"></div>
              </div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="h-4 w-4 rounded-full bg-emerald-500 shadow-lg ring-2 ring-emerald-300"></div>
            </div>

            <div className="absolute inset-0 flex items-center justify-center">
              <div className="absolute top-2 text-xs font-bold text-white">N</div>
              <div className="absolute bottom-2 text-xs font-bold text-white/60">S</div>
              <div className="absolute left-2 text-xs font-bold text-white/60">W</div>
              <div className="absolute right-2 text-xs font-bold text-white/60">E</div>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">Arah Kiblat</p>
            <p className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
              {Math.round(qiblaDirection)}°
            </p>
            {userLocation && (
              <p className="mt-1 text-xs text-muted-foreground">
                {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
              </p>
            )}
            <p className="mt-3 text-xs text-muted-foreground">
              Arahkan perangkat hingga ikon Ka'bah menunjuk ke atas
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

