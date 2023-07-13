import React, { useContext, useState, useEffect } from "react";
import { auth, db } from "../firebase.js";
import {
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signInWithEmailAndPassword,
  signOut,
  updateEmail,
  updatePassword,
  deleteUser,
} from "firebase/auth";
import { collection, doc, addDoc, setDoc, getDoc, updateDoc, deleteDoc, increment } from "firebase/firestore";

const AuthContext = React.createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState();
  const [loading, setLoading] = useState(true);
  const [userID, setUserID] = useState("");
  const usersCollectionRef = collection(db, "users");

  function signup(email, password, newdisplayName) {
    return createUserWithEmailAndPassword(auth, email, password).then(async (credentials) => {
      //updateDoc({ myDocRef, userId: increment(1) });
      const newUserRef = doc(db, "users", credentials.user.uid);
      setUserID(credentials.user.uid);
      await setDoc(newUserRef, {
        username: newdisplayName,
        userId: credentials.user.uid,
      });
    });
  }

  function login(email, password) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  function logout() {
    return signOut(auth);
  }

  function resetPassword(email) {
    return sendPasswordResetEmail(auth, email);
  }

  function updatingEmail(email) {
    return updateEmail(auth.currentUser, email);
  }

  function updatingPassword(password) {
    return updatePassword(auth.currentUser, password);
  }

  const updateUsername = async (id, newUsername) => {
    const userDoc = doc(db, "users", id);
    const updatedName = { username: newUsername };
    await updateDoc(userDoc, updatedName);
  };

  const deleteThisUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    await deleteUser(currentUser);
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    signup,
    login,
    logout,
    resetPassword,
    updatingEmail,
    updatingPassword,
    updateUsername,
    deleteThisUser,
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}
