import React, { useEffect, useState } from 'react';
import {
  AppUsageItem,
  DayNoteItem,
  SavedTaskItem,
  ScreenId,
  TabId,
  TaskItem,
} from './types';
import {
  INITIAL_APPS,
  INITIAL_NOTES,
  INITIAL_SAVED_TASKS,
  INITIAL_TASKS,
  SCREENS,
  TABS,
} from './screensData';
import { IPhone15Frame } from './components/IPhone15Frame';
import { ArchitectureMap } from './components/ArchitectureMap';
import {
  Smartphone,
  GitFork,
  Columns,
  Grid3X3,
  RotateCcw,
  Maximize2,
  Minimize2,
  ChevronRight,
} from 'lucide-react';

export default function App() {
  const [currentScreenId, setCurrentScreenId] = useState<ScreenId>('home');
  const [activeTabId, setActiveTabId] = useState<TabId>('home');
  const [history, setHistory] = useState<ScreenId[]>([]);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [viewMode, setViewMode] = useState<'phone' | 'split' | 'tree'>('phone');
  const [scaleFactor, setScaleFactor] = useState<number>(0.92);

  // Interactive wireframe state shared across all 15 screens
  const [tasks, setTasks] = useState<TaskItem[]>(INITIAL_TASKS);
  const [savedTasks, setSavedTasks] = useState<SavedTaskItem[]>(INITIAL_SAVED_TASKS);
  const [apps, setApps] = useState<AppUsageItem[]>(INITIAL_APPS);
  const [selectedAppId, setSelectedAppId] = useState<string>(INITIAL_APPS[0].id);
  const [notes, setNotes] = useState<DayNoteItem[]>(INITIAL_NOTES);
  const [mascotteMood, setMascotteMood] = useState<'felice' | 'arrabbiata'>('felice');
  const [mascotteStyle, setMascotteStyle] = useState<number>(1);

  useEffect(() => {
    const handleResize = () => {
      const availableHeight = window.innerHeight - 135;
      if (availableHeight < 860) {
        const factor = Math.max(0.65, Math.min(1, availableHeight / 890));
        setScaleFactor(Number(factor.toFixed(2)));
      } else {
        setScaleFactor(0.95);
      }
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const currentScreen = SCREENS[currentScreenId];

  const handleNavigate = (targetId: ScreenId) => {
    if (targetId === currentScreenId) return;

    // Switching directly between Panoramica period tabs keeps clean navigation
    const periodScreens: ScreenId[] = [
      'panoramica-giornaliera',
      'panoramica-settimanale',
      'panoramica-mensile',
    ];
    if (periodScreens.includes(currentScreenId) && periodScreens.includes(targetId)) {
      setCurrentScreenId(targetId);
      setActiveTabId('utilizzo');
      if (targetId === 'panoramica-giornaliera') {
        setHistory([]);
      } else if (targetId === 'panoramica-settimanale') {
        setHistory(['panoramica-giornaliera']);
      } else {
        setHistory(['panoramica-giornaliera', 'panoramica-settimanale']);
      }
      return;
    }

    // Switching to another root tab
    if (SCREENS[targetId].isMainTab) {
      setHistory([]);
      setCurrentScreenId(targetId);
      setActiveTabId(SCREENS[targetId].tabId);
      return;
    }

    setHistory((prev) => [...prev, currentScreenId]);
    setCurrentScreenId(targetId);
    setActiveTabId(SCREENS[targetId].tabId);
  };

  const handleBack = () => {
    if (history.length > 0) {
      const newHistory = [...history];
      const prevScreenId = newHistory.pop()!;
      setHistory(newHistory);
      setCurrentScreenId(prevScreenId);
      setActiveTabId(SCREENS[prevScreenId].tabId);
      return;
    }

    // Fallback to parent screen if jumped directly
    if (currentScreen.parentId) {
      const parent = currentScreen.parentId;
      setCurrentScreenId(parent);
      setActiveTabId(SCREENS[parent].tabId);
    }
  };

  const handleTabChange = (tabId: TabId) => {
    const tabConfig = TABS.find((t) => t.id === tabId);
    if (!tabConfig) return;
    setActiveTabId(tabId);
    setCurrentScreenId(tabConfig.screenId);
    setHistory([]);
  };

  const handleDirectJump = (targetId: ScreenId, tabId: TabId) => {
    const target = SCREENS[targetId];
    const path: ScreenId[] = [];
    let curr: ScreenId | null = target.parentId;
    while (curr) {
      path.unshift(curr);
      curr = SCREENS[curr].parentId;
    }
    setHistory(path);
    setCurrentScreenId(targetId);
    setActiveTabId(tabId);
  };

  const handleReset = () => {
    setCurrentScreenId('home');
    setActiveTabId('home');
    setHistory([]);
  };

  // Interactive handlers
  const handleToggleTask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: !t.completed } : t))
    );
  };

  const handleAddTask = (title: string, subtitle: string) => {
    const newTask: TaskItem = {
      id: `t-${Date.now()}`,
      title,
      subtitle,
      completed: false,
    };
    setTasks((prev) => [newTask, ...prev]);
  };

  const handleAddSavedTask = (title: string, subtitle: string) => {
    const newSaved: SavedTaskItem = {
      id: `s-${Date.now()}`,
      title,
      subtitle,
    };
    setSavedTasks((prev) => [newSaved, ...prev]);
  };

  const handleUseSavedTask = (saved: SavedTaskItem) => {
    handleAddTask(saved.title, saved.subtitle);
  };

  const handleToggleAppBlock = (appId: string) => {
    setApps((prev) =>
      prev.map((a) => (a.id === appId ? { ...a, blocked: !a.blocked } : a))
    );
  };

  const handleAddNote = (text: string) => {
    const newNote: DayNoteItem = {
      id: `n-${Date.now()}`,
      dateLabel: 'Oggi · Adesso',
      text,
    };
    setNotes((prev) => [newNote, ...prev]);
  };

  const getBreadcrumbs = () => {
    const trail: string[] = [];
    history.forEach((id) => trail.push(SCREENS[id].title));
    trail.push(currentScreen.title);
    return trail;
  };

  return (
    <div className="min-h-screen bg-[#ececec] wf-canvas-grid text-black flex flex-col font-sans select-none">
      {/* Studio Top Bar */}
      <header className="h-14 bg-white border-b border-black px-4 sm:px-6 flex items-center justify-between shrink-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-3.5 h-3.5 bg-black" />
          <div className="flex flex-col">
            <h1 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-black leading-tight">
              Wireframe iPhone 15
            </h1>
            <span className="text-[10px] text-neutral-500 uppercase tracking-wider hidden sm:inline">
              393 × 852 px · 15 Schermate Collegate
            </span>
          </div>
        </div>

        {/* View Mode Switcher */}
        <div className="flex items-center p-0.5 bg-neutral-100 border border-black">
          <button
            onClick={() => setViewMode('phone')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              viewMode === 'phone'
                ? 'bg-black text-white'
                : 'text-black hover:bg-neutral-200'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden md:inline">iPhone 15</span>
          </button>
          <button
            onClick={() => setViewMode('split')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              viewMode === 'split'
                ? 'bg-black text-white'
                : 'text-black hover:bg-neutral-200'
            }`}
          >
            <Columns className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Affiancata</span>
          </button>
          <button
            onClick={() => setViewMode('tree')}
            className={`flex items-center gap-1.5 px-3 py-1 text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
              viewMode === 'tree'
                ? 'bg-black text-white'
                : 'text-black hover:bg-neutral-200'
            }`}
          >
            <GitFork className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Schema</span>
          </button>
        </div>

        {/* Toolbar Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowGrid(!showGrid)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 border border-black text-xs font-semibold cursor-pointer transition-colors ${
              showGrid
                ? 'bg-black text-white'
                : 'bg-white text-black hover:bg-neutral-100'
            }`}
            title="Mostra/nascondi griglia colonne Figma"
          >
            <Grid3X3 className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Griglia</span>
          </button>

          <div className="hidden lg:flex items-center border border-black bg-white">
            <button
              onClick={() =>
                setScaleFactor((prev) => Math.max(0.65, Number((prev - 0.05).toFixed(2))))
              }
              className="px-2 py-1.5 hover:bg-neutral-100 border-r border-black cursor-pointer"
              title="Riduci zoom"
            >
              <Minimize2 className="w-3.5 h-3.5" />
            </button>
            <span className="px-2 text-[11px] font-semibold tabular-nums">
              {Math.round(scaleFactor * 100)}%
            </span>
            <button
              onClick={() =>
                setScaleFactor((prev) => Math.min(1.15, Number((prev + 0.05).toFixed(2))))
              }
              className="px-2 py-1.5 hover:bg-neutral-100 border-l border-black cursor-pointer"
              title="Aumenta zoom"
            >
              <Maximize2 className="w-3.5 h-3.5" />
            </button>
          </div>

          <button
            onClick={handleReset}
            className="flex items-center gap-1.5 px-2.5 py-1.5 border border-black bg-white hover:bg-neutral-100 text-xs font-semibold cursor-pointer"
            title="Torna alla Home"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden xl:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* Breadcrumb Bar */}
      <div className="bg-white border-b border-neutral-300 px-4 sm:px-6 py-2 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap">
          <span className="text-neutral-500 font-semibold uppercase text-[10px]">
            Percorso:
          </span>
          {getBreadcrumbs().map((crumb, idx, arr) => (
            <React.Fragment key={`${crumb}-${idx}`}>
              <span
                className={`px-1.5 py-0.5 ${
                  idx === arr.length - 1
                    ? 'border border-black bg-white font-bold text-black'
                    : 'text-neutral-600'
                }`}
              >
                {crumb}
              </span>
              {idx < arr.length - 1 && (
                <ChevronRight className="w-3.5 h-3.5 text-neutral-400 shrink-0" />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="hidden sm:flex items-center gap-4 text-[11px] text-neutral-600 shrink-0">
          <span>
            Scheda:{' '}
            <strong className="text-black">
              {TABS.find((t) => t.id === activeTabId)?.label}
            </strong>
          </span>
        </div>
      </div>

      {/* Main Stage */}
      <main className="flex-1 flex overflow-auto p-4 sm:p-6 items-start justify-center">
        {viewMode === 'phone' && (
          <div className="flex flex-col items-center justify-center w-full py-1">
            <div
              style={{
                transform: `scale(${scaleFactor})`,
                transformOrigin: 'top center',
                marginBottom: `${-(852 * (1 - scaleFactor))}px`,
              }}
              className="transition-transform duration-150"
            >
              <IPhone15Frame
                currentScreenId={currentScreenId}
                activeTabId={activeTabId}
                tasks={tasks}
                savedTasks={savedTasks}
                apps={apps}
                selectedAppId={selectedAppId}
                notes={notes}
                mascotteMood={mascotteMood}
                mascotteStyle={mascotteStyle}
                showGrid={showGrid}
                onNavigate={handleNavigate}
                onBack={handleBack}
                onTabChange={handleTabChange}
                onSelectApp={setSelectedAppId}
                onToggleTask={handleToggleTask}
                onAddTask={handleAddTask}
                onAddSavedTask={handleAddSavedTask}
                onUseSavedTask={handleUseSavedTask}
                onToggleAppBlock={handleToggleAppBlock}
                onAddNote={handleAddNote}
                onChangeMascotteMood={setMascotteMood}
                onChangeMascotteStyle={setMascotteStyle}
              />
            </div>
          </div>
        )}

        {viewMode === 'split' && (
          <div className="w-full max-w-7xl flex flex-col xl:flex-row items-center xl:items-start justify-center gap-8 py-1">
            <div className="shrink-0 flex justify-center">
              <div
                style={{
                  transform: `scale(${scaleFactor})`,
                  transformOrigin: 'top center',
                  marginBottom: `${-(852 * (1 - scaleFactor))}px`,
                }}
                className="transition-transform duration-150"
              >
                <IPhone15Frame
                  currentScreenId={currentScreenId}
                  activeTabId={activeTabId}
                  tasks={tasks}
                  savedTasks={savedTasks}
                  apps={apps}
                  selectedAppId={selectedAppId}
                  notes={notes}
                  mascotteMood={mascotteMood}
                  mascotteStyle={mascotteStyle}
                  showGrid={showGrid}
                  onNavigate={handleNavigate}
                  onBack={handleBack}
                  onTabChange={handleTabChange}
                  onSelectApp={setSelectedAppId}
                  onToggleTask={handleToggleTask}
                  onAddTask={handleAddTask}
                  onAddSavedTask={handleAddSavedTask}
                  onUseSavedTask={handleUseSavedTask}
                  onToggleAppBlock={handleToggleAppBlock}
                  onAddNote={handleAddNote}
                  onChangeMascotteMood={setMascotteMood}
                  onChangeMascotteStyle={setMascotteStyle}
                />
              </div>
            </div>

            <div className="flex-1 w-full xl:max-w-3xl">
              <ArchitectureMap
                currentScreenId={currentScreenId}
                onSelectScreen={handleDirectJump}
              />
            </div>
          </div>
        )}

        {viewMode === 'tree' && (
          <div className="w-full max-w-5xl py-1">
            <ArchitectureMap
              currentScreenId={currentScreenId}
              onSelectScreen={(screenId, tabId) => {
                handleDirectJump(screenId, tabId);
                setViewMode('split');
              }}
            />
          </div>
        )}
      </main>
    </div>
  );
}
