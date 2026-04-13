import { I18nManager } from 'react-native';

let rtlApplied = false;

export function setupRTL(): void {
  if (rtlApplied) return;
  if (!I18nManager.isRTL) {
    I18nManager.forceRTL(true);
  }
  rtlApplied = true;
}
