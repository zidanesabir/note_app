import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../../../lib/api';
import { useAuth } from '../../../contexts/AuthContext'; // Corrected relative path
import NoteForm from '../../../components/notes/NoteForm';
import LoadingSpinner from '../../../components/common/LoadingSpinner';
import Notification from '../../../components/common/Notification';

const EditNotePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [updateError, setUpdateError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (id && isAuthenticated) {
      fetchNoteForEdit();
    }
  }, [id, isAuthenticated, authLoading, router, user]);

  const fetchNoteForEdit = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/notes/${id}`);
      if (user && response.data.owner_id !== user.id) {
        setError("You are not authorized to edit this note.");
        setNote(null);
      } else {
        setNote(response.data);
      }
    } catch (err) {
      console.error('Failed to fetch note for edit:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Failed to load note for editing. It might not exist or you lack permission.');
      setNote(null);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateSubmit = async (noteData) => {
    setUpdateLoading(true);
    setUpdateError(null);
    try {
      await apiClient.put(`/notes/${id}`, noteData);
      router.push(`/notes/${id}`);
    } catch (err) {
      console.error('Failed to update note:', err.response?.data || err.message);
      setUpdateError('Failed to update note. Please check your input.');
    } finally {
      setUpdateLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-neutral-50">
        <LoadingSpinner size="lg" className="text-primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 text-center">
        <Notification message={error} type="error" />
        <Button onClick={() => router.back()} className="mt-4 btn-primary rounded-lg">Go Back</Button>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-neutral-700 text-xl">Note not found or not authorized to edit.</p>
        <Button onClick={() => router.push('/notes')} className="mt-4 btn-primary rounded-lg">Back to Notes</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8">
      <NoteForm
        note={note}
        onSubmit={handleUpdateSubmit}
        loading={updateLoading}
        error={updateError}
        isEdit={true}
      />
    </div>
  );
};

export default EditNotePage;