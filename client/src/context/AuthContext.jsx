import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

const getStoredUser = () => {
  try {
    const savedUser = localStorage.getItem('user');
    return savedUser ? JSON.parse(savedUser) : null;
  } catch (error) {
    return null;
  }
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(getStoredUser);
  const [token, setToken] = useState(localStorage.getItem('token') || '');

  const value = useMemo(
    () => ({
      user,
      token,
      isAdmin: user?.role === 'admin',
      isInstructor: user?.role === 'instructor',
      canManageCourses: user?.role === 'admin' || user?.role === 'instructor',
      login: (nextUser, nextToken) => {
        setUser(nextUser);
        setToken(nextToken);
        localStorage.setItem('token', nextToken);
        localStorage.setItem('user', JSON.stringify(nextUser));
      },
      logout: () => {
        setUser(null);
        setToken('');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      },
      setUser,
    }),
    [user, token],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  return useContext(AuthContext);
}
