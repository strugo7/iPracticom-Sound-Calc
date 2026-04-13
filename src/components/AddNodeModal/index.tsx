import React, { useState, useMemo } from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  Modal,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Text, Button, Snackbar, TextInput, Divider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { iPracticomColors, iPracticomSpacing, iPracticomRadius } from '../../theme';
import { useCatalogStore } from '../../store/catalogStore';
import { useTopologyStore } from '../../store/topologyStore';
import { NodeType, ChainNode, Player, Mixer, Matrix, Amplifier, Speaker } from '../../types/catalog';
import { S } from '../../strings';

// מודל להוספת צומת חדיד לשרשרת
// שלב 1: בחירת סוג צומת
// שלב 2: בחירת מוצר מהקטלוג
// עם בדיקת סדר שרשרת (source → mixer/matrix → amp → speakers)

interface AddNodeModalProps {
  visible: boolean;
  onClose: () => void;
}

type ProductType = Player | Mixer | Matrix | Amplifier | Speaker;

export function AddNodeModal({ visible, onClose }: AddNodeModalProps) {
  const { catalog } = useCatalogStore();
  const { chain, addNode } = useTopologyStore();

  const [step, setStep] = useState<'type' | 'product'>('type');
  const [selectedType, setSelectedType] = useState<NodeType | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [snackMessage, setSnackMessage] = useState('');
  const [snackVisible, setSnackVisible] = useState(false);

  // סוגי צמתים הזמינים
  const nodeTypes: NodeType[] = ['source', 'mixer', 'matrix', 'amplifier', 'speaker_group'];

  // קבל מוצרים לסוג נבחר
  const getProductsForType = (type: NodeType): ProductType[] => {
    switch (type) {
      case 'source':
        return catalog.players;
      case 'mixer':
        return catalog.mixers;
      case 'matrix':
        return catalog.matrices;
      case 'amplifier':
        return catalog.amplifiers;
      case 'speaker_group':
        return catalog.speakers;
    }
  };

  // סנן מוצרים לפי חיפוש
  const products = useMemo(() => {
    if (!selectedType) return [];
    const allProducts = getProductsForType(selectedType);
    if (!searchQuery.trim()) return allProducts;

    const lowerQuery = searchQuery.toLowerCase();
    return allProducts.filter(
      (p) =>
        p.name.toLowerCase().includes(lowerQuery) ||
        p.model.toLowerCase().includes(lowerQuery) ||
        p.manufacturer?.toLowerCase().includes(lowerQuery)
    );
  }, [selectedType, searchQuery]);

  // בדוק אם ניתן להוסיף סוג צומת זה בשלב זה של השרשרת
  const canAddNodeType = (type: NodeType): boolean => {
    // אם השרשרת ריקה, רק source מותר
    if (chain.length === 0) {
      return type === 'source';
    }

    const lastNode = chain[chain.length - 1];
    const hasSource = chain.some(n => n.type === 'source');
    const hasAmplifier = chain.some(n => n.type === 'amplifier');
    const hasSpeakerGroup = chain.some(n => n.type === 'speaker_group');

    // יכול להוסיף רק אחד מכל סוג (למעט mixer/matrix)
    if (type === 'amplifier' && hasAmplifier) {
      return false; // רק מגבר אחד
    }
    if (type === 'source' && hasSource) {
      return false; // רק source אחד
    }
    if (type === 'speaker_group' && hasSpeakerGroup) {
      return false; // רק speaker_group אחד
    }

    // סדר חייב להיות: source → [mixer/matrix] → amplifier → speaker_group
    // (mixer/matrix חייבים להתבוא אחרי source, אמפ חייב להתבוא אחרי source/mixer/matrix)

    // אם אחרון הוא source, יכול להוסיף mixer/matrix/amplifier
    if (lastNode.type === 'source') {
      return ['mixer', 'matrix', 'amplifier'].includes(type);
    }

    // אם אחרון הוא mixer או matrix
    if (['mixer', 'matrix'].includes(lastNode.type)) {
      // יכול להוסיף עוד mixer/matrix או amplifier
      return ['mixer', 'matrix', 'amplifier'].includes(type);
    }

    // אם אחרון הוא amplifier, רק speaker_group
    if (lastNode.type === 'amplifier') {
      return type === 'speaker_group';
    }

    return false;
  };

  const handleSelectType = (type: NodeType) => {
    if (!canAddNodeType(type)) {
      setSnackMessage(S.topology.snackInvalidOrder);
      setSnackVisible(true);
      return;
    }
    setSelectedType(type);
    setStep('product');
    setSearchQuery('');
  };

  const handleSelectProduct = (product: ProductType) => {
    const newNode: ChainNode = {
      id: `${selectedType}-${Date.now()}`,
      type: selectedType!,
      productId: product.id,
      // ברירת מחדל לרמקולים
      ...(selectedType === 'speaker_group' && {
        wiring: 'series',
        quantity: 1,
      }),
    };

    addNode(newNode);
    setSnackMessage(S.topology.snackSaved);
    setSnackVisible(true);

    // סגור את המודל
    onClose();
    setStep('type');
    setSelectedType(null);
    setSearchQuery('');
  };

  const handleBack = () => {
    if (step === 'product') {
      setStep('type');
      setSelectedType(null);
      setSearchQuery('');
    } else {
      onClose();
    }
  };

  const getTypeIcon = (type: NodeType) => {
    switch (type) {
      case 'source': return 'music';
      case 'mixer': return 'mixer';
      case 'matrix': return 'matrix';
      case 'amplifier': return 'amplifier';
      case 'speaker_group': return 'speaker';
    }
  };

  const getTypeLabel = (type: NodeType) => {
    switch (type) {
      case 'source': return S.topology.nodeTypes.source;
      case 'mixer': return S.topology.nodeTypes.mixer;
      case 'matrix': return S.topology.nodeTypes.matrix;
      case 'amplifier': return S.topology.nodeTypes.amplifier;
      case 'speaker_group': return S.topology.nodeTypes.speakerGroup;
    }
  };

  return (
    <>
      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <TouchableOpacity onPress={handleBack} style={styles.backButton}>
                <MaterialCommunityIcons
                  name="arrow-left"
                  size={24}
                  color={iPracticomColors.electricBlue}
                />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {S.addNodeModal.title}
              </Text>
              <View style={styles.backButton} />
            </View>

            {step === 'type' && (
              <>
                <Text style={styles.stepLabel}>
                  {S.addNodeModal.selectType}
                </Text>
                <FlatList
                  data={nodeTypes}
                  keyExtractor={(item) => item}
                  scrollEnabled={false}
                  renderItem={({ item: type }) => {
                    const canAdd = canAddNodeType(type);
                    return (
                      <TouchableOpacity
                        onPress={() => handleSelectType(type)}
                        disabled={!canAdd}
                        style={[
                          styles.typeButton,
                          !canAdd && styles.typeButtonDisabled,
                        ]}
                      >
                        <MaterialCommunityIcons
                          name={getTypeIcon(type)}
                          size={28}
                          color={
                            canAdd
                              ? iPracticomColors.electricBlue
                              : iPracticomColors.midGray
                          }
                        />
                        <Text
                          style={[
                            styles.typeLabel,
                            !canAdd && styles.typeLabelDisabled,
                          ]}
                        >
                          {getTypeLabel(type)}
                        </Text>
                      </TouchableOpacity>
                    );
                  }}
                />
              </>
            )}

            {step === 'product' && selectedType && (
              <>
                <Text style={styles.stepLabel}>
                  {S.addNodeModal.selectProduct}
                </Text>

                <TextInput
                  placeholder={S.addNodeModal.searchPlaceholder}
                  placeholderTextColor={iPracticomColors.midGray}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                  style={styles.searchInput}
                  textAlign="right"
                />

                {products.length === 0 ? (
                  <View style={styles.emptyState}>
                    <Text style={styles.emptyText}>
                      {S.addNodeModal.noResults}
                    </Text>
                  </View>
                ) : (
                  <FlatList
                    data={products}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item: product }) => (
                      <TouchableOpacity
                        onPress={() => handleSelectProduct(product)}
                        style={styles.productButton}
                      >
                        <View style={styles.productInfo}>
                          <Text style={styles.productName}>
                            {product.name}
                          </Text>
                          <Text style={styles.productModel}>
                            {product.model}
                          </Text>
                          {product.manufacturer && (
                            <Text style={styles.productMfg}>
                              {product.manufacturer}
                            </Text>
                          )}
                        </View>
                        <MaterialCommunityIcons
                          name="chevron-left"
                          size={24}
                          color={iPracticomColors.electricBlue}
                        />
                      </TouchableOpacity>
                    )}
                  />
                )}
              </>
            )}
          </View>
        </View>
      </Modal>

      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={2000}
      >
        {snackMessage}
      </Snackbar>
    </>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: iPracticomColors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: iPracticomSpacing.xl,
  },
  header: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: iPracticomSpacing.md,
    paddingTop: iPracticomSpacing.lg,
    paddingBottom: iPracticomSpacing.md,
    borderBottomWidth: 1,
    borderBottomColor: iPracticomColors.lightBG,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: iPracticomColors.darkNavy,
    textAlign: 'right',
  },
  backButton: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  stepLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: iPracticomColors.darkNavy,
    paddingHorizontal: iPracticomSpacing.md,
    paddingTop: iPracticomSpacing.md,
    paddingBottom: iPracticomSpacing.sm,
    textAlign: 'right',
  },
  typeButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: iPracticomSpacing.md,
    paddingVertical: iPracticomSpacing.md,
    marginHorizontal: iPracticomSpacing.md,
    marginBottom: iPracticomSpacing.sm,
    backgroundColor: iPracticomColors.lightBG,
    borderRadius: iPracticomRadius.card,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  typeButtonDisabled: {
    opacity: 0.5,
  },
  typeLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: iPracticomColors.darkNavy,
    marginRight: iPracticomSpacing.md,
    flex: 1,
    textAlign: 'right',
  },
  typeLabelDisabled: {
    color: iPracticomColors.midGray,
  },
  searchInput: {
    marginHorizontal: iPracticomSpacing.md,
    marginVertical: iPracticomSpacing.md,
    backgroundColor: iPracticomColors.lightBG,
  },
  emptyState: {
    paddingVertical: iPracticomSpacing.xxl,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: iPracticomColors.midGray,
    textAlign: 'right',
  },
  productButton: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    paddingHorizontal: iPracticomSpacing.md,
    paddingVertical: iPracticomSpacing.md,
    marginHorizontal: iPracticomSpacing.md,
    marginBottom: iPracticomSpacing.sm,
    backgroundColor: iPracticomColors.lightBG,
    borderRadius: iPracticomRadius.card,
  },
  productInfo: {
    flex: 1,
    marginRight: iPracticomSpacing.md,
  },
  productName: {
    fontSize: 14,
    fontWeight: '600',
    color: iPracticomColors.darkNavy,
    textAlign: 'right',
  },
  productModel: {
    fontSize: 12,
    color: iPracticomColors.midGray,
    marginTop: 2,
    textAlign: 'right',
  },
  productMfg: {
    fontSize: 11,
    color: iPracticomColors.midGray,
    marginTop: 2,
    fontStyle: 'italic',
    textAlign: 'right',
  },
});
