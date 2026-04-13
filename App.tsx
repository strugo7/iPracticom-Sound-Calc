import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { setupRTL } from './src/utils/rtl';
import { checkForUpdate } from './src/utils/checkVersion';
import { iPracticomMD3Theme, iPracticomColors } from './src/theme';
import { S } from './src/strings';

import CalculatorScreen from './src/screens/Calculator';
import TopologyScreen   from './src/screens/Topology';
import CatalogScreen    from './src/screens/Catalog';
import UpdateDialog     from './src/components/UpdateDialog';

setupRTL();

const Tab = createBottomTabNavigator();

export default function App() {
  const [updateInfo, setUpdateInfo] = useState<{ version: string; url: string } | null>(null);

  // בדיקת גרסה בהפעלה — כשל נבלע בשקט (אין אינטרנט וכו׳)
  useEffect(() => {
    checkForUpdate().then((result) => {
      if (result?.hasUpdate) {
        setUpdateInfo({ version: result.version, url: result.url });
      }
    });
  }, []);

  return (
    <PaperProvider theme={iPracticomMD3Theme}>
      <NavigationContainer>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            headerShown: false,
            tabBarActiveTintColor:   iPracticomColors.electricBlue,
            tabBarInactiveTintColor: iPracticomColors.midGray,
            tabBarStyle: { backgroundColor: iPracticomColors.white },
            tabBarIcon: ({ color, size }) => {
              const icons: Record<string, string> = {
                Calculator: 'calculator-variant-outline',
                Topology:   'sitemap-outline',
                Catalog:    'view-list-outline',
              };
              return (
                <MaterialCommunityIcons
                  name={icons[route.name] ?? 'circle-outline'}
                  color={color}
                  size={size}
                />
              );
            },
          })}
        >
          <Tab.Screen name="Calculator" component={CalculatorScreen} options={{ title: S.nav.calculator }} />
          <Tab.Screen name="Topology"   component={TopologyScreen}   options={{ title: S.nav.topology }} />
          <Tab.Screen name="Catalog"    component={CatalogScreen}    options={{ title: S.nav.catalog }} />
        </Tab.Navigator>
      </NavigationContainer>

      {/* דיאלוג עדכון — מתרנדר מעל הכל דרך Portal של react-native-paper */}
      <UpdateDialog
        visible={!!updateInfo}
        version={updateInfo?.version ?? ''}
        url={updateInfo?.url ?? ''}
        onDismiss={() => setUpdateInfo(null)}
      />
    </PaperProvider>
  );
}
