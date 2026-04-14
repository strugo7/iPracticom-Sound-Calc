/**
 * Header/index.tsx — כפתור בדיקת עדכונים לכותרת הניווט
 * מיועד לשימוש כ-headerRight בכל המסכים דרך screenOptions.
 */

import React from 'react';
import { TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useCheckUpdates } from '../../hooks/useCheckUpdates';
import { iPracticomColors } from '../../theme';

export function HeaderRefreshButton() {
  const { isChecking, checkForUpdates } = useCheckUpdates();

  return (
    <TouchableOpacity
      onPress={checkForUpdates}
      disabled={isChecking}
      style={styles.button}
      accessibilityRole="button"
      accessibilityLabel="בדוק עדכונים"
    >
      {isChecking ? (
        <ActivityIndicator size={20} color={iPracticomColors.electricBlue} />
      ) : (
        <MaterialCommunityIcons
          name="refresh"
          size={24}
          color={iPracticomColors.electricBlue}
        />
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
