import React, { useState } from 'react';
import {
  AppUsageItem,
  DayNoteItem,
  SavedTaskItem,
  ScreenId,
  TabId,
  TaskItem,
} from '../types';
import { SCREENS, TABS } from '../screensData';
import { PanoramicaScreens } from './screens/PanoramicaScreens';
import { HomeScreens } from './screens/HomeScreens';
import { ListaScreens } from './screens/ListaScreens';
import { Wifi, Battery } from 'lucide-react';

interface IPhone15FrameProps {
  currentScreenId: ScreenId;
  activeTabId: TabId;
  tasks: TaskItem[];
  savedTasks: SavedTaskItem[];
  apps: AppUsageItem[];
  selectedAppId: string;
  notes: DayNoteItem[];
  mascotteMood: 'felice' | 'arrabbiata';
  mascotteStyle: number;
  showGrid: boolean;
  onNavigate: (screenId: ScreenId) => void;
  onBack: () => void;
  onTabChange: (tabId: TabId) => void;
  onSelectApp: (appId: string) => void;
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string, subtitle: string) => void;
  onAddSavedTask: (title: string, subtitle: string) => void;
  onUseSavedTask: (saved: SavedTaskItem) => void;
  onToggleAppBlock: (appId: string) => void;
  onAddNote: (text: string) => void;
  onChangeMascotteMood: (mood: 'felice' | 'arrabbiata') => void;
  onChangeMascotteStyle: (style: number) => void;
}

export const IPhone15Frame: React.FC<IPhone15FrameProps> = ({
  currentScreenId,
  activeTabId,
  tasks,
  savedTasks,
  apps,
  selectedAppId,
  notes,
  mascotteMood,
  mascotteStyle,
  showGrid,
  onNavigate,
  onBack,
  onTabChange,
  onSelectApp,
  onToggleTask,
  onAddTask,
  onAddSavedTask,
  onUseSavedTask,
  onToggleAppBlock,
  onAddNote,
  onChangeMascotteMood,
  onChangeMascotteStyle,
}) => {
  const currentScreen = SCREENS[currentScreenId];
  const [islandExpanded, setIslandExpanded] = useState(false);

  const renderActiveScreen = () => {
    switch (currentScreenId) {
      case 'panoramica-giornaliera':
      case 'panoramica-settimanale':
      case 'panoramica-mensile':
      case 'calendario':
      case 'note-giornata':
      case 'dettagli-app':
        return (
          <PanoramicaScreens
            activeScreen={currentScreenId}
            apps={apps}
            selectedAppId={selectedAppId}
            notes={notes}
            onSelectApp={onSelectApp}
            onNavigate={onNavigate}
            onBack={onBack}
            onAddNote={onAddNote}
          />
        );

      case 'home':
      case 'lock-in':
      case 'blocco-app':
      case 'profilo':
      case 'progressi':
      case 'mascotte':
        return (
          <HomeScreens
            activeScreen={currentScreenId}
            tasks={tasks}
            apps={apps}
            mascotteMood={mascotteMood}
            mascotteStyle={mascotteStyle}
            onToggleTask={onToggleTask}
            onToggleAppBlock={onToggleAppBlock}
            onChangeMascotteMood={onChangeMascotteMood}
            onChangeMascotteStyle={onChangeMascotteStyle}
            onNavigate={onNavigate}
            onBack={onBack}
          />
        );

      case 'lista':
      case 'task-completate':
      case 'task-salvate':
        return (
          <ListaScreens
            activeScreen={currentScreenId}
            tasks={tasks}
            savedTasks={savedTasks}
            onToggleTask={onToggleTask}
            onAddTask={onAddTask}
            onAddSavedTask={onAddSavedTask}
            onUseSavedTask={onUseSavedTask}
            onNavigate={onNavigate}
            onBack={onBack}
          />
        );
    }
  };

  return (
    <div className="relative select-none">
      {/* iPhone 15 Hardware Chassis (393 × 852 px) */}
      <div className="w-[393px] h-[852px] bg-white border-[4px] border-black rounded-[54px] relative flex flex-col overflow-hidden shadow-[0_24px_60px_-15px_rgba(0,0,0,0.28)] box-border">
        {/* Side hardware button details */}
        <div className="absolute -left-[7px] top-[140px] w-[3px] h-[34px] bg-black rounded-l-sm" />
        <div className="absolute -left-[7px] top-[190px] w-[3px] h-[58px] bg-black rounded-l-sm" />
        <div className="absolute -left-[7px] top-[260px] w-[3px] h-[58px] bg-black rounded-l-sm" />
        <div className="absolute -right-[7px] top-[190px] w-[3px] h-[75px] bg-black rounded-r-sm" />

        {/* Dynamic Island */}
        <div
          onClick={() => setIslandExpanded(!islandExpanded)}
          className={`absolute top-[11px] left-1/2 -translate-x-1/2 bg-black rounded-full z-50 flex items-center justify-between px-3 cursor-pointer transition-all duration-200 ${
            islandExpanded ? 'w-[216px] h-[38px]' : 'w-[120px] h-[34px]'
          }`}
          title="Dynamic Island"
        >
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700" />
          {islandExpanded ? (
            <span className="text-[10px] text-white font-medium truncate px-2">
              {currentScreen.title}
            </span>
          ) : (
            <div className="w-2 h-2 rounded-full bg-neutral-900" />
          )}
          <div className="w-2.5 h-2.5 rounded-full bg-neutral-900 border border-neutral-700" />
        </div>

        {/* Status Bar */}
        <div className="h-[50px] pt-3 px-7 flex items-center justify-between text-black text-[13px] font-semibold z-40 bg-white shrink-0">
          <span className="tabular-nums tracking-tight">9:41</span>
          <div className="flex items-center gap-1.5">
            <div className="flex items-end gap-[1.5px] h-2.5">
              <span className="w-[2.5px] h-1 bg-black" />
              <span className="w-[2.5px] h-1.5 bg-black" />
              <span className="w-[2.5px] h-2 bg-black" />
              <span className="w-[2.5px] h-2.5 bg-black" />
            </div>
            <Wifi className="w-3.5 h-3.5 text-black" />
            <Battery className="w-4 h-4 text-black" />
          </div>
        </div>

        {/* Screen Viewport (each screen pins its top bar and scrolls its content) */}
        <main className="flex-1 overflow-hidden bg-white relative flex flex-col">
          {/* Optional Figma column layout grid overlay */}
          {showGrid && (
            <div className="pointer-events-none absolute inset-0 wf-col-grid z-30" />
          )}
          <div className="relative z-10 flex-1 min-h-0 flex flex-col">
            {renderActiveScreen()}
          </div>
        </main>

        {/* Bottom Navigation Bar (Exact Figma Wireframe: 3 circular outline buttons) */}
        <nav
          className="h-[88px] border-t border-black bg-white flex flex-col justify-between pt-2.5 pb-2 px-6 z-40 shrink-0"
          aria-label="Barra di navigazione principale"
        >
          <div className="flex items-center justify-between flex-1 px-2">
            {TABS.map((tab) => {
              const isActive = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => onTabChange(tab.id)}
                  className={`w-[46px] h-[46px] rounded-full flex items-center justify-center text-[11px] bg-white text-black transition-all cursor-pointer ${
                    isActive
                      ? 'border-[2.5px] border-black font-bold'
                      : 'border border-black font-normal hover:bg-neutral-100'
                  }`}
                  aria-current={isActive ? 'page' : undefined}
                >
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* iPhone Home Indicator */}
          <div className="w-[136px] h-[4.5px] bg-black rounded-full mx-auto mt-1 shrink-0" />
        </nav>
      </div>
    </div>
  );
};
