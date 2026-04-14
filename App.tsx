import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { PaperProvider } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import { setupRTL } from './src/utils/rtl';
import { iPracticomMD3Theme, iPracticomColors } from './src/theme';
import { S } from './src/strings';

import CalculatorScreen from './src/screens/Calculator';
import TopologyScreen   from './src/screens/Topology';
import { CatalogNavigator } from './src/navigation/CatalogNavigator';

import { UpdateModal }     from './src/components/UpdateModal';
import { UpdateSnackbars } from './src/components/UpdateSnackbars';

setupRTL();

const Tab = createBottomTabNavigator();

export default function App() {
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
          <Tab.Screen name="Catalog"    component={CatalogNavigator} options={{ title: S.nav.catalog }} />
        </Tab.Navigator>
      </NavigationContainer>

      {/* קומפוננטות עדכון גלובליות — מוצגות מעל כל מסך */}
      <UpdateModal />
      <UpdateSnackbars />
    </PaperProvider>
  );
}
