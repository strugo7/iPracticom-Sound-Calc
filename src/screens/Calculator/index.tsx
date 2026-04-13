import React from 'react';
import { View, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { S } from '../../strings';
import { iPracticomColors } from '../../theme';

export default function CalculatorScreen() {
  return (
    <View style={styles.container}>
      <Text variant="titleLarge">{S.calculator.screenTitle}</Text>
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
