/**
 * useCheckUpdates.ts — Custom hook לבדיקת עדכוני גרסה
 * עוטף את updateStore ומספק API נקי לקומפוננטות.
 */

import { useCallback } from 'react';
import { useUpdateStore } from '../store/updateStore';

export function useCheckUpdates() {
  const store = useUpdateStore();

  const checkForUpdates = useCallback(async () => {
    await store.checkForUpdates();
  }, [store]);

  const downloadAPK = useCallback(async () => {
    await store.downloadAPK();
  }, [store]);

  const dismissModal = useCallback(() => {
    store.dismissModal();
  }, [store]);

  const dismissError = useCallback(() => {
    store.resetError();
  }, [store]);

  return {
    currentVersion:    store.currentVersion,
    latestVersion:     store.latestVersion,
    isUpdateAvailable: store.isUpdateAvailable,
    isChecking:        store.isChecking,
    isDownloading:     store.isDownloading,
    downloadProgress:  store.downloadProgress,
    downloadComplete:  store.downloadComplete,
    error:             store.error,
    checkForUpdates,
    downloadAPK,
    dismissModal,
    dismissError,
  };
}
