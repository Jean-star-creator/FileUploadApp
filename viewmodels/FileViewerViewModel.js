// my-file-upload-app/viewmodels/FileViewerViewModel.js

/**
 * ViewModel da Tela de Visualização de Arquivos (FileViewerViewModel.js)
 *
 * Este ViewModel gerencia o estado e a lógica de negócio para a Tela de Visualização de Arquivos.
 * Ele abstrai a manipulação da lista de arquivos, o processo de adicionar novos arquivos,
 * e a lógica de sincronização (marcar como 'uploaded'), incluindo a interação com o Firebase Storage.
 * AGORA: Os arquivos são específicos do usuário logado.
 *
 * Ponto MVVM: Este é o ViewModel central para a funcionalidade de arquivos.
 * Ele gerencia o estado `files` e as funções que o modificam, interage com o "Model"
 * de armazenamento (Firebase) e agora depende do usuário logado do AuthContext.
 *
 * Dependências:
 * - react: Para o useState, useEffect.
 * - react-native: Para Alert.
 * - ../firebaseConfig: Para importar as funções e a instância do Firebase Storage.
 * - ../contexts/AuthContext: Para obter o usuário logado.
 *
 * Quem o chama: FileViewerScreen (a View).
 * Quem ele chama: Firebase Storage SDK (via firebaseConfig.js), useAuth.
 * Necessita de pacote: 'firebase'
 */

import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  deleteObject // Importa deleteObject
} from '../firebaseConfig';
import { useAuth } from '../contexts/AuthContext'; // NOVO: Importa o hook de autenticação

export const useFileViewerViewModel = () => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Ponto MVVM: Obtém o usuário logado do contexto

  // Função para carregar os arquivos do Firebase Storage
  const loadFilesFromFirebase = async () => {
    if (!user) { // Se não houver usuário logado, não tenta carregar arquivos
      setFiles([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      // Ponto MVVM: A pasta no Storage agora é específica do usuário (uid)
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
      console.error("Erro ao carregar arquivos do Firebase:", error);
      Alert.alert("Erro", "Não foi possível carregar os arquivos do Firebase.");
    } finally {
      setLoading(false);
    }
  };

  // Carrega os arquivos quando o componente é montado ou o usuário muda
  useEffect(() => {
    loadFilesFromFirebase();
  }, [user]); // Adiciona 'user' como dependência para recarregar quando o usuário loga/desloga

  // Lógica para adicionar um novo arquivo e fazer upload para o Firebase
  const addFile = async (localFileUri, fileType, customFileName = null) => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para enviar arquivos.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(localFileUri);
      const blob = await response.blob();

      // Ponto MVVM: O nome do arquivo pode ser customizado ou gerado automaticamente.
      // O caminho agora inclui o UID do usuário.
      let fileName = customFileName || `${
Date.now
()}_${Math.random().toString(36).substring(7)}`;
      // Garante que o nome tenha a extensão correta
      if (!fileName.includes('.')) {
        fileName += `.${fileType === 'image' ? 'jpg' : 'pdf'}`;
      } else if (fileType === 'image' && !fileName.match(/\.(jpg|jpeg|png|gif)$/i)) {
          fileName += '.jpg'; // Adiciona .jpg se for imagem e não tiver extensão válida
      } else if (fileType === 'pdf' && !fileName.toLowerCase().endsWith('.pdf')) {
          fileName += '.pdf'; // Adiciona .pdf se for PDF e não tiver extensão .pdf
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

    } catch (error) {
      console.error("Erro ao enviar arquivo para o Firebase:", error);
      Alert.alert('Erro', 'Não foi possível enviar o arquivo. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  // Lógica para sincronizar (recarregar) todos os arquivos do Firebase
  const synchronizeAllFiles = async () => {
    Alert.alert('Sincronizando', 'Buscando a lista mais recente de arquivos do Firebase...');
    await loadFilesFromFirebase();
    Alert.alert('Sincronização Concluída', 'Lista de arquivos atualizada!');
  };

  // Ponto MVVM: Lógica para deletar um arquivo.
  const deleteFile = async (fileId) => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para deletar arquivos.');
      return;
    }
    Alert.alert(
      "Confirmar Exclusão",
      "Tem certeza que deseja excluir este arquivo? Esta ação é irreversível.",
      [
        {
          text: "Cancelar",
          style: "cancel",
        },
        {
          text: "Excluir",
          onPress: async () => {
            setLoading(true);
            try {
              const fileRef = ref(storage, fileId); // fileId é o fullPath
              await deleteObject(fileRef); // Deleta do Firebase Storage

              // Ponto MVVM: Atualiza o estado do ViewModel após a exclusão.
              setFiles(prevFiles => prevFiles.filter(file => 
file.id
 !== fileId));
              Alert.alert("Sucesso", "Arquivo excluído com sucesso!");
            } catch (error) {
              console.error("Erro ao deletar arquivo:", error);
              Alert.alert("Erro", "Não foi possível excluir o arquivo.");
            } finally {
              setLoading(false);
            }
          },
        },
      ]
    );
  };

  // Ponto MVVM: Lógica para renomear um arquivo.
  // Note: O Firebase Storage não suporta renomear diretamente.
  // A solução comum é: baixar -> deletar o original -> subir com novo nome.
  const renameFile = async (fileId, newName) => {
    if (!user) {
      Alert.alert('Erro', 'Você precisa estar logado para renomear arquivos.');
      return;
    }
    // Verifica se o novo nome está vazio
    if (!newName || newName.trim() === '') {
        Alert.alert('Erro', 'O novo nome não pode ser vazio.');
        return;
    }

    setLoading(true);
    try {
      const oldFileRef = ref(storage, fileId);
      const oldDownloadURL = await getDownloadURL(oldFileRef);

      // Pega o tipo do arquivo original
      const oldFile = files.find(f => 
f.id
 === fileId);
      const fileType = oldFile ? oldFile.type : (newName.includes('.pdf') ? 'pdf' : 'image');

      // Garante que o novo nome tenha a extensão correta
      let finalNewName = newName;
      if (!finalNewName.includes('.')) {
        finalNewName += `.${fileType === 'image' ? 'jpg' : 'pdf'}`;
      } else if (fileType === 'image' && !finalNewName.match(/\.(jpg|jpeg|png|gif)$/i)) {
          finalNewName += '.jpg';
      } else if (fileType === 'pdf' && !finalNewName.toLowerCase().endsWith('.pdf')) {
          finalNewName += '.pdf';
      }

      // Cria uma nova referência com o novo nome
      const newFileRef = ref(storage, `uploads/${user.uid}/${finalNewName}`);

      // 1. Baixa o arquivo (ou usa a URL direta se já tiver blob)
      // Para o Firebase Storage, é mais eficiente se pudermos evitar baixar tudo.
      // O ideal seria que a `addFile` retornasse um blob, mas vamos refazer o fetch.
      const response = await fetch(oldDownloadURL);
      const blob = await response.blob();

      // 2. Faz upload com o novo nome
      await uploadBytes(newFileRef, blob);

      // 3. Deleta o arquivo antigo
      await deleteObject(oldFileRef);

      // Recarrega a lista para refletir a mudança
      await loadFilesFromFirebase();
      Alert.alert("Sucesso", "Arquivo renomeado com sucesso!");

    } catch (error) {
      console.error("Erro ao renomear arquivo:", error);
      Alert.alert("Erro", "Não foi possível renomear o arquivo.");
    } finally {
      setLoading(false);
    }
  };

  return {
    files,
    loading,
    addFile,
    synchronizeAllFiles,
    deleteFile, // Exporta a função de deletar
    renameFile, // Exporta a função de renomear
  };
}; 

