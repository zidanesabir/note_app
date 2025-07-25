import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../../lib/api';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Notification from '../../components/common/Notification';
import Button from '../../components/common/Button';
import ReactMarkdown from 'react-markdown';

// Removed: import { useAuth } from '../../contexts/AuthContext'; // Public notes should not need authentication

const PublicNotePage = () => {
  const router = useRouter();
  const { token_or_id } = router.query;
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (token_or_id) {
      fetchPublicNote();
    }
  }, [token_or_id]);

  const fetchPublicNote = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/notes/public/${token_or_id}`);
      setNote(response.data);
    } catch (err) {
      console.error('Failed to fetch public note:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Public note not found or not accessible.');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
        <Button onClick={() => router.push('/')} className="mt-4 btn-primary rounded-lg">Back to Home</Button>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="container mx-auto p-4 text-center">
        <p className="text-neutral-700 text-lg">Note not found or no public access available.</p>
        <Button onClick={() => router.push('/')} className="mt-4 btn-primary rounded-lg">Back to Home</Button>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 glass-card rounded-2xl shadow-card mt-8 border border-neutral-200">
      <h1 className="text-3xl font-heading font-bold text-gradient mb-4">{note.title}</h1>
      
      <div className="text-sm text-neutral-600 mb-4 flex justify-between items-center border-b border-neutral-200 pb-3">
        <span>Status: <span className="capitalize font-semibold text-primary">{note.visibility_status}</span></span>
        {note.tags && (
          <span>Tags: <span className="font-semibold">{note.tags.split(',').join(', ')}</span></span>
        )}
      </div>

      <div className="prose max-w-none text-neutral-800 leading-relaxed mb-6 pt-4">
        <ReactMarkdown>{note.content}</ReactMarkdown>
      </div>

      <div className="text-xs text-neutral-500 border-t pt-3 mt-4">
        <p>Created: {new Date(note.created_at).toLocaleString()}</p>
        <p>Last Updated: {new Date(note.updated_at).toLocaleString()}</p>
      </div>

      <div className="flex flex-wrap gap-3 mt-6">
        <Button
          onClick={() => router.push('/login')}
          className="btn-primary py-2 px-4 rounded-lg"
        >
          Login to manage your notes
        </Button>
      </div>
    </div>
  );
};

export default PublicNotePage;