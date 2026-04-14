import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { Text, Button, Appbar, Snackbar } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { S } from '../../strings';
import { iPracticomColors, iPracticomSpacing, iPracticomRadius } from '../../theme';
import { useTopologyStore } from '../../store/topologyStore';
import { TopologyNode } from '../../components/TopologyNode';
import { AddNodeModal } from '../../components/AddNodeModal';
import { ValidationPanel } from '../../components/ValidationPanel';
import { HeaderRefreshButton } from '../../components/Header';

export default function TopologyScreen() {
  const { chain, removeNode, updateNode } = useTopologyStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [snackMessage, setSnackMessage] = useState('');
  const [snackVisible, setSnackVisible] = useState(false);

  // ולידציה מתעדכנת אוטומטית ב-store על כל שינוי בשרשרת
  const validationResult = useTopologyStore((state) => state.validationResult);

  const handleRemoveNode = (nodeId: string) => {
    removeNode(nodeId);
  };

  const handleUpdateNode = (nodeId: string, updates: any) => {
    updateNode(nodeId, updates);
  };

  const handleClearChain = () => {
    if (chain.length > 0) {
      const { resetChain } = useTopologyStore.getState();
      resetChain();
      setSnackMessage(S.topology.snackSaved);
      setSnackVisible(true);
    }
  };

  const isEmpty = chain.length === 0;

  // בדיקה אם יש מספיק צמתים לולידציה (source + amp + speakers)
  const hasEnoughForValidation =
    chain.some(n => n.type === 'source') &&
    chain.some(n => n.type === 'amplifier') &&
    chain.some(n => n.type === 'speaker_group');

  return (
    <SafeAreaView style={styles.container}>
      {/* כותרת — כפתור עדכון בצד שמאל (RTL), שם מסך בצד ימין */}
      <Appbar.Header style={styles.appbar}>
        <HeaderRefreshButton />
        <Appbar.Content title={S.topology.screenTitle} titleStyle={styles.title} />
      </Appbar.Header>

      {isEmpty ? (
        /* מצב ריק */
        <View style={styles.emptyStateContainer}>
          <MaterialCommunityIcons
            name="link-off"
            size={64}
            color={iPracticomColors.midGray}
          />
          <Text style={styles.emptyStateText}>
            {S.topology.emptyState}
          </Text>
        </View>
      ) : (
        /* מצב עם שרשרת */
        <ScrollView
          style={styles.content}
          showsVerticalScrollIndicator={false}
        >
          {/* שרשרת אות */}
          <View style={styles.chainContainer}>
            {chain.map((node, index) => (
              <View key={node.id}>
                {/* צומת */}
                <TopologyNode
                  node={node}
                  onRemove={handleRemoveNode}
                  onUpdate={handleUpdateNode}
                />

                {/* חץ בין צמתים */}
                {index < chain.length - 1 && (
                  <View style={styles.arrowContainer}>
                    <MaterialCommunityIcons
                      name="arrow-down"
                      size={24}
                      color={iPracticomColors.skyBlue}
                    />
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* לוח ולידציה — מוצג רק כשיש תוצאה */}
          {validationResult && hasEnoughForValidation ? (
            <ValidationPanel result={validationResult} />
          ) : (
            chain.length > 0 && !hasEnoughForValidation && (
              <View style={styles.validationHint}>
                <MaterialCommunityIcons
                  name="information-outline"
                  size={18}
                  color={iPracticomColors.midGray}
                />
                <Text style={styles.hintText}>
                  {S.validation.notEnoughNodes}
                </Text>
              </View>
            )
          )}

          {/* רווח לקראת כפתורים */}
          <View style={styles.bottomSpacer} />
        </ScrollView>
      )}

      {/* כפתורים */}
      <View style={styles.buttonBar}>
        <Button
          mode="outlined"
          onPress={handleClearChain}
          disabled={isEmpty}
          style={styles.button}
          textColor={iPracticomColors.darkNavy}
        >
          {S.topology.clearButton}
        </Button>
        <Button
          mode="contained"
          onPress={() => setShowAddModal(true)}
          style={styles.button}
        >
          {S.topology.addNodeButton}
        </Button>
      </View>

      {/* מודל הוספת צומת */}
      <AddNodeModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
      />

      {/* Snackbar */}
      <Snackbar
        visible={snackVisible}
        onDismiss={() => setSnackVisible(false)}
        duration={2000}
      >
        {snackMessage}
      </Snackbar>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: iPracticomColors.lightBG,
  },
  appbar: {
    backgroundColor: iPracticomColors.white,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: iPracticomColors.darkNavy,
    textAlign: 'right',
    flex: 1,
  },
  emptyStateContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: iPracticomSpacing.lg,
  },
  emptyStateText: {
    fontSize: 16,
    color: iPracticomColors.midGray,
    textAlign: 'center',
    marginTop: iPracticomSpacing.md,
  },
  content: {
    flex: 1,
  },
  chainContainer: {
    paddingVertical: iPracticomSpacing.md,
  },
  arrowContainer: {
    alignItems: 'center',
    paddingVertical: iPracticomSpacing.sm,
  },
  validationHint: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'center',
    gap: iPracticomSpacing.sm,
    marginHorizontal: iPracticomSpacing.md,
    marginTop: iPracticomSpacing.lg,
    paddingVertical: iPracticomSpacing.md,
    paddingHorizontal: iPracticomSpacing.md,
    backgroundColor: iPracticomColors.white,
    borderRadius: iPracticomRadius.card,
    opacity: 0.7,
  },
  hintText: {
    fontSize: 13,
    color: iPracticomColors.midGray,
    textAlign: 'right',
  },
  bottomSpacer: {
    height: iPracticomSpacing.xxl,
  },
  buttonBar: {
    flexDirection: 'row-reverse',
    gap: iPracticomSpacing.md,
    paddingHorizontal: iPracticomSpacing.md,
    paddingVertical: iPracticomSpacing.md,
    backgroundColor: iPracticomColors.white,
    borderTopWidth: 1,
    borderTopColor: iPracticomColors.lightBG,
  },
  button: {
    flex: 1,
  },
});
