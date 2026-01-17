import { useAppStore } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Volume2, Pause } from 'lucide-react';

interface GlobalAudioControlProps {
  onToggle?: () => void;
}

export function GlobalAudioControl({ onToggle }: GlobalAudioControlProps) {
  const { audioState, toggleAudio: storeToggleAudio } = useAppStore();

  if (!audioState.surahName || audioState.audioUrls.length === 0) {
    return null;
  }

  const handleClick = () => {
    if (onToggle) {
      onToggle();
    } else {
      storeToggleAudio();
    }
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={handleClick}
      className={`h-9 w-9 rounded-full bg-white/20 text-white shadow-md transition-all hover:bg-white/30 hover:shadow-lg ${
        audioState.isPlaying ? 'animate-pulse' : ''
      }`}
      title={audioState.isPlaying ? 'Jeda Audio' : 'Putar Audio'}
    >
      {audioState.isPlaying ? (
        <Pause className="h-5 w-5" />
      ) : (
        <Volume2 className="h-5 w-5" />
      )}
    </Button>
  );
}

