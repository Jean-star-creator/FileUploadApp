
// my-file-upload-app/firebaseConfig.js

/**
 * Configuração do Firebase para o Aplicativo.
 *
 * Este arquivo inicializa o Firebase e exporta as instâncias necessárias
 * (como Storage e Auth) para serem usadas em outras partes do aplicativo.
 *
 * Ponto MVVM: Este é um serviço que os ViewModels irão consumir.
 *
 * Dependências:
 * - firebase: Biblioteca oficial do Firebase.
 *
 * Quem o chama: Principalmente viewmodels/FileViewerViewModel.js e AuthViewModel.js (novo).
 * Quem ele chama: N/A (apenas inicializa o SDK do Firebase).
 * Necessita de pacote: 'firebase'
 */

import { initializeApp } from 'firebase/app';
import { createUserWithEmailAndPassword, getAuth, onAuthStateChanged, signInWithEmailAndPassword, signOut } from 'firebase/auth'; // NOVO: Módulo de Autenticação
import { deleteObject, getDownloadURL, getStorage, listAll, ref, uploadBytes } from 'firebase/storage'; // Adicionado deleteObject 

// Suas credenciais do Firebase (substitua pelos seus próprios valores!)
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

// Obtém instâncias dos serviços
const storage = getStorage(app); // Obtém uma instância do Firebase Storage
const auth = getAuth(app); // NOVO: Instância do Auth

export {
  auth, // NOVO: Exporta a instância do Auth
  createUserWithEmailAndPassword, deleteObject, getDownloadURL,
  listAll, onAuthStateChanged, ref, // NOVO: Funções de autenticação
  signInWithEmailAndPassword,
  signOut, storage, uploadBytes
};

