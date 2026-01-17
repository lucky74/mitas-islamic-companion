import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Heart, Sunrise, Sunset } from 'lucide-react';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { morningDuas, eveningDuas } from '@/lib/duaData';
import { useI18n } from '@/lib/i18n';
import { LanguageSelector } from '@/components/LanguageSelector';

const DOA_HARIAN = [
  {
    title: 'Doa Sebelum Makan',
    arabic: 'بِسْمِ اللهِ وَعَلَى بَرَكَةِ اللهِ',
    translation: 'Dengan menyebut nama Allah dan atas berkah Allah.',
  },
  {
    title: 'Doa Sesudah Makan',
    arabic:
      'الْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا وَسَقَانَا وَجَعَلَنَا مُسْلِمِينَ',
    translation:
      'Segala puji bagi Allah yang telah memberi kami makan dan minum serta menjadikan kami muslim.',
  },
  {
    title: 'Doa Masuk Masjid',
    arabic: 'اللَّهُمَّ افْتَحْ لِي أَبْوَابَ رَحْمَتِكَ',
    translation: 'Ya Allah, bukakanlah untukku pintu-pintu rahmat-Mu.',
  },
  {
    title: 'Doa Keluar Masjid',
    arabic: 'اللَّهُمَّ إِنِّي أَسْأَلُكَ مِنْ فَضْلِكَ',
    translation: 'Ya Allah, sesungguhnya aku mohon kepada-Mu dari karunia-Mu.',
  },
  {
    title: 'Doa Sebelum Tidur',
    arabic: 'بِاسْمِكَ اللَّهُمَّ أَمُوتُ وَأَحْيَا',
    translation: 'Dengan nama-Mu ya Allah, aku mati dan aku hidup.',
  },
  {
    title: 'Doa Bangun Tidur',
    arabic:
      'الْحَمْدُ لِلَّهِ الَّذِي أَحْيَانَا بَعْدَ مَا أَمَاتَنَا وَإِلَيْهِ النُّشُورُ',
    translation:
      'Segala puji bagi Allah yang telah menghidupkan kami setelah mematikan kami dan kepada-Nya kami akan kembali.',
  },
  {
    title: 'Doa Masuk Kamar Mandi',
    arabic: 'اللَّهُمَّ إِنِّي أَعُوذُ بِكَ مِنَ الْخُبُثِ وَالْخَبَائِثِ',
    translation:
      'Ya Allah, aku berlindung kepada-Mu dari godaan setan laki-laki dan perempuan.',
  },
  {
    title: 'Doa Keluar Kamar Mandi',
    arabic: 'غُفْرَانَكَ',
    translation: 'Aku mohon ampunan-Mu.',
  },
  {
    title: 'Doa Bepergian',
    arabic:
      'سُبْحَانَ الَّذِي سَخَّرَ لَنَا هَذَا وَمَا كُنَّا لَهُ مُقْرِنِينَ وَإِنَّا إِلَى رَبِّنَا لَمُنْقَلِبُونَ',
    translation:
      'Maha Suci Allah yang telah menundukkan semua ini bagi kami padahal kami sebelumnya tidak mampu menguasainya, dan sesungguhnya kami akan kembali kepada Tuhan kami.',
  },
  {
    title: 'Doa Ketika Hujan',
    arabic: 'اللَّهُمَّ صَيِّبًا نَافِعًا',
    translation: 'Ya Allah, turunkanlah hujan yang bermanfaat.',
  },
];

function DoaPagiPetangSection() {
  const [activeDoaTab, setActiveDoaTab] = useState<'pagi' | 'petang'>('pagi');
  const { t } = useI18n();

  const currentData = activeDoaTab === 'pagi' ? morningDuas : eveningDuas;
  const isPagi = activeDoaTab === 'pagi';

  return (
    <div className="space-y-4">
      <div className="rounded-lg bg-gradient-to-br from-emerald-100 to-amber-100 p-4 shadow-md dark:from-emerald-900/30 dark:to-amber-900/30">
        <h3 className="mb-2 text-center text-lg font-bold text-emerald-900 dark:text-emerald-100">
          {t.doa.morningEvening}
        </h3>
        <p className="text-center text-sm text-emerald-800 dark:text-emerald-200">
          {t.doa.morningEveningDesc}
        </p>
      </div>

      <Tabs
        value={activeDoaTab}
        onValueChange={(v) => setActiveDoaTab(v as 'pagi' | 'petang')}
      >
        <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-emerald-100 to-amber-100 dark:from-emerald-900/30 dark:to-amber-900/30">
          <TabsTrigger
            value="pagi"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-emerald-500 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            <Sunrise className="mr-2 h-4 w-4" />
            {t.doa.morning} 🌅
          </TabsTrigger>
          <TabsTrigger
            value="petang"
            className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-amber-600 data-[state=active]:to-amber-500 data-[state=active]:text-white data-[state=active]:shadow-md"
          >
            <Sunset className="mr-2 h-4 w-4" />
            {t.doa.evening} 🌇
          </TabsTrigger>
        </TabsList>

        <TabsContent value={activeDoaTab} className="mt-4">
          <ScrollArea className="h-[calc(100vh-380px)]">
            <div className="space-y-3 pr-4">
              {currentData.map((dua, index) => (
                <Card
                  key={index}
                  className={`overflow-hidden shadow-md ${
                    isPagi
                      ? 'border-2 border-emerald-300 bg-gradient-to-br from-white to-emerald-50/50 dark:border-emerald-700 dark:from-card dark:to-emerald-950/20'
                      : 'border-2 border-amber-300 bg-gradient-to-br from-white to-amber-50/50 dark:border-amber-700 dark:from-card dark:to-amber-950/20'
                  }`}
                >
                  <CardHeader
                    className={`pb-3 ${
                      isPagi
                        ? 'bg-emerald-100/50 dark:bg-emerald-900/20'
                        : 'bg-amber-100/50 dark:bg-amber-900/20'
                    }`}
                  >
                    <CardTitle className="flex items-center gap-3 text-base">
                      <div
                        className={`flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white shadow-md ${
                          isPagi
                            ? 'bg-gradient-to-br from-emerald-600 to-emerald-500'
                            : 'bg-gradient-to-br from-amber-600 to-amber-500'
                        }`}
                      >
                        {index + 1}
                      </div>
                      {dua.title && (
                        <span
                          className={`flex-1 font-semibold ${
                            isPagi
                              ? 'text-emerald-900 dark:text-emerald-100'
                              : 'text-amber-900 dark:text-amber-100'
                          }`}
                        >
                          {dua.title}
                        </span>
                      )}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4 pt-4">
                    <div
                      className={`rounded-lg p-4 ${
                        isPagi
                          ? 'bg-emerald-100/50 dark:bg-emerald-900/20'
                          : 'bg-amber-100/50 dark:bg-amber-900/20'
                      }`}
                    >
                      <p className="font-arabic text-2xl leading-loose text-foreground">
                        {dua.arabic || ''}
                      </p>
                    </div>

                    {dua.transliteration && (
                      <div className="rounded-lg bg-muted/50 p-4">
                        <p className="text-sm font-medium italic text-muted-foreground">
                          {dua.transliteration}
                        </p>
                      </div>
                    )}

                    {dua.translation && (
                      <div className="rounded-lg bg-muted/70 p-4">
                        <p className="text-sm leading-relaxed text-foreground">
                          <span className="font-semibold">{t.doa.meaning}:</span>{' '}
                          {dua.translation}
                        </p>
                      </div>
                    )}

                    {dua.source && (
                      <div
                        className={`rounded-lg border p-4 ${
                          isPagi
                            ? 'border-emerald-300 bg-emerald-50/50 dark:border-emerald-700 dark:bg-emerald-950/20'
                            : 'border-amber-300 bg-amber-50/50 dark:border-amber-700 dark:bg-amber-950/20'
                        }`}
                      >
                        <p className="text-xs leading-relaxed text-muted-foreground">
                          <span
                            className={`font-semibold ${
                              isPagi
                                ? 'text-emerald-700 dark:text-emerald-300'
                                : 'text-amber-700 dark:text-amber-300'
                            }`}
                          >
                            {t.doa.source}:
                          </span>{' '}
                          {dua.source}
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          </ScrollArea>
        </TabsContent>
      </Tabs>
    </div>
  );
}

export function Doa() {
  const [activeTab, setActiveTab] = useState('pagiPetang');
  const { t } = useI18n();

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-background to-amber-50/30 pb-20 dark:from-emerald-950/20 dark:via-background dark:to-amber-950/10">
      <header className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-emerald-500 to-amber-600 px-6 pb-8 pt-6 text-white shadow-lg">
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
                src="/assets/generated/kaaba-icon-transparent.dim_64x64.png"
                alt=""
                className="h-10 w-10 brightness-0 invert"
              />
              <h1 className="text-2xl font-bold">{t.doa.title}</h1>
            </div>
            <LanguageSelector />
          </div>
          <p className="text-center text-sm opacity-90">{t.doa.subtitle}</p>
        </div>
      </header>

      <div className="px-6 py-6">
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2 bg-gradient-to-r from-emerald-100 to-amber-100 dark:from-emerald-900/30 dark:to-amber-900/30">
            <TabsTrigger
              value="pagiPetang"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-amber-600 data-[state=active]:text-white"
            >
              <Sunrise className="mr-2 h-4 w-4" />
              {t.doa.morningEvening}
            </TabsTrigger>
            <TabsTrigger
              value="doa"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-emerald-600 data-[state=active]:to-amber-600 data-[state=active]:text-white"
            >
              <Heart className="mr-2 h-4 w-4" />
              {t.doa.dailyDua}
            </TabsTrigger>
          </TabsList>

          <TabsContent value="pagiPetang" className="mt-4">
            <DoaPagiPetangSection />
          </TabsContent>

          <TabsContent value="doa" className="mt-4">
            <ScrollArea className="h-[calc(100vh-280px)]">
              <Accordion type="single" collapsible className="space-y-3">
                {DOA_HARIAN.map((doa, index) => (
                  <AccordionItem
                    key={index}
                    value={`doa-${index}`}
                    className="rounded-lg border-2 border-emerald-200 bg-gradient-to-r from-white to-emerald-50/50 shadow-md dark:border-emerald-800 dark:from-card dark:to-emerald-950/20"
                  >
                    <AccordionTrigger className="px-4 hover:no-underline">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-600 to-teal-600 text-sm font-bold text-white shadow-md">
                          {index + 1}
                        </div>
                        <span className="flex-1 text-left font-semibold text-emerald-900 dark:text-emerald-100">
                          {doa.title}
                        </span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4">
                      <div className="space-y-4">
                        <div className="rounded-lg bg-emerald-100/50 p-4 dark:bg-emerald-900/20">
                          <p className="font-arabic text-2xl leading-loose text-foreground">
                            {doa.arabic}
                          </p>
                        </div>
                        <div className="rounded-lg bg-muted/70 p-4">
                          <p className="text-sm text-muted-foreground">
                            {doa.translation}
                          </p>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

