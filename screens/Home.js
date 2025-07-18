// my-file-upload-app/screens/Home.js

/**
 * Componente da Tela Home (HomeScreen - View)
 *
 * Esta tela é a View da arquitetura MVVM para a Home.
 * Ela é responsável **APENAS** por renderizar a interface do usuário
 * e reagir a interações do usuário, chamando métodos do ViewModel.
 * Não contém lógica de negócio complexa.
 *
 * Ponto MVVM: Esta é a View. Ela consome o HomeViewModel para suas operações.
 *
 * Dependências:
 * - react-native: Para componentes UI como View, Text, StyleSheet, Button.
 * - ../viewmodels/HomeViewModel: Importa o ViewModel para gerenciar a lógica de navegação.
 *
 * Quem o chama: App.js (através do Stack Navigator).
 * Quem ele chama: useHomeViewModel (para obter a lógica).
 */

import { Button, StyleSheet, Text, View } from 'react-native';
import { useHomeViewModel } from '../viewmodels/HomeViewModel'; // Importa o ViewModel
import { Link } from 'expo-router';

export default function HomeScreen() {
  // Ponto MVVM: Obtenção do ViewModel. A View não sabe como a navegação é feita,
  // apenas que ela pode chamar `MapsToFiles`.
  const { navigateToFiles } = useHomeViewModel();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bem-vindo ao App de Arquivos!</Text>
      <Text style={styles.subtitle}>Gerencie suas imagens e PDFs.</Text>
      <Button
        title="Ver Meus Arquivos"
        // Ponto MVVM: A View dispara o evento e o ViewModel lida com a ação.
        onPress={navigateToFiles}
        color="#841584"
      />
      <Link href={"/painel"}>Ir para Painel</Link>
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
  },
});