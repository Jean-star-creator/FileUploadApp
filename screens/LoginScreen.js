// my-file-upload-app/screens/LoginScreen.js

/**
 * Tela de Login (LoginScreen - View)
 *
 * Esta View é responsável pela interface do usuário de login.
 * Ela coleta as credenciais do usuário e chama o `AuthViewModel`
 * para processar a autenticação. Não contém lógica de negócio.
 *
 * Ponto MVVM: Esta é a View. Ela utiliza o `useAuthViewModel`
 * para realizar a operação de login e `useAuth` para verificar se já está logado.
 *
 * Dependências:
 * - react-native: Para View, Text, TextInput, Button, StyleSheet, ActivityIndicator.
 * - @react-navigation/native: Para navegação.
 * - ../viewmodels/AuthViewModel: Para a lógica de login.
 * - ../contexts/AuthContext: Para verificar o estado de autenticação.
 *
 * Quem o chama: App.js (através do Stack Navigator)
 * Quem ele chama: AuthViewModel.js.
 */

import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuthViewModel } from '../viewmodels/AuthViewModel';
import { useAuth } from '../contexts/AuthContext'; // Para verificar se já está logado

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  // Ponto MVVM: A View obtém a lógica de login do ViewModel.
  const { loading, error, login } = useAuthViewModel();
  // Ponto MVVM: A View observa o estado do usuário do AuthContext.
  const { user } = useAuth();

  // Redireciona se o usuário já estiver logado
  useEffect(() => {
    if (user) {
      navigation.replace('Home'); // Redireciona para a Home se já estiver logado
    }
  }, [user, navigation]); // Roda quando 'user' ou 'navigation' mudam

  const handleLogin = async () => {
    // Ponto MVVM: A View dispara a ação e o ViewModel lida com ela.
    const success = await login(email, password);
    if (success) {
      // O redirecionamento será tratado pelo useEffect de `user`
    }
  };

  const navigateToRegister = () => {
    navigation.navigate('Register');
  };

  // Se já estiver logado ou carregando o estado inicial, não mostra o formulário.
  if (user || loading) {
    return (
      <View style={styles.fullScreenLoader}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loadingText}>{user ? 'Redirecionando...' : 'Verificando sessão...'}</Text>
      </View>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Bem-vindo de volta!</Text>
      <TextInput
        style={styles.input}
        placeholder="E-mail"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        placeholder="Senha"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button
        title={loading ? "Entrando..." : "Entrar"}
        onPress={handleLogin}
        disabled={loading}
        color="#007bff"
      />
      <View style={styles.registerContainer}>
        <Text style={styles.registerText}>Não tem uma conta?</Text>
        <Button
          title="Cadastre-se"
          onPress={navigateToRegister}
          disabled={loading}
          color="#6c757d"
        />
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
    padding: 20,
  },
  fullScreenLoader: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f2f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#333',
  },
  input: {
    width: '100%',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 8,
    marginBottom: 15,
    fontSize: 16,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
    textAlign: 'center',
  },
  registerContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  registerText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
}); 

