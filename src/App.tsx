import { useState } from 'react';
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

function App() {
  const currentPage = useAppStore((state) => state.currentPage);
  const [showSplash, setShowSplash] = useState(true);

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
          <main className="flex-1 pb-20">{renderPage()}</main>
          <BottomNav />
          <Toaster />
        </div>
      </I18nProvider>
    </ThemeProvider>
  );
}

export default App;

