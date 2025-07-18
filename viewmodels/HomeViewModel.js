// my-file-upload-app/viewmodels/HomeViewModel.js

/**
 * ViewModel da Tela Home (HomeViewModel.js)
 *
 * Este ViewModel encapsula a lógica de negócio e o estado da Tela Home.
 * Neste caso específico, a principal lógica é a de navegação.
 * Ele fornece métodos que a View pode chamar para executar ações.
 *
 * Ponto MVVM: Este arquivo é o ViewModel da Home. Ele expõe a função `MapsToFiles`.
 * A View (HomeScreen) irá chamar essa função para interagir.
 *
 * Dependências: Nenhuma específica além de lógica de JS.
 *
 * Quem o chama: HomeScreen (a View).
 * Quem ele chama: Nenhuma dependência externa, apenas manipula o que será retornado para a View.
 */

import { useNavigation } from '@react-navigation/native'; // Hook para acessar o objeto de navegação

export const useHomeViewModel = () => {
  const navigation = useNavigation();

  // Função que a View (HomeScreen) pode chamar para navegar
  const navigateToFiles = () => {
    navigation.navigate('FileViewer');
  };

  return {
    navigateToFiles,
  };
};