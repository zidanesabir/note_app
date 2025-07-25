import { useState } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import NoteForm from '../../components/notes/NoteForm';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Swal from 'sweetalert2';

const CreateNotePage = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { isAuthenticated, loading: authLoading } = useAuth();
  const router = useRouter();

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <LoadingSpinner size="lg" className="text-primary" />
      </div>
    );
  }

  const handleCreateSubmit = async (noteData) => {
    setLoading(true); // Button becomes disabled here
    setError(null);
    console.log("Attempting to create note. Loading is true."); // DEBUG LOG 1
    try {
      await apiClient.post('/notes/', noteData);
      
      Swal.fire({
        icon: 'success',
        title: 'Note Created!',
        text: 'Your new note has been successfully created.',
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'glass-card',
          title: 'text-neutral-800',
          content: 'text-neutral-700',
        },
      });

      router.push('/notes');
    } catch (err) {
      console.error('Failed to create note (catch block):', err.response?.data || err.message); // DEBUG LOG 2 (Error details)
      setError('Failed to create note. Please check your input.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.detail || 'Failed to create note. Please try again.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'glass-card',
          title: 'text-neutral-800',
          content: 'text-neutral-700',
        },
      });
    } finally {
      setLoading(false); // Button should become enabled here
      console.log("Finished note creation attempt. Loading is false."); // DEBUG LOG 3
    }
  };

  return (
    <div className="container mx-auto p-4 py-8">
      <NoteForm onSubmit={handleCreateSubmit} loading={loading} error={error} isEdit={false} />
    </div>
  );
};

export default CreateNotePage;