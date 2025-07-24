// my-file-upload-app/screens/FileViewer.js

/**
 * Componente da Tela de Visualização de Arquivos (FileViewerScreen - View)
 *
 * Esta é a View da arquitetura MVVM para a tela de visualização de arquivos.
 * Ela é responsável por renderizar a lista de arquivos, o botão de upload,
 * e o botão de sincronização. Ela consome o FileViewerViewModel para obter
 * os dados e disparar ações. Agora inclui um botão de logout.
 *
 * Ponto MVVM: Esta é a View. Ela acessa `files`, `loading`, `addFile`,
 * `synchronizeAllFiles`, `deleteFile` e `renameFile` do ViewModel
 * e os utiliza para renderizar a UI e responder a interações.
 *
 * Dependências:
 * - react-native: Para View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator.
 * - @expo/vector-icons: Para ícones.
 * - ../components/UploadButton: Componente reutilizável de UI.
 * - ../components/FileItem: Componente reutilizável de UI (agora com props para delete/edit).
 * - ../viewmodels/FileViewerViewModel: Importa o ViewModel.
 * - ../contexts/AuthContext: Para a função de logout.
 *
 * Quem o chama: App.js (através do Stack Navigator).
 * Quem ele chama: UploadButton.js, FileItem.js, useFileViewerViewModel, useAuth.
 * Necessita de pacotes: '@expo/vector-icons', 'firebase'
 */

import React, { useState } from 'react'; // Adicionado useState para o modal de upload
import { View, Text, FlatList, StyleSheet, TouchableOpacity, ActivityIndicator, Modal, TextInput, Button, Alert } from 'react-native';
import { MaterialCommunityIcons, Ionicons } from '@expo/vector-icons';
import UploadButton from '../components/UploadButton';
import FileItem from '../components/FileItem';
import { useFileViewerViewModel } from '../viewmodels/FileViewerViewModel';
import { useNavigation } from '@react-navigation/native'; // Bruno, goBack button
import { useAuth } from '../contexts/AuthContext'; // NOVO: Importa o hook de autenticação

export default function FileViewerScreen() {
  const { files, loading, addFile, synchronizeAllFiles, deleteFile, renameFile } = useFileViewerViewModel();

  const navigation = useNavigation(); // Bruno, goBack button:

  const { logout } = useAuth(); // Ponto MVVM: A View obtém a função de logout do AuthContext.

  const [modalVisible, setModalVisible] = useState(false);
  const [newFileName, setNewFileName] = useState('');
  const [selectedFileUri, setSelectedFileUri] = useState(null);
  const [selectedFileType, setSelectedFileType] = useState(null);

  const handleUploadCompleteWithModal = (uri, type) => {
    setSelectedFileUri(uri);
    setSelectedFileType(type);
    setNewFileName(''); // Limpa o nome anterior
    setModalVisible(true); // Abre o modal para o usuário inserir o nome
  };

  const confirmUpload = async () => {
    if (!selectedFileUri || !selectedFileType) return;

    if (newFileName.trim() === '') {
      Alert.alert('Nome do Arquivo', 'Por favor, insira um nome para o arquivo.');
      return;
    }

    setModalVisible(false);
    // Chama o ViewModel para adicionar o arquivo com o nome personalizado
    await addFile(selectedFileUri, selectedFileType, newFileName.trim());
    setSelectedFileUri(null);
    setSelectedFileType(null);
    setNewFileName('');
  };

  const renderItem = ({ item }) => (
    // Ponto MVVM: A View passa as funções do ViewModel para o componente filho.
    <FileItem
      file={item}
      onDelete={deleteFile} // Passa a função de deletar
      onRename={renameFile} // Passa a função de renomear
    />
  );

  return (
    <View style={styles.container}>
      {/* Cabeçalho com o botão de sincronização e logout */}
      <View style={styles.header}>

        <Button title="Voltar" onPress={() => navigation.goBack()} />

        <Text style={styles.title}>Meus Arquivos</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity
            onPress={synchronizeAllFiles}
            style={styles.syncButton}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <MaterialCommunityIcons name="cloud-sync" size={24} color="#fff" />
            )}
            <Text style={styles.syncButtonText}>
              {loading ? 'Carregando...' : 'Sincronizar'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={logout} style={styles.logoutButtonHeader}>
            <Ionicons name="log-out-outline" size={24} color="#fff" />
            <Text style={styles.logoutButtonTextHeader}>Sair</Text>
          </TouchableOpacity>
        </View>
      </View>

      {loading && files.length === 0 ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007bff" />
          <Text style={styles.loadingText}>Carregando arquivos...</Text>
        </View>
      ) : (
        <FlatList
          data={files}
          renderItem={renderItem}
          keyExtractor={item => 
item.id
}
          contentContainerStyle={styles.listContent}
          ListEmptyComponent={!loading && <Text style={styles.emptyListText}>Nenhum arquivo ainda. Adicione um!</Text>}
        />
      )}

      {/* Botão de Upload na parte inferior, agora chama o modal */}
      <UploadButton onUploadComplete={handleUploadCompleteWithModal} />

      {/* Modal para nome do arquivo */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>Nomear Arquivo</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Digite o nome do arquivo"
              value={newFileName}
              onChangeText={setNewFileName}
            />
            <View style={styles.modalButtons}>
              <Button title="Cancelar" onPress={() => setModalVisible(false)} color="#dc3545" />
              <Button title="Confirmar Upload" onPress={confirmUpload} color="#007bff" />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#333',
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  syncButton: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
    marginRight: 10,
  },
  syncButtonText: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  logoutButtonHeader: {
    flexDirection: 'row',
    backgroundColor: '#6c757d', // Cinza para o botão de sair
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 20,
    alignItems: 'center',
  },
  logoutButtonTextHeader: {
    color: '#fff',
    marginLeft: 5,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 100,
  },
  emptyListText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#777',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)', // Fundo escuro transparente
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  modalInput: {
    width: '100%',
    height: 50,
    borderColor: '#ddd',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
  },
}); 

