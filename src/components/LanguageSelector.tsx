import { Languages } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useI18n, languages } from '@/lib/i18n';

export function LanguageSelector() {
  const { language, setLanguage } = useI18n();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon" 
          className="h-9 w-9 text-inherit hover:bg-white/20 focus-visible:ring-white/20"
        >
          <Languages className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent 
        align="end" 
        className="min-w-[180px] bg-emerald-900 border-emerald-700 dark:bg-slate-900 dark:border-slate-700"
      >
        {languages.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className={`flex items-center justify-between text-white hover:bg-emerald-800 focus:bg-emerald-800 dark:text-gray-100 dark:hover:bg-slate-800 dark:focus:bg-slate-800 ${
              language === lang.code ? 'bg-emerald-800/50 dark:bg-slate-800/50' : ''
            }`}
          >
            <span className="font-medium">{lang.nativeName}</span>
            {language === lang.code && <span className="ml-2 text-amber-400 dark:text-amber-300">✓</span>}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

