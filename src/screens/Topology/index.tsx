import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { S } from '../../strings';
import { iPracticomColors } from '../../theme';

export default function TopologyScreen() {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge">{S.topology.screenTitle}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iPracticomColors.lightBG,
    alignItems: 'flex-end',
    padding: 16,
  },
});
