import React, { useState } from 'react';
import { AppUsageItem, DayNoteItem, ScreenId } from '../../types';
import { ArrowLeft, ChevronLeft, ChevronRight, Plus } from 'lucide-react';

interface PanoramicaProps {
  activeScreen:
    | 'panoramica-giornaliera'
    | 'panoramica-settimanale'
    | 'panoramica-mensile'
    | 'calendario'
    | 'note-giornata'
    | 'dettagli-app';
  apps: AppUsageItem[];
  selectedAppId: string;
  notes: DayNoteItem[];
  onSelectApp: (appId: string) => void;
  onNavigate: (screenId: ScreenId) => void;
  onBack: () => void;
  onAddNote: (text: string) => void;
}

const PeriodTopBar: React.FC<{
  active: 'mensile' | 'settimanale' | 'giornaliero';
  onNavigate: (screenId: ScreenId) => void;
}> = ({ active, onNavigate }) => {
  const btnBase =
    'h-[34px] min-w-[84px] px-2.5 bg-white text-[11px] text-black flex items-center justify-center transition-colors cursor-pointer';

  return (
    <div className="h-[58px] px-4 border-b border-black bg-white flex items-center justify-between shrink-0">
      <button
        onClick={() => onNavigate('panoramica-mensile')}
        className={`${btnBase} ${
          active === 'mensile'
            ? 'border-[2.5px] border-black font-semibold'
            : 'border border-black hover:bg-neutral-100'
        }`}
      >
        Mensile
      </button>
      <button
        onClick={() => onNavigate('panoramica-settimanale')}
        className={`${btnBase} ${
          active === 'settimanale'
            ? 'border-[2.5px] border-black font-semibold'
            : 'border border-black hover:bg-neutral-100'
        }`}
      >
        Settimanale
      </button>
      <button
        onClick={() => onNavigate('panoramica-giornaliera')}
        className={`${btnBase} ${
          active === 'giornaliero'
            ? 'border-[2.5px] border-black font-semibold'
            : 'border border-black hover:bg-neutral-100'
        }`}
      >
        Giornaliero
      </button>
    </div>
  );
};

const SubScreenTopBar: React.FC<{
  title: string;
  onBack: () => void;
  rightSlot?: React.ReactNode;
}> = ({ title, onBack, rightSlot }) => (
  <div className="h-[58px] px-4 border-b border-black bg-white flex items-center justify-between shrink-0">
    <button
      onClick={onBack}
      className="h-[34px] px-2.5 border border-black bg-white hover:bg-neutral-100 flex items-center gap-1 text-[11px] cursor-pointer"
    >
      <ArrowLeft className="w-3.5 h-3.5 stroke-[1.75]" />
      <span>Indietro</span>
    </button>
    <span className="text-[12px] font-semibold tracking-tight text-black truncate px-2">
      {title}
    </span>
    <div className="min-w-[68px] flex justify-end">{rightSlot}</div>
  </div>
);

const WireframeBar: React.FC<{
  fillPercent: number;
  limitPercent: number;
}> = ({ fillPercent, limitPercent }) => (
  <div className="relative w-full h-[18px] border border-black bg-white">
    <div
      className="h-full bg-black transition-all duration-300"
      style={{ width: `${Math.min(100, Math.max(0, fillPercent))}%` }}
    />
    {/* Threshold vertical tick crossing the progress bar, matching Figma wireframe */}
    <div
      className="absolute -top-[8px] -bottom-[8px] w-[1px] bg-black"
      style={{ left: `${limitPercent}%` }}
    />
  </div>
);

export const PanoramicaScreens: React.FC<PanoramicaProps> = ({
  activeScreen,
  apps,
  selectedAppId,
  notes,
  onSelectApp,
  onNavigate,
  onBack,
  onAddNote,
}) => {
  const [selectedDay, setSelectedDay] = useState<number>(22);
  const [newNoteText, setNewNoteText] = useState('');

  const topApp = apps[0];
  const secondApp = apps[1];
  const otherApp = apps[apps.length - 1];
  const selectedApp = apps.find((a) => a.id === selectedAppId) || topApp;

  const openAppDetails = (appId: string) => {
    onSelectApp(appId);
    onNavigate('dettagli-app');
  };

  // ================= 1. PANORAMICA GIORNALIERA (EXACT FIGMA WIREFRAME) =================
  if (activeScreen === 'panoramica-giornaliera') {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <PeriodTopBar active="giornaliero" onNavigate={onNavigate} />

        <div className="p-4 flex flex-col gap-5 flex-1 overflow-y-auto screen-scroll">
          {/* Tempo di utilizzo */}
          <div className="border border-black bg-white p-3.5 flex flex-col">
            <span className="text-[13px] text-black">Tempo di utilizzo</span>
            <div className="mt-4 mb-5">
              <WireframeBar fillPercent={71} limitPercent={84} />
            </div>
            <div className="text-[28px] leading-none font-normal text-right tabular-nums tracking-tight text-black">
              2h 53m
            </div>
          </div>

          {/* Applicazioni usate */}
          <div className="border border-black bg-white p-3.5 flex flex-col">
            <span className="text-[13px] text-black">Applicazioni usate</span>

            {/* Segmented horizontal bar */}
            <div className="mt-3">
              <div className="flex w-full h-[22px] border border-black bg-white text-[10px]">
                <button
                  onClick={() => openAppDetails(topApp.id)}
                  className="w-[52%] border-r border-black px-1.5 flex items-center text-left hover:bg-neutral-100 cursor-pointer truncate"
                  title="Apri dettagli App 1"
                >
                  {topApp.name}
                </button>
                <button
                  onClick={() => openAppDetails(secondApp.id)}
                  className="w-[30%] border-r border-black px-1.5 flex items-center text-left hover:bg-neutral-100 cursor-pointer truncate"
                  title="Apri dettagli App 2"
                >
                  {secondApp.name}
                </button>
                <button
                  onClick={() => openAppDetails(otherApp.id)}
                  className="w-[18%] px-1 flex items-center text-left hover:bg-neutral-100 cursor-pointer truncate"
                  title="Apri dettagli Altro"
                >
                  {otherApp.name}
                </button>
              </div>
              <div className="flex w-full text-[11px] tabular-nums mt-1.5">
                <div className="w-[52%] text-center">{topApp.percent}%</div>
                <div className="w-[30%] text-center">{secondApp.percent}%</div>
                <div className="w-[18%] text-center">{otherApp.percent}%</div>
              </div>
            </div>

            {/* App 1 detailed progress bar */}
            <button
              onClick={() => openAppDetails(topApp.id)}
              className="mt-6 text-left group cursor-pointer"
              title="Tocca per vedere i dettagli di App 1"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-[13px] text-black group-hover:underline">
                  {topApp.name}
                </span>
                <span className="text-[10px] text-neutral-500">Dettagli →</span>
              </div>
              <div className="mb-1.5">
                <WireframeBar fillPercent={87} limitPercent={83} />
              </div>
            </button>
          </div>

          {/* Notifiche & Attivazioni */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="border border-black bg-white p-3.5 h-[112px] flex flex-col justify-between">
              <span className="text-[13px] text-black">Notifiche</span>
              <span className="text-[28px] leading-none font-normal text-right tabular-nums text-black">
                58
              </span>
            </div>
            <div className="border border-black bg-white p-3.5 h-[112px] flex flex-col justify-between">
              <span className="text-[13px] text-black">Attivazioni</span>
              <span className="text-[28px] leading-none font-normal text-right tabular-nums text-black">
                123
              </span>
            </div>
          </div>

          {/* Note sulla giornata (Branch from flowchart) */}
          <button
            onClick={() => onNavigate('note-giornata')}
            className="border border-black bg-white px-3.5 py-3 flex items-center justify-between hover:bg-neutral-100 transition-colors cursor-pointer"
          >
            <div className="flex flex-col text-left">
              <span className="text-[13px] text-black">Note sulla giornata</span>
              <span className="text-[10px] text-neutral-500">
                {notes.length} note salvate oggi
              </span>
            </div>
            <span className="text-[12px] text-black">→</span>
          </button>
        </div>
      </div>
    );
  }

  // ================= 2. PANORAMICA SETTIMANALE =================
  if (activeScreen === 'panoramica-settimanale') {
    const weekDays = [
      { d: 'L', h: 68, prev: 80 },
      { d: 'M', h: 54, prev: 65 },
      { d: 'M', h: 78, prev: 72 },
      { d: 'G', h: 48, prev: 75 },
      { d: 'V', h: 86, prev: 92 },
      { d: 'S', h: 62, prev: 84 },
      { d: 'D', h: 52, prev: 68 },
    ];

    return (
      <div className="flex flex-col h-full overflow-hidden">
        <PeriodTopBar active="settimanale" onNavigate={onNavigate} />

        <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto screen-scroll">
          {/* Tempo settimanale + confronto settimana precedente */}
          <div className="border border-black bg-white p-3.5 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-black">Media settimanale</span>
              <span className="text-[11px] border border-black px-1.5 py-0.5 tabular-nums">
                -14% vs prec.
              </span>
            </div>
            <div className="mt-4 mb-4">
              <WireframeBar fillPercent={64} limitPercent={78} />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] text-neutral-600">
                Sett. prec.: 3h 18m / g
              </span>
              <span className="text-[26px] leading-none font-normal tabular-nums text-black">
                2h 49m
              </span>
            </div>
          </div>

          {/* Grafico confronto 7 giorni */}
          <div className="border border-black bg-white p-3.5 flex flex-col">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[13px] text-black">Confronto giorni</span>
              <div className="flex items-center gap-2 text-[9px] text-neutral-600">
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 bg-black inline-block" /> Questa
                </span>
                <span className="flex items-center gap-1">
                  <span className="w-2.5 h-2.5 border border-black bg-white inline-block" /> Prec.
                </span>
              </div>
            </div>

            <div className="h-[116px] flex items-end justify-between gap-2 pt-2 border-b border-black pb-1.5">
              {weekDays.map((item, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                  <div className="w-full flex items-end justify-center gap-0.5 flex-1">
                    <div
                      className="w-[9px] border border-black bg-white"
                      style={{ height: `${item.prev}%` }}
                    />
                    <div
                      className="w-[9px] bg-black"
                      style={{ height: `${item.h}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
            <div className="flex justify-between text-[10px] pt-1.5">
              {weekDays.map((item, idx) => (
                <span key={idx} className="flex-1 text-center">
                  {item.d}
                </span>
              ))}
            </div>
          </div>

          {/* Notifiche & Attivazioni settimanali */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="border border-black bg-white p-3 flex flex-col justify-between h-[96px]">
              <span className="text-[12px] text-black">Notifiche / sett.</span>
              <div className="text-right">
                <span className="text-[24px] leading-none tabular-nums block">384</span>
                <span className="text-[10px] text-neutral-600">-22 vs prec.</span>
              </div>
            </div>
            <div className="border border-black bg-white p-3 flex flex-col justify-between h-[96px]">
              <span className="text-[12px] text-black">Attivazioni / sett.</span>
              <div className="text-right">
                <span className="text-[24px] leading-none tabular-nums block">812</span>
                <span className="text-[10px] text-neutral-600">-48 vs prec.</span>
              </div>
            </div>
          </div>

          {/* Link a Panoramica Mensile */}
          <button
            onClick={() => onNavigate('panoramica-mensile')}
            className="border border-black bg-white px-3.5 py-3 flex items-center justify-between hover:bg-neutral-100 cursor-pointer"
          >
            <span className="text-[12px]">Vai a Panoramica Mensile</span>
            <span className="text-[12px]">→</span>
          </button>
        </div>
      </div>
    );
  }

  // ================= 3. PANORAMICA MENSILE =================
  if (activeScreen === 'panoramica-mensile') {
    const weeks = [
      { label: 'Sett. 1', fill: 78, time: '3h 12m' },
      { label: 'Sett. 2', fill: 68, time: '2h 58m' },
      { label: 'Sett. 3', fill: 62, time: '2h 44m' },
      { label: 'Sett. 4', fill: 55, time: '2h 31m' },
    ];

    return (
      <div className="flex flex-col h-full overflow-hidden">
        <PeriodTopBar active="mensile" onNavigate={onNavigate} />

        <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto screen-scroll">
          {/* Riepilogo Mensile */}
          <div className="border border-black bg-white p-3.5 flex flex-col">
            <div className="flex items-center justify-between">
              <span className="text-[13px] text-black">Novembre 2026</span>
              <span className="text-[11px] text-neutral-600">Media giornaliera</span>
            </div>
            <div className="mt-4 mb-4">
              <WireframeBar fillPercent={66} limitPercent={80} />
            </div>
            <div className="flex items-baseline justify-between">
              <span className="text-[11px] text-neutral-600">Totale: 84h 20m</span>
              <span className="text-[26px] leading-none tabular-nums">2h 48m</span>
            </div>
          </div>

          {/* Andamento 4 settimane */}
          <div className="border border-black bg-white p-3.5 flex flex-col gap-3">
            <span className="text-[13px] text-black">Andamento mensile</span>
            {weeks.map((w) => (
              <div key={w.label} className="flex flex-col gap-1">
                <div className="flex justify-between text-[11px]">
                  <span>{w.label}</span>
                  <span className="tabular-nums">{w.time}</span>
                </div>
                <div className="w-full h-[12px] border border-black bg-white">
                  <div className="h-full bg-black" style={{ width: `${w.fill}%` }} />
                </div>
              </div>
            ))}
          </div>

          {/* Notifiche & Attivazioni del mese */}
          <div className="grid grid-cols-2 gap-3.5">
            <div className="border border-black bg-white p-3 h-[86px] flex flex-col justify-between">
              <span className="text-[12px]">Notifiche mese</span>
              <span className="text-[22px] leading-none text-right tabular-nums">1.640</span>
            </div>
            <div className="border border-black bg-white p-3 h-[86px] flex flex-col justify-between">
              <span className="text-[12px]">Attivazioni mese</span>
              <span className="text-[22px] leading-none text-right tabular-nums">3.412</span>
            </div>
          </div>

          {/* Bottone per aprire il Calendario (dal diagramma) */}
          <button
            onClick={() => onNavigate('calendario')}
            className="border-[2px] border-black bg-white px-3.5 py-3 flex items-center justify-between hover:bg-neutral-100 cursor-pointer"
          >
            <div className="flex flex-col text-left">
              <span className="text-[13px] font-semibold">Calendario</span>
              <span className="text-[10px] text-neutral-600">
                Scorri tra le date e consulta i dati
              </span>
            </div>
            <span className="text-[13px]">→</span>
          </button>
        </div>
      </div>
    );
  }

  // ================= 4. CALENDARIO =================
  if (activeScreen === 'calendario') {
    const days = Array.from({ length: 30 }, (_, i) => i + 1);
    const dayHours = 1 + (selectedDay % 3);
    const dayMins = 12 + ((selectedDay * 7) % 45);
    const dayNotifs = 32 + ((selectedDay * 9) % 45);
    const dayActivations = 75 + ((selectedDay * 11) % 70);
    const fillPct = Math.min(95, 35 + ((selectedDay * 13) % 58));

    return (
      <div className="flex flex-col h-full overflow-hidden">
        <SubScreenTopBar title="Calendario" onBack={onBack} />

        <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto screen-scroll">
          {/* Selettore Mese */}
          <div className="border border-black bg-white px-3 py-2 flex items-center justify-between">
            <button
              onClick={() => setSelectedDay((d) => (d > 1 ? d - 1 : 30))}
              className="w-7 h-7 border border-black flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
              title="Giorno precedente"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-[13px] font-semibold">Novembre 2026</span>
            <button
              onClick={() => setSelectedDay((d) => (d < 30 ? d + 1 : 1))}
              className="w-7 h-7 border border-black flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
              title="Giorno successivo"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {/* Griglia Giorni */}
          <div className="border border-black bg-white p-3">
            <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] font-semibold pb-2 border-b border-black mb-2">
              <span>L</span>
              <span>M</span>
              <span>M</span>
              <span>G</span>
              <span>V</span>
              <span>S</span>
              <span>D</span>
            </div>
            <div className="grid grid-cols-7 gap-1.5">
              {days.map((d) => {
                const isSelected = d === selectedDay;
                return (
                  <button
                    key={d}
                    onClick={() => setSelectedDay(d)}
                    className={`aspect-square text-[11px] tabular-nums flex items-center justify-center cursor-pointer transition-colors ${
                      isSelected
                        ? 'bg-black text-white border-[2px] border-black font-bold'
                        : 'bg-white text-black border border-black hover:bg-neutral-100'
                    }`}
                  >
                    {d}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Dati relativi alla data selezionata */}
          <div className="border border-black bg-white p-3.5 flex flex-col gap-3">
            <div className="flex items-center justify-between border-b border-black pb-2">
              <span className="text-[12px] font-semibold">
                Dati del {selectedDay} Novembre
              </span>
              <span className="text-[11px] tabular-nums">
                {dayHours}h {dayMins}m
              </span>
            </div>
            <div className="py-1">
              <WireframeBar fillPercent={fillPct} limitPercent={80} />
            </div>
            <div className="grid grid-cols-2 gap-3 pt-1">
              <div className="border border-black p-2.5 flex flex-col justify-between h-[66px]">
                <span className="text-[11px]">Notifiche</span>
                <span className="text-[18px] text-right tabular-nums leading-none">
                  {dayNotifs}
                </span>
              </div>
              <div className="border border-black p-2.5 flex flex-col justify-between h-[66px]">
                <span className="text-[11px]">Attivazioni</span>
                <span className="text-[18px] text-right tabular-nums leading-none">
                  {dayActivations}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= 5. NOTE SULLA GIORNATA =================
  if (activeScreen === 'note-giornata') {
    const handleSave = (e: React.FormEvent) => {
      e.preventDefault();
      if (!newNoteText.trim()) return;
      onAddNote(newNoteText.trim());
      setNewNoteText('');
    };

    return (
      <div className="flex flex-col h-full overflow-hidden">
        <SubScreenTopBar title="Note sulla giornata" onBack={onBack} />

        <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto screen-scroll">
          {/* Form aggiungi nota */}
          <form onSubmit={handleSave} className="border border-black bg-white p-3 flex flex-col gap-2.5">
            <span className="text-[12px] font-semibold">Nuova nota</span>
            <textarea
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              placeholder="Scrivi una nota sulla giornata..."
              rows={3}
              className="w-full border border-black p-2 text-[12px] resize-none focus:outline-none focus:ring-1 focus:ring-black"
            />
            <button
              type="submit"
              className="self-end border border-black bg-white hover:bg-black hover:text-white px-3 py-1.5 text-[11px] flex items-center gap-1 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Salva nota</span>
            </button>
          </form>

          {/* Elenco note */}
          <div className="flex flex-col gap-2.5">
            <span className="text-[12px] text-neutral-600">Note registrate</span>
            {notes.map((n) => (
              <div key={n.id} className="border border-black bg-white p-3 flex flex-col gap-1">
                <span className="text-[10px] text-neutral-500">{n.dateLabel}</span>
                <p className="text-[12px] text-black leading-snug">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ================= 6. DETTAGLI UTILIZZO SINGOLA APPLICAZIONE =================
  const appHours = Math.floor(selectedApp.minutes / 60);
  const appMins = selectedApp.minutes % 60;
  const appLimitRatio = Math.min(100, Math.round((selectedApp.minutes / (selectedApp.limitMinutes * 1.15)) * 100));
  const limitMarkerPct = Math.min(92, Math.round((selectedApp.limitMinutes / (selectedApp.limitMinutes * 1.15)) * 100));
  const dayLetters = ['L', 'M', 'M', 'G', 'V', 'S', 'D'];
  const maxWeekly = Math.max(...selectedApp.weeklyMinutes, 1);

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <SubScreenTopBar title={`Dettagli · ${selectedApp.name}`} onBack={onBack} />

      <div className="p-4 flex flex-col gap-4 flex-1 overflow-y-auto screen-scroll">
        {/* Selettore rapido app */}
        <div className="flex gap-1.5 overflow-x-auto pb-1">
          {apps.map((app) => (
            <button
              key={app.id}
              onClick={() => onSelectApp(app.id)}
              className={`px-2.5 py-1 text-[11px] whitespace-nowrap cursor-pointer ${
                app.id === selectedApp.id
                  ? 'border-[2px] border-black font-semibold bg-white'
                  : 'border border-black bg-white hover:bg-neutral-100'
              }`}
            >
              {app.name}
            </button>
          ))}
        </div>

        {/* Header App + Tempo */}
        <div className="border border-black bg-white p-3.5 flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="wf-x-box w-[44px] h-[44px] shrink-0" />
            <div className="flex-1">
              <div className="text-[14px] font-semibold">{selectedApp.name}</div>
              <div className="text-[11px] text-neutral-600">
                {selectedApp.percent}% del tempo giornaliero
              </div>
            </div>
            <div className="text-[22px] tabular-nums">
              {appHours > 0 ? `${appHours}h ${appMins}m` : `${appMins}m`}
            </div>
          </div>

          <div className="mt-1 mb-2">
            <WireframeBar fillPercent={appLimitRatio} limitPercent={limitMarkerPct} />
          </div>
          <span className="text-[10px] text-neutral-600 text-right">
            Limite giornaliero: {selectedApp.limitMinutes}m
          </span>
        </div>

        {/* Notifiche & Attivazioni singola app */}
        <div className="grid grid-cols-2 gap-3.5">
          <div className="border border-black bg-white p-3.5 h-[100px] flex flex-col justify-between">
            <span className="text-[13px]">Notifiche</span>
            <span className="text-[26px] leading-none text-right tabular-nums">
              {selectedApp.notifications}
            </span>
          </div>
          <div className="border border-black bg-white p-3.5 h-[100px] flex flex-col justify-between">
            <span className="text-[13px]">Attivazioni</span>
            <span className="text-[26px] leading-none text-right tabular-nums">
              {selectedApp.activations}
            </span>
          </div>
        </div>

        {/* Panoramica sul resto dei giorni */}
        <div className="border border-black bg-white p-3.5 flex flex-col">
          <span className="text-[13px] mb-3">Panoramica altri giorni</span>
          <div className="h-[110px] flex items-end justify-between gap-2 border-b border-black pb-1.5">
            {selectedApp.weeklyMinutes.map((mins, idx) => (
              <div key={idx} className="flex-1 flex flex-col items-center h-full justify-end">
                <div
                  className={`w-full max-w-[18px] ${
                    idx === 6 ? 'bg-black' : 'border border-black bg-white'
                  }`}
                  style={{ height: `${Math.max(12, Math.round((mins / maxWeekly) * 100))}%` }}
                />
              </div>
            ))}
          </div>
          <div className="flex justify-between text-[10px] pt-1.5">
            {dayLetters.map((d, i) => (
              <span key={i} className={`flex-1 text-center ${i === 6 ? 'font-bold underline' : ''}`}>
                {d}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
