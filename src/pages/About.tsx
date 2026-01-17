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
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-amber-50 dark:from-emerald-950 dark:via-teal-950 dark:to-amber-950">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 shadow-lg">
        <div className="container mx-auto flex items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <img
              src="/assets/generated/mitas-logo-header.dim_120x120.png"
              alt="MITAS Logo"
              className="h-10 w-10 rounded-full border-2 border-emerald-700 shadow-lg"
            />
            <div>
              <h1 className="text-xl font-bold text-white">{t.about.title}</h1>
              <p className="text-xs text-emerald-100">{t.about.appName}</p>
            </div>
          </div>
          <LanguageSelector />
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Logo Section with solid background */}
        <div className="mb-8 flex justify-center">
          <div className="rounded-full bg-white p-4 shadow-xl dark:bg-slate-800">
            <img
              src="/assets/generated/mitas-logo-about-contrast.dim_120x120.png"
              alt="MITAS Logo"
              className="h-32 w-32 rounded-full border-2 border-emerald-700 shadow-lg"
            />
          </div>
        </div>

        {/* App Info Card with contrasting background */}
        <div className="mb-6 rounded-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6 shadow-xl dark:from-slate-900 dark:to-black">
          <div className="mb-4 text-center">
            <h2 className="mb-2 text-3xl font-bold text-emerald-400">
              {t.about.appName}
            </h2>
            <p className="text-lg font-semibold text-teal-300">
              {t.about.appFullName}
            </p>
          </div>

          <div className="mb-6 space-y-3 border-t border-emerald-700 pt-4">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">
                Pengembang:
              </span>
              <span className="text-emerald-400">
                {t.about.developer}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-semibold text-slate-300">
                Author / Founder:
              </span>
              <span className="text-emerald-400">
                {t.about.author}
              </span>
            </div>
          </div>

          <div className="mb-6">
            <p className="text-center leading-relaxed text-slate-200">
              {t.about.description}
            </p>
          </div>
        </div>

        {/* Features Card */}
        <div className="mb-6 rounded-2xl bg-white/90 p-6 shadow-xl backdrop-blur-sm dark:bg-slate-900/90">
          <h3 className="mb-4 text-center text-2xl font-bold text-emerald-700 dark:text-emerald-400">
            {t.about.featuresTitle}
          </h3>
          <ul className="space-y-3">
            {features.map((feature, index) => (
              <li
                key={index}
                className="flex items-start gap-3 rounded-lg bg-emerald-50 p-3 dark:bg-emerald-950/50"
              >
                <CheckCircle2 className="mt-0.5 h-5 w-5 flex-shrink-0 text-emerald-600 dark:text-emerald-400" />
                <span className="text-slate-700 dark:text-slate-300">{feature}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Vision Card */}
        <div className="mb-6 rounded-2xl bg-gradient-to-br from-amber-50 to-amber-100 p-6 shadow-xl dark:from-amber-950/50 dark:to-amber-900/50">
          <h3 className="mb-3 text-center text-xl font-bold text-amber-800 dark:text-amber-400">
            {t.about.visionTitle}
          </h3>
          <p className="text-center leading-relaxed text-amber-900 dark:text-amber-200">
            {t.about.vision}
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {t.about.copyright}
          </p>
        </div>
      </main>
    </div>
  );
}

