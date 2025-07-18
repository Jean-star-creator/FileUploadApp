// my-file-upload-app/components/UploadButton.js

/**
 * Componente de Botão de Upload Flutuante (UploadButton - UI Component)
 *
 * Este componente é uma parte da View. Sua responsabilidade é puramente
 * de interface do usuário e interação com APIs do sistema (seleção de arquivos).
 * Ele expõe um evento (`onUploadComplete`) para notificar seu pai (a View, que por sua vez
 * chamará o ViewModel) sobre um novo arquivo.
 *
 * Ponto MVVM: É um sub-componente da View. Ele delega o tratamento do arquivo selecionado
 * para a função `onUploadComplete` que vem via props, evitando ter lógica de negócio aqui.
 *
 * Dependências:
 * - react-native: Para View, TouchableOpacity, Text, StyleSheet, Alert, Platform, ActionSheetIOS.
 * - expo-image-picker: Para acessar a câmera e a galeria.
 * - expo-document-picker: Para selecionar arquivos como PDFs.
 * - @expo/vector-icons: Para o ícone de adição (Ionicons).
 *
 * Quem o chama: FileViewerScreen (a View).
 * Quem ele chama: Funções do Expo ImagePicker e DocumentPicker.
 * Necessita de pacotes: 'expo-image-picker', 'expo-document-picker', '@expo/vector-icons'
 */

import { Ionicons } from '@expo/vector-icons';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { ActionSheetIOS, Alert, Platform, StyleSheet, TouchableOpacity, View } from 'react-native';

export default function UploadButton({ onUploadComplete }) {

  const pickImageFromCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Precisamos da permissão da câmera para tirar fotos.');
      return;
    }

    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      // Ponto MVVM: Delega a "lógica de negócio" de adicionar o arquivo ao pai (FileViewerScreen),
      // que passará para o ViewModel.
      onUploadComplete(result.assets[0].uri, 'image');
    }
  };

  const pickImageFromGallery = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permissão Negada', 'Precisamos da permissão da galeria para selecionar imagens.');
      return;
    }

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      onUploadComplete(result.assets[0].uri, 'image');
    }
  };

  const pickDocument = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: 'application/pdf',
        copyToCacheDirectory: true,
      });

      if (!result.canceled) {
        onUploadComplete(result.assets[0].uri, 'pdf');
      }
    } catch (error) {
      console.error('Erro ao selecionar documento:', error);
      Alert.alert('Erro', 'Não foi possível selecionar o documento.');
    }
  };

  const showUploadOptions = () => {
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ['Cancelar', 'Tirar Foto', 'Escolher Imagem', 'Escolher PDF'],
          cancelButtonIndex: 0,
        },
        buttonIndex => {
          if (buttonIndex === 1) {
            pickImageFromCamera();
          } else if (buttonIndex === 2) {
            pickImageFromGallery();
          } else if (buttonIndex === 3) {
            pickDocument();
          }
        }
      );
    } else {
      Alert.alert(
        "Escolher Opção de Upload",
        "Como você gostaria de adicionar um arquivo?",
        [
          { text: "Tirar Foto", onPress: pickImageFromCamera },
          { text: "Escolher Imagem", onPress: pickImageFromGallery },
          { text: "Escolher PDF", onPress: pickDocument },
          { text: "Cancelar", style: "cancel" }
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.button} onPress={showUploadOptions}>
        <Ionicons name="add" size={30} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    zIndex: 10,
  },
  button: {
    backgroundColor: '#007bff',
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
});