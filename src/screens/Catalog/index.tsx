import React, { useCallback, useMemo } from 'react';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import {
  View,
  StyleSheet,
  SectionList,
  SectionListData,
  SectionListRenderItemInfo,
} from 'react-native';
import { Text, Searchbar, Chip } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { iPracticomColors, iPracticomSpacing, iPracticomRadius } from '../../theme';
import { S } from '../../strings';
import {
  useCatalogStore,
  getFilteredSections,
  CategoryKey,
  AnyProduct,
  CatalogSection,
} from '../../store/catalogStore';
import { CatalogCard } from '../../components/CatalogCard';
import { CatalogStackParamList } from '../../navigation/CatalogNavigator';

// ─── מסך קטלוג — רשימת מוצרים עם חיפוש, סינון וגיליון פרטים ───────────────

const CATEGORY_CHIPS: { key: CategoryKey; label: string }[] = [
  { key: 'all', label: S.catalog.allCategories },
  { key: 'players', label: S.catalog.categories.players },
  { key: 'mixers', label: S.catalog.categories.mixers },
  { key: 'matrices', label: S.catalog.categories.matrices },
  { key: 'amplifiers', label: S.catalog.categories.amplifiers },
  { key: 'speakers', label: S.catalog.categories.speakers },
];

type CatalogNavigationProp = StackNavigationProp<CatalogStackParamList, 'CatalogList'>;

export default function CatalogScreen() {
  const navigation = useNavigation<CatalogNavigationProp>();
  const searchQuery = useCatalogStore((s) => s.searchQuery);
  const activeCategory = useCatalogStore((s) => s.activeCategory);
  const setSearchQuery = useCatalogStore((s) => s.setSearchQuery);
  const setActiveCategory = useCatalogStore((s) => s.setActiveCategory);

  // סלקטור — מחשב סקשנים מסוננים
  const sections = useMemo(
    () => getFilteredSections(useCatalogStore.getState()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQuery, activeCategory],
  );

  const handleProductPress = useCallback(
    (product: AnyProduct, category: CategoryKey) => {
      navigation.push('ProductDetail', { product, category });
    },
    [navigation],
  );

  const renderItem = useCallback(
    ({ item, section }: SectionListRenderItemInfo<AnyProduct, CatalogSection>) => (
      <CatalogCard
        product={item}
        category={section.category}
        onPress={() => handleProductPress(item, section.category)}
      />
    ),
    [handleProductPress],
  );

  const renderSectionHeader = useCallback(
    ({ section }: { section: SectionListData<AnyProduct, CatalogSection> }) => (
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>{section.title}</Text>
        <View style={styles.sectionBadge}>
          <Text style={styles.sectionCount}>{section.data.length}</Text>
        </View>
      </View>
    ),
    [],
  );

  const renderEmptyList = useCallback(
    () => (
      <View style={styles.emptyContainer}>
        <MaterialCommunityIcons
          name="magnify-close"
          size={56}
          color={iPracticomColors.midGray + '60'}
        />
        <Text style={styles.emptyText}>{S.catalog.noResults}</Text>
      </View>
    ),
    [],
  );

  const keyExtractor = useCallback((item: AnyProduct) => item.id, []);

  return (
    <View style={styles.container}>
      {/* כותרת */}
      <View style={styles.titleRow}>
        <MaterialCommunityIcons
          name="book-open-page-variant-outline"
          size={24}
          color={iPracticomColors.electricBlue}
        />
        <Text style={styles.screenTitle}>{S.catalog.screenTitle}</Text>
      </View>

      {/* חיפוש */}
      <View style={styles.searchWrapper}>
        <Searchbar
          placeholder={S.catalog.searchPlaceholder}
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
          inputStyle={styles.searchInput}
          iconColor={iPracticomColors.midGray}
          placeholderTextColor={iPracticomColors.midGray + '80'}
          accessibilityLabel={S.a11y.searchInput}
        />
      </View>

      {/* צ'יפים — סינון קטגוריה */}
      <View style={styles.chipsRow}>
        {CATEGORY_CHIPS.map((chip) => {
          const isActive = activeCategory === chip.key;
          return (
            <Chip
              key={chip.key}
              selected={isActive}
              onPress={() => setActiveCategory(chip.key)}
              style={[styles.chip, isActive && styles.chipActive]}
              textStyle={[styles.chipText, isActive && styles.chipTextActive]}
              showSelectedCheck={false}
              compact
            >
              {chip.label}
            </Chip>
          );
        })}
      </View>

      {/* רשימת מוצרים */}
      <SectionList
        sections={sections}
        keyExtractor={keyExtractor}
        renderItem={renderItem}
        renderSectionHeader={renderSectionHeader}
        ListEmptyComponent={renderEmptyList}
        stickySectionHeadersEnabled={false}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={null}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iPracticomColors.lightBG,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: iPracticomSpacing.lg,
    paddingTop: iPracticomSpacing.lg,
    paddingBottom: iPracticomSpacing.sm,
    gap: iPracticomSpacing.sm,
  },
  screenTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: iPracticomColors.darkNavy,
    textAlign: 'right',
  },
  searchWrapper: {
    paddingHorizontal: iPracticomSpacing.md,
    marginBottom: iPracticomSpacing.sm,
  },
  searchBar: {
    backgroundColor: iPracticomColors.white,
    borderRadius: iPracticomRadius.card,
    elevation: 1,
    shadowColor: iPracticomColors.darkNavy,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    height: 46,
  },
  searchInput: {
    fontSize: 14,
    textAlign: 'right',
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'flex-end',
    paddingHorizontal: iPracticomSpacing.md,
    marginBottom: iPracticomSpacing.md,
    gap: iPracticomSpacing.xs,
  },
  chip: {
    backgroundColor: iPracticomColors.white,
    borderColor: iPracticomColors.midGray + '30',
    borderWidth: 1,
  },
  chipActive: {
    backgroundColor: iPracticomColors.electricBlue,
    borderColor: iPracticomColors.electricBlue,
  },
  chipText: {
    fontSize: 12,
    color: iPracticomColors.darkNavy,
  },
  chipTextActive: {
    color: iPracticomColors.white,
    fontWeight: '600',
  },
  listContent: {
    paddingBottom: iPracticomSpacing.xxl,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingHorizontal: iPracticomSpacing.lg,
    paddingTop: iPracticomSpacing.md,
    paddingBottom: iPracticomSpacing.sm,
    gap: iPracticomSpacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: iPracticomColors.electricBlue,
    textAlign: 'right',
  },
  sectionBadge: {
    backgroundColor: iPracticomColors.electricBlue + '14',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 10,
  },
  sectionCount: {
    fontSize: 12,
    fontWeight: '600',
    color: iPracticomColors.electricBlue,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingTop: iPracticomSpacing.xxl * 2,
  },
  emptyText: {
    fontSize: 16,
    color: iPracticomColors.midGray,
    marginTop: iPracticomSpacing.md,
    textAlign: 'center',
  },
});
