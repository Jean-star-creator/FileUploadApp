// my-file-upload-app/viewmodels/FileViewerViewModel.js

/**
 * ViewModel da Tela de Visualização de Arquivos (FileViewerViewModel.js)
 *
 * Este ViewModel agora consome o FilesContext para obter e manipular a lista de arquivos.
 * Ele atua como uma ponte entre a FileViewerScreen (View) e o FilesContext (Model/Serviço de dados).
 * Sua responsabilidade é expor os dados e as ações de forma conveniente para a View.
 *
 * Ponto MVVM: Este é o ViewModel. Ele consome o `useFiles` (do FilesContext)
 * para acessar os dados e funções de manipulação de arquivos.
 *
 * Dependências:
 * - react-native: Para Alert.
 * - ../contexts/FilesContext: NOVO: Importa o hook para consumir o contexto de arquivos.
 *
 * Quem o chama: FileViewerScreen (a View).
 * Quem ele chama: useFiles (do FilesContext).
 */

import { useFiles } from '../contexts/FilesContext'; // NOVO: Importa o hook do FilesContext

export const useFileViewerViewModel = () => {
  // Ponto MVVM: O ViewModel obtém todos os dados e funções do FilesContext.
  const {
    files,
    loadingFiles,
    loadFilesFromFirebase, // Função para sincronizar/recarregar
    addFileToFirebase,     // Função para adicionar (com upload)
    deleteFileFromFirebase, // Função para deletar
    renameFileInFirebase,   // Função para renomear
  } = useFiles();

  // A função addFile do ViewModel agora apenas repassa para o contexto
  const addFile = async (localFileUri, fileType, customFileName = null) => {
    // Não precisa de try-catch aqui, pois o FilesContext já lida com alertas de erro
    await addFileToFirebase(localFileUri, fileType, customFileName);
  };

  // A função synchronizeAllFiles do ViewModel agora apenas repassa para o contexto
  const synchronizeAllFiles = async () => {
    await loadFilesFromFirebase();
  };

  // A função deleteFile do ViewModel agora apenas repassa para o contexto
  const deleteFile = async (fileId) => {
    await deleteFileFromFirebase(fileId);
  };

  // A função renameFile do ViewModel agora apenas repassa para o contexto
  const renameFile = async (fileId, newName) => {
    await renameFileInFirebase(fileId, newName);
  };

  return {
    files,
    loading: loadingFiles, // Renomeia 'loadingFiles' para 'loading' para compatibilidade com a View
    addFile,
    synchronizeAllFiles,
    deleteFile,
    renameFile,
  };
}; 