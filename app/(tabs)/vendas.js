import { View, Text, TextInput, StyleSheet, Button, FlatList } from 'react-native';
import { useState } from 'react';
import { useSales } from './SalesContext';

export default function Vendas() {
  const { registerSale, sabores } = useSales();

  const [cliente, setCliente] = useState('');
  const [itensSelecionados, setItensSelecionados] = useState({});
  const [busca, setBusca] = useState('');

  const handleQuantidadeChange = (id, quantidade) => {
    const novaQtd = parseInt(quantidade) || 0;
    setItensSelecionados((prev) => ({ ...prev, [id]: novaQtd }));
  };

  const calcularTotal = () => {
    return sabores.reduce((total, item) => {
      const qtd = itensSelecionados[item.id] || 0;
      return total + item.preco * qtd;
    }, 0);
  };

  const gerarDescricao = () => {
    return sabores
      .filter((item) => (itensSelecionados[item.id] || 0) > 0)
      .map((item) => {
        const qtd = itensSelecionados[item.id];
        return `${qtd}x ${item.nome}`;
      })
      .join(', ');
  };

  const handleRegister = () => {
    const total = calcularTotal();
    const desc = gerarDescricao();

    if (!cliente || total === 0) {
      return alert('Preencha o nome do cliente e selecione ao menos 1 item');
    }

    registerSale(cliente, desc, total);
    setCliente('');
    setItensSelecionados({});
    setBusca('');
  };

  const saboresFiltrados = sabores.filter((item) =>
    item.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Registrar Venda</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do Cliente"
        value={cliente}
        onChangeText={setCliente}
      />

      <TextInput
        style={styles.input}
        placeholder="Buscar sabor..."
        value={busca}
        onChangeText={setBusca}
      />

      <FlatList
        data={saboresFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.itemRow}>
            <Text style={styles.itemText}>{item.nome} - R$ {item.preco.toFixed(2)}</Text>
            <TextInput
              style={styles.qtyInput}
              keyboardType="numeric"
              placeholder="Qtd"
              value={itensSelecionados[item.id]?.toString() || ''}
              onChangeText={(text) => handleQuantidadeChange(item.id, text)}
            />
          </View>
        )}
        ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 10 }}>Nenhum sabor encontrado.</Text>}
      />

      <Text style={styles.total}>Total: R$ {calcularTotal().toFixed(2)}</Text>

      <Button title="Registrar Venda" onPress={handleRegister} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    gap: 10,
  },
  title: {
    fontSize: 22,
    marginBottom: 10,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  itemText: {
    fontSize: 16,
    flex: 1,
  },
  qtyInput: {
    width: 60,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 6,
    padding: 6,
    textAlign: 'center',
    marginLeft: 10,
  },
  total: {
    fontSize: 18,
    textAlign: 'right',
    marginVertical: 12,
    fontWeight: 'bold',
  },
});
