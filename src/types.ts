export type TabId = 'utilizzo' | 'home' | 'lista';

export type ScreenId =
  // Ramo Sinistro - Panoramica / Utilizzo
  | 'panoramica-giornaliera'
  | 'panoramica-settimanale'
  | 'panoramica-mensile'
  | 'calendario'
  | 'note-giornata'
  | 'dettagli-app'
  // Ramo Centrale - Home
  | 'home'
  | 'lock-in'
  | 'blocco-app'
  | 'profilo'
  | 'progressi'
  | 'mascotte'
  // Ramo Destro - Lista
  | 'lista'
  | 'task-completate'
  | 'task-salvate';

export interface ScreenConfig {
  id: ScreenId;
  title: string;
  shortTitle: string;
  tabId: TabId;
  isMainTab: boolean;
  parentId: ScreenId | null;
  childrenIds: ScreenId[];
  level: number;
  branch: 'left' | 'center' | 'right';
}

export interface TaskItem {
  id: string;
  title: string;
  subtitle: string;
  completed: boolean;
}

export interface SavedTaskItem {
  id: string;
  title: string;
  subtitle: string;
}

export interface AppUsageItem {
  id: string;
  name: string;
  percent: number;
  minutes: number;
  limitMinutes: number;
  notifications: number;
  activations: number;
  weeklyMinutes: number[];
  blocked: boolean;
}

export interface DayNoteItem {
  id: string;
  dateLabel: string;
  text: string;
}
