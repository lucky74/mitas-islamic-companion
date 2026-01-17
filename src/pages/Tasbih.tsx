import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Plus, RotateCcw, Trash2 } from 'lucide-react';
import { useAppStore } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { LanguageSelector } from '@/components/LanguageSelector';
import { useI18n } from '@/lib/i18n';

export function Tasbih() {
  const {
    tasbihCounters,
    updateTasbihCount,
    resetTasbihCounter,
    removeTasbihCounter,
    addTasbihCounter,
  } = useAppStore();
  const { t } = useI18n();
  const [newCounterName, setNewCounterName] = useState('');
  const [newCounterTarget, setNewCounterTarget] = useState('33');
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleCount = (id: string) => {
    const counter = tasbihCounters.find((c) => c.id === id);
    if (counter && counter.count < counter.target) {
      updateTasbihCount(id, counter.count + 1);

      if (navigator.vibrate) {
        navigator.vibrate(50);
      }
    }
  };

  const handleAddCounter = () => {
    if (!newCounterName.trim()) return;

    const newCounter = {
      id: Date.now().toString(),
      name: newCounterName,
      count: 0,
      target: parseInt(newCounterTarget) || 33,
    };

    addTasbihCounter(newCounter);
    setNewCounterName('');
    setNewCounterTarget('33');
    setDialogOpen(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50/50 via-background to-teal-50/30 dark:from-emerald-950/20 dark:via-background dark:to-teal-950/10">
      <header className="relative overflow-hidden bg-gradient-to-br from-emerald-600 via-teal-500 to-teal-600 px-6 pb-8 pt-6 text-white shadow-lg">
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
                src="/assets/generated/tasbih-icon.dim_64x64.png"
                alt=""
                className="h-10 w-10 brightness-0 invert"
              />
              <h1 className="text-2xl font-bold">{t.tasbih.title}</h1>
            </div>
            <LanguageSelector />
          </div>
          <p className="text-center text-sm opacity-90">{t.tasbih.subtitle}</p>
        </div>
      </header>

      <div className="px-6 py-6">
        <div className="mb-4 flex justify-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-md hover:from-emerald-700 hover:to-teal-700" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {t.tasbih.addCounter}
              </Button>
            </DialogTrigger>
            <DialogContent className="border-emerald-200 dark:border-emerald-800">
              <DialogHeader>
                <DialogTitle className="text-emerald-900 dark:text-emerald-100">
                  {t.tasbih.newCounter}
                </DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="name">{t.tasbih.dhikrName}</Label>
                  <Input
                    id="name"
                    placeholder="Contoh: Istighfar"
                    value={newCounterName}
                    onChange={(e) => setNewCounterName(e.target.value)}
                    className="border-emerald-200 focus:border-emerald-400 dark:border-emerald-800"
                  />
                </div>
                <div>
                  <Label htmlFor="target">{t.tasbih.target}</Label>
                  <Input
                    id="target"
                    type="number"
                    placeholder="33"
                    value={newCounterTarget}
                    onChange={(e) => setNewCounterTarget(e.target.value)}
                    className="border-emerald-200 focus:border-emerald-400 dark:border-emerald-800"
                  />
                </div>
                <Button
                  onClick={handleAddCounter}
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700"
                >
                  {t.tasbih.add}
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-4">
          {tasbihCounters.map((counter) => {
            const progress = (counter.count / counter.target) * 100;
            const isComplete = counter.count >= counter.target;

            return (
              <Card
                key={counter.id}
                className={`overflow-hidden shadow-md ${
                  isComplete
                    ? 'border-2 border-emerald-400 bg-gradient-to-br from-emerald-50 to-teal-50 dark:border-emerald-600 dark:from-emerald-900/30 dark:to-teal-900/30'
                    : 'border-emerald-200 bg-white dark:border-emerald-800 dark:bg-card'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-emerald-900 dark:text-emerald-100">
                      {counter.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => resetTasbihCounter(counter.id)}
                        className="h-8 w-8 text-emerald-600 hover:bg-emerald-100 hover:text-emerald-700 dark:text-emerald-400 dark:hover:bg-emerald-900/50"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTasbihCounter(counter.id)}
                        className="h-8 w-8 text-destructive hover:bg-destructive/10"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="mb-2 text-6xl font-bold tabular-nums text-emerald-600 dark:text-emerald-400">
                      {counter.count}
                    </div>
                    <p className="text-sm text-muted-foreground">
                      {t.tasbih.of} {counter.target}
                    </p>
                  </div>

                  <Progress
                    value={progress}
                    className="h-2 bg-emerald-100 dark:bg-emerald-900/30"
                  />

                  <Button
                    onClick={() => handleCount(counter.id)}
                    disabled={isComplete}
                    className="h-24 w-full bg-gradient-to-r from-emerald-600 to-teal-600 text-xl font-semibold hover:from-emerald-700 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500"
                    size="lg"
                  >
                    {isComplete ? `✓ ${t.tasbih.complete}` : t.tasbih.tapToCount}
                  </Button>

                  {isComplete && (
                    <div className="rounded-lg bg-gradient-to-r from-emerald-100 to-teal-100 p-3 text-center shadow-md dark:from-emerald-900/30 dark:to-teal-900/30">
                      <p className="text-sm font-medium text-emerald-800 dark:text-emerald-200">
                        {t.tasbih.targetReached}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}

