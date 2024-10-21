import {getApp,getApps,initializeApp} from "firebase/app";
import {getFirestore} from "firebase/firestore";
import {getStorage} from "firebase/storage";
const firebaseConfig = {
  apiKey: "AIzaSyA5cEjRUYYvPAdWz5KSMMLfk3O49k_6ofQ",
  authDomain: "pdf-chat-d7d04.firebaseapp.com",
  projectId: "pdf-chat-d7d04",
  storageBucket: "pdf-chat-d7d04.appspot.com",
  messagingSenderId: "953731633627",
  appId: "1:953731633627:web:95676be05f991b624a57fe",
  measurementId: "G-HHDGTDSNPF"
};
const app=getApps().length===0?initializeApp(firebaseConfig):getApp();
const db=getFirestore(app);
const storage=getStorage(app);
export {db,storage};