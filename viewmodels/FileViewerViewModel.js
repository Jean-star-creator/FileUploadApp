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
 * de armazenamento (Firebase).
 *
 * Dependências:
 * - react: Para o useState, useEffect (para carregar arquivos).
 * - react-native: Para Alert.
 * - ../firebaseConfig: Para importar as funções e a instância do Firebase Storage.
 *
 * Quem o chama: FileViewerScreen (a View).
 * Quem ele chama: Firebase Storage SDK (via firebaseConfig.js).
 * Necessita de pacote: 'firebase'
 */

import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import {
  storage, // Instância do Storage
  ref,     // Função para criar referências de arquivo
  uploadBytes, // Função para subir bytes
  getDownloadURL, // Função para obter URL de download
  listAll // Função para listar arquivos
} from '../firebaseConfig'; // Importa as configurações e funções do Firebase

export const useFileViewerViewModel = () => {
  const [files, setFiles] = useState([]); // Inicia a lista de arquivos vazia
  const [loading, setLoading] = useState(true); // Estado de carregamento

  // Função para carregar os arquivos do Firebase Storage
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
          // Tenta adivinhar o tipo com base na extensão
          const fileType = fileName.includes('.pdf') ? 'pdf' : 'image';

          return {
            id: itemRef.fullPath, // Usa o fullPath como ID único
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

  // Carrega os arquivos quando o componente é montado
  useEffect(() => {
    loadFilesFromFirebase();
  }, []); // Array de dependências vazio para rodar apenas uma vez na montagem

  // Lógica para adicionar um novo arquivo e fazer upload para o Firebase
  const addFile = async (localFileUri, fileType) => {
    try {
      // Ponto MVVM: O ViewModel coordena o upload, que é uma lógica de negócio.
      const response = await fetch(localFileUri); // Faz um fetch do URI local do arquivo
      const blob = await response.blob(); // Converte para Blob

      const fileName = `${
Date.now
()}_${Math.random().toString(36).substring(7)}.${fileType === 'image' ? 'jpg' : 'pdf'}`;
      const storageRef = ref(storage, `uploads/${fileName}`); // Cria uma referência no Storage

      await uploadBytes(storageRef, blob); // Faz o upload do Blob

      const downloadURL = await getDownloadURL(storageRef); // Obtém a URL de download

      const newFile = {
        id: storageRef.fullPath, // ID único do Firebase
        name: fileName,
        uri: downloadURL,
        type: fileType,
        uploaded: true, // Já foi para o Firebase!
      };

      setFiles(prevFiles => [...prevFiles, newFile]); // Adiciona à lista local
      Alert.alert('Sucesso', 'Arquivo enviado e adicionado à lista!');

    } catch (error) {
      console.error("Erro ao enviar arquivo para o Firebase:", error);
      Alert.alert('Erro', 'Não foi possível enviar o arquivo.');
    }
  };

  // Lógica para sincronizar todos os arquivos não enviados (agora, isso seria para arquivos *locais* que ainda não subiram)
  // Para esta versão, assumimos que 'addFile' já faz o upload direto.
  // A função `synchronizeAllFiles` agora pode ser usada para "revalidar" a lista se tivermos arquivos locais pendentes,
  // ou para forçar um re-upload de arquivos marcados como não enviados.
  // Por simplicidade, vamos refatorar para que ela simplesmente recarregue do Firebase
  // e, futuramente, você pode adicionar a lógica de "upload pendente".
  const synchronizeAllFiles = async () => {
    await loadFilesFromFirebase(); // Recarrega do Firebase para garantir a lista mais recente
    Alert.alert('Sincronização', 'Lista de arquivos atualizada do Firebase!');
  };


  return {
    files,
    loading, // Expor estado de carregamento para a View
    addFile,
    synchronizeAllFiles,
  };
}; 