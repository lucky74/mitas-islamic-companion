import { useI18n } from '@/lib/i18n';
import { LanguageSelector } from '@/components/LanguageSelector';
import { CheckCircle2 } from 'lucide-react';

export function About() {
  const { t } = useI18n();

  const features = [
    t.about.features.hijriCalendar,
    t.about.features.prayerTimes,
    t.about.features.quran,
    t.about.features.dua,
    t.about.features.qibla,
    t.about.features.tasbih,
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-black/40 via-slate-950/70 to-emerald-950/60">
      <header className="sticky top-0 z-40 border-b border-amber-500/40 bg-gradient-to-r from-black/95 via-slate-950/95 to-emerald-950/95 shadow-2xl ornament-header-arch">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/mitas-logo.png"
              alt="MITAS Logo"
              className="h-10 w-10 rounded-full border-2 border-amber-500/80 shadow-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-amber-100">{t.about.title}</h1>
              <p className="text-xs text-emerald-100">{t.about.appName}</p>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-black/70 p-4 shadow-xl">
            <img
              src="/mitas-logo.png"
              alt="MITAS Logo"
              className="h-32 w-32 rounded-full border-2 border-amber-500/80 shadow-lg"
            />
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-black/85 via-slate-950/95 to-emerald-950/90 p-6 shadow-2xl">
          <div className="mb-4 text-center">
            <h2 className="mb-2 text-3xl font-bold text-amber-300">
              {t.about.appName}
            </h2>
            <p className="text-lg font-semibold text-emerald-100">
              {t.about.appFullName}
            </p>
          </div>

          <div className="mb-6 space-y-6 border-t border-emerald-700/60 pt-6 text-center">
            <div className="space-y-1">
              <span className="block text-xs font-medium uppercase tracking-widest text-emerald-400">
                Pengembang
              </span>
              <span className="block text-lg font-bold text-amber-100">
                {t.about.developer}
              </span>
            </div>

            <div className="space-y-1">
              <span className="block text-xs font-medium uppercase tracking-widest text-emerald-400">
                Author / Founder
              </span>
              <span className="block text-lg font-bold text-amber-100">
                {t.about.author}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-center leading-relaxed text-emerald-100/90">
              {t.about.description}
            </p>
          </div>
        </div>

        <div className="mb-6 rounded-2xl border border-amber-500/40 bg-black/70 p-6 shadow-xl backdrop-blur-sm">
          <h3 className="mb-4 text-center text-2xl font-bold text-amber-100">
            {t.about.featuresTitle}
          </h3>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-3 rounded-lg bg-gradient-to-r from-black/80 via-emerald-950/80 to-emerald-900/80 p-3"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-amber-300" />
                <span className="text-emerald-100/90">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-6 rounded-2xl border border-amber-500/40 bg-gradient-to-br from-black/85 via-amber-950/90 to-emerald-900/90 p-6 shadow-xl">
          <h3 className="mb-3 text-center text-xl font-bold text-amber-100">
            {t.about.visionTitle}
          </h3>
          <p className="text-center leading-relaxed text-emerald-100/90">
            {t.about.vision}
          </p>
        </div>

        <div className="mt-8 text-center">
          <p className="text-sm text-emerald-100/80">
            {t.about.copyright}
          </p>
        </div>
      </main>
    </div>
  );
}
