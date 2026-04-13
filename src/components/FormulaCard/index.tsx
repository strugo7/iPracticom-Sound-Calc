import React, { useCallback, useEffect, useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Card, TextInput, Text } from 'react-native-paper';
import { S } from '../../strings';
import { iPracticomColors, iPracticomSpacing, iPracticomRadius } from '../../theme';
import { OhmEngine } from '../../engine/ohm';
import { useCalculatorStore, CalculatorVariable } from '../../store/calcStore';

// ────────────────────────────────────────────────────────────────────────────
// סוגי קלט אפשריים לכל נוסחה
type InputVar = 'P' | 'V' | 'I' | 'R';

interface FormulaDefinition {
  label: string;       // תצוגה מתמטית (ASCII)
  inputA: InputVar;
  inputB: InputVar;
  calc: (a: number, b: number) => number;
}

// מידע תצוגה לכל משתנה
const UNIT_INFO: Record<InputVar, { symbol: string; name: string }> = {
  P: { symbol: 'W', name: 'הספק' },
  V: { symbol: 'V', name: 'מתח' },
  I: { symbol: 'A', name: 'זרם' },
  R: { symbol: 'Ω', name: 'התנגד׳' },
};

// 12 הנוסחאות — 3 לכל משתנה יעד
const FORMULAS: Record<CalculatorVariable, FormulaDefinition[]> = {
  P: [
    { label: 'V × I',   inputA: 'V', inputB: 'I', calc: OhmEngine.P_from_VI },
    { label: 'V² ÷ R',  inputA: 'V', inputB: 'R', calc: OhmEngine.P_from_V2R },
    { label: 'I² × R',  inputA: 'I', inputB: 'R', calc: OhmEngine.P_from_I2R },
  ],
  V: [
    { label: 'I × R',   inputA: 'I', inputB: 'R', calc: OhmEngine.V_from_IR },
    { label: 'P ÷ I',   inputA: 'P', inputB: 'I', calc: OhmEngine.V_from_PI },
    { label: '√(P×R)',  inputA: 'P', inputB: 'R', calc: OhmEngine.V_from_PR },
  ],
  I: [
    { label: 'V ÷ R',   inputA: 'V', inputB: 'R', calc: OhmEngine.I_from_VR },
    { label: 'P ÷ V',   inputA: 'P', inputB: 'V', calc: OhmEngine.I_from_PV },
    { label: '√(P÷R)',  inputA: 'P', inputB: 'R', calc: OhmEngine.I_from_PR },
  ],
  R: [
    { label: 'V ÷ I',   inputA: 'V', inputB: 'I', calc: OhmEngine.R_from_VI },
    { label: 'V² ÷ P',  inputA: 'V', inputB: 'P', calc: OhmEngine.R_from_V2P },
    { label: 'P ÷ I²',  inputA: 'P', inputB: 'I', calc: OhmEngine.R_from_PI2 },
  ],
};

// סדר כפתורי המשתנים — הסדר הזה נקבע ב-RTL (ימין לשמאל: P, V, I, R)
const VARIABLE_ORDER: CalculatorVariable[] = ['P', 'V', 'I', 'R'];

// ────────────────────────────────────────────────────────────────────────────

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

  const [formulaIndex, setFormulaIndex] = useState(0);

  // טקסט גולמי של השדות — מאפשר הקלדת מספרים עשרוניים בלי שהנקודה תיאכל
  const [text1, setText1] = useState('');
  const [text2, setText2] = useState('');

  const currentFormulas = FORMULAS[targetVariable];
  const currentFormula = currentFormulas[formulaIndex];

  // ממיר טקסט קלט למספר — מטפל גם בפסיק כמפריד עשרוני (לוקאל עברי)
  const parseInput = (text: string): number | null => {
    if (text === '') return null;
    const normalized = text.replace(',', '.');
    const num = parseFloat(normalized);
    return isNaN(num) || !isFinite(num) ? null : num;
  };

  const clearInputs = useCallback(() => {
    setInput1(null);
    setInput2(null);
    setResult(null);
    setText1('');
    setText2('');
  }, [setInput1, setInput2, setResult]);

  // חישוב אוטומטי בכל שינוי
  useEffect(() => {
    if (
      input1 === null ||
      input2 === null ||
      input1 === 0 ||
      input2 === 0
    ) {
      setResult(null);
      return;
    }
    const val = currentFormula.calc(input1, input2);
    setResult(isFinite(val) ? val : null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [input1, input2, targetVariable, formulaIndex]);

  const handleVariableChange = (variable: CalculatorVariable) => {
    setTargetVariable(variable);
    setFormulaIndex(0);
    clearInputs();
  };

  const handleFormulaChange = (idx: number) => {
    setFormulaIndex(idx);
    clearInputs();
  };

  const formatResult = (): string => {
    if (result === null || result === undefined) {
      return S.calculator.resultEmpty;
    }
    return result.toFixed(3);
  };

  // ──────────────────────────────────────────────────────────────────────────
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.container}
      keyboardShouldPersistTaps="handled"
    >
      {/* ── בחירת משתנה יעד ──────────────────────────────────────────────── */}
      <Text style={styles.sectionLabel}>{S.calculator.solveFor}</Text>

      <View style={styles.varRow}>
        {VARIABLE_ORDER.map((variable) => {
          const info = UNIT_INFO[variable];
          const isActive = targetVariable === variable;
          return (
            <TouchableOpacity
              key={variable}
              style={[styles.varButton, isActive && styles.varButtonActive]}
              onPress={() => handleVariableChange(variable)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.varButtonSymbol,
                  isActive && styles.varButtonSymbolActive,
                ]}
                numberOfLines={1}
              >
                {info.symbol}
              </Text>
              <Text
                style={[
                  styles.varButtonName,
                  isActive && styles.varButtonNameActive,
                ]}
                numberOfLines={1}
              >
                {info.name}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── בחירת נוסחה (3 אפשרויות לכל משתנה) ─────────────────────────── */}
      <Text style={styles.sectionLabel}>{S.calculator.formulaLabel}</Text>

      <View style={styles.formulaRow}>
        {currentFormulas.map((formula, idx) => {
          const isActive = formulaIndex === idx;
          return (
            <TouchableOpacity
              key={idx}
              style={[
                styles.formulaButton,
                isActive && styles.formulaButtonActive,
              ]}
              onPress={() => handleFormulaChange(idx)}
              activeOpacity={0.75}
            >
              <Text
                style={[
                  styles.formulaButtonText,
                  isActive && styles.formulaButtonTextActive,
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formula.label}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── קלטים מסומנים לפי הנוסחה שנבחרה ────────────────────────────── */}
      <Card style={styles.card}>
        <Card.Content style={styles.inputsContainer}>
          <TextInput
            label={`${UNIT_INFO[currentFormula.inputA].name} (${UNIT_INFO[currentFormula.inputA].symbol})`}
            value={text1}
            onChangeText={(text) => {
              setText1(text);
              setInput1(parseInput(text));
            }}
            keyboardType="decimal-pad"
            style={styles.input}
            contentStyle={styles.inputContent}
            mode="outlined"
          />
          <TextInput
            label={`${UNIT_INFO[currentFormula.inputB].name} (${UNIT_INFO[currentFormula.inputB].symbol})`}
            value={text2}
            onChangeText={(text) => {
              setText2(text);
              setInput2(parseInput(text));
            }}
            keyboardType="decimal-pad"
            style={styles.input}
            contentStyle={styles.inputContent}
            mode="outlined"
          />
        </Card.Content>
      </Card>

      {/* ── תוצאה ────────────────────────────────────────────────────────── */}
      <Card style={[styles.card, styles.resultCard]}>
        <Card.Content>
          <Text style={styles.resultLabel}>{S.calculator.resultLabel}</Text>
          <View style={styles.resultRow}>
            {/* ביחידה ביחידה: ערך מימין, יחידה משמאל (RTL) */}
            <Text style={styles.resultUnit}>
              {UNIT_INFO[targetVariable].symbol}
            </Text>
            <Text style={styles.resultValue}>{formatResult()}</Text>
          </View>
        </Card.Content>
      </Card>

      {/* ── נקה ──────────────────────────────────────────────────────────── */}
      <TouchableOpacity
        style={styles.clearButton}
        onPress={() => {
          reset();
          setFormulaIndex(0);
          setText1('');
          setText2('');
        }}
        activeOpacity={0.75}
      >
        <Text style={styles.clearButtonText}>{S.calculator.clearButton}</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

// ────────────────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  container: {
    padding: iPracticomSpacing.lg,
    paddingBottom: iPracticomSpacing.xxl,
  },

  // ── תוויות קטע ─────────────────────────────────────────────────────────
  sectionLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: iPracticomColors.darkNavy,
    textAlign: 'right',
    marginBottom: iPracticomSpacing.sm,
  },

  // ── שורת משתנים (P/V/I/R) ──────────────────────────────────────────────
  varRow: {
    flexDirection: 'row',
    gap: iPracticomSpacing.sm,
    marginBottom: iPracticomSpacing.lg,
  },
  varButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: iPracticomSpacing.sm + 2,
    borderRadius: iPracticomRadius.button,
    borderWidth: 1.5,
    borderColor: iPracticomColors.midGray,
    backgroundColor: iPracticomColors.white,
    minHeight: 56,
  },
  varButtonActive: {
    backgroundColor: iPracticomColors.electricBlue,
    borderColor: iPracticomColors.electricBlue,
  },
  varButtonSymbol: {
    fontSize: 18,
    fontWeight: '700',
    color: iPracticomColors.darkNavy,
    lineHeight: 24,
    textAlign: 'center',
  },
  varButtonSymbolActive: {
    color: iPracticomColors.white,
  },
  varButtonName: {
    fontSize: 11,
    color: iPracticomColors.midGray,
    lineHeight: 15,
    textAlign: 'center',
  },
  varButtonNameActive: {
    color: iPracticomColors.white,
  },

  // ── שורת נוסחאות (3 אפשרויות) ──────────────────────────────────────────
  formulaRow: {
    flexDirection: 'row',
    gap: iPracticomSpacing.sm,
    marginBottom: iPracticomSpacing.lg,
  },
  formulaButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: iPracticomSpacing.sm,
    paddingHorizontal: iPracticomSpacing.xs,
    borderRadius: iPracticomRadius.button,
    borderWidth: 1.5,
    borderColor: iPracticomColors.skyBlue,
    backgroundColor: iPracticomColors.white,
    minHeight: 44,
  },
  formulaButtonActive: {
    backgroundColor: iPracticomColors.electricBlue,
    borderColor: iPracticomColors.electricBlue,
  },
  formulaButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: iPracticomColors.electricBlue,
    textAlign: 'center',
  },
  formulaButtonTextActive: {
    color: iPracticomColors.white,
  },

  // ── כרטיס קלטים ────────────────────────────────────────────────────────
  card: {
    marginBottom: iPracticomSpacing.lg,
    borderRadius: iPracticomRadius.card,
    elevation: 2,
    backgroundColor: iPracticomColors.white,
  },
  inputsContainer: {
    gap: iPracticomSpacing.md,
  },
  input: {
    backgroundColor: iPracticomColors.white,
  },
  inputContent: {
    textAlign: 'right',
  },

  // ── כרטיס תוצאה ─────────────────────────────────────────────────────────
  resultCard: {
    borderStartColor: iPracticomColors.electricBlue,
    borderStartWidth: 4,
  },
  resultLabel: {
    fontSize: 13,
    color: iPracticomColors.midGray,
    textAlign: 'right',
    marginBottom: iPracticomSpacing.xs,
  },
  resultRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'flex-end',
    gap: iPracticomSpacing.sm,
  },
  resultValue: {
    fontSize: 36,
    fontWeight: '700',
    color: iPracticomColors.electricBlue,
  },
  resultUnit: {
    fontSize: 20,
    color: iPracticomColors.midGray,
    fontWeight: '600',
  },

  // ── כפתור נקה ───────────────────────────────────────────────────────────
  clearButton: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: iPracticomSpacing.md,
    borderRadius: iPracticomRadius.button,
    borderWidth: 1.5,
    borderColor: iPracticomColors.electricBlue,
    backgroundColor: iPracticomColors.white,
  },
  clearButtonText: {
    fontSize: 15,
    fontWeight: '600',
    color: iPracticomColors.electricBlue,
  },
});
