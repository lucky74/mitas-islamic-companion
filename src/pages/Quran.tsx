import { useEffect, useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Book, Bookmark, Search, BookmarkPlus, Volume2, X, Headphones, Pause } from 'lucide-react';
import { fetchAllSurahs, fetchSurah } from '@/lib/api';
import { useBookmarks, useAddBookmark, useRemoveBookmark } from '@/hooks/useQueries';
import { Skeleton } from '@/components/ui/skeleton';
import { toast } from 'sonner';
import { useI18n } from '@/lib/i18n';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useAppStore } from '@/lib/store';
import * as DialogPrimitive from '@radix-ui/react-dialog';

interface QuranSurah {
  number: number;
  name: string;
  englishName: string;
  englishNameTranslation: string;
  numberOfAyahs: number;
  revelationType: string;
}

export function Quran() {
  const { t } = useI18n();
  const { audioState, setAudioState, resetAudio } = useAppStore();
  const [surahs, setSurahs] = useState<QuranSurah[]>([]);
  const [selectedSurah, setSelectedSurah] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [surahLoading, setSurahLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isAudioPlaying, setIsAudioPlaying] = useState(false);
  const [currentAyahIndex, setCurrentAyahIndex] = useState(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const retryCountRef = useRef(0);
  const MAX_RETRIES = 2;

  const { data: bookmarks } = useBookmarks();
  const addBookmark = useAddBookmark();
  const removeBookmark = useRemoveBookmark();

  useEffect(() => {
    const loadSurahs = async () => {
      try {
        const data = await fetchAllSurahs();
        setSurahs(data);
      } catch (error) {
        console.error('Failed to load surahs:', error);
        toast.error(t.common.error);
      } finally {
        setLoading(false);
      }
    };

    loadSurahs();
  }, [t]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.preload = 'auto';
    }

    const audio = audioRef.current;

    const handleEnded = () => {
      if (currentAyahIndex < audioState.audioUrls.length - 1) {
        setCurrentAyahIndex((prev) => prev + 1);
        retryCountRef.current = 0;
      } else {
        setIsAudioPlaying(false);
        setCurrentAyahIndex(0);
        toast.success('Surah selesai diputar');
      }
    };

    const handleError = (e: Event) => {
      console.error('Audio error at index:', currentAyahIndex, e);
      if (retryCountRef.current < MAX_RETRIES && currentAyahIndex < audioState.audioUrls.length - 1) {
        retryCountRef.current++;
        toast.error(`Melewati ayat ${currentAyahIndex + 1}, melanjutkan...`);
        setCurrentAyahIndex((prev) => prev + 1);
      } else if (currentAyahIndex < audioState.audioUrls.length - 1) {
        retryCountRef.current = 0;
        setCurrentAyahIndex((prev) => prev + 1);
      } else {
        setIsAudioPlaying(false);
        toast.error('Gagal memutar audio');
      }
    };

    const handleCanPlay = () => {
      retryCountRef.current = 0;
    };

    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);
    audio.addEventListener('canplay', handleCanPlay);

    return () => {
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('canplay', handleCanPlay);
    };
  }, [currentAyahIndex, audioState.audioUrls.length]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || audioState.audioUrls.length === 0) return;

    const playAudio = async () => {
      try {
        if (isAudioPlaying && audioState.audioUrls[currentAyahIndex]) {
          const audioUrl = audioState.audioUrls[currentAyahIndex];

          if (!audioUrl || audioUrl.trim() === '' || audioUrl === 'null') {
            console.error('Invalid audio URL at index:', currentAyahIndex);
            if (currentAyahIndex < audioState.audioUrls.length - 1) {
              setCurrentAyahIndex((prev) => prev + 1);
            } else {
              setIsAudioPlaying(false);
              toast.error('Audio tidak tersedia');
            }
            return;
          }

          audio.src = audioUrl;
          await audio.play();
        } else {
          audio.pause();
        }
      } catch (error) {
        console.error('Audio playback error:', error);
        if (currentAyahIndex < audioState.audioUrls.length - 1) {
          setCurrentAyahIndex((prev) => prev + 1);
        } else {
          setIsAudioPlaying(false);
          toast.error('Gagal memutar audio');
        }
      }
    };

    playAudio();
  }, [currentAyahIndex, isAudioPlaying, audioState.audioUrls]);

  useEffect(() => {
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.src = '';
      }
      resetAudio();
      setIsAudioPlaying(false);
      setCurrentAyahIndex(0);
    };
  }, [resetAudio]);

  const handleSurahClick = async (surahNumber: number) => {
    setSurahLoading(true);
    try {
      const textData = await fetchSurah(surahNumber);

      const audioResponse = await fetch(`https://api.alquran.cloud/v1/surah/${surahNumber}/ar.alafasy`);

      if (!audioResponse.ok) {
        throw new Error(`Audio API returned ${audioResponse.status}`);
      }

      const audioData = await audioResponse.json();

      if (!audioData || audioData.code !== 200 || !audioData.data || !audioData.data.ayahs) {
        throw new Error('Invalid audio API response structure');
      }

      if (textData) {
        const audioUrls = audioData.data.ayahs
          .map((ayah: any) => {
            if (ayah.audio && typeof ayah.audio === 'string' && ayah.audio.trim() !== '') {
              return ayah.audio;
            }
            return null;
          })
          .filter((url: string | null) => url !== null);

        if (audioUrls.length === 0) {
          toast.error('Audio tidak tersedia untuk surah ini');
          setSelectedSurah({
            ...textData,
            audioData: null,
          });
          setAudioState({
            audioUrls: [],
            currentAyahIndex: 0,
            totalAyahs: 0,
            surahName: textData.arabic.englishName,
            isPlaying: false,
            isInitialized: false,
          });
        } else {
          setSelectedSurah({
            ...textData,
            audioData: audioData.data,
          });

          setAudioState({
            audioUrls: audioUrls,
            currentAyahIndex: 0,
            totalAyahs: audioUrls.length,
            surahName: textData.arabic.englishName,
            isPlaying: false,
            isInitialized: true,
          });

          console.log(`Loaded ${audioUrls.length} audio URLs for ${textData.arabic.englishName}`);
        }

        setCurrentAyahIndex(0);
        setIsAudioPlaying(false);
        retryCountRef.current = 0;
      } else {
        toast.error(t.common.error);
      }
    } catch (error) {
      console.error('Failed to load surah:', error);
      toast.error('Gagal memuat surah. Silakan coba lagi.');
    } finally {
      setSurahLoading(false);
    }
  };

  const toggleAudio = async () => {
    if (audioState.audioUrls.length === 0) {
      toast.error('Audio tidak tersedia untuk surah ini');
      return;
    }

    if (!audioRef.current) return;

    try {
      if (isAudioPlaying) {
        audioRef.current.pause();
        setIsAudioPlaying(false);
      } else {
        const audioUrl = audioState.audioUrls[currentAyahIndex];

        if (!audioUrl || audioUrl.trim() === '' || audioUrl === 'null') {
          toast.error('Audio tidak valid');
          return;
        }

        if (!audioRef.current.src || audioRef.current.src !== audioUrl) {
          audioRef.current.src = audioUrl;
        }
        await audioRef.current.play();
        setIsAudioPlaying(true);
      }
    } catch (error) {
      console.error('Failed to toggle audio:', error);
      toast.error('Klik tombol audio untuk memutar');
    }
  };

  const handleBookmark = (surah: number, ayah: number) => {
    const isBookmarked = bookmarks?.some((b) => Number(b.surah) === surah && Number(b.ayah) === ayah);

    if (isBookmarked) {
      removeBookmark.mutate(
        { surah, ayah },
        {
          onSuccess: () => toast.success(t.quran.bookmarkRemoved),
        }
      );
    } else {
      addBookmark.mutate(
        { surah, ayah, description: `Surah ${surah}, Ayat ${ayah}` },
        {
          onSuccess: () => toast.success(t.quran.bookmarkAdded),
        }
      );
    }
  };

  const handleCloseDialog = () => {
    setSelectedSurah(null);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
    }
    resetAudio();
    setIsAudioPlaying(false);
    setCurrentAyahIndex(0);
    retryCountRef.current = 0;
  };

  const filteredSurahs = surahs.filter(
    (surah) =>
      surah.englishName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      surah.name.includes(searchQuery)
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/40 via-slate-950/70 to-emerald-950/60 pb-20 geometric-bg-soft">
      <header className="relative overflow-hidden border-b border-amber-500/40 bg-gradient-to-br from-black via-emerald-950 to-emerald-800 px-6 pb-8 pt-6 text-amber-100 shadow-2xl ornament-header-arch">
        <div className="absolute inset-0 opacity-10">
          <img
            src="/assets/generated/islamic-pattern-bg.dim_800x600.png"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>

        <div className="relative">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src="/assets/generated/quran-icon-transparent.dim_64x64.png"
                alt=""
                className="h-10 w-10 rounded-full border-2 border-amber-500/70 bg-black/40 p-1 shadow-lg"
              />
              <h1 className="text-2xl font-bold text-amber-100">{t.quran.title}</h1>
            </div>
            <div className="flex items-center gap-1">
              <LanguageSelector />
            </div>
          </div>

          <div className="relative mt-2">
            <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-white/60" />
            <Input
              placeholder={t.quran.search}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="border border-amber-500/40 bg-black/50 pl-10 text-amber-50 placeholder:text-emerald-100/60 shadow-md focus:bg-black/70"
            />
          </div>
        </div>
      </header>

      <div className="px-6 py-6 pb-24">
        <Tabs defaultValue="surahs">
          <TabsList className="grid w-full grid-cols-2 border border-amber-500/40 bg-gradient-to-r from-black/80 via-emerald-950/90 to-emerald-900/80">
            <TabsTrigger value="surahs" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white">
              <Book className="mr-2 h-4 w-4" />
              {t.quran.surahList}
            </TabsTrigger>
            <TabsTrigger value="bookmarks" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-teal-600 data-[state=active]:text-white">
              <Bookmark className="mr-2 h-4 w-4" />
              {t.quran.bookmarks}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="surahs" className="mt-4">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <div className="space-y-3 pb-4">
                {loading ? (
                  <>
                    {[...Array(10)].map((_, i) => (
                      <Card
                        key={i}
                        className="ornament-card-soft border-emerald-500/50 bg-gradient-to-br from-black/85 via-emerald-950/95 to-emerald-900/90"
                      >
                        <CardContent className="p-4">
                          <Skeleton className="h-16 w-full" />
                        </CardContent>
                      </Card>
                    ))}
                  </>
                ) : (
                  filteredSurahs.map((surah) => (
                    <Card
                      key={surah.number}
                      className="ornament-card-soft cursor-pointer border-emerald-500/60 bg-gradient-to-br from-black/85 via-emerald-950/95 to-emerald-900/90 shadow-xl transition-all hover:scale-[1.02] hover:border-amber-400 hover:shadow-2xl"
                      onClick={() => handleSurahClick(surah.number)}
                    >
                      <CardContent className="flex items-center gap-4 p-4">
                        <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500 via-teal-500 to-amber-400 font-bold text-black shadow-md">
                          {surah.number}
                        </div>
                        <div className="flex-1">
                          <h3 className="font-semibold text-emerald-50">{surah.englishName}</h3>
                          <p className="text-sm text-emerald-100/80">
                            {surah.englishNameTranslation} • {surah.numberOfAyahs} {t.quran.ayat}
                          </p>
                        </div>
                        <div className="text-right text-xl font-arabic text-amber-200">
                          {surah.name}
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="bookmarks" className="mt-4">
            <ScrollArea className="h-[calc(100vh-280px)]">
              {!bookmarks || bookmarks.length === 0 ? (
                <Card className="ornament-card-soft border-amber-500/40 bg-black/70">
                  <CardContent className="p-8 text-center">
                    <Bookmark className="mx-auto mb-4 h-12 w-12 text-amber-400" />
                    <p className="text-sm text-emerald-100/80">{t.quran.noBookmarks}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3 pb-4">
                  {bookmarks.map((bookmark, index) => (
                    <Card
                      key={index}
                      className="ornament-card-soft border-emerald-500/60 bg-gradient-to-br from-black/85 via-emerald-950/95 to-emerald-900/90 shadow-xl"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-semibold text-emerald-50">
                              Surah {Number(bookmark.surah)}, {t.quran.ayat} {Number(bookmark.ayah)}
                            </h3>
                            <p className="text-sm text-emerald-100/80">
                              {bookmark.description}
                            </p>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleBookmark(Number(bookmark.surah), Number(bookmark.ayah))}
                            className="text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                          >
                            <Bookmark className="h-5 w-5 fill-current" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog open={!!selectedSurah} onOpenChange={handleCloseDialog}>
        <DialogPrimitive.Portal>
          <DialogPrimitive.Overlay className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
          <DialogContent className="ornament-card ornament-corner max-h-[85vh] max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center justify-between gap-4">
                <div className="flex items-center gap-2">
                  <span className="text-emerald-900 dark:text-emerald-100">
                    {selectedSurah?.arabic.englishName}
                  </span>
                  <span className="font-arabic text-emerald-800 dark:text-emerald-200">
                    {selectedSurah?.arabic.name}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  {audioState.audioUrls.length > 0 && audioState.isInitialized && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={toggleAudio}
                      className={`h-9 w-9 rounded-full text-emerald-700 transition-all hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-900/50 ${
                        isAudioPlaying ? 'animate-pulse bg-emerald-100 dark:bg-emerald-900/50' : ''
                      }`}
                      title={isAudioPlaying ? 'Jeda Audio' : 'Putar Audio'}
                    >
                      {isAudioPlaying ? (
                        <Pause className="h-5 w-5" />
                      ) : (
                        <Headphones className="h-5 w-5" />
                      )}
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleCloseDialog}
                    className="h-8 w-8 text-emerald-700 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-900/50"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </DialogTitle>
            </DialogHeader>

            {surahLoading ? (
              <div className="space-y-4">
                {[...Array(5)].map((_, i) => (
                  <Skeleton key={i} className="h-24 w-full" />
                ))}
              </div>
            ) : (
              <ScrollArea className="max-h-[55vh]">
                <div className="space-y-6 pr-4 pb-6">
                  {selectedSurah?.arabic.ayahs.map((ayah: any, index: number) => {
                    const indonesianAyah = selectedSurah.indonesian.ayahs[index];
                    const isBookmarked = bookmarks?.some(
                      (b) =>
                        Number(b.surah) === selectedSurah.arabic.number &&
                        Number(b.ayah) === ayah.numberInSurah
                    );
                    const isCurrentlyPlaying = isAudioPlaying && currentAyahIndex === index;

                    return (
                      <div
                        key={ayah.number}
                        className={`rounded-2xl border-2 p-4 transition-all ornament-inner-border ${
                          isCurrentlyPlaying
                            ? 'border-amber-400 bg-gradient-to-r from-emerald-900/60 via-emerald-800/80 to-amber-800/60 shadow-xl'
                            : 'border-emerald-700/70 bg-black/60 shadow-md'
                        }`}
                      >
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">
                            {t.quran.ayat} {ayah.numberInSurah}
                          </span>
                          <div className="flex items-center gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => {
                                const newIndex = index;
                                setCurrentAyahIndex(newIndex);
                                setIsAudioPlaying(true);
                              }}
                              className={`h-8 w-8 rounded-full text-emerald-700 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-900/50 ${
                                isCurrentlyPlaying ? 'bg-emerald-100 dark:bg-emerald-900/50' : ''
                              }`}
                              title={t.quran.playAyah}
                            >
                              <Volume2 className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() =>
                                handleBookmark(selectedSurah.arabic.number, ayah.numberInSurah)
                              }
                              className={`h-8 w-8 rounded-full text-emerald-700 hover:bg-emerald-100 dark:text-emerald-300 dark:hover:bg-emerald-900/50 ${
                                isBookmarked ? 'text-amber-500' : ''
                              }`}
                              title={
                                isBookmarked ? t.quran.bookmarkRemoveLabel : t.quran.bookmarkAddLabel
                              }
                            >
                              {isBookmarked ? (
                                <Bookmark className="h-4 w-4 fill-current" />
                              ) : (
                                <BookmarkPlus className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>

                        <p className="mb-3 text-right text-2xl leading-loose font-arabic text-emerald-900 dark:text-emerald-100">
                          {ayah.text}
                        </p>
                        <p className="text-sm text-emerald-800 dark:text-emerald-200">
                          {indonesianAyah?.text}
                        </p>
                      </div>
                    );
                  })}
                </div>
              </ScrollArea>
            )}
          </DialogContent>
        </DialogPrimitive.Portal>
      </Dialog>
    </div>
  );
}
