import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, UserRole } from '../types';
import { auth } from '../firebase/firebase';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  User as FirebaseUser,
  updateProfile
} from 'firebase/auth';
import { mockUsers } from '../data/mockData';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string, role?: UserRole) => Promise<boolean>;
  signup: (email: string, password: string, name: string, role: UserRole, phone: string, state: string, district: string) => Promise<boolean>;
  logout: () => Promise<void>;
  hasRole: (roles: UserRole[]) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to convert Firebase user to our User type
function firebaseUserToUser(firebaseUser: FirebaseUser): User | null {
  const customClaims = (firebaseUser as any).customClaims || {};
  const userMetadata = firebaseUser.metadata;
  
  // Try to get role from custom claims, then from displayName metadata, then from localStorage
  let role: UserRole = customClaims.role || 
    (userMetadata as any).role ||
    (localStorage.getItem(`user_role_${firebaseUser.uid}`) as UserRole) ||
    'field_officer';

  // Get user data from localStorage or create from Firebase user
  const savedUserData = localStorage.getItem(`user_data_${firebaseUser.uid}`);
  if (savedUserData) {
    try {
      const userData = JSON.parse(savedUserData);
      return {
        id: firebaseUser.uid,
        email: firebaseUser.email || '',
        name: userData.name || firebaseUser.displayName || 'User',
        role: userData.role || role,
        phone: userData.phone || '',
        state: userData.state || '',
        district: userData.district || '',
      };
    } catch (e) {
      // Fallback
    }
  }

  // Fallback: create user from Firebase data
  return {
    id: firebaseUser.uid,
    email: firebaseUser.email || '',
    name: firebaseUser.displayName || 'User',
    role: role,
    phone: '',
    state: '',
    district: '',
  };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const appUser = firebaseUserToUser(firebaseUser);
        setUser(appUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string, role?: UserRole): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;
      
      // Check if role matches (if provided)
      const savedRole = localStorage.getItem(`user_role_${firebaseUser.uid}`) as UserRole;
      if (role && savedRole && savedRole !== role) {
        await signOut(auth);
        return false;
      }

      const appUser = firebaseUserToUser(firebaseUser);
      setUser(appUser);
      return true;
    } catch (error: any) {
      console.error('Login error:', error);
      return false;
    }
  };

  const signup = async (
    email: string, 
    password: string, 
    name: string, 
    role: UserRole,
    phone: string,
    state: string,
    district: string
  ): Promise<boolean> => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Update display name
      await updateProfile(firebaseUser, { displayName: name });

      // Store role and user data in localStorage (in production, this should be in Firestore)
      localStorage.setItem(`user_role_${firebaseUser.uid}`, role);
      const userData: User = {
        id: firebaseUser.uid,
        email: email,
        name: name,
        role: role,
        phone: phone,
        state: state,
        district: district,
      };
      localStorage.setItem(`user_data_${firebaseUser.uid}`, JSON.stringify(userData));

      setUser(userData);
      return true;
    } catch (error: any) {
      console.error('Signup error:', error);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  const hasRole = (roles: UserRole[]): boolean => {
    if (!user) return false;
    return roles.includes(user.role);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      isAuthenticated: !!user, 
      loading,
      login, 
      signup,
      logout, 
      hasRole 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
