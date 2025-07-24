// my-file-upload-app/screens/RegisterScreen.js

/**
 * Tela de Registro (RegisterScreen - View)
 *
 * Esta View é responsável pela interface do usuário de registro.
 * Ela coleta as credenciais do novo usuário e chama o `AuthViewModel`
 * para processar a criação da conta. Não contém lógica de negócio.
 *
 * Ponto MVVM: Esta é a View. Ela utiliza o `useAuthViewModel`
 * para realizar a operação de registro.
 *
 * Dependências:
 * - react-native: Para View, Text, TextInput, Button, StyleSheet, ActivityIndicator.
 * - @react-navigation/native: Para navegação.
 * - ../viewmodels/AuthViewModel: Para a lógica de registro.
 *
 * Quem o chama: App.js (através do Stack Navigator) ou LoginScreen.js.
 * Quem ele chama: AuthViewModel.js.
 */

import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from 'react-native';
import { useAuthViewModel } from '../viewmodels/AuthViewModel';

export default function RegisterScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  // Ponto MVVM: A View obtém a lógica de registro do ViewModel.
  const { loading, error, register } = useAuthViewModel();

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }
    // Ponto MVVM: A View dispara a ação e o ViewModel lida com ela.
    const success = await register(email, password);
    if (success) {
      navigation.goBack(); // Volta para a tela de login após o registro
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <Text style={styles.title}>Crie sua conta</Text>
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
      <TextInput
        style={styles.input}
        placeholder="Confirmar Senha"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        secureTextEntry
      />
      {error && <Text style={styles.errorText}>{error}</Text>}
      <Button
        title={loading ? "Registrando..." : "Registrar"}
        onPress={handleRegister}
        disabled={loading}
        color="#007bff"
      />
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Já tem uma conta?</Text>
        <Button
          title="Fazer Login"
          onPress={() => navigation.goBack()}
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
  loginContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  loginText: {
    fontSize: 16,
    color: '#555',
    marginBottom: 10,
  },
}); 