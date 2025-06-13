// /DB/firebaseConfig.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/11.9.0/firebase-app.js";
import {
  getFirestore,
  doc,
  getDoc,
  collection,
  addDoc,
  getDocs,
  query,
  orderBy,
  limit,
  updateDoc,
  serverTimestamp,
  setDoc,
  where,
  deleteDoc
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-firestore.js";

import {
  getAuth,
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-auth.js";

import {
  getStorage,
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL
} from "https://www.gstatic.com/firebasejs/11.9.0/firebase-storage.js";

// Configuración de Firebase
export const firebaseConfig = {
  apiKey: "AIzaSyA49aYSdJNjF_VOag-YtN4ymqXxGFBucGM",
  authDomain: "gestionarproductos-v2.firebaseapp.com",
  projectId: "gestionarproductos-v2",
  storageBucket: "gestionarproductos-v2.firebasestorage.app",
  messagingSenderId: "750668566859",
  appId: "1:750668566859:web:968fd1b8068e3a3b9ed8ce",
  measurementId: "G-9M7D6FF27E"
};

// Inicializa la app
export const app = initializeApp(firebaseConfig);

// Firebase Services
export const db = getFirestore(app);
export const auth = getAuth();

// ✅ Crear una instancia secundaria de Firebase para registrar sin cerrar sesión actual
export function getSecondaryAuth() {
  const secondaryApp = initializeApp(firebaseConfig, "iniciarSesion");
  return getAuth(secondaryApp);
}

// Reexportar funciones comunes
export {
  onAuthStateChanged,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  doc,
  getDoc,
  collection,
  getDocs,
  query,
  orderBy,
  addDoc,
  limit,
  updateDoc,
  serverTimestamp,
  setDoc,
  where,
  deleteDoc,
  getStorage,
  ref,
  deleteObject,
  uploadBytes,
  getDownloadURL,
  signOut,
};