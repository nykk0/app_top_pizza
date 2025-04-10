import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const SalesContext = createContext();

export function SalesProvider({ children }) {
  const [sales, setSales] = useState([]);
  const [sabores, setSabores] = useState([]);
  const [totalVendas, setTotalVendas] = useState(0);
  const [totalItensVendidos, setTotalItensVendidos] = useState(0);
  const [totalEstoque, setTotalEstoque] = useState(104);

  const dataLoaded = useRef(false);

  useEffect(() => {
    const loadData = async () => {
      if (dataLoaded.current) return;

      const salesData = await AsyncStorage.getItem('sales');
      const saboresData = await AsyncStorage.getItem('sabores');

      if (salesData) setSales(JSON.parse(salesData));
      if (saboresData) setSabores(JSON.parse(saboresData));

      dataLoaded.current = true;
    };

    loadData();
  }, []);

  useEffect(() => {
    AsyncStorage.setItem('sales', JSON.stringify(sales));

    const total = sales.reduce((sum, item) => sum + item.valor, 0);
    const qtd = sales.reduce((sum, item) => {
      const matches = item.descricao.match(/\d+x/g);
      const totalQtd = matches ? matches.reduce((acc, m) => acc + parseInt(m), 0) : 0;
      return sum + totalQtd;
    }, 0);

    setTotalVendas(total);
    setTotalItensVendidos(qtd);
  }, [sales]);

  const registerSale = (cliente, descricao, valor) => {
    const newSale = {
      id: Date.now(),
      cliente,
      descricao,
      valor: parseFloat(valor),
      data: new Date().toISOString().split('T')[0], // salva a data no formato AAAA-MM-DD
    };
    setSales((prev) => [...prev, newSale]);
  };

  const cadastrarSabor = async (nome, preco) => {
    const novoSabor = {
      id: Date.now(),
      nome,
      preco,
    };

    const novosSabores = [...sabores, novoSabor];
    setSabores(novosSabores);
    await AsyncStorage.setItem('sabores', JSON.stringify(novosSabores));
  };

  return (
    <SalesContext.Provider
      value={{
        totalVendas,
        totalItensVendidos,
        totalEstoque,
        registerSale,
        cadastrarSabor,
        sabores,
        sales,
      }}
    >
      {children}
    </SalesContext.Provider>
  );
}

export function useSales() {
  return useContext(SalesContext);
}
