import { useContext } from 'react';
import { AuthContext } from '../contexts/AuthContext'; // Corrected relative path

const useAuth = () => useContext(AuthContext);

export default useAuth;