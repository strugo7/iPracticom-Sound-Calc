import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CatalogScreen from '../screens/Catalog';
import ProductDetailScreen from '../screens/ProductDetail';
import { AnyProduct, CategoryKey } from '../store/catalogStore';

// ─── פרמטרים של ניווט Catalog Stack ───────────────────────────────────────

export type CatalogStackParamList = {
  CatalogList: undefined;
  ProductDetail: { product: AnyProduct; category: CategoryKey };
};

const Stack = createStackNavigator<CatalogStackParamList>();

export function CatalogNavigator() {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen
        name="CatalogList"
        component={CatalogScreen}
      />
      <Stack.Screen
        name="ProductDetail"
        component={ProductDetailScreen}
      />
    </Stack.Navigator>
  );
}
