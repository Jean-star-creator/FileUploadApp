// my-file-upload-app/firebaseConfig.js

/**
 * Configuração do Firebase para o Aplicativo.
 *
 * Este arquivo inicializa o Firebase e exporta as instâncias necessárias
 * (como Storage) para serem usadas em outras partes do aplicativo.
 *
 * Ponto MVVM: Embora não seja parte direta do MVVM, esta é uma camada de "Serviço"
 * que o ViewModel (FileViewerViewModel) consumirá para interagir com o backend.
 *
 * Dependências:
 * - firebase: Biblioteca oficial do Firebase.
 *
 * Quem o chama: Principalmente viewmodels/FileViewerViewModel.js
 * Quem ele chama: N/A (apenas inicializa o SDK do Firebase).
 * Necessita de pacote: 'firebase'
 */

import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytes, getDownloadURL, listAll } from 'firebase/storage';

// Suas credenciais do Firebase (substitua pelos seus próprios valores!)
// const firebaseConfig = {
//   apiKey: "YOUR_API_KEY",
//   authDomain: "YOUR_AUTH_DOMAIN",
//   projectId: "YOUR_PROJECT_ID",
//   storageBucket: "YOUR_STORAGE_BUCKET",
//   messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
//   appId: "YOUR_APP_ID"
// };

const firebaseConfig = {
  apiKey: "AIzaSyAP7VYlUcOOXvqszaUb3_GmcVivqpTX4h4",
  authDomain: "fileuploadapp-25f69.firebaseapp.com",
  projectId: "fileuploadapp-25f69",
  storageBucket: "fileuploadapp-25f69.firebasestorage.app",
  messagingSenderId: "1026400489675",
  appId: "1:1026400489675:web:d2ffc1c4b6eb08546f0b4e"
};


// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Obtém uma instância do Firebase Storage
const storage = getStorage(app);

export {
  storage,
  ref,
  uploadBytes,
  getDownloadURL,
  listAll
}; 

