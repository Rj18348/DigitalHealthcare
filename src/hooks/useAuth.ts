// @ts-ignore
import { User as FirebaseUser, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { auth, db } from '../services/firebase';
import { User, UserRole } from '../types';

export interface AuthState {
  user: User | null;
  firebaseUser: FirebaseUser | null;
  loading: boolean;
  role: UserRole | null;
}

export const useAuth = (): AuthState => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    firebaseUser: null,
    loading: true,
    role: null,
  });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser: any) => {
      if (firebaseUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setAuthState({
              user: userData,
              firebaseUser,
              loading: false,
              role: userData.role,
            });
          } else {
            // User document doesn't exist, sign out
            await auth.signOut();
            setAuthState({
              user: null,
              firebaseUser: null,
              loading: false,
              role: null,
            });
          }
        } catch (error) {
          console.error('Error fetching user data:', error);
          setAuthState({
            user: null,
            firebaseUser: null,
            loading: false,
            role: null,
          });
        }
      } else {
        setAuthState({
          user: null,
          firebaseUser: null,
          loading: false,
          role: null,
        });
      }
    });

    return unsubscribe;
  }, []);

  return authState;
};
