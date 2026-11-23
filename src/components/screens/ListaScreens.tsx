import React, { useState } from 'react';
import { SavedTaskItem, ScreenId, TaskItem } from '../../types';
import { ArrowLeft, Check, Plus, X } from 'lucide-react';

interface ListaScreensProps {
  activeScreen: 'lista' | 'task-completate' | 'task-salvate';
  tasks: TaskItem[];
  savedTasks: SavedTaskItem[];
  onToggleTask: (taskId: string) => void;
  onAddTask: (title: string, subtitle: string) => void;
  onAddSavedTask: (title: string, subtitle: string) => void;
  onUseSavedTask: (saved: SavedTaskItem) => void;
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

export const ListaScreens: React.FC<ListaScreensProps> = ({
  activeScreen,
  tasks,
  savedTasks,
  onToggleTask,
  onAddTask,
  onAddSavedTask,
  onUseSavedTask,
  onNavigate,
  onBack,
}) => {
  const [showAddSheet, setShowAddSheet] = useState(false);
  const [draftTitle, setDraftTitle] = useState('');
  const [draftSubtitle, setDraftSubtitle] = useState('');
  const [savedNotice, setSavedNotice] = useState<string | null>(null);

  const activeTasks = tasks.filter((t) => !t.completed);
  const completedTasks = tasks.filter((t) => t.completed);

  const handleAddNew = (e: React.FormEvent) => {
    e.preventDefault();
    const title = draftTitle.trim() || 'Promemoria';
    const subtitle =
      draftSubtitle.trim() || 'Lorem ipsum dolor sit amet consectetur. Vulputate';
    if (activeScreen === 'task-salvate') {
      onAddSavedTask(title, subtitle);
    } else {
      onAddTask(title, subtitle);
    }
    setDraftTitle('');
    setDraftSubtitle('');
    setShowAddSheet(false);
  };

  // ================= 1. LA MIA LISTA (EXACT FIGMA WIREFRAME - RIGHT SCREEN) =================
  if (activeScreen === 'lista') {
    return (
      <div className="flex flex-col h-full relative overflow-hidden">
        {/* Top bar matching Image 1 right screen */}
        <div className="h-[58px] px-4 border-b border-black bg-white flex items-center justify-between shrink-0">
          <button
            onClick={() => onNavigate('task-salvate')}
            className="border border-black bg-white hover:bg-neutral-100 px-2.5 py-1 text-[10px] leading-[1.15] text-center cursor-pointer transition-colors"
            title="Apri Task salvate (routine quotidiane)"
          >
            Task
            <br />
            salvate
          </button>
          <button
            onClick={() => onNavigate('task-completate')}
            className="border border-black bg-white hover:bg-neutral-100 px-2.5 py-1 text-[10px] leading-[1.15] text-center cursor-pointer transition-colors"
            title="Apri Task completate"
          >
            Mostra task
            <br />
            completate
          </button>
        </div>

        {/* Scrollable Promemoria list */}
        <div className="px-4 py-4 flex flex-col gap-3 pb-24 flex-1 overflow-y-auto screen-scroll">
          {activeTasks.length > 0 ? (
            activeTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="w-[36px] h-[36px] rounded-full border border-black bg-white hover:bg-neutral-100 shrink-0 flex items-center justify-center cursor-pointer transition-colors"
                  aria-label="Segna task come completata"
                />
                <div className="flex-1 border border-black bg-white px-2.5 py-1.5 min-w-0">
                  <div className="text-[12px] font-bold leading-tight text-black truncate">
                    {task.title}
                  </div>
                  <div className="text-[10.5px] leading-tight text-black truncate mt-0.5">
                    {task.subtitle}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="border border-black bg-white p-5 text-center text-[12px]">
              Nessun promemoria attivo. Usa il bottone + per aggiungerne uno.
            </div>
          )}
        </div>

        {/* Floating circular + button at bottom-right (exact match to Image 1) */}
        <button
          onClick={() => setShowAddSheet(true)}
          className="absolute right-4 bottom-4 w-[72px] h-[72px] rounded-full border border-black bg-white hover:bg-neutral-100 flex items-center justify-center text-[20px] text-black cursor-pointer z-20"
          aria-label="Aggiungi promemoria"
          title="Aggiungi nuovo promemoria"
        >
          +
        </button>

        {/* Wireframe Quick-Add Modal Sheet */}
        {showAddSheet && (
          <div className="absolute inset-0 bg-black/25 z-30 flex items-end">
            <form
              onSubmit={handleAddNew}
              className="w-full bg-white border-t-[2px] border-black p-4 flex flex-col gap-3"
            >
              <div className="flex items-center justify-between border-b border-black pb-2">
                <span className="text-[12px] font-semibold">Nuovo promemoria</span>
                <button
                  type="button"
                  onClick={() => setShowAddSheet(false)}
                  className="w-7 h-7 border border-black flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <input
                type="text"
                value={draftTitle}
                onChange={(e) => setDraftTitle(e.target.value)}
                placeholder="Promemoria"
                className="w-full border border-black px-2.5 py-2 text-[12px] focus:outline-none"
              />
              <input
                type="text"
                value={draftSubtitle}
                onChange={(e) => setDraftSubtitle(e.target.value)}
                placeholder="Descrizione breve..."
                className="w-full border border-black px-2.5 py-2 text-[11px] focus:outline-none"
              />
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddSheet(false);
                    onNavigate('task-salvate');
                  }}
                  className="flex-1 h-[38px] border border-black bg-white hover:bg-neutral-100 text-[11px] cursor-pointer"
                >
                  Da Task salvate
                </button>
                <button
                  type="submit"
                  className="flex-1 h-[38px] border border-black bg-black text-white hover:bg-neutral-800 text-[11px] font-semibold cursor-pointer"
                >
                  Aggiungi
                </button>
              </div>
            </form>
          </div>
        )}
      </div>
    );
  }

  // ================= 2. TASK COMPLETATE =================
  if (activeScreen === 'task-completate') {
    return (
      <div className="flex flex-col h-full overflow-hidden">
        <SubHeader title="Task completate" onBack={onBack} />

        <div className="p-4 flex flex-col gap-3 flex-1 overflow-y-auto screen-scroll">
          <div className="flex items-center justify-between text-[11px] text-neutral-600 border-b border-black pb-2">
            <span>Completate oggi</span>
            <span className="tabular-nums">{completedTasks.length}</span>
          </div>

          {completedTasks.length > 0 ? (
            completedTasks.map((task) => (
              <div key={task.id} className="flex items-center gap-3">
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="w-[36px] h-[36px] rounded-full border border-black bg-black text-white shrink-0 flex items-center justify-center cursor-pointer hover:bg-neutral-800"
                  title="Ripristina nella lista attiva"
                >
                  <Check className="w-4 h-4 stroke-[2.2]" />
                </button>
                <div className="flex-1 border border-black bg-white px-2.5 py-1.5 min-w-0 opacity-75">
                  <div className="text-[12px] font-bold leading-tight line-through truncate">
                    {task.title}
                  </div>
                  <div className="text-[10.5px] leading-tight line-through truncate mt-0.5">
                    {task.subtitle}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="border border-black bg-white p-5 text-center text-[12px]">
              Nessuna task completata al momento.
            </div>
          )}
        </div>
      </div>
    );
  }

  // ================= 3. TASK SALVATE (Routine quotidiane) =================
  return (
    <div className="flex flex-col h-full relative overflow-hidden">
      <SubHeader title="Task salvate" onBack={onBack} />

      <div className="p-4 flex flex-col gap-3 pb-24 flex-1 overflow-y-auto screen-scroll">
        <div className="border border-black bg-white p-2.5 text-[11px] text-neutral-700 leading-snug">
          Spazio dedicato alle task quotidiane ricorrenti. Tocca + per aggiungerle alla lista di oggi.
        </div>

        {savedNotice && (
          <div className="border border-black bg-black text-white px-3 py-2 text-[11px]">
            {savedNotice}
          </div>
        )}

        {savedTasks.map((item) => (
          <div key={item.id} className="flex items-center gap-3">
            <button
              onClick={() => {
                onUseSavedTask(item);
                setSavedNotice(`"${item.title}" aggiunta alla lista di oggi`);
                window.setTimeout(() => setSavedNotice(null), 2000);
              }}
              className="w-[36px] h-[36px] rounded-full border border-black bg-white hover:bg-black hover:text-white shrink-0 flex items-center justify-center cursor-pointer transition-colors"
              title="Aggiungi alla lista del giorno"
            >
              <Plus className="w-4 h-4" />
            </button>
            <div className="flex-1 border border-black bg-white px-2.5 py-1.5 min-w-0">
              <div className="text-[12px] font-bold leading-tight truncate">{item.title}</div>
              <div className="text-[10.5px] text-neutral-600 leading-tight truncate mt-0.5">
                {item.subtitle}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Bottone + per creare nuova routine salvata */}
      <button
        onClick={() => setShowAddSheet(true)}
        className="absolute right-4 bottom-4 w-[66px] h-[66px] rounded-full border border-black bg-white hover:bg-neutral-100 flex items-center justify-center text-[20px] text-black cursor-pointer z-20"
        title="Nuova task salvata"
      >
        +
      </button>

      {showAddSheet && (
        <div className="absolute inset-0 bg-black/25 z-30 flex items-end">
          <form
            onSubmit={handleAddNew}
            className="w-full bg-white border-t-[2px] border-black p-4 flex flex-col gap-3"
          >
            <div className="flex items-center justify-between border-b border-black pb-2">
              <span className="text-[12px] font-semibold">Nuova task salvata</span>
              <button
                type="button"
                onClick={() => setShowAddSheet(false)}
                className="w-7 h-7 border border-black flex items-center justify-center hover:bg-neutral-100 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <input
              type="text"
              value={draftTitle}
              onChange={(e) => setDraftTitle(e.target.value)}
              placeholder="Es. Portare fuori il cane"
              className="w-full border border-black px-2.5 py-2 text-[12px] focus:outline-none"
            />
            <input
              type="text"
              value={draftSubtitle}
              onChange={(e) => setDraftSubtitle(e.target.value)}
              placeholder="Routine quotidiana..."
              className="w-full border border-black px-2.5 py-2 text-[11px] focus:outline-none"
            />
            <button
              type="submit"
              className="w-full h-[38px] border border-black bg-black text-white hover:bg-neutral-800 text-[11px] font-semibold cursor-pointer"
            >
              Salva routine
            </button>
          </form>
        </div>
      )}
    </div>
  );
};
