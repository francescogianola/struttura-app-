import React from 'react';
import { ScreenId, TabId } from '../types';
import { SCREENS } from '../screensData';
import { Check, ArrowDown, CornerDownRight } from 'lucide-react';

interface ArchitectureMapProps {
  currentScreenId: ScreenId;
  onSelectScreen: (screenId: ScreenId, tabId: TabId) => void;
}

export const ArchitectureMap: React.FC<ArchitectureMapProps> = ({
  currentScreenId,
  onSelectScreen,
}) => {
  const renderNode = (
    screenId: ScreenId,
    tabId: TabId,
    isMainTab = false,
    subtitle = ''
  ) => {
    const screen = SCREENS[screenId];
    const isCurrent = currentScreenId === screenId;

    return (
      <button
        onClick={() => onSelectScreen(screenId, tabId)}
        className={`text-left p-2.5 border transition-all cursor-pointer w-full ${
          isCurrent
            ? 'border-[2.5px] border-black bg-black text-white'
            : isMainTab
            ? 'border-[2px] border-black bg-neutral-100 text-black hover:bg-neutral-200'
            : 'border border-black bg-white text-black hover:bg-neutral-100'
        }`}
      >
        <div className="flex items-center justify-between gap-2 mb-1">
          <span
            className={`text-[9px] uppercase tracking-wider px-1.5 py-0.5 border ${
              isCurrent
                ? 'border-white/50 text-white'
                : 'border-black bg-white text-black'
            }`}
          >
            {isMainTab ? 'Barra inferiore' : `Livello ${screen.level}`}
          </span>
          {isCurrent && (
            <span className="flex items-center gap-0.5 text-[9px] font-bold uppercase">
              <Check className="w-3 h-3" />
              Attiva
            </span>
          )}
        </div>
        <div className="text-[12px] font-bold leading-snug">{screen.title}</div>
        {subtitle && (
          <div
            className={`text-[10px] mt-0.5 leading-tight ${
              isCurrent ? 'text-neutral-300' : 'text-neutral-600'
            }`}
          >
            {subtitle}
          </div>
        )}
      </button>
    );
  };

  return (
    <div className="flex flex-col gap-5 p-5 bg-white border border-black">
      <div className="border-b border-black pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-sm font-bold uppercase tracking-wider text-black">
            Architettura Completa (15 Schermate)
          </h2>
          <p className="text-xs text-neutral-600 mt-0.5">
            Clicca su qualsiasi schermata dello schema per aprirla direttamente nell&apos;iPhone.
          </p>
        </div>
        <div className="flex items-center gap-3 text-[10px]">
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-neutral-100 border-[2px] border-black inline-block" />
            Schermate Principali (3 Tab)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-3 h-3 bg-white border border-black inline-block" />
            Sottoschermate
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* RAMO SINISTRO: PANORAMICA / UTILIZZO */}
        <div className="flex flex-col gap-2.5 p-3 bg-neutral-50 border border-dashed border-black">
          <div className="text-[11px] font-bold uppercase tracking-wider border-b border-black pb-1">
            1. Utilizzo / Panoramica
          </div>

          {renderNode(
            'panoramica-giornaliera',
            'utilizzo',
            true,
            'Tempo, app usate, notifiche, attivazioni'
          )}

          <div className="flex justify-center">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>

          <div className="flex flex-col gap-2.5 pl-2.5 border-l border-black">
            <div className="flex flex-col gap-2 p-2 bg-white border border-black">
              <div className="flex items-center gap-1 text-[9px] uppercase text-neutral-600 font-semibold">
                <CornerDownRight className="w-3 h-3" />
                Periodo e Storico
              </div>
              {renderNode(
                'panoramica-settimanale',
                'utilizzo',
                false,
                'Confronto settimana prec.'
              )}
              <div className="flex justify-center">
                <ArrowDown className="w-3 h-3" />
              </div>
              {renderNode('panoramica-mensile', 'utilizzo', false, 'Riepilogo del mese')}
              <div className="flex justify-center">
                <ArrowDown className="w-3 h-3" />
              </div>
              {renderNode('calendario', 'utilizzo', false, 'Dati per singola data')}
            </div>

            {renderNode('note-giornata', 'utilizzo', false, 'Appunti giornalieri')}
            {renderNode(
              'dettagli-app',
              'utilizzo',
              false,
              'Notifiche, tempo, altri giorni'
            )}
          </div>
        </div>

        {/* RAMO CENTRALE: HOME */}
        <div className="flex flex-col gap-2.5 p-3 bg-neutral-50 border border-dashed border-black">
          <div className="text-[11px] font-bold uppercase tracking-wider border-b border-black pb-1">
            2. Home
          </div>

          {renderNode('home', 'home', true, 'Mascotte, Lock in, Promemoria')}

          <div className="flex justify-center">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>

          <div className="flex flex-col gap-2.5 pl-2.5 border-l border-black">
            <div className="flex flex-col gap-2 p-2 bg-white border border-black">
              <div className="flex items-center gap-1 text-[9px] uppercase text-neutral-600 font-semibold">
                <CornerDownRight className="w-3 h-3" />
                Focus Mode
              </div>
              {renderNode('lock-in', 'home', false, 'Sessione concentrazione')}
              <div className="flex justify-center">
                <ArrowDown className="w-3 h-3" />
              </div>
              {renderNode('blocco-app', 'home', false, 'Selezione app da bloccare')}
            </div>

            <div className="flex flex-col gap-2 p-2 bg-white border border-black">
              <div className="flex items-center gap-1 text-[9px] uppercase text-neutral-600 font-semibold">
                <CornerDownRight className="w-3 h-3" />
                Area Utente
              </div>
              {renderNode('profilo', 'home', false, 'Riepilogo profilo')}
              <div className="grid grid-cols-2 gap-2 pt-1">
                {renderNode('progressi', 'home', false, 'Dall’installazione')}
                {renderNode('mascotte', 'home', false, 'Stile minimo')}
              </div>
            </div>
          </div>
        </div>

        {/* RAMO DESTRO: LA MIA LISTA */}
        <div className="flex flex-col gap-2.5 p-3 bg-neutral-50 border border-dashed border-black">
          <div className="text-[11px] font-bold uppercase tracking-wider border-b border-black pb-1">
            3. Lista
          </div>

          {renderNode('lista', 'lista', true, 'Elenco task del giorno')}

          <div className="flex justify-center">
            <ArrowDown className="w-3.5 h-3.5" />
          </div>

          <div className="flex flex-col gap-2.5 pl-2.5 border-l border-black">
            {renderNode('task-completate', 'lista', false, 'Storico completate')}
            {renderNode('task-salvate', 'lista', false, 'Routine quotidiane fisse')}
          </div>
        </div>
      </div>
    </div>
  );
};
