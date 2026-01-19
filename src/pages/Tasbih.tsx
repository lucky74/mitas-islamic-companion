import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { CircleDot, Plus, RotateCcw, Trash2 } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-b from-black/40 via-slate-950/70 to-emerald-950/60">
      <header className="relative overflow-hidden border-b border-amber-500/40 bg-gradient-to-br from-black via-emerald-950 to-teal-800 px-6 pb-8 pt-6 text-amber-100 shadow-2xl ornament-header-arch">
        <div className="relative">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-amber-500/70 bg-gradient-to-br from-amber-500 via-emerald-500 to-teal-600 p-1 shadow-lg">
                <CircleDot className="h-6 w-6 text-black" />
              </div>
              <h1 className="text-2xl font-bold text-amber-100">{t.tasbih.title}</h1>
            </div>
            <LanguageSelector />
          </div>
          <p className="text-center text-sm text-emerald-100/90">{t.tasbih.subtitle}</p>
        </div>
      </header>

      <div className="px-6 py-6">
        <div className="mb-4 flex justify-end">
          <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-600 text-white shadow-md hover:from-amber-500/90 hover:via-emerald-500/90 hover:to-teal-600/90" size="sm">
                <Plus className="mr-2 h-4 w-4" />
                {t.tasbih.addCounter}
              </Button>
            </DialogTrigger>
            <DialogContent className="border-amber-500/40 bg-slate-950">
              <DialogHeader>
                <DialogTitle className="text-amber-100">
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
                    className="border-amber-500/40 bg-black/40 text-amber-100 placeholder:text-emerald-300 focus:border-amber-400"
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
                    className="border-amber-500/40 bg-black/40 text-amber-100 placeholder:text-emerald-300 focus:border-amber-400"
                  />
                </div>
                <Button
                  onClick={handleAddCounter}
                  className="w-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-600 text-black hover:from-amber-400 hover:via-emerald-500 hover:to-teal-600"
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
                    ? 'border-2 border-amber-400 bg-gradient-to-br from-black/80 via-emerald-900/80 to-teal-900/80'
                    : 'border border-amber-500/40 bg-gradient-to-br from-black/80 via-slate-950/90 to-emerald-950/90'
                }`}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg text-amber-100">
                      {counter.name}
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => resetTasbihCounter(counter.id)}
                        className="h-8 w-8 text-amber-300 hover:bg-amber-900/40 hover:text-amber-200"
                      >
                        <RotateCcw className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeTasbihCounter(counter.id)}
                        className="h-8 w-8 text-red-400 hover:bg-red-900/40"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center">
                    <div className="mb-2 text-6xl font-bold tabular-nums text-amber-300">
                      {counter.count}
                    </div>
                    <p className="text-sm text-emerald-100/80">
                      {t.tasbih.of} {counter.target}
                    </p>
                  </div>

                  <Progress
                    value={progress}
                    className="h-2 bg-emerald-900/60"
                  />

                  <Button
                    onClick={() => handleCount(counter.id)}
                    disabled={isComplete}
                    className="h-24 w-full bg-gradient-to-r from-amber-500 via-emerald-500 to-teal-600 text-xl font-semibold text-black hover:from-amber-400 hover:via-emerald-500 hover:to-teal-600 disabled:from-gray-500 disabled:to-gray-600"
                    size="lg"
                  >
                    {isComplete ? `✓ ${t.tasbih.complete}` : t.tasbih.tapToCount}
                  </Button>

                  {isComplete && (
                    <div className="rounded-lg bg-gradient-to-r from-amber-500/20 via-emerald-500/10 to-teal-500/20 p-3 text-center shadow-md">
                      <p className="text-sm font-medium text-amber-100">
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
