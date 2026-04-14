/**
 * UpdateModal/index.tsx — דיאלוג עדכון גרסה זמינה
 * מוצג כשגרסה חדשה זמינה ב-GitHub.
 */

import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Dialog, Portal, Button, Text } from 'react-native-paper';
import { useCheckUpdates } from '../../hooks/useCheckUpdates';
import { iPracticomColors, iPracticomSpacing } from '../../theme';
import { S } from '../../strings';

export function UpdateModal() {
  const {
    isUpdateAvailable,
    currentVersion,
    latestVersion,
    isDownloading,
    downloadProgress,
    downloadAPK,
    dismissModal,
  } = useCheckUpdates();

  if (!isUpdateAvailable || !latestVersion) {
    return null;
  }

  return (
    <Portal>
      <Dialog
        visible={isUpdateAvailable}
        onDismiss={dismissModal}
        style={styles.dialog}
      >
        <Dialog.Title style={styles.title}>
          {S.updates.updateAvailable}
        </Dialog.Title>

        <Dialog.Content>
          <View style={styles.versionRow}>
            <Text variant="bodyMedium" style={styles.label}>
              {S.updates.latestVersion}
            </Text>
            <Text variant="bodyLarge" style={styles.versionValue}>
              {latestVersion.replace(/^v/, '')}
            </Text>
          </View>

          <View style={styles.versionRow}>
            <Text variant="bodyMedium" style={styles.label}>
              {S.updates.currentVersion}
            </Text>
            <Text variant="bodyLarge" style={styles.versionValueCurrent}>
              {currentVersion}
            </Text>
          </View>

          {isDownloading && (
            <View style={styles.progressRow}>
              <Text variant="bodySmall" style={styles.progressText}>
                {S.updates.downloading} {downloadProgress}%
              </Text>
            </View>
          )}
        </Dialog.Content>

        <Dialog.Actions>
          <Button
            onPress={dismissModal}
            disabled={isDownloading}
            textColor={iPracticomColors.midGray}
          >
            {S.general.cancel}
          </Button>
          <Button
            mode="contained"
            onPress={downloadAPK}
            disabled={isDownloading}
            buttonColor={iPracticomColors.electricBlue}
          >
            {S.updates.download}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = StyleSheet.create({
  dialog: {
    borderRadius: 12,
    backgroundColor: iPracticomColors.white,
  },
  title: {
    fontFamily: 'Ploni-Bold',
    color: iPracticomColors.darkNavy,
    textAlign: 'right',
  },
  versionRow: {
    marginVertical: iPracticomSpacing.sm,
  },
  label: {
    color: iPracticomColors.midGray,
    textAlign: 'right',
  },
  versionValue: {
    color: iPracticomColors.electricBlue,
    fontFamily: 'Assistant-Regular',
    textAlign: 'right',
    marginTop: 2,
  },
  versionValueCurrent: {
    color: iPracticomColors.darkNavy,
    fontFamily: 'Assistant-Regular',
    textAlign: 'right',
    marginTop: 2,
  },
  progressRow: {
    marginTop: iPracticomSpacing.md,
    paddingVertical: iPracticomSpacing.sm,
    borderRadius: 8,
    backgroundColor: iPracticomColors.lightBG,
    paddingHorizontal: iPracticomSpacing.sm,
  },
  progressText: {
    color: iPracticomColors.darkNavy,
    textAlign: 'right',
  },
});
