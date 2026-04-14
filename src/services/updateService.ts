/**
 * updateService.ts — שירות בדיקת עדכונים מ-GitHub
 * פונקציות טהורות בלבד — ללא גישה לסטור או ל-side effects חיצוניים.
 */

import RNFS from 'react-native-fs';
import NetInfo from '@react-native-community/netinfo';
import { Linking, Platform } from 'react-native';

const GITHUB_REPO = 'strugo7/iPracticom-Sound-Calc';
const GITHUB_API_URL = 'https://api.github.com';

interface GitHubAsset {
  name: string;
  browser_download_url: string;
}

interface GitHubRelease {
  tag_name: string;
  assets: GitHubAsset[];
}

export interface LatestReleaseInfo {
  updateAvailable: boolean;
  latestVersion: string | null;
  downloadUrl: string | null;
}

// בדיקת קישוריות לרשת
export async function hasNetworkConnectivity(): Promise<boolean> {
  if (Platform.OS !== 'android') { return false; }
  const state = await NetInfo.fetch();
  return state.isConnected ?? false;
}

// שליפת הגרסה האחרונה מ-GitHub
async function fetchLatestRelease(): Promise<GitHubRelease | null> {
  const url = `${GITHUB_API_URL}/repos/${GITHUB_REPO}/releases/latest`;
  const response = await fetch(url, {
    headers: { Accept: 'application/vnd.github.v3+json' },
  });
  if (!response.ok) {
    throw new Error(`GitHub API error: ${response.status}`);
  }
  return response.json() as Promise<GitHubRelease>;
}

// השוואת גרסאות סמנטיות (ללא תלות בספריות חיצוניות)
export function isUpdateAvailable(current: string, latest: string): boolean {
  const curr = current.replace(/^v/, '').split('.').map(Number);
  const lat  = latest.replace(/^v/, '').split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    const c = curr[i] ?? 0;
    const l = lat[i]  ?? 0;
    if (l > c) { return true; }
    if (l < c) { return false; }
  }
  return false;
}

// זרימה ראשית: בדיקה אם קיים עדכון
export async function checkForUpdates(
  currentVersion: string,
): Promise<LatestReleaseInfo> {
  const hasInternet = await hasNetworkConnectivity();
  if (!hasInternet) {
    throw new Error('NO_INTERNET');
  }

  const release = await fetchLatestRelease();
  if (!release) {
    throw new Error('API_ERROR');
  }

  const latestVersion = release.tag_name;
  const updateAvail = isUpdateAvailable(currentVersion, latestVersion);
  const apkAsset = release.assets.find(a => a.name.endsWith('.apk'));
  const downloadUrl = apkAsset?.browser_download_url ?? null;

  return {
    updateAvailable: updateAvail,
    latestVersion,
    downloadUrl,
  };
}

// הורדת APK לתיקיית Downloads
export async function downloadAPK(
  downloadUrl: string,
  onProgress?: (percent: number) => void,
): Promise<string> {
  const downloadsDir = RNFS.DownloadDirectoryPath;
  const fileName = 'iPracticom-Sound-Calc.apk';
  const filePath = `${downloadsDir}/${fileName}`;

  const result = await RNFS.downloadFile({
    fromUrl: downloadUrl,
    toFile: filePath,
    progress: res => {
      const percent = Math.round((res.bytesWritten / res.contentLength) * 100);
      onProgress?.(percent);
    },
    progressDivider: 1,
    background: false,
    discretionary: false,
  }).promise;

  if (result.statusCode !== 200) {
    throw new Error(`Download failed: status ${result.statusCode}`);
  }

  return filePath;
}

// פתיחת מנהל הקבצים לתיקיית Downloads
export async function openDownloadsFolder(): Promise<void> {
  try {
    if (Platform.OS === 'android') {
      await Linking.openURL(
        'content://com.android.externalstorage.documents/root/primary:Download',
      );
    }
  } catch {
    // silent fail — המשתמש יכול לנווט ידנית
  }
}
