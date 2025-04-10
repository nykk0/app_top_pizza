import React, { useState } from 'react';
import { View, Text, TextInput, Button, FlatList, StyleSheet, Alert } from 'react-native';
import { useSales } from './SalesContext';

export default function CadastroItens() {
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');
  const { cadastrarSabor, sabores } = useSales();

  const handleSalvar = () => {
    if (!nome || !preco) return Alert.alert('Erro', 'Preencha todos os campos');

    cadastrarSabor(nome, parseFloat(preco));
    setNome('');
    setPreco('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Sabores</Text>

      <TextInput
        style={styles.input}
        placeholder="Sabor da Pizza"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço (R$)"
        keyboardType="numeric"
        value={preco}
        onChangeText={setPreco}
      />

      <Button title="Cadastrar Sabor" onPress={handleSalvar} />

      <FlatList
        data={sabores}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Text style={styles.item}>
            🍕 {item.nome} - R$ {item.preco.toFixed(2)}
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    flex: 1,
  },
  title: {
    fontSize: 20,
    marginBottom: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    padding: 10,
    borderRadius: 6,
    marginBottom: 10,
    borderColor: '#ccc',
  },
  item: {
    padding: 10,
    fontSize: 16,
  },
});
