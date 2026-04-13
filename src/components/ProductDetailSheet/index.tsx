import React, { useRef, useEffect } from 'react';
import {
  View,
  StyleSheet,
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  Dimensions,
} from 'react-native';
import { Text, Button } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { iPracticomColors, iPracticomSpacing, iPracticomRadius } from '../../theme';
import {
  AnyProduct,
  CategoryKey,
} from '../../store/catalogStore';
import { Player, Mixer, Matrix, Amplifier, Speaker } from '../../types/catalog';
import { S } from '../../strings';

// ─── גיליון פרטי מוצר — bottom sheet style ──────────────────────────────────

interface ProductDetailSheetProps {
  visible: boolean;
  product: AnyProduct | null;
  category: CategoryKey | null;
  onDismiss: () => void;
}

const SCREEN_HEIGHT = Dimensions.get('window').height;

interface SpecRow {
  label: string;
  value: string;
}

function getSpecRows(product: AnyProduct, category: CategoryKey | null): SpecRow[] {
  const ds = S.catalog.detailSheet;
  const rows: SpecRow[] = [
    { label: ds.manufacturer, value: product.manufacturer },
    { label: ds.model, value: product.model },
  ];

  switch (category) {
    case 'players': {
      const p = product as Player;
      rows.push(
        { label: ds.outputType, value: p.outputType },
        { label: ds.outputVoltage, value: `${p.outputVoltage}V` },
      );
      if (p.additionalOutputs?.length) {
        rows.push({ label: ds.outputs, value: p.additionalOutputs.join(', ') });
      }
      break;
    }
    case 'mixers': {
      const m = product as Mixer;
      rows.push(
        { label: ds.inputs, value: String(m.inputCount) },
        { label: ds.outputs, value: String(m.outputCount) },
      );
      break;
    }
    case 'matrices': {
      const mtx = product as Matrix;
      rows.push(
        { label: ds.inputs, value: String(mtx.inputs) },
        { label: ds.outputs, value: String(mtx.outputs) },
      );
      if (mtx.zones) {
        rows.push({ label: ds.zones, value: String(mtx.zones) });
      }
      rows.push({ label: ds.dsp, value: mtx.dsp ? ds.yes : ds.no });
      break;
    }
    case 'amplifiers': {
      const amp = product as Amplifier;
      rows.push(
        { label: ds.channels, value: String(amp.channels) },
        { label: ds.powerPerChannel, value: `${amp.powerPerChannel}W` },
        { label: ds.minImpedance, value: `${amp.minImpedance}Ω` },
      );
      if (amp.totalPower) {
        rows.push({ label: ds.totalPower, value: `${amp.totalPower}W` });
      }
      rows.push(
        { label: ds.supports70V, value: amp.supports70V ? ds.yes : ds.no },
        { label: ds.supports100V, value: amp.supports100V ? ds.yes : ds.no },
        { label: ds.dsp, value: amp.dsp ? ds.yes : ds.no },
      );
      break;
    }
    case 'speakers': {
      const spk = product as Speaker;
      rows.push(
        { label: ds.powerRating, value: `${spk.powerRating}W` },
        { label: ds.impedance, value: `${spk.impedance}Ω` },
        { label: ds.hasTransformer, value: spk.hasLineTransformer ? ds.yes : ds.no },
      );
      if (spk.transformerTaps?.length) {
        rows.push({ label: ds.transformerTaps, value: spk.transformerTaps.map((t) => `${t}W`).join(', ') });
      }
      break;
    }
    default:
      break;
  }

  return rows;
}

const CATEGORY_ICONS: Record<string, string> = {
  players: 'play-circle-outline',
  mixers: 'tune-vertical',
  matrices: 'grid',
  amplifiers: 'amplifier',
  speakers: 'speaker',
};

export function ProductDetailSheet({ visible, product, category, onDismiss }: ProductDetailSheetProps) {
  const slideAnim = useRef(new Animated.Value(SCREEN_HEIGHT)).current;

  useEffect(() => {
    if (visible) {
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 250,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();
    } else {
      slideAnim.setValue(SCREEN_HEIGHT);
    }
  }, [visible, slideAnim]);

  if (!product || !category) return null;

  const specRows = getSpecRows(product, category);
  const icon = CATEGORY_ICONS[category] || 'cube-outline';

  const handleDismiss = () => {
    Animated.timing(slideAnim, {
      toValue: SCREEN_HEIGHT,
      duration: 250,
      easing: Easing.in(Easing.ease),
      useNativeDriver: true,
    }).start(() => onDismiss());
  };

  return (
    <Modal visible={visible} transparent animationType="none" onRequestClose={handleDismiss}>
      {/* רקע כהה */}
      <Pressable style={styles.backdrop} onPress={handleDismiss}>
        <View />
      </Pressable>

      {/* גיליון */}
      <Animated.View style={[styles.sheet, { transform: [{ translateY: slideAnim }] }]}>
        {/* ידית */}
        <View style={styles.handleBar} />

        {/* כותרת */}
        <View style={styles.headerRow}>
          <View style={styles.headerIconCircle}>
            <MaterialCommunityIcons name={icon} size={26} color={iPracticomColors.electricBlue} />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
            <Text style={styles.productManufacturer}>{product.manufacturer}</Text>
          </View>
        </View>

        {/* מפריד */}
        <View style={styles.divider} />

        {/* מפרט טכני */}
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {specRows.map((row, idx) => (
            <View key={`${row.label}-${idx}`} style={[styles.specRow, idx % 2 === 0 && styles.specRowAlt]}>
              <Text style={styles.specValue}>{row.value}</Text>
              <Text style={styles.specLabel}>{row.label}</Text>
            </View>
          ))}
        </ScrollView>

        {/* כפתור סגירה */}
        <View style={styles.closeContainer}>
          <Button
            mode="contained"
            onPress={handleDismiss}
            style={styles.closeButton}
            labelStyle={styles.closeLabel}
            buttonColor={iPracticomColors.electricBlue}
            textColor={iPracticomColors.white}
          >
            {S.catalog.detailSheet.closeButton}
          </Button>
        </View>
      </Animated.View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.45)',
  },
  sheet: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    maxHeight: SCREEN_HEIGHT * 0.75,
    backgroundColor: iPracticomColors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: iPracticomSpacing.sm,
    paddingBottom: iPracticomSpacing.lg,
  },
  handleBar: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: iPracticomColors.midGray + '40',
    alignSelf: 'center',
    marginBottom: iPracticomSpacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: iPracticomSpacing.lg,
    marginBottom: iPracticomSpacing.md,
  },
  headerIconCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: iPracticomColors.electricBlue + '14',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: iPracticomSpacing.md,
  },
  headerText: {
    flex: 1,
    alignItems: 'flex-end',
  },
  productName: {
    fontSize: 18,
    fontWeight: '700',
    color: iPracticomColors.darkNavy,
    textAlign: 'right',
  },
  productManufacturer: {
    fontSize: 13,
    color: iPracticomColors.midGray,
    marginTop: 2,
    textAlign: 'right',
  },
  divider: {
    height: 1,
    backgroundColor: iPracticomColors.midGray + '20',
    marginHorizontal: iPracticomSpacing.lg,
    marginBottom: iPracticomSpacing.sm,
  },
  scrollContent: {
    paddingHorizontal: iPracticomSpacing.lg,
    paddingBottom: iPracticomSpacing.md,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: iPracticomSpacing.sm + 4,
    paddingHorizontal: iPracticomSpacing.sm,
    borderRadius: iPracticomRadius.input,
  },
  specRowAlt: {
    backgroundColor: iPracticomColors.lightBG,
  },
  specLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: iPracticomColors.darkNavy,
    textAlign: 'right',
  },
  specValue: {
    fontSize: 14,
    color: iPracticomColors.midGray,
    textAlign: 'left',
    maxWidth: '55%' as unknown as number,
  },
  closeContainer: {
    paddingHorizontal: iPracticomSpacing.lg,
    paddingTop: iPracticomSpacing.sm,
  },
  closeButton: {
    borderRadius: iPracticomRadius.button,
  },
  closeLabel: {
    fontSize: 15,
    fontWeight: '600',
  },
});
