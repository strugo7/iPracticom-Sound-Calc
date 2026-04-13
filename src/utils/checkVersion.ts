/**
 * checkVersion.ts
 * בודק מול GitHub Releases API אם יש גרסה חדשה יותר מהגרסה הנוכחית.
 * מחזיר null בשקט על כל שגיאה (אין אינטרנט, rate-limit, וכו׳).
 */

// חייב להתאים ל-versionName ב-android/app/build.gradle
const CURRENT_VERSION = '1.0.1';

const GITHUB_API_URL =
  'https://api.github.com/repos/strugo7/iPracticom-Sound-Calc/releases/latest';

interface UpdateCheckResult {
  hasUpdate: boolean;
  version: string;
  url: string;
}

/**
 * משווה שתי גרסאות סמנטיות.
 * מסיר קידומת 'v' אם קיימת (v1.0.2 → 1.0.2).
 * מחזיר true אם latest חדשה יותר מ-current.
 */
function isNewer(latest: string, current: string): boolean {
  const parse = (v: string): number[] =>
    v.replace(/^v/, '').split('.').map((n) => parseInt(n, 10) || 0);

  const [la, lb, lc] = parse(latest);
  const [ca, cb, cc] = parse(current);

  if (la !== ca) return la > ca;
  if (lb !== cb) return lb > cb;
  return lc > cc;
}

/**
 * בודק אם יש גרסה חדשה ב-GitHub.
 * @returns UpdateCheckResult אם הצליח, null אם נכשל/אין אינטרנט
 */
export async function checkForUpdate(): Promise<UpdateCheckResult | null> {
  try {
    const response = await fetch(GITHUB_API_URL, {
      headers: { Accept: 'application/vnd.github.v3+json' },
    });

    if (!response.ok) return null;

    const data: { tag_name?: string; html_url?: string } = await response.json();
    const latestTag = data.tag_name ?? '';
    const htmlUrl = data.html_url ?? '';

    if (!latestTag) return null;

    return {
      hasUpdate: isNewer(latestTag, CURRENT_VERSION),
      version: latestTag.replace(/^v/, ''),
      url: htmlUrl,
    };
  } catch {
    // אין אינטרנט, timeout, JSON שגוי — הכל נבלע בשקט
    return null;
  }
}
