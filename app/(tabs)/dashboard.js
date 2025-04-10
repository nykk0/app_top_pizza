import React, { useContext, useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  TextInput,
  ScrollView,
  Pressable,
} from 'react-native';
import { SalesContext } from './SalesContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import DateTimePicker from '@react-native-community/datetimepicker';

const hoje = new Date();

export default function Dashboard() {
  const { totalVendas, totalItensVendidos, totalEstoque, sales } = useContext(SalesContext);
  const [dataFiltro, setDataFiltro] = useState(hoje.toISOString().split('T')[0]); // Data no formato "YYYY-MM-DD"
  const [showPicker, setShowPicker] = useState(false);
  const [vendasFiltradas, setVendasFiltradas] = useState([]);

  useEffect(() => {
    const filtradas = sales.filter((venda) => venda.data === dataFiltro); // Filtra vendas pela data
    setVendasFiltradas(filtradas);
  }, [dataFiltro, sales]);

  const handleChange = (event, selectedDate) => {
    setShowPicker(Platform.OS === 'ios'); // No iOS, deixa o picker visível
    if (selectedDate) {
      setDataFiltro(selectedDate.toISOString().split('T')[0]); // Atualiza a data no formato "YYYY-MM-DD"
    }
  };

  const handleManualDateChange = (text) => {
    setDataFiltro(text); // Atualiza a data com o valor inserido pelo usuário
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>📊 Painel de Controle</Text>

      <View style={styles.cardContainer}>
        <View style={[styles.card, styles.cardPrimary]}>
          <Icon name="cash-register" size={36} color="#fff" />
          <Text style={styles.cardTitle}>Total de Vendas</Text>
          <Text style={styles.cardValue}>R$ {totalVendas.toFixed(2)}</Text>
        </View>

        <View style={[styles.card, styles.cardSuccess]}>
          <Icon name="pizza" size={36} color="#fff" />
          <Text style={styles.cardTitle}>Itens Vendidos</Text>
          <Text style={styles.cardValue}>{totalItensVendidos}</Text>
        </View>

        <View style={[styles.card, styles.cardWarning]}>
          <Icon name="warehouse" size={36} color="#fff" />
          <Text style={styles.cardTitle}>Estoque Atual</Text>
          <Text style={styles.cardValue}>{totalEstoque}</Text>
        </View>
      </View>

      <Text style={styles.subHeader}>Vendas do dia</Text>

      {/* Campo de Data com TextInput editável */}
      <TextInput
        style={styles.input}
        value={dataFiltro} // Exibe a data no formato simples "YYYY-MM-DD"
        onFocus={() => setShowPicker(true)} // Ao focar no campo, mostrar o picker
        onChangeText={handleManualDateChange} // Permite ao usuário editar manualmente a data
        placeholder="Digite a data (YYYY-MM-DD)"
      />

      {/* DateTimePicker */}
      {showPicker && (
        <DateTimePicker
          value={new Date(dataFiltro)}
          mode="date"
          display="default"
          onChange={handleChange}
        />
      )}

      {/* Exibição das vendas filtradas */}
      {vendasFiltradas.length > 0 ? (
        vendasFiltradas
          .slice()
          .reverse()
          .map((item) => (
            <View key={item.id} style={styles.saleItem}>
              <View style={styles.saleRow}>
                <Text style={styles.saleCliente}>{item.cliente}</Text>
                <Text style={styles.saleValor}>R$ {item.valor.toFixed(2)}</Text>
              </View>
              <Text style={styles.saleDescricao}>{item.descricao}</Text>
              <Text style={{ color: '#aaa', fontSize: 12 }}>
                Data: {item.data}
              </Text>
            </View>
          ))
      ) : (
        <Text style={styles.semVendas}>Nenhuma venda registrada nessa data.</Text>
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F8F8',
    paddingHorizontal: 20,
    paddingTop: 40,
  },
  header: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    color: '#333',
    textAlign: 'center',
  },
  cardContainer: {
    gap: 20,
    marginBottom: 30,
  },
  card: {
    padding: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    alignItems: 'center',
  },
  cardTitle: {
    color: '#fff',
    fontSize: 18,
    marginTop: 10,
  },
  cardValue: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginTop: 5,
  },
  cardPrimary: {
    backgroundColor: '#8B0000',
  },
  cardSuccess: {
    backgroundColor: '#2E8B57',
  },
  cardWarning: {
    backgroundColor: '#FFA500',
  },
  subHeader: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 10,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  saleItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    elevation: 2,
  },
  saleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  saleCliente: {
    fontWeight: 'bold',
    fontSize: 16,
    color: '#333',
  },
  saleValor: {
    fontSize: 16,
    color: '#8B0000',
  },
  saleDescricao: {
    color: '#666',
    fontSize: 14,
  },
  semVendas: {
    textAlign: 'center',
    color: '#999',
    marginTop: 20,
    fontSize: 16,
  },
});
