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
//             {Platform.select({
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
 * definindo as telas Home e FileViewer.
 *
 * Ponto MVVM: Este é o ponto onde as Views (telas) são inicializadas
 * e conectadas ao sistema de navegação. Ele não possui lógica de negócio.
 *
 * Dependências:
 * - @react-navigation/native: Necessário para o core da navegação.
 * - @react-navigation/native-stack: Necessário para criar um navegador baseado em pilha.
 *
 * Quem o chama: O ambiente Expo/React Native chama este arquivo como o ponto de partida.
 * Quem ele chama: HomeScreen e FileViewerScreen (através do Navigator).
 */

// import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

// import FileViewerScreen from './screens/FileViewer';
import FileViewerScreen from '../../screens/FileViewer';
// import HomeScreen from './screens/Home';
import HomeScreen from '../../screens/Home';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    // <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="FileViewer" component={FileViewerScreen} />
      </Stack.Navigator>
    // </NavigationContainer>
  );
}
