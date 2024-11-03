import React, { createContext, useContext, useState, useEffect } from "react";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  UserCredential,
  updatePassword as updPassword,
  updateEmail as updEmail,
  signOut as firebaseSignOut,
} from "firebase/auth";
import firebase from 'src/services/firebase';
import { useUser } from "./useUser";

type Props = {
  children?: React.ReactNode;
};

type UserData = {
  email: string;
  uid: string;
};

type AuthContextData = {
  loggedIn: boolean;
  user: UserData | null;
  signUp(email: string, password: string): Promise<UserCredential | Error>;
  signIn(email: string, password: string): Promise<UserCredential | Error>;
  signOut(): Promise<void>;
  updatePassword(newPassword: string): Promise<void | Error>;
  updateEmail(newEmail: string): Promise<void | Error>;
};

const authContext = createContext<AuthContextData>({} as AuthContextData);

export const useAuth = () => {
  return useContext(authContext);
};

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const [user, setUser] = useState<UserData | null>(null);
  const userData = useUser();

  useEffect(() => {
    if (user == null && userData.initialized) {
      userData.destroy();
    }
  }, [user, userData]);

  const signIn = async (email: string, password: string): Promise<UserCredential | Error> => {
    try {
      const userCredential = await signInWithEmailAndPassword(firebase.auth, email, password);
      setUser({ email: userCredential.user.email!, uid: userCredential.user.uid });
      userData.initialize(userCredential.user);
      return userCredential; // Ensure this is returned
    } catch (error: any) {
      console.error(`useAuth signIn ERROR:\n    CODE: ${error.code}\n    MESSAGE: ${error.message}`);
      return new Error(error.code); // Return an Error object
    }
  };

  const signUp = async (email: string, password: string): Promise<UserCredential | Error> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(firebase.auth, email, password);
      const user = userCredential.user;
      setUser({ email: user.email!, uid: user.uid });
      return userCredential; // Ensure this is returned
    } catch (error: any) {
      console.error(`useAuth signUp ERROR:\n    CODE: ${error.code}\n    MESSAGE: ${error.message}`);
      return new Error(error.code); // Return an Error object
    }
  };

  const signOut = async (): Promise<void> => {
    try {
      await firebaseSignOut(firebase.auth);
      setUser(null); // Set user to null after sign out
    } catch (error: any) {
      console.error(`useAuth signOut ERROR:\n    CODE: ${error.code}\n    MESSAGE: ${error.message}`);
    }
  };

  const updatePassword = async (newPassword: string): Promise<void | Error> => {
    try {
      await updPassword(firebase.auth.currentUser, newPassword);
    } catch (error: any) {
      console.error(error);
      return new Error(error.code); // Return an Error object
    }
  };

  const updateEmail = async (newEmail: string): Promise<void | Error> => {
    try {
      await updEmail(firebase.auth.currentUser, newEmail);
    } catch (error: any) {
      console.error(error);
      return new Error(error.code); // Return an Error object
    }
  };

  return (
    <authContext.Provider value={{ loggedIn: !!user, user, signUp, signIn, signOut, updatePassword, updateEmail }}>
      {children}
    </authContext.Provider>
  );
};
