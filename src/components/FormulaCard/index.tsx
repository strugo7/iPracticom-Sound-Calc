import React, { useEffect } from 'react';
import { View, StyleSheet, I18nManager } from 'react-native';
import {
  Card,
  TextInput,
  SegmentedButtons,
  Text,
  Button,
} from 'react-native-paper';
import { S } from '../../strings';
import { iPracticomColors, iPracticomSpacing, iPracticomRadius } from '../../theme';
import { OhmEngine } from '../../engine/ohm';
import { useCalculatorStore, CalculatorVariable } from '../../store/calcStore';

export default function FormulaCard() {
  const {
    input1,
    input2,
    targetVariable,
    result,
    setInput1,
    setInput2,
    setTargetVariable,
    setResult,
    reset,
  } = useCalculatorStore();

  // חישוב אוטומטי בעת שינוי קלטים או משתנה היעד
  useEffect(() => {
    calculateResult();
  }, [input1, input2, targetVariable]);

  const calculateResult = () => {
    // אם אחד מהקלטים חסר, אין לחשב
    if (input1 === null || input2 === null || input1 === 0 || input2 === 0) {
      setResult(null);
      return;
    }

    let calculated: number | null = null;

    // בחר נוסחה לפי המשתנה הנדרש והקלטים הזמינים
    if (targetVariable === 'P') {
      // ניסיון לחשב Watts (Power)
      // P = V×I, P = V²/R, P = I²×R
      // בדוק האם יש לנו את הקלטים הנדרשים
      if (input1 && input2) {
        // נסה כל נוסחה
        calculated = OhmEngine.P_from_VI(input1, input2);
        if (calculated === null) {
          calculated = OhmEngine.P_from_V2R(input1, input2);
        }
        if (calculated === null) {
          calculated = OhmEngine.P_from_I2R(input1, input2);
        }
      }
    } else if (targetVariable === 'V') {
      // ניסיון לחשב Volts (Voltage)
      // V = I×R, V = P/I, V = √(P×R)
      if (input1 && input2) {
        calculated = OhmEngine.V_from_IR(input1, input2);
        if (calculated === null) {
          calculated = OhmEngine.V_from_PI(input1, input2);
        }
        if (calculated === null) {
          calculated = OhmEngine.V_from_PR(input1, input2);
        }
      }
    } else if (targetVariable === 'I') {
      // ניסיון לחשב Amps (Current)
      // I = V/R, I = P/V, I = √(P/R)
      if (input1 && input2) {
        calculated = OhmEngine.I_from_VR(input1, input2);
        if (calculated === null) {
          calculated = OhmEngine.I_from_PV(input1, input2);
        }
        if (calculated === null) {
          calculated = OhmEngine.I_from_PR(input1, input2);
        }
      }
    } else if (targetVariable === 'R') {
      // ניסיון לחשב Ohms (Resistance)
      // R = V/I, R = V²/P, R = P/I²
      if (input1 && input2) {
        calculated = OhmEngine.R_from_VI(input1, input2);
        if (calculated === null) {
          calculated = OhmEngine.R_from_V2P(input1, input2);
        }
        if (calculated === null) {
          calculated = OhmEngine.R_from_PI2(input1, input2);
        }
      }
    }

    setResult(calculated);
  };

  const formatResult = (): string => {
    if (result === null || result === undefined) {
      return S.calculator.resultEmpty;
    }
    // עגול לשלוש ספרות עשרוניות
    return result.toFixed(3);
  };

  const getResultUnit = (): string => {
    switch (targetVariable) {
      case 'P':
        return S.calculator.unitWatts;
      case 'V':
        return S.calculator.unitVolts;
      case 'I':
        return S.calculator.unitAmps;
      case 'R':
        return S.calculator.unitOhms;
      default:
        return '';
    }
  };

  const handleVariableChange = (value: string) => {
    setTargetVariable(value as CalculatorVariable);
  };

  return (
    <View style={styles.container}>
      {/* בחירת משתנה היעד */}
      <Text variant="titleMedium" style={styles.label}>
        {S.calculator.solveFor}
      </Text>
      <SegmentedButtons
        value={targetVariable}
        onValueChange={handleVariableChange}
        buttons={[
          { value: 'P', label: 'W\nהספק', accessibilityLabel: 'Power' },
          { value: 'V', label: 'V\nמתח', accessibilityLabel: 'Voltage' },
          { value: 'I', label: 'A\nזרם', accessibilityLabel: 'Current' },
          { value: 'R', label: 'Ω\nהתנגד׳', accessibilityLabel: 'Resistance' },
        ]}
        style={styles.segmentedButtons}
      />

      {/* קלטי הערכים הידועים */}
      <Card style={styles.card}>
        <Card.Content>
          <View style={styles.inputsContainer}>
            <TextInput
              label={`${S.calculator.inputPlaceholder} 1`}
              value={input1 ? input1.toString() : ''}
              onChangeText={(text) => {
                const num = text === '' ? null : parseFloat(text);
                setInput1(isNaN(num as number) ? null : num);
              }}
              keyboardType="decimal-pad"
              textAlign={I18nManager.isRTL ? 'right' : 'left'}
              style={[styles.input, { textAlign: 'right' }]}
              placeholder={S.calculator.inputPlaceholder}
            />

            <TextInput
              label={`${S.calculator.inputPlaceholder} 2`}
              value={input2 ? input2.toString() : ''}
              onChangeText={(text) => {
                const num = text === '' ? null : parseFloat(text);
                setInput2(isNaN(num as number) ? null : num);
              }}
              keyboardType="decimal-pad"
              textAlign={I18nManager.isRTL ? 'right' : 'left'}
              style={[styles.input, { textAlign: 'right' }]}
              placeholder={S.calculator.inputPlaceholder}
            />
          </View>
        </Card.Content>
      </Card>

      {/* תוצאה */}
      <Card style={[styles.card, styles.resultCard]}>
        <Card.Content>
          <Text style={styles.resultLabel}>{S.calculator.resultLabel}</Text>
          <View style={styles.resultRow}>
            <Text style={styles.resultValue}>{formatResult()}</Text>
            <Text style={styles.resultUnit}>{getResultUnit()}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* כפתור נקיון */}
      <Button
        mode="outlined"
        onPress={reset}
        style={styles.clearButton}
        textColor={iPracticomColors.electricBlue}
      >
        {S.calculator.clearButton}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: iPracticomSpacing.lg,
    backgroundColor: iPracticomColors.lightBG,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: iPracticomColors.darkNavy,
    marginBottom: iPracticomSpacing.sm,
    textAlign: 'right',
  },
  segmentedButtons: {
    marginBottom: iPracticomSpacing.lg,
  },
  card: {
    marginBottom: iPracticomSpacing.lg,
    borderRadius: iPracticomRadius.card,
    elevation: 2,
  },
  inputsContainer: {
    gap: iPracticomSpacing.md,
  },
  input: {
    backgroundColor: iPracticomColors.white,
  },
  resultCard: {
    backgroundColor: iPracticomColors.white,
    borderLeftColor: iPracticomColors.electricBlue,
    borderLeftWidth: 4,
  },
  resultLabel: {
    fontSize: 14,
    color: iPracticomColors.midGray,
    marginBottom: iPracticomSpacing.xs,
    textAlign: 'right',
  },
  resultRow: {
    flexDirection: 'row-reverse',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    gap: iPracticomSpacing.sm,
  },
  resultValue: {
    fontSize: 32,
    fontWeight: '700',
    color: iPracticomColors.electricBlue,
  },
  resultUnit: {
    fontSize: 18,
    color: iPracticomColors.midGray,
    fontWeight: '600',
  },
  clearButton: {
    marginTop: iPracticomSpacing.md,
    borderColor: iPracticomColors.electricBlue,
  },
});
