import { Home, Clock, BookOpen, Heart, Circle, Info, MapPin } from 'lucide-react';
import { useAppStore, type PageType } from '@/lib/store';
import { useI18n } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export function BottomNav() {
  const { currentPage, setCurrentPage } = useAppStore();
  const { t } = useI18n();

  const navItems = [
    { id: 'home' as PageType, icon: Home, label: t.nav.home },
    { id: 'prayer' as PageType, icon: Clock, label: t.nav.prayer },
    { id: 'quran' as PageType, icon: BookOpen, label: t.nav.quran },
    { id: 'doa' as PageType, icon: Heart, label: t.nav.doa },
    { id: 'masjid' as PageType, icon: MapPin, label: t.nav.masjid },
    { id: 'tasbih' as PageType, icon: Circle, label: t.nav.tasbih },
    { id: 'about' as PageType, icon: Info, label: t.nav.about },
  ];

  const handleNavigation = (pageId: PageType) => {
    try {
      setCurrentPage(pageId);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="flex items-center justify-around px-1 py-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentPage === item.id;

          return (
            <button
              key={item.id}
              onClick={() => handleNavigation(item.id)}
              className={cn(
                'flex flex-col items-center gap-1 rounded-lg px-2 py-2 transition-all',
                isActive ? 'text-primary' : 'text-muted-foreground hover:text-foreground'
              )}
              aria-label={item.label}
              aria-current={isActive ? 'page' : undefined}
            >
              <Icon
                className={cn(
                  'h-5 w-5 transition-transform',
                  isActive && 'scale-110'
                )}
              />
              <span className="text-[10px] font-medium">{item.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}

