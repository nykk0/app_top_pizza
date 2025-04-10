import React from 'react';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { SalesProvider } from './SalesContext';

import Dashboard from './dashboard';
import Vendas from './vendas';
import Estoque from './estoque';
import { InventoryProvider } from './InventoryContext';
import CadastroItens from './CadastroItens';
import CadastroItensEstoque from './CadastroItensEstoque';

import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const Drawer = createDrawerNavigator();

export default function Home() {
  return (
    <SalesProvider>
      <InventoryProvider>
      <Drawer.Navigator
        initialRouteName="Dashboard"
        screenOptions={{
          headerStyle: { backgroundColor: '#8B0000' },
          headerTintColor: '#fff',
          drawerActiveTintColor: '#8B0000',
          drawerInactiveTintColor: '#333',
          drawerLabelStyle: { fontSize: 16 },
        }}
      >
        <Drawer.Screen
          name="Dashboard"
          component={Dashboard}
          options={{
            title: 'Início',
            drawerIcon: ({ color, size }) => (
              <Icon name="view-dashboard" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="Vendas"
          component={Vendas}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="pizza" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="CadastroItens"
          component={CadastroItens}
          options={{
            title: 'Cadastro de Itens',
            drawerIcon: ({ color, size }) => (
              <Icon name="food" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
          name="Estoque"
          component={Estoque}
          options={{
            drawerIcon: ({ color, size }) => (
              <Icon name="warehouse" color={color} size={size} />
            ),
          }}
        />
        <Drawer.Screen
  name="CadastroItensEstoque"
  component={CadastroItensEstoque}
  options={{
    title: 'Cadastro de Itens No Estoque',
    drawerIcon: ({ color, size }) => (
      <Icon name="food" color={color} size={size} />
    ),
  }}
/>

      </Drawer.Navigator>
      </InventoryProvider>
    </SalesProvider>
  );
}
