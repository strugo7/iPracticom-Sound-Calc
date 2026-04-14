import React, { useMemo } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Dimensions,
  Image,
  SafeAreaView,
  Pressable,
  FlatList,
} from 'react-native';
import { Text, Button, Snackbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { iPracticomColors, iPracticomSpacing, iPracticomRadius } from '../../theme';
import { S } from '../../strings';
import { CatalogStackParamList } from '../../navigation/CatalogNavigator';
import { Player, Mixer, Matrix, Amplifier, Speaker } from '../../types/catalog';
import { CategoryKey } from '../../store/catalogStore';
import { getProductImage } from '../../utils/productImages';

// ─── Product Detail Screen — מסך פרטי מוצר מלא ────────────────────────────────

const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH = Dimensions.get('window').width;
const HERO_HEIGHT = SCREEN_HEIGHT * 0.45;

const CATEGORY_ICONS: Record<string, string> = {
  players: 'play-circle-outline',
  mixers: 'tune-vertical',
  matrices: 'grid',
  amplifiers: 'amplifier',
  speakers: 'speaker',
};

interface StatCell {
  label: string;
  value: string;
  isHighlight?: boolean;
}

function getStatCells(product: any, category: CategoryKey | null): StatCell[] {
  const ds = (S as any).productDetail;
  const cells: StatCell[] = [];

  switch (category) {
    case 'amplifiers': {
      const amp = product as Amplifier;
      cells.push(
        { label: ds.channels, value: String(amp.channels) },
        { label: ds.powerPerChannel, value: `${amp.powerPerChannel}W`, isHighlight: true },
        { label: ds.minImpedance, value: `${amp.minImpedance}Ω` },
        { label: ds.technology, value: amp.technology || '—' },
      );
      if (amp.totalPower) {
        cells.push({ label: ds.totalPower, value: `${amp.totalPower}W`, isHighlight: true });
      }
      cells.push(
        { label: ds.supports70V, value: amp.supports70V ? 'כן' : 'לא' },
        { label: ds.supports100V, value: amp.supports100V ? 'כן' : 'לא' },
        { label: ds.dsp, value: amp.dsp ? 'כן' : 'לא' },
      );
      if (amp.intelliDrive) {
        cells.push({ label: ds.intelliDrive, value: 'כן' });
      }
      break;
    }
    case 'matrices': {
      const mtx = product as Matrix;
      cells.push(
        { label: ds.inputs, value: String(mtx.inputs) },
        { label: ds.outputs, value: String(mtx.outputs) },
        { label: ds.dsp, value: mtx.dsp ? 'כן' : 'לא' },
      );
      if (mtx.zones) {
        cells.push({ label: ds.zones, value: String(mtx.zones) });
      }
      break;
    }
    case 'players': {
      const p = product as Player;
      cells.push(
        { label: 'סוג יציאה', value: p.outputType },
        { label: 'מתח יציאה', value: `${p.outputVoltage}V`, isHighlight: true },
      );
      if (p.maxResolution) {
        cells.push({ label: 'רזולוציה', value: p.maxResolution });
      }
      break;
    }
    case 'speakers': {
      const spk = product as Speaker;
      cells.push(
        { label: ds.powerRating, value: `${spk.powerRating}W`, isHighlight: true },
        { label: ds.impedance, value: `${spk.impedance}Ω` },
        { label: 'שנאי קו', value: spk.hasLineTransformer ? 'כן' : 'לא' },
      );
      break;
    }
    case 'mixers': {
      const m = product as Mixer;
      cells.push(
        { label: 'כניסות', value: String(m.inputCount) },
        { label: 'יציאות', value: String(m.outputCount) },
        { label: 'שלבי הגברה', value: String(m.gainStages) },
      );
      break;
    }
    default:
      break;
  }

  return cells;
}

function getConnectionItems(product: any, category: CategoryKey | null): string[] {
  const items: string[] = [];

  switch (category) {
    case 'amplifiers': {
      const amp = product as Amplifier;
      if (amp.inputConnectors?.length) {
        items.push(...amp.inputConnectors);
      }
      break;
    }
    case 'matrices': {
      const mtx = product as Matrix;
      if ((mtx as any).connectivity?.length) {
        items.push(...(mtx as any).connectivity);
      }
      break;
    }
    case 'players': {
      const p = product as Player;
      if (p.connectivity?.length) {
        items.push(...p.connectivity);
      }
      break;
    }
    default:
      break;
  }

  return items;
}

type ProductDetailNavigationProp = StackNavigationProp<CatalogStackParamList, 'ProductDetail'>;
type ProductDetailRouteProp = React.ComponentProps<any>['route'];

export default function ProductDetailScreen() {
  const navigation = useNavigation<ProductDetailNavigationProp>();
  const route = useRoute<ProductDetailRouteProp>();
  const { product, category } = route.params as {
    product: any;
    category: CategoryKey;
  };

  const [snackVisible, setSnackVisible] = React.useState(false);
  const [snackMessage, setSnackMessage] = React.useState('');

  const imageSource = useMemo(() => getProductImage(product.id), [product.id]);
  const statCells = useMemo(() => getStatCells(product, category), [product, category]);
  const connectionItems = useMemo(() => getConnectionItems(product, category), [product, category]);

  const categoryIcon = CATEGORY_ICONS[category] || 'cube-outline';

  const handleAddToChain = () => {
    setSnackMessage((S as any).productDetail.snackComingSoon);
    setSnackVisible(true);
  };

  const handleGuide = () => {
    setSnackMessage((S as any).productDetail.snackComingSoon);
    setSnackVisible(true);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header Bar */}
      <View style={styles.headerBar}>
        <Pressable
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [styles.backButton, pressed && styles.backButtonPressed]}
        >
          <MaterialCommunityIcons
            name="chevron-right"
            size={28}
            color={iPracticomColors.electricBlue}
          />
        </Pressable>
        <Text style={styles.headerTitle}>{(S as any).productDetail.screenTitle}</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* ════ Hero Section ════ */}
        <View style={styles.heroContainer}>
          {/* Background: Dark Navy */}
          <View style={styles.heroBackground}>
            {imageSource ? (
              <Image
                source={imageSource}
                style={styles.heroImage}
                resizeMode="contain"
              />
            ) : (
              <MaterialCommunityIcons
                name={categoryIcon}
                size={80}
                color={iPracticomColors.midGray}
              />
            )}
          </View>

          {/* Overlay: Product info + badge */}
          <View style={styles.heroOverlay}>
            {/* Category Badge */}
            <View style={styles.categoryBadge}>
              <Text style={styles.categoryBadgeText}>
                {S.catalog.categories[category as keyof typeof S.catalog.categories]}
              </Text>
            </View>

            {/* Product Name & Manufacturer */}
            <Text style={styles.productName}>{product.name}</Text>
            <Text style={styles.productManufacturer}>{product.manufacturer}</Text>
          </View>
        </View>

        {/* ════ Action Buttons ════ */}
        <View style={styles.buttonsRow}>
          <Button
            mode="outlined"
            onPress={handleGuide}
            style={styles.buttonSecondary}
            labelStyle={styles.buttonLabelSecondary}
            textColor={iPracticomColors.electricBlue}
          >
            {(S as any).productDetail.guideButton}
          </Button>
          <Button
            mode="contained"
            onPress={handleAddToChain}
            style={styles.buttonPrimary}
            labelStyle={styles.buttonLabelPrimary}
          >
            {(S as any).productDetail.addToChainButton}
          </Button>
        </View>

        {/* ════ Specs Section ════ */}
        <View style={styles.specsCard}>
          <View style={styles.sectionHeader}>
            <MaterialCommunityIcons
              name="tune-vertical"
              size={20}
              color={iPracticomColors.darkNavy}
            />
            <Text style={styles.sectionTitle}>{(S as any).productDetail.specsSection}</Text>
          </View>

          <View style={styles.statGrid}>
            {statCells.map((cell, idx) => (
              <View key={idx} style={[styles.statCell, idx % 2 === 1 && styles.statCellRight]}>
                <Text
                  style={[
                    styles.statValue,
                    cell.isHighlight && styles.statValueHighlight,
                  ]}
                >
                  {cell.value}
                </Text>
                <Text style={styles.statLabel}>{cell.label}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ════ Connections Section (conditional) ════ */}
        {connectionItems.length > 0 && (
          <View style={styles.connectionsCard}>
            <View style={styles.sectionHeader}>
              <MaterialCommunityIcons
                name="cable-data"
                size={20}
                color={iPracticomColors.darkNavy}
              />
              <Text style={styles.sectionTitle}>{(S as any).productDetail.connectionsSection}</Text>
            </View>

            <FlatList
              data={connectionItems}
              keyExtractor={(item, idx) => `${idx}`}
              renderItem={({ item }) => (
                <View style={styles.connectionItem}>
                  <View style={styles.bulletPoint} />
                  <Text style={styles.connectionText}>{item}</Text>
                </View>
              )}
              scrollEnabled={false}
            />
          </View>
        )}
      </ScrollView>

      {/* Snackbar */}
      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={2000}
        style={styles.snackbar}
      >
        {snackMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iPracticomColors.darkNavy,
  },
  scrollView: {
    flex: 1,
    backgroundColor: iPracticomColors.darkNavy,
  },
  scrollContent: {
    paddingBottom: iPracticomSpacing.xl,
  },

  // ─── Header Bar ───────────────────────────────────────────────────────────
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: iPracticomSpacing.md,
    paddingVertical: iPracticomSpacing.md,
    backgroundColor: iPracticomColors.darkNavy,
    borderBottomColor: iPracticomColors.white + '10',
    borderBottomWidth: 1,
  },
  backButton: {
    padding: iPracticomSpacing.sm,
    borderRadius: 24,
  },
  backButtonPressed: {
    backgroundColor: iPracticomColors.white + '10',
  },
  headerTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 17,
    fontWeight: '700',
    color: iPracticomColors.white,
  },
  headerSpacer: {
    width: 40,
  },

  // ─── Hero Section ─────────────────────────────────────────────────────────
  heroContainer: {
    height: HERO_HEIGHT,
    backgroundColor: iPracticomColors.darkNavy,
    justifyContent: 'flex-end',
    position: 'relative',
  },
  heroBackground: {
    ...StyleSheet.absoluteFill,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: iPracticomColors.darkNavy,
  },
  heroImage: {
    width: '80%',
    height: 200,
  },
  heroOverlay: {
    paddingHorizontal: iPracticomSpacing.lg,
    paddingBottom: iPracticomSpacing.lg,
    zIndex: 1,
  },
  categoryBadge: {
    alignSelf: 'flex-end',
    backgroundColor: iPracticomColors.electricBlue,
    paddingHorizontal: iPracticomSpacing.md,
    paddingVertical: iPracticomSpacing.xs,
    borderRadius: iPracticomRadius.badge,
    marginBottom: iPracticomSpacing.sm,
  },
  categoryBadgeText: {
    color: iPracticomColors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  productName: {
    fontSize: 22,
    fontWeight: '700',
    color: iPracticomColors.white,
    textAlign: 'right',
    marginBottom: iPracticomSpacing.xs,
  },
  productManufacturer: {
    fontSize: 13,
    color: iPracticomColors.midGray,
    textAlign: 'right',
  },

  // ─── Action Buttons ───────────────────────────────────────────────────────
  buttonsRow: {
    flexDirection: 'row-reverse',
    gap: iPracticomSpacing.md,
    paddingHorizontal: iPracticomSpacing.lg,
    paddingTop: iPracticomSpacing.lg,
    paddingBottom: iPracticomSpacing.md,
    backgroundColor: iPracticomColors.darkNavy,
  },
  buttonPrimary: {
    flex: 1,
    backgroundColor: iPracticomColors.electricBlue,
    borderRadius: iPracticomRadius.button,
  },
  buttonLabelPrimary: {
    color: iPracticomColors.white,
    fontWeight: '700',
    fontSize: 14,
  },
  buttonSecondary: {
    flex: 1,
    borderColor: iPracticomColors.electricBlue,
    borderWidth: 2,
    borderRadius: iPracticomRadius.button,
  },
  buttonLabelSecondary: {
    fontWeight: '700',
    fontSize: 14,
  },

  // ─── Specs Section ────────────────────────────────────────────────────────
  specsCard: {
    marginHorizontal: iPracticomSpacing.md,
    marginBottom: iPracticomSpacing.md,
    backgroundColor: iPracticomColors.white,
    borderRadius: iPracticomRadius.card,
    elevation: 2,
    padding: iPracticomSpacing.md,
  },
  sectionHeader: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: iPracticomSpacing.sm,
    marginBottom: iPracticomSpacing.md,
    paddingBottom: iPracticomSpacing.md,
    borderBottomColor: iPracticomColors.midGray + '20',
    borderBottomWidth: 1,
  },
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: iPracticomColors.darkNavy,
  },
  statGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 0,
  },
  statCell: {
    flex: 1,
    minWidth: '45%',
    paddingVertical: iPracticomSpacing.sm,
    paddingHorizontal: iPracticomSpacing.sm,
    borderRightColor: iPracticomColors.midGray + '20',
    borderRightWidth: 1,
    borderBottomColor: iPracticomColors.midGray + '20',
    borderBottomWidth: 1,
    alignItems: 'flex-end',
  },
  statCellRight: {
    borderRightWidth: 0,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: iPracticomColors.darkNavy,
    marginBottom: iPracticomSpacing.xs,
  },
  statValueHighlight: {
    color: iPracticomColors.electricBlue,
  },
  statLabel: {
    fontSize: 12,
    color: iPracticomColors.midGray,
    textAlign: 'right',
  },

  // ─── Connections Section ──────────────────────────────────────────────────
  connectionsCard: {
    marginHorizontal: iPracticomSpacing.md,
    marginBottom: iPracticomSpacing.md,
    backgroundColor: iPracticomColors.white,
    borderRadius: iPracticomRadius.card,
    elevation: 2,
    padding: iPracticomSpacing.md,
  },
  connectionItem: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: iPracticomSpacing.md,
    paddingVertical: iPracticomSpacing.sm,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: iPracticomColors.electricBlue,
  },
  connectionText: {
    flex: 1,
    fontSize: 14,
    color: iPracticomColors.darkNavy,
    textAlign: 'right',
  },

  // ─── Snackbar ─────────────────────────────────────────────────────────────
  snackbar: {
    backgroundColor: iPracticomColors.midGray,
  },
});
