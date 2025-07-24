// import { Image } from 'expo-image';
// import { Platform, StyleSheet } from 'react-native';

// import { HelloWave } from '@/components/HelloWave';
// import ParallaxScrollView from '@/components/ParallaxScrollView';
// import { ThemedText } from '@/components/ThemedText';
// import { ThemedView } from '@/components/ThemedView';

// export default function HomeScreen() {
//   return (
//     <ParallaxScrollView
//       headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
//       headerImage={
//         <Image
//           source={require('@/assets/images/partial-react-logo.png')}
//           style={styles.reactLogo}
//         />
//       }>
//       <ThemedView style={styles.titleContainer}>
//         <ThemedText type="title">Welcome!</ThemedText>
//         <HelloWave />
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 1: Try it</ThemedText>
//         <ThemedText>
//           Edit <ThemedText type="defaultSemiBold">app/(tabs)/index.tsx</ThemedText> to see changes.
//           Press{' '}
//           <ThemedText type="defaultSemiBold">
//             {
// Platform.select
// ({
//               ios: 'cmd + d',
//               android: 'cmd + m',
//               web: 'F12',
//             })}
//           </ThemedText>{' '}
//           to open developer tools.
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 2: Explore</ThemedText>
//         <ThemedText>
//           {`Tap the Explore tab to learn more about what's included in this starter app.`}
//         </ThemedText>
//       </ThemedView>
//       <ThemedView style={styles.stepContainer}>
//         <ThemedText type="subtitle">Step 3: Get a fresh start</ThemedText>
//         <ThemedText>
//           {`When you're ready, run `}
//           <ThemedText type="defaultSemiBold">npm run reset-project</ThemedText> to get a fresh{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> directory. This will move the current{' '}
//           <ThemedText type="defaultSemiBold">app</ThemedText> to{' '}
//           <ThemedText type="defaultSemiBold">app-example</ThemedText>.
//         </ThemedText>
//       </ThemedView>
//     </ParallaxScrollView>
//   );
// }

// const styles = StyleSheet.create({
//   titleContainer: {
//     flexDirection: 'row',
//     alignItems: 'center',
//     gap: 8,
//   },
//   stepContainer: {
//     gap: 8,
//     marginBottom: 8,
//   },
//   reactLogo: {
//     height: 178,
//     width: 290,
//     bottom: 0,
//     left: 0,
//     position: 'absolute',
//   },
// });


// ****** ****** ******* ********* *********** 
// ****** ****** ******* ********* *********** 

// Colando o meu arquivo do App.js aqui

// ****** ****** ******* ********* *********** 
// ****** ****** ******* ********* *********** 

// ESTE ARQUIVo não existia na criação do expo, eu CRIEI ele!

// my-file-upload-app/App.js

/**
 * Componente Principal do Aplicativo (App.js)
 *
 * Este arquivo é o ponto de entrada do aplicativo.
 * Ele configura o sistema de navegação usando React Navigation,
 * e agora, gerencia as rotas condicionais baseadas no estado de autenticação.
 * O `AuthProvider` envolve todo o aplicativo para disponibilizar o usuário logado.
 *
 * Ponto MVVM: Este é o orquestrador das Views. Ele decide qual conjunto de Views
 * exibir com base no estado de autenticação fornecido pelo `AuthContext`.
 *
 * Dependências:
 * - @react-navigation/native: Core da navegação.
 * - @react-navigation/native-stack: Navegador em pilha.
 * - ./screens/LoginScreen: Nova tela de login.
 * - ./screens/RegisterScreen: Nova tela de registro.
 * - ./contexts/AuthContext: Provedor de autenticação.
 * - ./screens/Home: Tela principal.
 * - ./screens/FileViewer: Tela de visualização de arquivos.
 *
 * Quem o chama: O ambiente Expo/React Native.
 * Quem ele chama: LoginScreen, RegisterScreen, HomeScreen, FileViewerScreen, AuthProvider.
 */

import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { AuthProvider, useAuth } from '../../contexts/AuthContext'; // NOVO: Importa o provedor e o hook de autenticação
import FileViewerScreen from '../../screens/FileViewer';
import HomeScreen from '../../screens/Home';
import LoginScreen from '../../screens/LoginScreen'; // NOVO: Tela de Login
import RegisterScreen from '../../screens/RegisterScreen'; // NOVO: Tela de Registro

const Stack = createNativeStackNavigator();

// Componente que decide qual grupo de rotas exibir (autenticado ou não)
function AppRoutes() {
  // Ponto MVVM: A View (AppRoutes) consome o estado de autenticação do AuthContext.
  const { user, loading } = useAuth(); // Obtém o usuário e o estado de carregamento do contexto

  // Se o AuthContext ainda estiver verificando o estado de autenticação inicial, exibe um loader.
  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {user ? ( // Se há um usuário logado
        <>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="FileViewer" component={FileViewerScreen} />
        </>
      ) : ( // Se não há usuário logado
        <>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function App() {
  return (
    <AuthProvider>
        
      {/* Não precisa de containers aninhados na navegação. Senão dará erro! Por isso deve-se Comentar o "<NavigationContainer>" */}

      {/* <NavigationContainer>  */}
        <AppRoutes />
      {/* </NavigationContainer> */}
      
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
}); 