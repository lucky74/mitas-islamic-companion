type SplashScreenProps = {
  onComplete: () => void;
};

export function SplashScreen({ onComplete }: SplashScreenProps) {
  setTimeout(onComplete, 2000);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-emerald-600 via-teal-500 to-amber-500 text-white">
      <div className="animate-scaleIn mb-6 rounded-full bg-white/10 p-6 shadow-elevation-3">
        <img
          src="/assets/generated/app-icon.dim_512x512.png"
          alt="MITAS Logo"
          className="h-20 w-20"
        />
      </div>
      <h1 className="animate-fadeIn mb-2 text-3xl font-bold tracking-wide">MITAS</h1>
      <p className="max-w-xs text-center text-sm text-white/90">
        Islamic Companion App yang membantu ibadah harian Anda dengan jadwal shalat, Al-Qur’an,
        doa harian, dan tasbih digital.
      </p>
    </div>
  );
}

