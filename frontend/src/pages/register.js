import { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext'; // Corrected relative path
import { useRouter } from 'next/router';
import RegisterForm from '../components/auth/RegisterForm'; // Corrected relative path
import LoadingSpinner from '../components/common/LoadingSpinner';

const RegisterPage = () => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push('/notes'); // Redirect authenticated users to notes
    }
  }, [loading, isAuthenticated, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <LoadingSpinner size="lg" className="text-primary" />
      </div>
    );
  }

  return <RegisterForm />;
};

export default RegisterPage;