import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { collection, getFirestore, getDocs, getDoc, query, where } from "firebase/firestore";
import { useAuth } from "./contexts/AuthContext";

const firebaseConfig = {
  apiKey: "AIzaSyA8UD2fccBJnhITvpRMgj3aU_AiXhaTx5w",
  authDomain: "auth-project-53491.firebaseapp.com",
  projectId: "auth-project-53491",
  storageBucket: "auth-project-53491.appspot.com",
  messagingSenderId: "453688216402",
  appId: "1:453688216402:web:d274276b703d636e37488b",
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const db = getFirestore(app);

export const getDocuments = async (collectionName, userId) => {
  const docs = await getDocs(query(collection(db, collectionName), where("userId", "==", userId)));
  const docslists = docs.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  return docslists;
};

export default app;
