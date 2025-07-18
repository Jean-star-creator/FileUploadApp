// my-file-upload-app/components/FileItem.js

/**
 * Componente de Item de Arquivo Individual (FileItem - UI Component)
 *
 * Este é um componente puramente de View. Ele recebe as `props` de um `file`
 * (que vem do estado gerenciado pelo FileViewerViewModel) e é responsável
 * apenas por renderizar visualmente esse arquivo na lista. Não possui lógica
 * de negócio ou estado interno complexo.
 *
 * Ponto MVVM: É um componente de UI que renderiza dados fornecidos pelo ViewModel.
 *
 * Dependências:
 * - react-native: Para View, Text, Image, StyleSheet.
 * - @expo/vector-icons: Para exibir ícones de PDF (MaterialCommunityIcons) e upload (Ionicons).
 *
 * Quem o chama: FileViewerScreen (através da FlatList).
 * Quem ele chama: Nenhuma dependência externa significativa além dos ícones.
 * Necessita de pacote: '@expo/vector-icons'
 */

import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { Image, StyleSheet, Text, View } from 'react-native';

export default function FileItem({ file }) {
  const renderPreview = () => {
    if (file.type === 'image') {
      return <Image source={{ uri: file.uri }} style={styles.thumbnail} />;
    } else if (file.type === 'pdf') {
      return <MaterialCommunityIcons name="file-pdf-box" size={50} color="#E53935" />;
    }
    return <MaterialCommunityIcons name="file-question" size={50} color="#777" />;
  };

  return (
    <View style={styles.itemContainer}>
      <View style={styles.previewContainer}>
        {renderPreview()}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.fileName}>{file.name}</Text>
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
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusText: {
    fontSize: 14,
    marginLeft: 5,
    fontWeight: '500',
  },
});