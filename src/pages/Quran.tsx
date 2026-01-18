import { useEffect, useState } from 'react';
import { Book, Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Skeleton } from '@/components/ui/skeleton';
import { fetchAllSurahs, type QuranSurah } from '@/lib/api';
import { useI18n } from '@/lib/i18n';
import { LanguageSelector } from '@/components/LanguageSelector';

export function Quran() {
  const { t } = useI18n();
  const [surahs, setSurahs] = useState<QuranSurah[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    let cancelled = false;

    const loadSurahs = async () => {
      try {
        const data = await fetchAllSurahs();
        if (!cancelled) {
          setSurahs(data);
        }
      } catch {
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadSurahs();

    return () => {
      cancelled = true;
    };
  }, []);

  const filteredSurahs = surahs.filter((surah) => {
    const query = searchQuery.toLowerCase();
    return (
      surah.englishName.toLowerCase().includes(query) ||
      surah.englishNameTranslation.toLowerCase().includes(query) ||
      surah.name.includes(searchQuery)
    );
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-background to-teal-50/30 dark:from-emerald-950/20 dark:via-background dark:to-teal-950/10">
      <header className="bg-gradient-to-br from-emerald-600 via-teal-500 to-teal-600 px-6 pb-6 pt-6 text-white shadow-lg">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Book className="h-8 w-8" />
            <h1 className="text-2xl font-bold">{t.quran.title}</h1>
          </div>
          <LanguageSelector />
        </div>

        <div className="relative mt-4">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
          <Input
            placeholder={t.quran.search}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border-white/20 bg-white/10 pl-10 text-white placeholder:text-white/60 focus:bg-white/20"
          />
        </div>
      </header>

      <div className="px-6 py-6 pb-24">
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="space-y-3 pb-4">
            {loading ? (
              Array.from({ length: 10 }).map((_, index) => (
                <Card key={index} className="border-emerald-200 dark:border-emerald-800">
                  <CardContent className="p-4">
                    <Skeleton className="h-16 w-full" />
                  </CardContent>
                </Card>
              ))
            ) : (
              filteredSurahs.map((surah) => (
                <Card
                  key={surah.number}
                  className="border-emerald-200 bg-gradient-to-r from-white to-emerald-50/50 shadow-md transition-all hover:scale-[1.02] hover:border-emerald-400 hover:shadow-lg dark:border-emerald-800 dark:from-card dark:to-emerald-950/20 dark:hover:border-emerald-600"
                >
                  <CardContent className="flex items-center gap-4 p-4">
                    <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-500 font-bold text-white shadow-md">
                      {surah.number}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-emerald-900 dark:text-emerald-100">{surah.englishName}</h3>
                      <p className="text-sm text-muted-foreground">
                        {surah.englishNameTranslation} • {surah.numberOfAyahs} {t.quran.ayat}
                      </p>
                    </div>
                    <div className="text-right text-xl font-arabic text-emerald-800 dark:text-emerald-200">{surah.name}</div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

