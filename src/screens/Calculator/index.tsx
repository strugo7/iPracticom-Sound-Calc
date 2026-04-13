import React from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import { Appbar } from 'react-native-paper';
import { S } from '../../strings';
import { iPracticomColors } from '../../theme';
import FormulaCard from '../../components/FormulaCard';

export default function CalculatorScreen() {
  return (
    <SafeAreaView style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content
          title={S.calculator.screenTitle}
          titleStyle={styles.headerTitle}
        />
      </Appbar.Header>
      <FormulaCard />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iPracticomColors.lightBG,
  },
  header: {
    backgroundColor: iPracticomColors.white,
    elevation: 2,
  },
  headerTitle: {
    textAlign: 'right',
    color: iPracticomColors.darkNavy,
    fontSize: 20,
    fontWeight: '600',
  },
});
