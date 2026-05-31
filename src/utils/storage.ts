import type { Note } from '../types';

const KEYS = {
  notes: 'pdp_notes_v4',
  labels: 'pdp_labels_v4',
  theme: 'pdp_theme_v4',
  clientId: 'pdp_client_id_v4',
  accessToken: 'pdp_access_token',
  tokenExpires: 'pdp_token_expires',
  lastSync: 'pdp_last_sync',
} as const;

export const storage = {
  getNotes: (): Note[] | null => {
    try {
      const raw = localStorage.getItem(KEYS.notes);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  saveNotes: (notes: Note[]) => {
    localStorage.setItem(KEYS.notes, JSON.stringify(notes));
  },

  getLabels: (): string[] | null => {
    try {
      const raw = localStorage.getItem(KEYS.labels);
      return raw ? JSON.parse(raw) : null;
    } catch { return null; }
  },

  saveLabels: (labels: string[]) => {
    localStorage.setItem(KEYS.labels, JSON.stringify(labels));
  },

  getTheme: (): string | null => localStorage.getItem(KEYS.theme),
  saveTheme: (theme: string) => localStorage.setItem(KEYS.theme, theme),

  getClientId: (): string => localStorage.getItem(KEYS.clientId) || '',
  saveClientId: (id: string) => localStorage.setItem(KEYS.clientId, id),
  removeClientId: () => localStorage.removeItem(KEYS.clientId),

  getAccessToken: (): string | null => localStorage.getItem(KEYS.accessToken),
  saveAccessToken: (token: string, expiresAt: number) => {
    localStorage.setItem(KEYS.accessToken, token);
    localStorage.setItem(KEYS.tokenExpires, expiresAt.toString());
  },
  isTokenValid: (): boolean => {
    const exp = localStorage.getItem(KEYS.tokenExpires);
    return !!exp && Date.now() < parseInt(exp);
  },
  removeAccessToken: () => {
    localStorage.removeItem(KEYS.accessToken);
    localStorage.removeItem(KEYS.tokenExpires);
  },

  getLastSync: (): number | null => {
    const raw = localStorage.getItem(KEYS.lastSync);
    return raw ? parseInt(raw) : null;
  },
  saveLastSync: (ts: number) => localStorage.setItem(KEYS.lastSync, ts.toString()),

  clearAll: () => {
    Object.values(KEYS).forEach(k => localStorage.removeItem(k));
  },
};
