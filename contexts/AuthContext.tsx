import { router } from "expo-router";
import { User, createUserWithEmailAndPassword, onAuthStateChanged, signInWithEmailAndPassword, signOut } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";
import React, { createContext, useEffect, useState } from 'react';
import { UserData } from '../interfaces/common'; // tu nueva interface
import { auth, db } from "../utils/FirebaseConfig";

interface AuthContextProps {
  user: User | null;
  userData: UserData | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string) => Promise<User | null>;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userData, setUserData] = useState<UserData | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        const userDoc = await getDoc(doc(db, "users", currentUser.uid));
        if (userDoc.exists()) {
          setUserData(userDoc.data() as UserData);
        }
      } else {
        setUser(null);
        setUserData(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      setUser(firebaseUser);

      const userDoc = await getDoc(doc(db, "users", firebaseUser.uid));
      if (userDoc.exists()) {
        setUserData(userDoc.data() as UserData);
        router.push("/(app)/(drawer)/Index");
      }

      return true;
    } catch (error) {
      console.error("🔥 Error al autenticar usuario:", error);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string): Promise<User | null> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      setUser(firebaseUser);

      const newUserData: UserData = {
        id: firebaseUser.uid,
        email,
        name,
        fandoms: {},
        friends: {
          id: "",
          name: ""
        },
        friendRequests: {
          id: "",
          name: ""
        },
        stats: [0, 0, 0],
      };

      await setDoc(doc(db, "users", firebaseUser.uid), newUserData);
      setUserData(newUserData);

      router.push("/(app)/(drawer)/Index");
      return firebaseUser;
    } catch (error) {
      console.error("🔥 Error al registrar usuario:", error);
      return null;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setUser(null);
      setUserData(null);
      router.replace("/");
    } catch (error) {
      console.error("🔥 Error al cerrar sesión:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ user, userData, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextProps => {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de un AuthProvider");
  }
  return context;
};