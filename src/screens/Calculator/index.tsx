import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { S } from '../../strings';
import { iPracticomColors, iPracticomSpacing } from '../../theme';
import FormulaCard from '../../components/FormulaCard';
import { HeaderRefreshButton } from '../../components/Header';

export default function CalculatorScreen() {
  return (
    <SafeAreaView style={styles.container}>
      {/* כותרת מסך — RTL: כפתור עדכון משמאל, שם מסך מימין */}
      <View style={styles.header}>
        <HeaderRefreshButton />
        <Text style={styles.headerTitle}>{S.calculator.screenTitle}</Text>
      </View>

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
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: iPracticomColors.white,
    paddingRight: iPracticomSpacing.lg,
    paddingVertical: iPracticomSpacing.sm,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: iPracticomColors.darkNavy,
    textAlign: 'right',
  },
});
