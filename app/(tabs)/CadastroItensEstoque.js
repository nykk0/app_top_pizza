import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useInventory } from './InventoryContext';

export default function CadastroItensEstoque() {
  const { cadastrarItem } = useInventory();
  const [nome, setNome] = useState('');
  const [preco, setPreco] = useState('');

  const handleCadastro = () => {
    if (!nome || !preco) {
      return Alert.alert('Erro', 'Nome e preço são obrigatórios.');
    }

    const precoNumerico = parseFloat(preco.replace(',', '.'));
    if (isNaN(precoNumerico) || precoNumerico < 0) {
      return Alert.alert('Erro', 'Preço inválido.');
    }

    cadastrarItem(nome, precoNumerico);
    setNome('');
    setPreco('');
    Alert.alert('Sucesso', 'Item cadastrado com sucesso!');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastrar Novo Item no Estoque</Text>

      <TextInput
        style={styles.input}
        placeholder="Nome do item"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Preço do item (R$)"
        value={preco}
        onChangeText={setPreco}
        keyboardType="decimal-pad"
      />

      <Button title="Cadastrar" onPress={handleCadastro} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 6,
    marginBottom: 15,
  },
});
