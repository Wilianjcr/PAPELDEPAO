export interface TodoItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface Note {
  id: string;
  title: string;
  content: string;
  type: 'text' | 'todo';
  todoItems: TodoItem[];
  color: NoteColor;
  isPinned: boolean;
  isArchived: boolean;
  isTrashed: boolean;
  isMonospace: boolean;
  labels: string[];
  dueDate: string | null;
  dueTime: string | null;
  password: string | null;
  passwordHash: string | null;
  imageData: string | null;
  audioData: string | null;
  alarmTriggered: boolean;
  updatedAt: number;
  createdAt: number;
}

export type NoteColor = 'default' | 'red' | 'orange' | 'yellow' | 'green' | 'teal' | 'blue' | 'darkblue' | 'purple' | 'pink' | 'brown' | 'gray';

export type ThemeName = 'light' | 'dark' | 'solarized-dark' | 'solarized-light' | 'rose' | 'violet' | 'amber' | 'glass';

export type FilterType = 'all' | 'todo' | 'pinned' | 'archive' | 'trash' | string;

export type ViewLayout = 'grid' | 'list';

export type DriveStatus = 'disconnected' | 'connecting' | 'connected' | 'syncing' | 'error';

export interface AppState {
  notes: Note[];
  labels: string[];
  activeFilter: FilterType;
  viewLayout: ViewLayout;
  activeTheme: ThemeName;
  searchQuery: string;
}

export interface CloudState {
  googleClientId: string;
  accessToken: string | null;
  gdriveFileId: string | null;
  driveStatus: DriveStatus;
  lastSyncTimestamp: number | null;
}
