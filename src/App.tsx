import { useEffect, useState } from 'react';
import { ThemeProvider } from 'next-themes';
import { Toaster } from '@/components/ui/sonner';
import { Home } from '@/pages/Home';
import { Prayer } from '@/pages/Prayer';
import { Quran } from '@/pages/Quran';
import { Doa } from '@/pages/Doa';
import { Tasbih } from '@/pages/Tasbih';
import { About } from '@/pages/About';
import { Masjid } from '@/pages/Masjid';
import { BottomNav } from '@/components/BottomNav';
import { SplashScreen } from '@/components/SplashScreen';
import { useAppStore } from '@/lib/store';
import { I18nProvider } from '@/lib/i18n';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

function App() {
  const currentPage = useAppStore((state) => state.currentPage);
  const [showSplash, setShowSplash] = useState(true);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const dismissed = window.localStorage.getItem('mitas_install_banner_dismissed');
    if (!dismissed) {
      setShowInstallBanner(true);
    }
  }, []);

  const handleCopyAndOpenLink = async () => {
    if (typeof window === 'undefined') return;

    const url = window.location.href;

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(url);
        toast.success('Link MITAS sudah disalin. Tempel di browser untuk install.');
      }
    } catch {
    }

    window.open(url, '_blank');
  };

  const handleDismissBanner = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('mitas_install_banner_dismissed', 'true');
    }
    setShowInstallBanner(false);
  };

  const renderPage = () => {
    
    switch (currentPage) {
      case 'home':
        return <Home />;
      case 'prayer':
        return <Prayer />;
      case 'quran':
        return <Quran />;
      case 'doa':
        return <Doa />;
      case 'tasbih':
        return <Tasbih />;
      case 'about':
        return <About />;
      case 'masjid':
        return <Masjid />;
      default:
        return <Home />;
    }
  };

  if (showSplash) {
    return <SplashScreen onComplete={() => setShowSplash(false)} />;
  }

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <I18nProvider>
        <div className="flex min-h-screen flex-col bg-gradient-to-b from-black via-slate-950 to-emerald-950">
          {showInstallBanner && (
            <div className="border-b border-amber-500/40 bg-gradient-to-r from-black/90 via-emerald-950/95 to-amber-900/90 px-3 py-2 text-xs text-amber-50">
              <div className="mx-auto flex max-w-xl items-center gap-3">
                <img
                  src="/assets/generated/app-icon.dim_512x512.png"
                  alt="MITAS"
                  className="h-8 w-8 rounded-xl border border-amber-400 bg-black/40"
                />
                <div className="flex-1">
                  <p className="text-[13px] font-semibold leading-tight">Install aplikasi MITAS</p>
                  <p className="text-[11px] text-emerald-100/80">
                    Salin link ini dan buka di browser untuk memasang aplikasi seperti Android.
                  </p>
                </div>
                <div className="flex items-center gap-1">
                  <Button
                    size="sm"
                    onClick={handleCopyAndOpenLink}
                    className="h-8 bg-gradient-to-r from-emerald-500 via-teal-500 to-amber-400 px-3 text-[11px] font-semibold text-black"
                  >
                    Salin & buka
                  </Button>
                  <button
                    type="button"
                    onClick={handleDismissBanner}
                    className="rounded-full border border-amber-500/50 px-1 text-[11px] text-amber-100/80"
                  >
                    ×
                  </button>
                </div>
              </div>
            </div>
          )}
          <main className="flex-1 pb-20">{renderPage()}</main>
          <BottomNav />
          <Toaster />
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;

