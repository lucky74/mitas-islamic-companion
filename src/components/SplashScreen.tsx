type SplashScreenProps = {
  onComplete: () => void;
};

export function SplashScreen({ onComplete }: SplashScreenProps) {
  setTimeout(onComplete, 2000);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-900 via-slate-950 to-black text-white">
      <div className="animate-scaleIn mb-6 rounded-full bg-emerald-900/80 p-4 shadow-elevation-3">
        <img
          src="/mitas-logo.png"
          alt="MITAS Logo"
          className="h-24 w-24 rounded-full border-2 border-emerald-500 object-contain shadow-lg"
        />
      </div>
      <h1 className="animate-fadeIn mb-2 text-3xl font-bold tracking-wide text-amber-300">
        MITAS
      </h1>
      <p className="max-w-xs text-center text-sm text-emerald-100">
        Islamic Companion App yang membantu ibadah harian Anda dengan jadwal shalat, Al-Qur’an,
        doa harian, dan tasbih digital.
      </p>
    </div>
  );
}
