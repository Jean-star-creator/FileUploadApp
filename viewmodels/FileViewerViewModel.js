// my-file-upload-app/viewmodels/FileViewerViewModel.js

/**
 * ViewModel da Tela de Visualização de Arquivos (FileViewerViewModel.js)
 *
 * Este ViewModel gerencia o estado e a lógica de negócio para a Tela de Visualização de Arquivos.
 * Ele abstrai a manipulação da lista de arquivos, o processo de adicionar novos arquivos,
 * e a lógica de sincronização (marcar como 'uploaded'), incluindo a interação com o Firebase Storage.
 *
 * Ponto MVVM: Este é o ViewModel central para a funcionalidade de arquivos.
 * Ele gerencia o estado `files` e as funções que o modificam, agora interage com o "Model"
 * de armazenamento (Firebase). A flag `uploaded` agora reflete o status no Firebase.
 *
 * Dependências:
 * - react: Para o useState, useEffect.
 * - react-native: Para Alert.
 * - ../firebaseConfig: Para importar as funções e a instância do Firebase Storage.
 *
 * Quem o chama: FileViewerScreen (a View).
 * Quem ele chama: Firebase Storage SDK (via firebaseConfig.js).
 * Necessita de pacote: 'firebase'
 */

import { useEffect, useState } from 'react';
import { Alert } from 'react-native';
import {
  getDownloadURL, // Função para obter URL de download
  listAll // Função para listar arquivos
  , // Instância do Storage
  ref,
  storage, // Função para criar referências de arquivo
  uploadBytes
} from '../firebaseConfig'; // Importa as configurações e funções do Firebase

export const useFileViewerViewModel = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  // Ponto MVVM: A lógica de carregar dados do "Model" (Firebase) está aqui.
  // Garante que o estado `files` no ViewModel esteja sempre atualizado com o que está na nuvem.
  const loadFilesFromFirebase = async () => {
    setLoading(true);
    try {
      const listRef = ref(storage, 'uploads/'); // Referência para a pasta 'uploads' no Storage
      const res = await listAll(listRef); // Lista todos os itens na pasta

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
            uploaded: true, // Se veio do Firebase, já está uploaded
          };
        })
      );
      setFiles(loadedFiles);
    } catch (error) {
      console.error("Erro ao carregar arquivos do Firebase:", error);
      Alert.alert("Erro", "Não foi possível carregar os arquivos do Firebase.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFilesFromFirebase();
  }, []);

  // Ponto MVVM: Lógica de negócio para adicionar e fazer o upload de um novo arquivo.
  const addFile = async (localFileUri, fileType) => {
    setLoading(true); // Pode ser bom mostrar um loader durante o upload também
    try {
      const response = await fetch(localFileUri);
      const blob = await response.blob();

      const fileName = `${
Date.now
()}_${Math.random().toString(36).substring(7)}.${fileType === 'image' ? 'jpg' : 'pdf'}`;
      const storageRef = ref(storage, `uploads/${fileName}`);

      await uploadBytes(storageRef, blob); // Faz o upload
      const downloadURL = await getDownloadURL(storageRef); // Obtém a URL

      const newFile = {
        id: storageRef.fullPath,
        name: fileName,
        uri: downloadURL,
        type: fileType,
        uploaded: true, // Automaticamente true, pois foi acabado de subir
      };

      // Ponto MVVM: Atualiza o estado `files` no ViewModel.
      setFiles(prevFiles => [...prevFiles, newFile]);
      Alert.alert('Sucesso', 'Arquivo enviado e adicionado à lista!');

    } catch (error) {
      console.error("Erro ao enviar arquivo para o Firebase:", error);
      Alert.alert('Erro', 'Não foi possível enviar o arquivo.');
    } finally {
      setLoading(false);
    }
  };

  // Ponto MVVM: Ação de sincronização agora significa recarregar a lista do Firebase.
  const synchronizeAllFiles = async () => {
    Alert.alert('Sincronizando', 'Buscando a lista mais recente de arquivos do Firebase...');
    await loadFilesFromFirebase(); // Chama a função que carrega do Firebase
    Alert.alert('Sincronização Concluída', 'Lista de arquivos atualizada!');
  };

  // Ponto MVVM: Retorna o estado e as funções para a View.
  return {
    files,
    loading,
    addFile,
    synchronizeAllFiles,
  };
}; 

