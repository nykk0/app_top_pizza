import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TextInput,
  Button,
  StyleSheet,
  Alert,
  TouchableOpacity,
} from 'react-native';
import { useInventory } from './InventoryContext';

export default function Estoque() {
  const { estoque, registrarEntrada, registrarSaida } = useInventory();
  const [quantidade, setQuantidade] = useState('');
  const [motivo, setMotivo] = useState('');
  const [tipo, setTipo] = useState('entrada');
  const [itemSelecionado, setItemSelecionado] = useState(null);
  const [filtro, setFiltro] = useState('');

  const handleMovimentacao = () => {
    if (!quantidade || !motivo || !itemSelecionado) {
      return Alert.alert('Erro', 'Preencha todos os campos.');
    }

    const qtd = parseInt(quantidade);

    if (tipo === 'saida' && qtd > itemSelecionado.quantidade) {
      return Alert.alert('Erro', 'Quantidade maior que o disponível no estoque.');
    }

    if (tipo === 'entrada') {
      registrarEntrada(itemSelecionado.id, qtd, motivo);
    } else {
      registrarSaida(itemSelecionado.id, qtd, motivo);
    }

    setQuantidade('');
    setMotivo('');
    setItemSelecionado(null);
  };

  const itensFiltrados = estoque.filter((item) =>
    item.nome.toLowerCase().includes(filtro.toLowerCase())
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Controle de Estoque</Text>

      {/* 🔍 Caixa de pesquisa */}
      <TextInput
        style={styles.input}
        placeholder="Pesquisar item..."
        value={filtro}
        onChangeText={setFiltro}
      />

      <FlatList
        data={itensFiltrados}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setItemSelecionado(item)} style={styles.card}>
            <Text style={styles.nome}>{item.nome}</Text>
            <Text>Quantidade: {item.quantidade}</Text>
            <Text>Preço: R$ {item.preco.toFixed(2)}</Text>
            {item.quantidade <= 5 && <Text style={styles.alerta}>⚠️ Estoque Baixo</Text>}
          </TouchableOpacity>
        )}
      />

      {itemSelecionado && (
        <View style={styles.form}>
          <Text style={styles.subtitulo}>Movimentar: {itemSelecionado.nome}</Text>

          <View style={styles.tipoContainer}>
            <Button
              title="Entrada"
              color={tipo === 'entrada' ? 'green' : '#ccc'}
              onPress={() => setTipo('entrada')}
            />
            <Button
              title="Saída"
              color={tipo === 'saida' ? 'red' : '#ccc'}
              onPress={() => setTipo('saida')}
            />
          </View>

          <TextInput
            style={styles.input}
            placeholder="Quantidade"
            keyboardType="numeric"
            value={quantidade}
            onChangeText={setQuantidade}
          />
          <TextInput
            style={styles.input}
            placeholder="Motivo"
            value={motivo}
            onChangeText={setMotivo}
          />
          <Button title="Confirmar" onPress={handleMovimentacao} />
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  card: {
    padding: 10,
    borderWidth: 1,
    borderRadius: 8,
    marginBottom: 10,
    backgroundColor: '#f9f9f9',
    borderColor: '#ddd',
  },
  nome: { fontSize: 18, fontWeight: '600' },
  alerta: { color: 'red', marginTop: 5 },
  form: {
    marginTop: 20,
    borderTopWidth: 1,
    borderColor: '#ddd',
    paddingTop: 10,
  },
  subtitulo: { fontSize: 18, marginBottom: 8 },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 8,
    borderRadius: 6,
    marginBottom: 10,
  },
  tipoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
});
