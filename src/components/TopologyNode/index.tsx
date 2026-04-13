import React, { useMemo } from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Text, IconButton } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { iPracticomColors, iPracticomSpacing, iPracticomRadius } from '../../theme';
import { useCatalogStore } from '../../store/catalogStore';
import { ChainNode, NodeType } from '../../types/catalog';
import { S } from '../../strings';

// צומת בשרשרת האות - מציג שם מוצר, סוג, וכפתור הסרה

interface TopologyNodeProps {
  node: ChainNode;
  onRemove: (nodeId: string) => void;
  onUpdate?: (nodeId: string, updates: Partial<ChainNode>) => void;
}

export function TopologyNode({ node, onRemove, onUpdate }: TopologyNodeProps) {
  const { catalog } = useCatalogStore();

  // מצא את המוצר בקטלוג
  const product = useMemo(() => {
    switch (node.type) {
      case 'source':
        return catalog.players.find(p => p.id === node.productId);
      case 'mixer':
        return catalog.mixers.find(m => m.id === node.productId);
      case 'matrix':
        return catalog.matrices.find(m => m.id === node.productId);
      case 'amplifier':
        return catalog.amplifiers.find(a => a.id === node.productId);
      case 'speaker_group':
        return catalog.speakers.find(s => s.id === node.productId);
      default:
        return null;
    }
  }, [node, catalog]);

  // בחר אייקון בהתאם לסוג
  const getIcon = (type: NodeType) => {
    switch (type) {
      case 'source': return 'music';
      case 'mixer': return 'mixer';
      case 'matrix': return 'matrix';
      case 'amplifier': return 'amplifier';
      case 'speaker_group': return 'speaker';
      default: return 'help-circle';
    }
  };

  // תיאור אנושי של סוג
  const getTypeLabel = (type: NodeType) => {
    switch (type) {
      case 'source': return S.topology.nodeTypes.source;
      case 'mixer': return S.topology.nodeTypes.mixer;
      case 'matrix': return S.topology.nodeTypes.matrix;
      case 'amplifier': return S.topology.nodeTypes.amplifier;
      case 'speaker_group': return S.topology.nodeTypes.speakerGroup;
      default: return S.general.unknown;
    }
  };

  const typeLabel = getTypeLabel(node.type);
  const productName = product ? product.name : S.general.notAvailable;
  const productModel = product ? product.model : '';

  return (
    <View style={styles.container}>
      <View style={styles.nodeCard}>
        <View style={styles.iconWrapper}>
          <MaterialCommunityIcons
            name={getIcon(node.type)}
            size={28}
            color={iPracticomColors.electricBlue}
          />
        </View>

        <View style={styles.contentWrapper}>
          <Text
            style={styles.type}
            numberOfLines={1}
          >
            {typeLabel}
          </Text>
          <Text
            style={styles.productName}
            numberOfLines={1}
          >
            {productName}
          </Text>
          {productModel && (
            <Text
              style={styles.productModel}
              numberOfLines={1}
            >
              {productModel}
            </Text>
          )}

          {/* רמקולים - הצג אפשרויות חיווט וכמות */}
          {node.type === 'speaker_group' && onUpdate && (
            <View style={styles.speakerOptions}>
              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>
                  {S.topology.wiringLabel}
                </Text>
                <TouchableOpacity
                  onPress={() =>
                    onUpdate(node.id, {
                      wiring: node.wiring === 'series' ? 'parallel' : 'series',
                    })
                  }
                  style={styles.optionButton}
                >
                  <Text style={styles.optionValue}>
                    {node.wiring === 'series'
                      ? S.topology.wiringSeries
                      : S.topology.wiringParallel}
                  </Text>
                </TouchableOpacity>
              </View>

              <View style={styles.optionRow}>
                <Text style={styles.optionLabel}>
                  {S.topology.quantityLabel}
                </Text>
                <View style={styles.quantityControls}>
                  <IconButton
                    icon="minus"
                    size={16}
                    onPress={() => {
                      const qty = (node.quantity || 1) - 1;
                      if (qty > 0) {
                        onUpdate(node.id, { quantity: qty });
                      }
                    }}
                    accessibilityLabel={S.a11y.quantityDecrement}
                  />
                  <Text style={styles.quantityValue}>
                    {node.quantity || 1}
                  </Text>
                  <IconButton
                    icon="plus"
                    size={16}
                    onPress={() => {
                      onUpdate(node.id, { quantity: (node.quantity || 1) + 1 });
                    }}
                    accessibilityLabel={S.a11y.quantityIncrement}
                  />
                </View>
              </View>
            </View>
          )}
        </View>

        <IconButton
          icon="trash-can-outline"
          size={20}
          onPress={() => onRemove(node.id)}
          accessibilityLabel={S.a11y.removeNodeButton}
          iconColor={iPracticomColors.error}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: iPracticomSpacing.md,
    paddingVertical: iPracticomSpacing.sm,
  },
  nodeCard: {
    flexDirection: 'row-reverse',
    alignItems: 'flex-start',
    backgroundColor: iPracticomColors.white,
    borderRadius: iPracticomRadius.card,
    paddingHorizontal: iPracticomSpacing.md,
    paddingVertical: iPracticomSpacing.md,
    elevation: 2,
  },
  iconWrapper: {
    width: 48,
    height: 48,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: iPracticomColors.lightBG,
    borderRadius: 12,
    marginLeft: iPracticomSpacing.md,
  },
  contentWrapper: {
    flex: 1,
    marginRight: iPracticomSpacing.md,
  },
  type: {
    fontSize: 12,
    color: iPracticomColors.midGray,
    fontWeight: '500',
    textAlign: 'right',
  },
  productName: {
    fontSize: 15,
    fontWeight: '600',
    color: iPracticomColors.darkNavy,
    marginTop: 2,
    textAlign: 'right',
  },
  productModel: {
    fontSize: 12,
    color: iPracticomColors.midGray,
    marginTop: 2,
    textAlign: 'right',
  },
  speakerOptions: {
    marginTop: iPracticomSpacing.md,
    paddingTop: iPracticomSpacing.md,
    borderTopWidth: 1,
    borderTopColor: iPracticomColors.lightBG,
  },
  optionRow: {
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 4,
  },
  optionLabel: {
    fontSize: 12,
    color: iPracticomColors.darkNavy,
    fontWeight: '500',
    textAlign: 'right',
  },
  optionButton: {
    paddingHorizontal: iPracticomSpacing.sm,
    paddingVertical: 4,
    backgroundColor: iPracticomColors.lightBG,
    borderRadius: 6,
  },
  optionValue: {
    fontSize: 12,
    color: iPracticomColors.electricBlue,
    fontWeight: '600',
    textAlign: 'right',
  },
  quantityControls: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
  },
  quantityValue: {
    fontSize: 12,
    color: iPracticomColors.darkNavy,
    fontWeight: '600',
    minWidth: 20,
    textAlign: 'center',
  },
});
