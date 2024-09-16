import { initializeApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import ReactNativeAsyncStorage from "@react-native-async-storage/async-storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyD-PjjT8SdPZz9xO7Szg-8eZqbhluf1VJ0",
  authDomain: "unifit-2a059.firebaseapp.com",
  databaseURL: "https://unifit-2a059-default-rtdb.europe-west1.firebasedatabase.app",
  projectId: "unifit-2a059",
  storageBucket: "unifit-2a059.appspot.com",
  messagingSenderId: "137115719754",
  appId: "1:137115719754:web:051292896bfc677da36eb3"
};

export const app = initializeApp(firebaseConfig);
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});
export const db = getFirestore(app);
export const rtdb = getDatabase(app);


export default { auth, db, rtdb };
