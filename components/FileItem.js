// my-file-upload-app/components/FileItem.js

/**
 * Componente de Item de Arquivo Individual (FileItem - UI Component)
 *
 * Este é um componente puramente de View. Ele recebe as `props` de um `file`
 * (que vem do estado gerenciado pelo FileViewerViewModel) e é responsável
 * apenas por renderizar visualmente esse arquivo na lista. Agora inclui
 * funcionalidade para deletar e renomear arquivos.
 *
 * Ponto MVVM: É um componente de UI que renderiza dados e dispara eventos
 * que são tratados pelo ViewModel através das `props` `onDelete` e `onRename`.
 *
 * Dependências:
 * - react-native: Para View, Text, Image, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Button, Platform.
 * - @expo/vector-icons: Para exibir ícones de PDF, upload, deletar e editar.
 *
 * Quem o chama: FileViewerScreen (através da FlatList).
 * Quem ele chama: Nenhuma dependência externa significativa além dos ícones.
 * Necessita de pacote: '@expo/vector-icons'
 */

import React, { useState } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, Alert, Modal, TextInput, Button, Platform } from 'react-native'; // <-- Adicionado Platform
import { MaterialCommunityIcons, Ionicons, Feather } from '@expo/vector-icons';

export default function FileItem({ file, onDelete, onRename }) {
  const [isEditing, setIsEditing] = useState(false);
  // Pega só o nome, sem a extensão, para a edição
  const [newFileName, setNewFileName] = useState(file.name.split('.')[0]); 

  const renderPreview = () => {
    if (file.type === 'image') {
      return <Image source={{ uri: file.uri }} style={styles.thumbnail} />;
    } else if (file.type === 'pdf') {
      return <MaterialCommunityIcons name="file-pdf-box" size={50} color="#E53935" />;
    }
    return <MaterialCommunityIcons name="file-question" size={50} color="#777" />;
  };

  const handleRename = () => {
    if (newFileName.trim() === '') {
      Alert.alert('Erro', 'O nome do arquivo não pode ser vazio.');
      return;
    }
    // Ponto MVVM: A View dispara a ação de renomear, que o ViewModel processará.
    onRename(
file.id
, newFileName.trim());
    setIsEditing(false); // Fecha o modal/edição após a tentativa de renomear
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.previewContainer}>
        {renderPreview()}
      </View>
      <View style={styles.infoContainer}>
        {/* Edição inline para iOS, modal para Android */}
        {isEditing && Platform.OS === 'ios' ? (
          <TextInput
            style={styles.editInput}
            value={newFileName}
            onChangeText={setNewFileName}
            autoFocus
            onSubmitEditing={handleRename} // Renomeia ao apertar enter
            onBlur={() => { // Renomeia ao perder foco, mas com um pequeno delay para não fechar modal do teclado
              setTimeout(() => {
                if (isEditing) handleRename(); // Garante que só chame se ainda estiver editando
              }, 100);
            }}
          />
        ) : (
          <Text style={styles.fileName}>{
file.name
}</Text>
        )}
        <View style={styles.statusContainer}>
          {file.uploaded ? (
            <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
          ) : (
            <Ionicons name="sync-circle" size={20} color="#FFC107" />
          )}
          <Text style={[styles.statusText, { color: file.uploaded ? '#4CAF50' : '#FFC107' }]}>
            {file.uploaded ? 'Uploaded' : 'Sincronizar'}
          </Text>
        </View>
      </View>
      <View style={styles.actionsContainer}>
        {/* Botão de Edição */}
        <TouchableOpacity onPress={() => setIsEditing(true)} style={styles.actionButton}>
          <Feather name="edit" size={20} color="#007bff" />
        </TouchableOpacity>
        {/* Botão de Exclusão */}
        <TouchableOpacity onPress={() => onDelete(
file.id
)} style={styles.actionButton}>
          <MaterialCommunityIcons name="delete" size={22} color="#dc3545" />
        </TouchableOpacity>
      </View>

      {/* Modal de Edição para Android */}
      {Platform.OS === 'android' && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={isEditing}
          onRequestClose={() => setIsEditing(false)}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalTitle}>Renomear Arquivo</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="Novo nome do arquivo"
                value={newFileName}
                onChangeText={setNewFileName}
                autoFocus
              />
              <View style={styles.modalButtons}>
                <Button title="Cancelar" onPress={() => setIsEditing(false)} color="#dc3545" />
                <Button title="Renomear" onPress={handleRename} color="#007bff" />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  previewContainer: {
    width: 60,
    height: 60,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    backgroundColor: '#eee',
    borderRadius: 5,
    overflow: 'hidden',
  },
  thumbnail: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  infoContainer: {
    flex: 1,
  },
  fileName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  editInput: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingVertical: 2,
    marginBottom: 5,
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    marginLeft: 5,
    fontWeight: '500',
  },
  actionsContainer: {
    flexDirection: 'row',
    marginLeft: 10,
  },
  actionButton: {
    marginLeft: 10,
    padding: 5,
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: 'rgba(0,0,0,0.5)',
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

