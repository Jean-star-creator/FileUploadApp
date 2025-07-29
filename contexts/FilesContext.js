// my-file-upload-app/contexts/FilesContext.js

/**
 * Contexto de Gerenciamento de Arquivos (FilesContext.js)
 *
 * Este contexto React fornece o estado da lista de arquivos do usuário logado,
 * e as funções para interagir com esses arquivos no Firebase Storage (upload, delete, rename, list).
 * Ele centraliza a lógica de acesso a dados de arquivos, atuando como o "Model" global
 * para os ViewModels que precisam manipular arquivos.
 *
 * Ponto MVVM: Atua como uma camada de "Serviço" ou "Model/Repository" para os dados de arquivos.
 * O FileViewerViewModel agora consumirá este contexto.
 *
 * Dependências:
 * - react: Para createContext, useState, useEffect, useContext, useCallback. // 'useCallback' ADICIONADO AQUI
 * - react-native: Para Alert, ActivityIndicator, View, StyleSheet, Text.
 * - ../firebaseConfig: Para as funções e instância do Firebase Storage.
 * - ./AuthContext: Para obter o UID do usuário logado.
 *
 * Quem o chama: App.js (para o provedor) e FileViewerViewModel (para consumir as funções/dados).
 * Quem ele chama: Funções do Firebase Storage.
 */

import React, { createContext, useCallback, useContext, useEffect, useState } from 'react'; // <-- useCallback adicionado
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  storage,
  uploadBytes
} from '../firebaseConfig';
import { useAuth } from './AuthContext';

const FilesContext = createContext();

export const FilesProvider = ({ children }) => {
  const [files, setFiles] = useState([]);
  const [loadingFiles, setLoadingFiles] = useState(true);
  const { user } = useAuth();

  // Usamos useCallback para memorizar a função. Ela só será recriada se 'user' mudar.
  const loadFilesFromFirebase = useCallback(async () => {
    if (!user) {
      setFiles([]);
      setLoadingFiles(false);
      return;
    }

    setLoadingFiles(true);
    try {
      const listRef = ref(storage, `uploads/${user.uid}/`);
      const res = await listAll(listRef);

      const loadedFiles = await Promise.all(
        
res.items.map
(async (itemRef) => {
          const downloadURL = await getDownloadURL(itemRef);
          const fileName = 
itemRef.name
;
          const fileType = fileName.includes('.pdf') ? 'pdf' : 'image';

          return {
            id: itemRef.fullPath,
            name: fileName,
            uri: downloadURL,
            type: fileType,
            uploaded: true,
          };
        })
      );
      setFiles(loadedFiles);
    } catch (error) {
      console.error("Erro ao carregar arquivos do Firebase (FilesContext):", error);
      Alert.alert("Erro", "Não foi possível carregar os arquivos. Tente novamente.");
    } finally {
      setLoadingFiles(false);
    }
  }, [user]); // <-- 'user' é a dependência para esta função useCallback

  // Agora, o useEffect pode incluir loadFilesFromFirebase sem reclamações do linter,
  // pois ela é uma função memorizada e sua recriação é controlada.
  useEffect(() => {
    loadFilesFromFirebase();
  }, [user, loadFilesFromFirebase]); // <-- 'loadFilesFromFirebase' adicionado como dependência aqui

  const addFileToFirebase = async (localFileUri, fileType, customFileName = null) => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para enviar arquivos.');
      return false;
    }

    setLoadingFiles(true);
    try {
      const response = await fetch(localFileUri);
      const blob = await response.blob();

      let fileName = customFileName || `${
Date.now
()}_${Math.random().toString(36).substring(7)}`;
      if (!fileName.includes('.')) {
        fileName += `.${fileType === 'image' ? 'jpg' : 'pdf'}`;
      } else if (fileType === 'image' && !fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
          fileName += '.jpg';
      } else if (fileType === 'pdf' && !fileName.toLowerCase().endsWith('.pdf')) {
          fileName += '.pdf';
      }

      const storageRef = ref(storage, `uploads/${user.uid}/${fileName}`);

      await uploadBytes(storageRef, blob);
      const downloadURL = await getDownloadURL(storageRef);

      const newFile = {
        id: storageRef.fullPath,
        name: fileName,
        uri: downloadURL,
        type: fileType,
        uploaded: true,
      };

      setFiles(prevFiles => [...prevFiles, newFile]);
      Alert.alert('Sucesso', 'Arquivo enviado e adicionado à lista!');
      return true;

    } catch (error) {
      console.error("Erro ao enviar arquivo para o Firebase (FilesContext):", error);
      Alert.alert('Erro', 'Não foi possível enviar o arquivo. Tente novamente.');
      return false;
    } finally {
      setLoadingFiles(false);
    }
  };

  const deleteFileFromFirebase = async (fileId) => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para deletar arquivos.');
      return false;
    }
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este arquivo? Esta ação é irreversível.",
      [
        {
          text: "Cancelar",
          style: "cancel",
          onPress: () => false,
        },
        {
          text: "Excluir",
          onPress: async () => {
            setLoadingFiles(true);
            try {
              const fileRef = ref(storage, fileId);
              await deleteObject(fileRef);

              setFiles(prevFiles => prevFiles.filter(file => 
file.id
 !== fileId));
              Alert.alert("Sucesso", "Arquivo excluído com sucesso!");
              return true;
            } catch (error) {
              console.error("Erro ao deletar arquivo (FilesContext):", error);
              Alert.alert("Erro", "Não foi possível excluir o arquivo.");
              return false;
            } finally {
              setLoadingFiles(false);
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const renameFileInFirebase = async (fileId, newName) => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para renomear arquivos.');
      return false;
    }
    if (!newName || newName.trim() === '') {
      Alert.alert('Erro', 'O novo nome não pode ser vazio.');
      return false;
    }

    setLoadingFiles(true);
    try {
      const oldFileRef = ref(storage, fileId);
      const oldDownloadURL = await getDownloadURL(oldFileRef);

      const oldFile = files.find(f => 
f.id
 === fileId);
      const fileType = oldFile ? oldFile.type : (newName.includes('.pdf') ? 'pdf' : 'image');

      let finalNewName = newName;
      if (!finalNewName.includes('.')) {
        finalNewName += `.${fileType === 'image' ? 'jpg' : 'pdf'}`;
      } else if (fileType === 'image' && !finalNewName.match(/\.(jpg|jpeg|png|gif)$/i)) {
          finalNewName += '.jpg';
      } else if (fileType === 'pdf' && !finalNewName.toLowerCase().endsWith('.pdf')) {
          finalNewName += '.pdf';
      }

      const newFileRef = ref(storage, `uploads/${user.uid}/${finalNewName}`);

      const response = await fetch(oldDownloadURL);
      const blob = await response.blob();

      await uploadBytes(newFileRef, blob);
      const newDownloadURL = await getDownloadURL(newFileRef);

      await deleteObject(oldFileRef);

      setFiles(prevFiles => {
        const updatedFiles = prevFiles.filter(file => 
file.id
 !== fileId);
        const newFile = {
            id: newFileRef.fullPath,
            name: finalNewName,
            uri: newDownloadURL,
            type: fileType,
            uploaded: true,
        };
        return [...updatedFiles, newFile];
      });

      Alert.alert("Sucesso", "Arquivo renomeado com sucesso!");
      return true;

    } catch (error) {
      console.error("Erro ao renomear arquivo (FilesContext):", error);
      Alert.alert("Erro", "Não foi possível renomear o arquivo.");
      return false;
    } finally {
      setLoadingFiles(false);
    }
  };

  return (
    <FilesContext.Provider value={{
      files,
      loadingFiles,
      loadFilesFromFirebase,
      addFileToFirebase,
      deleteFileFromFirebase,
      renameFileInFirebase,
    }}>
      {loadingFiles && user && files.length === 0 ? (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Carregando seus arquivos...</Text>
        </View>
      ) : (
        children
      )}
    </FilesContext.Provider>
  );
};

export const useFiles = () => {
  return useContext(FilesContext);
};

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
}); 