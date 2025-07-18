import { Link } from 'expo-router';
import { Text } from 'react-native';

export default function Painel() {
  return (
    <>
        <Text >Tela do Painel</Text>
        <Link href={"/"}>Voltar para Home</Link>
        {/* <Button
                title="Ver Meus Arquivos"
                // Ponto MVVM: A View dispara o evento e o ViewModel lida com a ação.
                onPress={navigateToFiles}
                color="#841584"
       /> */}
    </>
  );
}