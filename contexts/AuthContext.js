// my-file-upload-app/contexts/AuthContext.js

/**
 * Contexto de Autenticação (AuthContext.js)
 *
 * Este contexto React fornece o estado de autenticação do usuário (usuário logado, status de carregamento)
 * para toda a árvore de componentes. Ele utiliza o `onAuthStateChanged` do Firebase
 * para monitorar automaticamente o estado de autenticação.
 *
 * Ponto MVVM: Atua como uma camada de "serviço" ou "repositório" de autenticação,
 * que os ViewModels e Views podem consumir.
 *
 * Dependências:
 * - react: Para createContext, useState, useEffect.
 * - firebaseConfig: Para as funções e instância do Firebase Auth.
 *
 * Quem o chama: App.js (para o provedor) e outros componentes/viewmodels (para consumir).
 * Quem ele chama: Funções do Firebase Auth.
 */

import React, { createContext, useState, useEffect, useContext } from 'react';
import { auth, onAuthStateChanged, signOut } from '../firebaseConfig';
import { ActivityIndicator, View, StyleSheet } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Armazena o objeto do usuário logado
  const [loading, setLoading] = useState(true); // Indica se o estado de autenticação está sendo carregado

  useEffect(() => {
    // onAuthStateChanged: monitora o estado de autenticação do Firebase.
    // É executado quando o usuário faz login, logout ou quando o estado muda.
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser); // Define o usuário atual
      setLoading(false); // Marca o carregamento como concluído
    });

    // Retorna uma função de limpeza para desinscrever o listener quando o componente for desmontado.
    return () => unsubscribe();
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  // Função para fazer logout
  const logout = async () => {
    try {
      await signOut(auth);
      // setUser(null) é automaticamente tratado pelo onAuthStateChanged
    } catch (error) {
      console.error("Erro ao fazer logout:", error);
      alert("Erro ao fazer logout.");
    }
  };

  // Se ainda estiver carregando o estado de autenticação, exibe um loader
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  // O provedor disponibiliza o usuário e a função de logout para todos os componentes filhos.
  return (
    <AuthContext.Provider value={{ user, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para consumir o contexto de autenticação de forma mais limpa.
export const useAuth = () => {
  return useContext(AuthContext);
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
}); 