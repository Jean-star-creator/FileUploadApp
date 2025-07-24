// my-file-upload-app/viewmodels/AuthViewModel.js

/**
 * ViewModel de Autenticação (AuthViewModel.js)
 *
 * Este ViewModel gerencia a lógica de negócio para registro e login de usuários.
 * Ele interage diretamente com o Firebase Authentication.
 *
 * Ponto MVVM: Este ViewModel expõe métodos para registro e login,
 * que as Views (LoginScreen, RegisterScreen) irão chamar.
 *
 * Dependências:
 * - react: Para useState (para gerenciar erros ou estados internos do form).
 * - firebaseConfig: Para as funções de autenticação do Firebase.
 *
 * Quem o chama: LoginScreen.js e RegisterScreen.js (as Views de autenticação).
 * Quem ele chama: Funções do Firebase Auth.
 */

import { useState } from 'react';
import { Alert } from 'react-native';
import {
    auth,
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword
} from '../firebaseConfig';

export const useAuthViewModel = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Função para registrar um novo usuário
  const register = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      Alert.alert("Sucesso", "Conta criada com sucesso! Faça login para continuar.");
      return true; // Retorna true para indicar sucesso no registro
    } catch (err) {
      console.error("Erro no registro:", err.code, err.message);
      let errorMessage = "Erro ao criar conta. Tente novamente.";
      if (err.code === 'auth/email-already-in-use') {
        errorMessage = "Este e-mail já está em uso.";
      } else if (err.code === 'auth/invalid-email') {
        errorMessage = "O e-mail fornecido é inválido.";
      } else if (err.code === 'auth/weak-password') {
        errorMessage = "A senha deve ter pelo menos 6 caracteres.";
      }
      setError(errorMessage);
      Alert.alert("Erro", errorMessage);
      return false; // Retorna false para indicar falha
    } finally {
      setLoading(false);
    }
  };

  // Função para fazer login
  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      Alert.alert("Sucesso", "Login realizado com sucesso!");
      return true; // Retorna true para indicar sucesso no login
    } catch (err) {
      console.error("Erro no login:", err.code, err.message);
      let errorMessage = "Erro ao fazer login. Verifique seu e-mail e senha.";
      if (err.code === 'auth/invalid-email' || err.code === 'auth/user-not-found' || err.code === 'auth/wrong-password') {
        errorMessage = "E-mail ou senha inválidos.";
      } else if (err.code === 'auth/too-many-requests') {
        errorMessage = "Muitas tentativas de login. Tente novamente mais tarde.";
      }
      setError(errorMessage);
      Alert.alert("Erro", errorMessage);
      return false; // Retorna false para indicar falha
    } finally {
      setLoading(false);
    }
  };

  // Ponto MVVM: O ViewModel retorna o estado de carregamento, erros e as funções para as Views.
  return {
    loading,
    error,
    register,
    login,
  };
}; 

