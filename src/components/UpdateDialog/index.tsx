import React from 'react';
import { Linking } from 'react-native';
import { Button, Dialog, Portal, Text } from 'react-native-paper';
import { S } from '../../strings';
import { iPracticomColors } from '../../theme';

interface UpdateDialogProps {
  visible: boolean;
  version: string;
  url: string;
  onDismiss: () => void;
}

export default function UpdateDialog({
  visible,
  version,
  url,
  onDismiss,
}: UpdateDialogProps) {
  const handleUpdate = async () => {
    try {
      await Linking.openURL(url);
    } catch {
      // אם לא ניתן לפתוח את הקישור — פשוט סוגר
    } finally {
      onDismiss();
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title style={styles.title}>{S.updates.title}</Dialog.Title>
        <Dialog.Content>
          <Text style={styles.body}>
            {S.updates.newVersion.replace('{{ver}}', version)}
          </Text>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss} textColor={iPracticomColors.midGray}>
            {S.updates.remindLater}
          </Button>
          <Button onPress={handleUpdate} textColor={iPracticomColors.electricBlue}>
            {S.updates.updateNow}
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
}

const styles = {
  title: {
    textAlign: 'right' as const,
    color: iPracticomColors.darkNavy,
  },
  body: {
    textAlign: 'right' as const,
    color: iPracticomColors.darkNavy,
    fontSize: 14,
    lineHeight: 22,
  },
};
