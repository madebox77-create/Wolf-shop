import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import { 
  onAuthStateChanged, 
  User, 
  signOut,
  GoogleAuthProvider,
  signInWithPopup
} from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  logout: () => Promise<void>;
  isAuthModalOpen: boolean;
  openAuthModal: () => void;
  closeAuthModal: () => void;
  needsVerification: boolean;
  setNeedsVerification: (val: boolean) => void;
  verificationEmail: string;
  setVerificationEmail: (val: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [needsVerification, setNeedsVerification] = useState(false);
  const [verificationEmail, setVerificationEmail] = useState('');

  useEffect(() => {
    // Listen for auth changes
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        // Safely attempt to link user document in Firestore
        try {
          const userRef = doc(db, 'users', currentUser.uid);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              name: currentUser.displayName || 'Wolf Member',
              email: currentUser.email,
              role: 'client',
              created_at: new Date().toISOString()
            });
          }
        } catch (dbError: any) {
          // If Firestore is unreachable (offline), we log it but don't break the auth flow
          if (dbError?.code === 'unavailable' || dbError?.message?.includes('offline')) {
            console.warn("Firestore profile sync skipped: backend is currently unreachable.");
          } else {
            console.error("Firestore user sync error:", dbError);
          }
        }
        
        setIsAuthModalOpen(false);
        setNeedsVerification(false);
      }
      
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    await signOut(auth);
    setUser(null);
    setNeedsVerification(false);
  };

  const openAuthModal = () => setIsAuthModalOpen(true);
  const closeAuthModal = () => {
    setIsAuthModalOpen(false);
    if (!user) {
      setNeedsVerification(false);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      logout, 
      isAuthModalOpen, 
      openAuthModal, 
      closeAuthModal,
      needsVerification,
      setNeedsVerification,
      verificationEmail,
      setVerificationEmail
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
