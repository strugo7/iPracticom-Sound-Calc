/**
 * UpdateSnackbars/index.tsx — Snackbars לסטטוס עדכון
 * מציג: בדיקה, הצלחה, הורדה בתהליך, ושגיאות עם כפתור ניסיון חוזר.
 */

import React, { useEffect, useRef, useState } from 'react';
import { Snackbar } from 'react-native-paper';
import { useCheckUpdates } from '../../hooks/useCheckUpdates';
import { S } from '../../strings';
import { iPracticomColors } from '../../theme';

// react-native-paper v5 לא מייצא DURATION_INDEFINITE — משתמשים בערך גדול
const SNACKBAR_INDEFINITE = 99999999;

export function UpdateSnackbars() {
  const {
    isChecking,
    isUpdateAvailable,
    isDownloading,
    downloadProgress,
    downloadComplete,
    error,
    dismissError,
    checkForUpdates,
  } = useCheckUpdates();

  const [showUpToDate, setShowUpToDate] = useState(false);
  const [showDownloadDone, setShowDownloadDone] = useState(false);

  // זיכרון: האם הבדיקה החלה (כדי לדעת שהיא הסתיימה)
  const wasChecking = useRef(false);
  const wasDownloading = useRef(false);

  useEffect(() => {
    if (isChecking) {
      wasChecking.current = true;
    } else if (wasChecking.current) {
      // הבדיקה הסתיימה
      wasChecking.current = false;
      if (!isUpdateAvailable && !error) {
        setShowUpToDate(true);
      }
    }
  }, [isChecking, isUpdateAvailable, error]);

  useEffect(() => {
    if (isDownloading) {
      wasDownloading.current = true;
    } else if (wasDownloading.current && downloadComplete) {
      wasDownloading.current = false;
      setShowDownloadDone(true);
    }
  }, [isDownloading, downloadComplete]);

  const errorMessage = getErrorMessage(error);
  const showRetry = error !== null && error !== 'NO_INTERNET';

  return (
    <>
      {/* בדיקה בתהליך */}
      <Snackbar
        visible={isChecking}
        onDismiss={() => {}}
        duration={SNACKBAR_INDEFINITE}
      >
        {S.updates.checkingForUpdates}
      </Snackbar>

      {/* עדכני — אין גרסה חדשה */}
      <Snackbar
        visible={showUpToDate && !isChecking}
        onDismiss={() => setShowUpToDate(false)}
        duration={3000}
        style={{ backgroundColor: iPracticomColors.success }}
      >
        {'✓ ' + S.updates.youAreUpToDate}
      </Snackbar>

      {/* הורדה בתהליך */}
      <Snackbar
        visible={isDownloading}
        onDismiss={() => {}}
        duration={SNACKBAR_INDEFINITE}
      >
        {`${S.updates.downloading} ${downloadProgress}%`}
      </Snackbar>

      {/* הורדה הושלמה */}
      <Snackbar
        visible={showDownloadDone && !isDownloading}
        onDismiss={() => setShowDownloadDone(false)}
        duration={4000}
        style={{ backgroundColor: iPracticomColors.success }}
      >
        {'✓ ' + S.updates.downloadComplete}
      </Snackbar>

      {/* שגיאה */}
      <Snackbar
        visible={!!error && !isChecking && !isDownloading}
        onDismiss={dismissError}
        duration={SNACKBAR_INDEFINITE}
        style={{ backgroundColor: iPracticomColors.error }}
        action={
          showRetry
            ? { label: S.general.retry, onPress: checkForUpdates }
            : undefined
        }
      >
        {'✗ ' + errorMessage}
      </Snackbar>
    </>
  );
}

function getErrorMessage(error: string | null): string {
  if (!error) { return ''; }
  switch (error) {
    case 'NO_INTERNET':
      return S.updates.noInternet;
    case 'API_ERROR':
    case 'DOWNLOAD_ERROR':
      return S.updates.connectionError;
    default:
      return S.updates.connectionError;
  }
}
