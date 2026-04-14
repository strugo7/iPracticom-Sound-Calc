/**
 * updateStore.ts — מצב בדיקת עדכונים (Zustand)
 * מנהל את כל מצבי ה-UI הקשורים לעדכון הגרסה.
 */

import { create } from 'zustand';
import * as updateService from '../services/updateService';

export interface UpdateState {
  // מצב נוכחי
  currentVersion: string;
  latestVersion: string | null;
  isUpdateAvailable: boolean;
  downloadUrl: string | null;

  // מצבי UI
  isChecking: boolean;
  isDownloading: boolean;
  downloadProgress: number; // 0–100
  downloadComplete: boolean;
  error: string | null;

  // פעולות
  setCurrentVersion: (version: string) => void;
  checkForUpdates: () => Promise<void>;
  downloadAPK: () => Promise<void>;
  dismissModal: () => void;
  resetError: () => void;
}

export const useUpdateStore = create<UpdateState>((set, get) => ({
  // מצב התחלתי
  currentVersion: '1.0.0',
  latestVersion: null,
  isUpdateAvailable: false,
  downloadUrl: null,

  isChecking: false,
  isDownloading: false,
  downloadProgress: 0,
  downloadComplete: false,
  error: null,

  setCurrentVersion: (version) => set({ currentVersion: version }),

  checkForUpdates: async () => {
    set({ isChecking: true, error: null });
    try {
      const result = await updateService.checkForUpdates(get().currentVersion);
      set({
        latestVersion: result.latestVersion,
        isUpdateAvailable: result.updateAvailable,
        downloadUrl: result.downloadUrl,
        isChecking: false,
      });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'API_ERROR';
      set({ error: message, isChecking: false });
    }
  },

  downloadAPK: async () => {
    const { downloadUrl } = get();
    if (!downloadUrl) { return; }

    set({ isDownloading: true, downloadProgress: 0, error: null, downloadComplete: false });
    try {
      await updateService.downloadAPK(downloadUrl, (progress) => {
        set({ downloadProgress: progress });
      });
      await updateService.openDownloadsFolder();
      set({ isDownloading: false, downloadProgress: 100, downloadComplete: true });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'DOWNLOAD_ERROR';
      set({ error: message, isDownloading: false, downloadProgress: 0 });
    }
  },

  dismissModal: () => set({ isUpdateAvailable: false }),

  resetError: () => set({ error: null }),
}));
