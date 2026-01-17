import { Settings } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { useAppStore, PRAYER_METHODS } from '@/lib/store';
import { useI18n } from '@/lib/i18n';
import { toast } from 'sonner';

export function PrayerSourceSelector() {
  const { prayerMethod, setPrayerMethod } = useAppStore();
  const { t } = useI18n();

  const handleMethodChange = (methodId: string) => {
    const newMethod = parseInt(methodId);
    setPrayerMethod(newMethod);
    toast.success(t.messages.methodUpdated);
  };

  const getMethodDescription = (methodId: number) => {
    switch (methodId) {
      case 3: return t.methods.mwlDesc;
      case 4: return t.methods.makkahDesc;
      case 11: return t.methods.kemenagDesc;
      case 2: return t.methods.isnaDesc;
      case 1: return t.methods.karachiDesc;
      case 5: return t.methods.egyptDesc;
      case 7: return t.methods.tehranDesc;
      default: return '';
    }
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <div>
            <Select value={prayerMethod.toString()} onValueChange={handleMethodChange}>
              <SelectTrigger className="h-9 w-9 border-white/30 bg-white/15 p-0 text-white hover:bg-white/25 focus:ring-2 focus:ring-white/40 transition-all [&>svg]:hidden">
                <SelectValue>
                  <Settings className="h-4 w-4" />
                </SelectValue>
              </SelectTrigger>
              <SelectContent align="end" className="w-80 bg-emerald-900 border-emerald-700 dark:bg-slate-900 dark:border-slate-700">
                {PRAYER_METHODS.map((method) => (
                  <SelectItem 
                    key={method.id} 
                    value={method.id.toString()}
                    className="text-white hover:bg-emerald-800 focus:bg-emerald-800 dark:text-gray-100 dark:hover:bg-slate-800 dark:focus:bg-slate-800"
                  >
                    <div className="flex flex-col py-1">
                      <span className="font-semibold text-sm">{method.name}</span>
                      <span className="text-xs text-emerald-200 dark:text-slate-300 mt-0.5">
                        {getMethodDescription(method.id)}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </TooltipTrigger>
        <TooltipContent 
          side="bottom" 
          className="bg-emerald-900 text-white border-emerald-700 dark:bg-slate-900 dark:border-slate-700"
        >
          <p className="text-sm font-medium">Pilih sumber jadwal salat</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}

