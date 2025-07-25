import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '../contexts/AuthContext';
import LoadingSpinner from '../components/common/LoadingSpinner';

const HomePage = () => {
  const router = useRouter();
  const { isAuthenticated, loading } = useAuth();

  useEffect(() => {
    if (!loading) {
      if (isAuthenticated) {
        router.push('/notes'); // Redirect to notes if logged in
      } else {
        router.push('/login'); // Redirect to login if not logged in
      }
    }
  }, [loading, isAuthenticated, router]);

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-128px)]"> {/* Adjust height to fit header/footer */}
      {loading ? (
        <LoadingSpinner size="lg" className="text-blue-600" />
      ) : (
        <p className="text-xl text-gray-700">Redirecting...</p>
      )}
    </div>
  );
};

export default HomePage;