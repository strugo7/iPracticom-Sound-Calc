import { ImageSourcePropType } from 'react-native';

// ─── מיפוי תמונות מוצרים ─────────────────────────────────────────────────────
//
// React Native דורש require() סטטי בזמן בנייה — לא ניתן לבנות נתיב דינמי.
// לכן כל תמונה חייבת להופיע כאן עם require() מפורש.
//
// כשמוסיפים תמונה חדשה:
//   1. שים את הקובץ ב: assets/images/{product-id}.jpg
//   2. הוסף שורה למילון PRODUCT_IMAGES למטה בפורמט:
//        'product-id': require('../../assets/images/product-id.jpg'),
//   3. הוסף "image": "product-id.jpg" לערך המתאים ב-catalog.json
// ─────────────────────────────────────────────────────────────────────────────

const PRODUCT_IMAGES: Record<string, ImageSourcePropType> = {
  // ── נגנים ──────────────────────────────────────────────────────────────────
  // 'player-arylic-s50-pro-plus': require('../../assets/images/player-arylic-s50-pro-plus.jpg'),
  // 'player-audiopro-link1':      require('../../assets/images/player-audiopro-link1.jpg'),

  // ── מיקסרים ────────────────────────────────────────────────────────────────
  // 'mixer-xxx': require('../../assets/images/mixer-xxx.jpg'),

  // ── מטריקסים ───────────────────────────────────────────────────────────────
  // 'matrix-xxx': require('../../assets/images/matrix-xxx.jpg'),

  // ── מגברים ─────────────────────────────────────────────────────────────────
  // 'amp-xxx': require('../../assets/images/amp-xxx.jpg'),

  // ── רמקולים ────────────────────────────────────────────────────────────────
  // 'spk-xxx': require('../../assets/images/spk-xxx.jpg'),
};

/**
 * מחזיר את מקור התמונה של המוצר לפי ה-ID שלו.
 * מחזיר null אם אין תמונה — הקומפוננטה תציג אייקון חלופי.
 */
export function getProductImage(productId: string): ImageSourcePropType | null {
  return PRODUCT_IMAGES[productId] ?? null;
}
