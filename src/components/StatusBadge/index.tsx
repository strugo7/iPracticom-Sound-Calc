import React, { useEffect, useRef } from 'react';
import { View, StyleSheet, Animated, Easing, AccessibilityInfo } from 'react-native';
import { Text } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { iPracticomColors, iPracticomSpacing, iPracticomRadius } from '../../theme';
import { S } from '../../strings';

// סמן תקינות ירוק (✓) או אדום (✗) עם טקסט תיאור
// כולל אנימציה עדינה וגרסה מפורטת עם ערכים מספריים

interface StatusBadgeProps {
  ok: boolean;
  label: string;
  value?: string;
  detail?: string;
}

export function StatusBadge({ ok, label, value, detail }: StatusBadgeProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  // אנימציה עדינה בכל שינוי מצב
  useEffect(() => {
    fadeAnim.setValue(0);
    scaleAnim.setValue(0.95);
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
      Animated.timing(scaleAnim, {
        toValue: 1,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, [ok]);

  const backgroundColor = ok ? iPracticomColors.success : iPracticomColors.error;
  const iconName = ok ? 'check-circle-outline' : 'close-circle-outline';
  const accessibilityLabel = ok ? S.a11y.statusBadgeOk : S.a11y.statusBadgeFail;

  return (
    <Animated.View
      style={[
        styles.badge,
        { backgroundColor, opacity: fadeAnim, transform: [{ scale: scaleAnim }] },
      ]}
      accessible
      accessibilityRole="summary"
      accessibilityLabel={`${label}: ${accessibilityLabel}${value ? ` — ${value}` : ''}`}
    >
      {/* שורה עליונה: אייקון + תווית */}
      <View style={styles.headerRow}>
        <View style={styles.labelContainer}>
          <MaterialCommunityIcons
            name={iconName}
            size={20}
            color={iPracticomColors.white}
          />
          <Text style={styles.label}>{label}</Text>
        </View>
        <View style={[styles.statusPill, ok ? styles.statusPillOk : styles.statusPillFail]}>
          <Text style={styles.statusText}>
            {ok ? S.validation.statusOk : S.validation.statusFail}
          </Text>
        </View>
      </View>

      {/* ערך ראשי (כגון "3.2Ω") */}
      {value && (
        <Text style={styles.value}>{value}</Text>
      )}

      {/* פרטים נוספים (כגון "מינימום מגבר: 4Ω") */}
      {detail && (
        <Text style={styles.detail}>{detail}</Text>
      )}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  badge: {
    borderRadius: iPracticomRadius.badge,
    paddingVertical: iPracticomSpacing.sm + 2,
    paddingHorizontal: iPracticomSpacing.md,
    marginVertical: iPracticomSpacing.xs,
  },
  headerRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelContainer: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: iPracticomSpacing.sm,
  },
  label: {
    fontSize: 14,
    fontWeight: '700',
    color: iPracticomColors.white,
    textAlign: 'right',
  },
  statusPill: {
    paddingHorizontal: iPracticomSpacing.sm + 2,
    paddingVertical: 2,
    borderRadius: 10,
  },
  statusPillOk: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  statusPillFail: {
    backgroundColor: 'rgba(0, 0, 0, 0.15)',
  },
  statusText: {
    fontSize: 14,
    fontWeight: 'bold',
    color: iPracticomColors.white,
    textAlign: 'right',
  },
  value: {
    fontSize: 13,
    fontWeight: '600',
    color: iPracticomColors.white,
    marginTop: iPracticomSpacing.xs + 2,
    opacity: 0.95,
    textAlign: 'right',
  },
  detail: {
    fontSize: 12,
    color: iPracticomColors.white,
    marginTop: 2,
    opacity: 0.8,
    textAlign: 'right',
  },
});
