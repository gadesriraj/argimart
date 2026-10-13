import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '../types';
import { SAMPLE_USERS } from '../data/sampleData';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (email: string, role?: UserRole) => Promise<{ success: boolean; message?: string }>;
  register: (userData: {
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    address: string;
    password?: string;
  }) => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
  switchRoleQuickly: (role: UserRole) => void;
  updateProfile: (updatedData: Partial<User>) => void;
  usersList: User[];
  toggleUserStatus: (userId: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const USERS_STORAGE_KEY = 'harvesthub_users';
const CURRENT_USER_STORAGE_KEY = 'harvesthub_current_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [usersList, setUsersList] = useState<User[]>(() => {
    const saved = localStorage.getItem(USERS_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    return SAMPLE_USERS;
  });

  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const saved = localStorage.getItem(CURRENT_USER_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        console.error(e);
      }
    }
    // Default to the sample farmer or customer for convenient demonstration
    return SAMPLE_USERS[1]; // Rameshwar Sharma (Farmer)
  });

  useEffect(() => {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(usersList));
  }, [usersList]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(CURRENT_USER_STORAGE_KEY);
    }
  }, [currentUser]);

  const login = async (email: string, role?: UserRole): Promise<{ success: boolean; message?: string }> => {
    const found = usersList.find(u => u.email.toLowerCase() === email.toLowerCase());
    if (found) {
      if (!found.active) {
        return { success: false, message: 'Account is deactivated. Please contact platform admin.' };
      }
      setCurrentUser(found);
      return { success: true };
    }
    
    // Quick demo login if role is provided
    if (role) {
      const roleMatch = usersList.find(u => u.role === role);
      if (roleMatch) {
        setCurrentUser(roleMatch);
        return { success: true };
      }
    }

    return { success: false, message: 'No registered user found with this email address.' };
  };

  const register = async (userData: {
    fullName: string;
    email: string;
    phone: string;
    role: UserRole;
    address: string;
    password?: string;
  }): Promise<{ success: boolean; message?: string }> => {
    if (usersList.some(u => u.email.toLowerCase() === userData.email.toLowerCase())) {
      return { success: false, message: 'An account with this email already exists.' };
    }

    // Public registration only permits FARMER or CUSTOMER (protects ADMIN)
    if (userData.role === 'ADMIN') {
      return { success: false, message: 'Administrator accounts cannot be self-registered.' };
    }

    const newUser: User = {
      id: `user-${Date.now()}`,
      fullName: userData.fullName,
      email: userData.email,
      phone: userData.phone,
      role: userData.role,
      address: userData.address,
      active: true,
      createdAt: new Date().toISOString(),
    };

    setUsersList(prev => [...prev, newUser]);
    setCurrentUser(newUser);
    return { success: true };
  };

  const logout = () => {
    setCurrentUser(null);
  };

  const switchRoleQuickly = (role: UserRole) => {
    const targetUser = usersList.find(u => u.role === role);
    if (targetUser) {
      setCurrentUser(targetUser);
    }
  };

  const updateProfile = (updatedData: Partial<User>) => {
    if (!currentUser) return;
    const updated = { ...currentUser, ...updatedData };
    setCurrentUser(updated);
    setUsersList(prev => prev.map(u => u.id === updated.id ? updated : u));
  };

  const toggleUserStatus = (userId: string) => {
    setUsersList(prev => prev.map(u => {
      if (u.id === userId) {
        const next = { ...u, active: !u.active };
        if (currentUser?.id === userId) {
          setCurrentUser(next);
        }
        return next;
      }
      return u;
    }));
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        register,
        logout,
        switchRoleQuickly,
        updateProfile,
        usersList,
        toggleUserStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
