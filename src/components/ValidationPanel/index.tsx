import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { iPracticomColors, iPracticomSpacing, iPracticomRadius } from '../../theme';
import { StatusBadge } from '../StatusBadge';
import { ValidationResult } from '../../types/catalog';
import { S } from '../../strings';

// לוח ולידציה מלא — מציג את כל ה-badges לבדיקת שרשרת
// עכבה, הספק, מתח קו (אם רלוונטי)
// כולל סיכום שגיאות בתחתית

interface ValidationPanelProps {
  result: ValidationResult;
}

export function ValidationPanel({ result }: ValidationPanelProps) {
  const slideAnim = useRef(new Animated.Value(30)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  // אנימציית כניסה עדינה
  useEffect(() => {
    slideAnim.setValue(30);
    fadeAnim.setValue(0);
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  // חישוב מצב כללי
  const allOk = result.impedanceOk && result.powerOk &&
    (!result.lineVoltageRequired || result.lineVoltageOk);

  return (
    <Animated.View
      style={[
        styles.container,
        {
          opacity: fadeAnim,
          transform: [{ translateY: slideAnim }],
        },
      ]}
    >
      {/* כותרת הסעיף */}
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <MaterialCommunityIcons
            name={allOk ? 'shield-check-outline' : 'shield-alert-outline'}
            size={22}
            color={allOk ? iPracticomColors.success : iPracticomColors.error}
          />
          <Text style={styles.title}>{S.validation.sectionTitle}</Text>
        </View>
        <View style={[styles.overallIndicator, allOk ? styles.indicatorOk : styles.indicatorFail]}>
          <Text style={styles.overallText}>
            {allOk ? S.validation.statusOk : S.validation.statusFail}
          </Text>
        </View>
      </View>

      <Divider style={styles.divider} />

      {/* בדיקת עכבה */}
      <StatusBadge
        ok={result.impedanceOk}
        label={S.validation.impedanceCheck}
        value={`${S.validation.impedanceActual}: ${result.impedanceActual.toFixed(1)}Ω — ${S.validation.impedanceMin}: ${result.impedanceMin}Ω`}
        detail={
          !result.impedanceOk
            ? S.validation.errorImpedanceTooLow
            : undefined
        }
      />

      {/* בדיקת הספק */}
      <StatusBadge
        ok={result.powerOk}
        label={S.validation.powerCheck}
        value={`${S.validation.powerRequired}: ${result.powerRequired}W — ${S.validation.powerAvailable}: ${result.powerAvailable}W`}
        detail={
          !result.powerOk
            ? S.validation.errorPowerExceeded
            : undefined
        }
      />

      {/* בדיקת מתח קו (רק אם רלוונטי - רמקול עם שנאי) */}
      {result.lineVoltageRequired && (
        <StatusBadge
          ok={result.lineVoltageOk}
          label={S.validation.lineVoltageCheck}
          value={
            result.lineVoltageOk
              ? S.validation.lineVoltageSupported
              : S.validation.lineVoltageNotSupported
          }
          detail={
            !result.lineVoltageOk
              ? S.validation.errorLineVoltageMismatch
              : undefined
          }
        />
      )}

      {/* סיכום שגיאות (אם יש) */}
      {result.errors.length > 0 && (
        <View style={styles.errorsContainer}>
          <Divider style={styles.divider} />
          <View style={styles.errorsHeader}>
            <MaterialCommunityIcons
              name="alert-outline"
              size={16}
              color={iPracticomColors.error}
            />
            <Text style={styles.errorsTitle}>{S.validation.errorsSummaryTitle}</Text>
          </View>
          {result.errors.map((error, idx) => (
            <Text key={idx} style={styles.errorText}>
              • {error}
            </Text>
          ))}
        </View>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: iPracticomSpacing.md,
    marginTop: iPracticomSpacing.lg,
    paddingHorizontal: iPracticomSpacing.md,
    paddingVertical: iPracticomSpacing.md,
    backgroundColor: iPracticomColors.white,
    borderRadius: iPracticomRadius.card,
    elevation: 2,
  },
  header: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: iPracticomSpacing.sm,
  },
  headerContent: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: iPracticomSpacing.sm,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: iPracticomColors.darkNavy,
  },
  overallIndicator: {
    paddingHorizontal: iPracticomSpacing.md,
    paddingVertical: iPracticomSpacing.xs,
    borderRadius: iPracticomRadius.badge,
  },
  indicatorOk: {
    backgroundColor: iPracticomColors.success + '1A', // 10% opacity
  },
  indicatorFail: {
    backgroundColor: iPracticomColors.error + '1A', // 10% opacity
  },
  overallText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  divider: {
    backgroundColor: iPracticomColors.midGray,
    opacity: 0.3,
    height: 1,
    marginVertical: iPracticomSpacing.sm,
  },
  errorsContainer: {
    marginTop: iPracticomSpacing.xs,
  },
  errorsHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: iPracticomSpacing.xs,
    marginBottom: iPracticomSpacing.sm,
  },
  errorsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: iPracticomColors.error,
  },
  errorText: {
    fontSize: 12,
    color: iPracticomColors.error,
    marginBottom: 4,
    textAlign: 'right',
    lineHeight: 18,
  },
});
