import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

const InventoryContext = createContext();

export function InventoryProvider({ children }) {
  const [estoque, setEstoque] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      const data = await AsyncStorage.getItem('estoque');
      if (data) setEstoque(JSON.parse(data));
    };
    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('estoque', JSON.stringify(estoque));
  }, [estoque]);

  const cadastrarItem = (nome, preco, quantidade = 0) => {
    const novoItem = {
      id: Date.now(),
      nome,
      preco: parseFloat(preco),
      quantidade,
      historico: [],
    };
    setEstoque((prev) => [...prev, novoItem]);
  };

  const registrarEntrada = (id, quantidade, motivo) => {
    setEstoque((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantidade: item.quantidade + quantidade,
              historico: [
                ...item.historico,
                {
                  tipo: 'entrada',
                  quantidade,
                  motivo,
                  data: new Date().toISOString().split('T')[0],
                },
              ],
            }
          : item
      )
    );
  };

  const registrarSaida = (id, quantidade, motivo) => {
    setEstoque((prev) =>
      prev.map((item) =>
        item.id === id
          ? {
              ...item,
              quantidade: item.quantidade - quantidade,
              historico: [
                ...item.historico,
                {
                  tipo: 'saida',
                  quantidade,
                  motivo,
                  data: new Date().toISOString().split('T')[0],
                },
              ],
            }
          : item
      )
    );
  };

  return (
    <InventoryContext.Provider
      value={{
        estoque,
        cadastrarItem,
        registrarEntrada,
        registrarSaida,
      }}
    >
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  return useContext(InventoryContext);
}
