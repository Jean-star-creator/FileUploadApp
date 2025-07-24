// my-file-upload-app/screens/Home.js

/**
 * Componente da Tela Home (HomeScreen - View)
 *
 * Esta tela serve como o ponto central de navegação do aplicativo.
 * Agora, inclui um botão de logout.
 *
 * Ponto MVVM: Esta é a View. Ela consome o HomeViewModel para navegação
 * e o `useAuth` do AuthContext para a funcionalidade de logout.
 *
 * Dependências:
 * - react-native: Para View, Text, StyleSheet, Button.
 * - ../viewmodels/HomeViewModel: Importa o ViewModel para gerenciar a lógica de navegação.
 * - ../contexts/AuthContext: Para a função de logout.
 *
 * Quem o chama: App.js (através do Stack Navigator).
 * Quem ele chama: useHomeViewModel (para obter a lógica), useAuth (para logout).
 */

import React from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity } from 'react-native';
import { useHomeViewModel } from '../viewmodels/HomeViewModel';
import { useAuth } from '../contexts/AuthContext'; // NOVO: Importa o hook de autenticação

export default function HomeScreen() {
  const { navigateToFiles } = useHomeViewModel();
  // Ponto MVVM: A View obtém a função de logout do AuthContext.
  const { logout } = useAuth(); // Obtém a função de logout

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao App de Arquivos!</Text>
      <Text style={styles.subtitle}>Gerencie suas imagens e PDFs com segurança.</Text>
      <Button
        title="Ver Meus Arquivos"
        onPress={navigateToFiles}
        color="#841584"
      />
      <TouchableOpacity style={styles.logoutButton} onPress={logout}>
        <Text style={styles.logoutButtonText}>Sair da Conta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
  logoutButton: {
    marginTop: 30,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#dc3545', // Cor vermelha para o logout
    borderRadius: 5,
  },
  logoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
}); 