import React, { useRef, useEffect } from 'react';
import { View, StyleSheet, Animated, Easing } from 'react-native';
import { Text, TouchableRipple } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { iPracticomColors, iPracticomSpacing, iPracticomRadius } from '../../theme';
import { AnyProduct, CategoryKey } from '../../store/catalogStore';
import { S } from '../../strings';

// ─── קומפוננטת כרטיס מוצר בקטלוג ───────────────────────────────────────────

interface CatalogCardProps {
  product: AnyProduct;
  category: CategoryKey;
  onPress: () => void;
}

const CATEGORY_ICONS: Record<string, string> = {
  players: 'play-circle-outline',
  mixers: 'tune-vertical',
  matrices: 'grid',
  amplifiers: 'amplifier',
  speakers: 'speaker',
};

function getSubtitle(product: AnyProduct, category: CategoryKey): string {
  switch (category) {
    case 'amplifiers': {
      const amp = product as { channels: number; powerPerChannel: number };
      return `${amp.channels} ${S.catalog.detailSheet.channels} · ${amp.powerPerChannel}W`;
    }
    case 'speakers': {
      const spk = product as { impedance: number; powerRating: number };
      return `${spk.impedance}Ω · ${spk.powerRating}W`;
    }
    case 'matrices': {
      const mtx = product as { inputs: number; outputs: number };
      return `${mtx.inputs}×${mtx.outputs}`;
    }
    case 'players': {
      const plr = product as { outputType: string };
      return plr.outputType;
    }
    case 'mixers': {
      const mix = product as { inputCount: number; outputCount: number };
      return `${mix.inputCount}/${mix.outputCount}`;
    }
    default:
      return product.manufacturer;
  }
}

export function CatalogCard({ product, category, onPress }: CatalogCardProps) {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.95)).current;

  useEffect(() => {
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
  }, [fadeAnim, scaleAnim]);

  const icon = CATEGORY_ICONS[category] || 'cube-outline';
  const subtitle = getSubtitle(product, category);

  return (
    <Animated.View style={[styles.cardOuter, { opacity: fadeAnim, transform: [{ scale: scaleAnim }] }]}>
      <TouchableRipple
        onPress={onPress}
        rippleColor={iPracticomColors.skyBlue + '30'}
        style={styles.card}
        accessibilityLabel={S.a11y.catalogItemDetail}
        accessibilityRole="button"
      >
        <View style={styles.cardRow}>
          {/* חץ שמאלי */}
          <MaterialCommunityIcons
            name="chevron-left"
            size={22}
            color={iPracticomColors.midGray}
          />

          {/* תוכן */}
          <View style={styles.cardContent}>
            <Text style={styles.cardTitle} numberOfLines={1}>
              {product.name}
            </Text>
            <Text style={styles.cardSubtitle} numberOfLines={1}>
              {product.manufacturer} · {subtitle}
            </Text>
          </View>

          {/* אייקון קטגוריה */}
          <View style={styles.iconCircle}>
            <MaterialCommunityIcons
              name={icon}
              size={20}
              color={iPracticomColors.electricBlue}
            />
          </View>
        </View>
      </TouchableRipple>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  cardOuter: {
    marginHorizontal: iPracticomSpacing.md,
    marginBottom: iPracticomSpacing.sm,
  },
  card: {
    backgroundColor: iPracticomColors.white,
    borderRadius: iPracticomRadius.card,
    paddingVertical: iPracticomSpacing.md,
    paddingHorizontal: iPracticomSpacing.md,
    elevation: 1,
    shadowColor: iPracticomColors.darkNavy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
  },
  cardRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  cardContent: {
    flex: 1,
    marginHorizontal: iPracticomSpacing.sm,
    alignItems: 'flex-end',
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: iPracticomColors.darkNavy,
    textAlign: 'right',
  },
  cardSubtitle: {
    fontSize: 12,
    color: iPracticomColors.midGray,
    marginTop: 2,
    textAlign: 'right',
  },
  iconCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: iPracticomColors.electricBlue + '12',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
