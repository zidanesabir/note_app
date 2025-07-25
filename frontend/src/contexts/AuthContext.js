import { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../lib/api';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sharedNotesCount, setSharedNotesCount] = useState(0);
  const [sharedNotesList, setSharedNotesList] = useState([]); // Will store the actual shared notes data
  const [showNotificationsModal, setShowNotificationsModal] = useState(false); // Controls modal visibility
  const router = useRouter();

  // Helper to fetch shared notes count AND list
  const fetchSharedNotesData = async () => {
    if (!user) { // Only fetch if user is logged in
      setSharedNotesCount(0);
      setSharedNotesList([]);
      return;
    }
    try {
      const response = await apiClient.get('/notes/?status=shared&limit=1000'); // Fetch all shared notes for notification list
      setSharedNotesCount(response.data.length);
      setSharedNotesList(response.data); // Store the full list of shared notes
    } catch (error) {
      console.error('AuthContext: Failed to fetch shared notes data:', error);
      setSharedNotesCount(0);
      setSharedNotesList([]);
    }
  };

  useEffect(() => {
    const loadUser = async () => {
      const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
      if (token) {
        try {
          const res = await apiClient.get('/auth/me');
          setUser(res.data);
        } catch (error) {
          console.error('AuthContext: Failed to load user from token:', error);
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Fetch shared notes data whenever user state changes (e.g., login/logout)
  useEffect(() => {
    if (user) {
      fetchSharedNotesData();
    } else {
      setSharedNotesCount(0);
      setSharedNotesList([]);
    }
  }, [user]);

  const login = async (email, password) => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      params.append('username', email);
      params.append('password', password);

      const res = await apiClient.post('/auth/login', params, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      });

      if (typeof window !== 'undefined') {
        localStorage.setItem('token', res.data.access_token);
      }
      const userRes = await apiClient.get('/auth/me');
      setUser(userRes.data);
      await fetchSharedNotesData(); // Fetch after successful login
      router.push('/notes');
      return true;
    } catch (error) {
      console.error('AuthContext: Login failed:', error.response?.data || error.message);
      setUser(null);
      setSharedNotesCount(0);
      setSharedNotesList([]);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password) => {
    try {
      setLoading(true);
      await apiClient.post('/auth/register', { email, password });
      return await login(email, password);
    } catch (error) {
      console.error('AuthContext: Registration failed:', error.response?.data || error.message);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('token');
    }
    setUser(null);
    setSharedNotesCount(0);
    setSharedNotesList([]);
    router.push('/login');
  };

  // Functions to control the notification modal
  const openSharedNotesModal = () => setShowNotificationsModal(true);
  const closeSharedNotesModal = () => setShowNotificationsModal(false);

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated: !!user,
      loading,
      login,
      register,
      logout,
      sharedNotesCount,
      sharedNotesList, // Expose the list of shared notes
      showNotificationsModal, // Expose modal visibility state
      openSharedNotesModal,   // Expose function to open modal
      closeSharedNotesModal   // Expose function to close modal
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === null) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};