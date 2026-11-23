import React, { useEffect, useState } from 'react';
import { AppUsageItem, ScreenId, TaskItem } from '../../types';
import { ArrowLeft, Check } from 'lucide-react';

interface HomeScreensProps {
  activeScreen: 'home' | 'lock-in' | 'blocco-app' | 'profilo' | 'progressi' | 'mascotte';
  tasks: TaskItem[];
  apps: AppUsageItem[];
  mascotteMood: 'felice' | 'arrabbiata';
  mascotteStyle: number;
  onToggleTask: (taskId: string) => void;
  onToggleAppBlock: (appId: string) => void;
  onChangeMascotteMood: (mood: 'felice' | 'arrabbiata') => void;
  onChangeMascotteStyle: (style: number) => void;
  onNavigate: (screenId: ScreenId) => void;
  onBack: () => void;
}

const SubHeader: React.FC<{ title: string; onBack: () => void }> = ({ title, onBack }) => (
  <div className="h-[58px] px-4 border-b border-black bg-white flex items-center justify-between shrink-0">
    <button
      onClick={onBack}
      className="h-[34px] px-2.5 border border-black bg-white hover:bg-neutral-100 flex items-center gap-1 text-[11px] cursor-pointer"
    >
      <ArrowLeft className="w-3.5 h-3.5 stroke-[1.75]" />
      <span>Indietro</span>
    </button>
    <span className="text-[12px] font-semibold text-black">{title}</span>
    <div className="w-[68px]" />
  </div>
);

export const HomeScreens: React.FC<HomeScreensProps> = ({
  activeScreen,
  tasks,
  apps,
  mascotteMood,
  mascotteStyle,
  onToggleTask,
  onToggleAppBlock,
  onChangeMascotteMood,
  onChangeMascotteStyle,
  onNavigate,
  onBack,
}) => {
  const [selectedMinutes, setSelectedMinutes] = useState<number>(25);
  const [secondsLeft, setSecondsLeft] = useState<number>(25 * 60);
  const [isLockedIn, setIsLockedIn] = useState<boolean>(false);

  useEffect(() => {
    if (!isLockedIn) return;
    const timer = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          setIsLockedIn(false);
          return selectedMinutes * 60;
        }
        return prev - 1;
      });
    }, 1000);
    return () => window.clearInterval(timer);
  }, [isLockedIn, selectedMinutes]);

  const selectDuration = (mins: number) => {
    setIsLockedIn(false);
    setSelectedMinutes(mins);
    setSecondsLeft(mins * 60);
  };

  const formatTimer = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  };

  const blockedAppsCount = apps.filter((a) => a.blocked).length;
  const activeHomeTasks = tasks.filter((t) => !t.completed).slice(0, 3);

  // ================= 1. HOME (EXACT FIGMA WIREFRAME - CENTER SCREEN) =================
  if (activeScreen === 'home') {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        {/* Top bar with circular Profilo button on left */}
        <div className="h-[58px] px-4 border-b border-black bg-white flex items-center justify-between shrink-0">
          <button
            onClick={() => onNavigate('profilo')}
            className="w-[42px] h-[42px] rounded-full border border-black bg-white hover:bg-neutral-100 flex items-center justify-center text-[11px] text-black cursor-pointer transition-colors"
            title="Apri Profilo"
          >
            Profilo
          </button>
          {isLockedIn && (
            <button
              onClick={() => onNavigate('lock-in')}
              className="border border-black px-2 py-1 text-[10px] tabular-nums bg-white hover:bg-neutral-100 cursor-pointer"
            >
              Lock in · {formatTimer(secondsLeft)}
            </button>
          )}
        </div>

        <div className="flex-1 overflow-y-auto screen-scroll flex flex-col">
          {/* Center Hero X-box (Mascotte area) + bottom-right Lock in circle */}
          <div className="px-4 py-5 border-b border-black bg-white">
          <div className="wf-x-box w-full h-[326px] relative">
            {/* Circular Lock in button positioned bottom-right overlapping the X-box exactly like Image 1 */}
            <button
              onClick={() => onNavigate('lock-in')}
              className="absolute right-1.5 bottom-1.5 w-[80px] h-[80px] rounded-full border border-black bg-white hover:bg-neutral-100 flex items-center justify-center text-[11px] text-black cursor-pointer transition-colors z-10"
              title="Avvia sessione Lock in"
            >
              Lock in
            </button>
          </div>
        </div>

        {/* Lower Promemoria list (3 rows matching Image 1) */}
        <div className="px-4 py-4 flex flex-col gap-3.5 flex-1">
          {activeHomeTasks.length > 0 ? (
            activeHomeTasks.map((task, idx) => (
              <div key={task.id} className="flex items-center gap-3">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="w-[38px] h-[38px] rounded-full border border-black bg-white hover:bg-neutral-100 shrink-0 flex items-center justify-center cursor-pointer transition-colors"
                  aria-label="Completa promemoria"
                />
                <div
                  onClick={() => onNavigate('lista')}
                  className="flex-1 border border-black bg-white px-2.5 py-1.5 min-w-0 cursor-pointer hover:bg-neutral-50"
                >
                  <div className="text-[12px] font-bold leading-tight text-black truncate">
                    {task.title}
                  </div>
                  <div className="text-[10.5px] leading-tight text-black truncate mt-0.5">
                    {idx === 0 ? task.title : task.subtitle}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="border border-black bg-white p-4 text-center text-[11px]">
              Tutti i promemoria di oggi sono completati.
            </div>
          )}
          </div>
        </div>
      </div>
    );
  }

  // ================= 2. LOCK IN =================
  if (activeScreen === 'lock-in') {
    const durations = [15, 25, 45, 60];

    return (
      <div className="flex flex-col h-full overflow-hidden">
        <SubHeader title="Lock in" onBack={onBack} />

        <div className="p-4 flex flex-col gap-5 flex-1 overflow-y-auto screen-scroll">
          {/* Selettore durata */}
          <div className="grid grid-cols-4 gap-2">
            {durations.map((mins) => (
              <button
                key={mins}
                onClick={() => selectDuration(mins)}
                className={`h-[34px] bg-white text-[11px] tabular-nums cursor-pointer ${
                  selectedMinutes === mins
                    ? 'border-[2.5px] border-black font-semibold'
                    : 'border border-black hover:bg-neutral-100'
                }`}
              >
                {mins}m
              </button>
            ))}
          </div>

          {/* Cerchio Timer centrale wireframe */}
          <div className="flex flex-col items-center justify-center py-4 border border-black bg-white">
            <div className="w-[184px] h-[184px] rounded-full border border-black flex flex-col items-center justify-center bg-white">
              <span className="text-[10px] uppercase tracking-wider text-neutral-600 mb-1">
                {isLockedIn ? 'Sessione attiva' : 'Pronto'}
              </span>
              <span className="text-[36px] font-normal tabular-nums leading-none">
                {formatTimer(secondsLeft)}
              </span>
              <span className="text-[10px] text-neutral-600 mt-2">
                {blockedAppsCount} app bloccate
              </span>
            </div>

            <button
              onClick={() => setIsLockedIn(!isLockedIn)}
              className={`mt-5 w-[180px] h-[40px] border border-black text-[12px] font-semibold cursor-pointer transition-colors ${
                isLockedIn
                  ? 'bg-white text-black hover:bg-neutral-100'
                  : 'bg-black text-white hover:bg-neutral-800'
              }`}
            >
              {isLockedIn ? 'Interrompi sessione' : 'Avvia Lock in'}
            </button>
          </div>

          {/* Pannello accesso app da bloccare */}
          <button
            onClick={() => onNavigate('blocco-app')}
            className="border border-black bg-white p-3.5 flex items-center justify-between hover:bg-neutral-100 cursor-pointer"
          >
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-semibold">App da bloccare</span>
              <span className="text-[11px] text-neutral-600 mt-0.5">
                {blockedAppsCount} di {apps.length} selezionate
              </span>
            </div>
            <span className="text-[13px]">→</span>
          </button>

          {/* Anteprima app attualmente bloccate */}
          <div className="border border-black bg-white p-3 flex flex-col gap-2">
            <span className="text-[11px] text-neutral-600">Selezionate ora</span>
            <div className="flex flex-wrap gap-1.5">
              {apps
                .filter((a) => a.blocked)
                .map((app) => (
                  <span
                    key={app.id}
                    className="border border-black px-2 py-0.5 text-[11px] bg-white"
                  >
                    {app.name}
                  </span>
                ))}
              {blockedAppsCount === 0 && (
                <span className="text-[11px] text-neutral-500">
                  Nessuna app selezionata
                </span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= 3. PANNELLO APP DA BLOCCARE =================
  if (activeScreen === 'blocco-app') {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <SubHeader title="App da bloccare" onBack={onBack} />

        <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto screen-scroll">
          <div className="border border-black bg-white px-3 py-2 text-[11px] text-neutral-600">
            Seleziona quali applicazioni bloccare durante Lock in
          </div>

          <div className="flex flex-col gap-2.5">
            {apps.map((app) => (
              <button
                key={app.id}
                onClick={() => onToggleAppBlock(app.id)}
                className="flex items-center gap-3 w-full text-left cursor-pointer group"
              >
                <div
                  className={`w-[34px] h-[34px] rounded-full border border-black shrink-0 flex items-center justify-center transition-colors ${
                    app.blocked ? 'bg-black text-white' : 'bg-white text-black'
                  }`}
                >
                  {app.blocked && <Check className="w-4 h-4 stroke-[2.2]" />}
                </div>
                <div className="flex-1 border border-black bg-white px-3 py-2 flex items-center justify-between group-hover:bg-neutral-50">
                  <div className="flex items-center gap-2.5">
                    <div className="wf-x-box w-7 h-7 shrink-0" />
                    <div>
                      <div className="text-[12px] font-semibold leading-tight">{app.name}</div>
                      <div className="text-[10px] text-neutral-600 leading-tight mt-0.5">
                        {app.minutes}m oggi · {app.notifications} notifiche
                      </div>
                    </div>
                  </div>
                  <span className="text-[10px] border border-black px-1.5 py-0.5">
                    {app.blocked ? 'Bloccata' : 'Libera'}
                  </span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ================= 4. PROFILO =================
  if (activeScreen === 'profilo') {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <SubHeader title="Profilo" onBack={onBack} />

        <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto screen-scroll">
          {/* Avatar + Nome placeholder */}
          <div className="border border-black bg-white p-4 flex items-center gap-4">
            <div className="wf-x-box w-[68px] h-[68px] rounded-full overflow-hidden shrink-0" />
            <div className="flex flex-col gap-1">
              <span className="text-[15px] font-semibold">Utente</span>
              <span className="text-[11px] text-neutral-600">
                Obiettivo giornaliero: 3h 00m
              </span>
            </div>
          </div>

          {/* Metriche rapide profilo */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="border border-black bg-white p-3 h-[88px] flex flex-col justify-between">
              <span className="text-[12px]">Giorni attivi</span>
              <span className="text-[24px] leading-none text-right tabular-nums">28</span>
            </div>
            <div className="border border-black bg-white p-3 h-[88px] flex flex-col justify-between">
              <span className="text-[12px]">Obiettivi ok</span>
              <span className="text-[24px] leading-none text-right tabular-nums">19</span>
            </div>
          </div>

          {/* 2 Sottoschermate dal diagramma: Progressi & Mascotte */}
          <button
            onClick={() => onNavigate('progressi')}
            className="border border-black bg-white p-4 flex items-center justify-between hover:bg-neutral-100 cursor-pointer"
          >
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-semibold">Progressi</span>
              <span className="text-[11px] text-neutral-600 mt-0.5">
                Progressi da quando hai installato l&apos;app
              </span>
            </div>
            <span className="text-[14px]">→</span>
          </button>

          <button
            onClick={() => onNavigate('mascotte')}
            className="border border-black bg-white p-4 flex items-center justify-between hover:bg-neutral-100 cursor-pointer"
          >
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-semibold">Mascotte</span>
              <span className="text-[11px] text-neutral-600 mt-0.5">
                Stato e personalizzazioni minime
              </span>
            </div>
            <span className="text-[14px]">→</span>
          </button>
        </div>
      </div>
    );
  }

  // ================= 5. PROGRESSI =================
  if (activeScreen === 'progressi') {
    const trendBars = [92, 84, 78, 70, 66, 58, 52];

    return (
      <div className="flex flex-col h-full overflow-hidden">
        <SubHeader title="Progressi" onBack={onBack} />

        <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto screen-scroll">
          {/* Trend dall'installazione */}
          <div className="border border-black bg-white p-3.5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px]">Andamento utilizzo</span>
              <span className="text-[11px] border border-black px-1.5 py-0.5">
                -38% dal giorno 1
              </span>
            </div>
            <div className="h-[110px] flex items-end justify-between gap-2 border-b border-black pb-1.5">
              {trendBars.map((val, i) => (
                <div key={i} className="flex-1 flex flex-col items-center h-full justify-end">
                  <div
                    className={`w-full max-w-[20px] ${
                      i === trendBars.length - 1 ? 'bg-black' : 'border border-black bg-white'
                    }`}
                    style={{ height: `${val}%` }}
                  />
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] text-neutral-600 pt-1.5">
              <span>Installazione</span>
              <span>Oggi</span>
            </div>
          </div>

          {/* Statistiche totali */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="border border-black bg-white p-3.5 h-[96px] flex flex-col justify-between">
              <span className="text-[12px]">Tempo risparmiato</span>
              <span className="text-[24px] leading-none text-right tabular-nums">18h 40m</span>
            </div>
            <div className="border border-black bg-white p-3.5 h-[96px] flex flex-col justify-between">
              <span className="text-[12px]">Sessioni Lock in</span>
              <span className="text-[24px] leading-none text-right tabular-nums">34</span>
            </div>
          </div>

          {/* Traguardi wireframe */}
          <div className="border border-black bg-white p-3.5 flex flex-col gap-3">
            <span className="text-[13px]">Traguardi</span>
            {[
              { label: 'Prima settimana sotto le 3h', pct: 100 },
              { label: '10 sessioni Lock in completate', pct: 100 },
              { label: '30 giorni consecutivi', pct: 70 },
            ].map((m) => (
              <div key={m.label} className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px]">
                  <span>{m.label}</span>
                  <span className="tabular-nums">{m.pct}%</span>
                </div>
                <div className="w-full h-[10px] border border-black bg-white">
                  <div className="h-full bg-black" style={{ width: `${m.pct}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ================= 6. MASCOTTE (Personalizzazioni MINIME) =================
  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SubHeader title="Mascotte" onBack={onBack} />

      <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto screen-scroll">
        {/* Preview X-box Mascotte */}
        <div className="border border-black bg-white p-4 flex flex-col gap-3">
          <div className="wf-x-box w-full h-[220px] flex items-center justify-center">
            <div className="bg-white border border-black px-3 py-1.5 text-[11px] text-center">
              <div className="font-semibold">
                Mascotte · Stile {mascotteStyle}
              </div>
              <div className="text-[10px] text-neutral-600">
                Stato: {mascotteMood === 'felice' ? 'Felice' : 'Arrabbiata'}
              </div>
            </div>
          </div>

          {/* Toggle stato Felice / Arrabbiata */}
          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => onChangeMascotteMood('felice')}
              className={`h-[36px] text-[11px] cursor-pointer ${
                mascotteMood === 'felice'
                  ? 'border-[2.5px] border-black font-semibold bg-white'
                  : 'border border-black bg-white hover:bg-neutral-100'
              }`}
            >
              Stato: Felice
            </button>
            <button
              onClick={() => onChangeMascotteMood('arrabbiata')}
              className={`h-[36px] text-[11px] cursor-pointer ${
                mascotteMood === 'arrabbiata'
                  ? 'border-[2.5px] border-black font-semibold bg-white'
                  : 'border border-black bg-white hover:bg-neutral-100'
              }`}
            >
              Stato: Arrabbiata
            </button>
          </div>
        </div>

        {/* Personalizzazioni minime (come da post-it) */}
        <div className="border border-black bg-white p-3.5 flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <span className="text-[13px]">Personalizzazione minima</span>
            <span className="text-[10px] text-neutral-500">3 opzioni</span>
          </div>
          <div className="grid grid-cols-3 gap-2.5">
            {[1, 2, 3].map((styleNum) => (
              <button
                key={styleNum}
                onClick={() => onChangeMascotteStyle(styleNum)}
                className={`p-2 flex flex-col items-center gap-1.5 bg-white cursor-pointer ${
                  mascotteStyle === styleNum
                    ? 'border-[2.5px] border-black font-semibold'
                    : 'border border-black hover:bg-neutral-100'
                }`}
              >
                <div className="wf-x-box w-full aspect-square" />
                <span className="text-[10px]">Stile {styleNum}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
