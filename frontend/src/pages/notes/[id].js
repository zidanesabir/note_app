import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import apiClient from '../../lib/api';
import { useAuth } from '../../contexts/AuthContext';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Notification from '../../components/common/Notification';
import Button from '../../components/common/Button';
import ReactMarkdown from 'react-markdown';
import Swal from 'sweetalert2';

const ViewNotePage = () => {
  const router = useRouter();
  const { id } = router.query;
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const [note, setNote] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
      return;
    }
    if (id && isAuthenticated) {
      fetchNote();
    }
  }, [id, isAuthenticated, authLoading, router]);

  const fetchNote = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/notes/${id}`);
      setNote(response.data);
    } catch (err) {
      console.error('Failed to fetch note:', err.response?.data || err.message);
      setError(err.response?.data?.detail || 'Failed to load note. You might not have permission or it might not exist.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load note. You might not have permission or it might not exist.',
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
      setLoading(false);
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/public/${note.id}`);
    Swal.fire({
      icon: 'success',
      title: 'Link Copied!',
      text: 'Public link copied to clipboard.',
      timer: 2000,
      timerProgressBar: true,
      showConfirmButton: false,
      customClass: {
        popup: 'glass-card',
        title: 'text-neutral-800',
        content: 'text-neutral-700',
      },
    });
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 flex items-center justify-center">
        <div className="glass-card p-8 rounded-2xl shadow-card border border-white/20 backdrop-blur-sm">
          <LoadingSpinner size="lg" className="text-primary" />
          <p className="mt-4 text-neutral-600 text-center font-medium">Loading your note...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-orange-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card p-8 rounded-2xl shadow-card border border-white/20 backdrop-blur-sm text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <Notification message={error} type="error" />
          </div>
          <Button 
            onClick={() => router.back()} 
            className="btn-primary rounded-lg px-6 py-3 font-semibold hover:shadow-lg transition-all duration-200"
          >
            ← Go Back
          </Button>
        </div>
      </div>
    );
  }

  if (!note) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-neutral-50 via-white to-slate-50 flex items-center justify-center p-4">
        <div className="max-w-md w-full glass-card p-8 rounded-2xl shadow-card border border-white/20 backdrop-blur-sm text-center">
          <div className="mb-6">
            <div className="w-16 h-16 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">📝</span>
            </div>
            <p className="text-neutral-700 text-lg font-medium">Note not found</p>
            <p className="text-neutral-500 text-sm mt-2">The note you're looking for doesn't exist or has been removed.</p>
          </div>
          <Button 
            onClick={() => router.push('/notes')} 
            className="btn-primary rounded-lg px-6 py-3 font-semibold hover:shadow-lg transition-all duration-200"
          >
            ← Back to Notes
          </Button>
        </div>
      </div>
    );
  }

  const isOwner = user && note.owner_id === user.id;

  // Get status color and icon
  const getStatusDisplay = (status) => {
    switch (status) {
      case 'public':
        return { color: 'text-green-600 bg-green-50', icon: '🌍', label: 'Public' };
      case 'shared':
        return { color: 'text-blue-600 bg-blue-50', icon: '👥', label: 'Shared' };
      case 'private':
        return { color: 'text-purple-600 bg-purple-50', icon: '🔒', label: 'Private' };
      default:
        return { color: 'text-neutral-600 bg-neutral-50', icon: '📝', label: status };
    }
  };

  const statusDisplay = getStatusDisplay(note.visibility_status);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 py-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="glass-card rounded-2xl shadow-card border border-white/20 backdrop-blur-sm p-8">
            {/* Title and Status */}
            <div className="mb-6">
              <h1 className="text-4xl font-heading font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4 leading-tight">
                {note.title}
              </h1>
              
              {/* Status and Tags Row */}
              <div className="flex flex-wrap items-center gap-4 mb-4">
                <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-semibold ${statusDisplay.color} border border-current/20`}>
                  <span>{statusDisplay.icon}</span>
                  <span>{statusDisplay.label}</span>
                </div>
                
                {note.tags && (
                  <div className="flex flex-wrap gap-2">
                    {note.tags.split(',').map((tag, index) => (
                      <span 
                        key={index}
                        className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-neutral-100 text-neutral-700 border border-neutral-200"
                      >
                        #{tag.trim()}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Shared By Banner */}
              {note.visibility_status === 'shared' && !isOwner && note.owner_email && (
                <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl border border-blue-200/50 animate-fade-in">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">👤</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-800">Shared by</p>
                      <p className="text-base font-semibold text-blue-900">{note.owner_email}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Metadata */}
            <div className="flex flex-wrap gap-6 text-sm text-neutral-600 border-t border-neutral-200 pt-4">
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">📅</span>
                <span>Created: {new Date(note.created_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-neutral-400">✏️</span>
                <span>Updated: {new Date(note.updated_at).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-4xl mx-auto mb-8">
          <div className="glass-card rounded-2xl shadow-card border border-white/20 backdrop-blur-sm p-8">
           	Content: <div className="prose prose-lg max-w-none text-neutral-800 leading-relaxed">
              <ReactMarkdown
               	 components={{
                  h1: ({node, ...props}) => <h1 className="text-3xl font-bold text-neutral-900 mb-4 mt-8 first:mt-0" {...props} />,
                  h2: ({node, ...props}) => <h2 className="text-2xl font-semibold text-neutral-800 mb-3 mt-6" {...props} />,
                  h3: ({node, ...props}) => <h3 className="text-xl font-semibold text-neutral-800 mb-2 mt-4" {...props} />,
                  p: ({node, ...props}) => <p className="mb-4 text-neutral-700 leading-relaxed" {...props} />,
                  blockquote: ({node, ...props}) => (
                    <blockquote className="border-l-4 border-indigo-300 pl-4 py-2 bg-indigo-50 rounded-r-lg italic text-neutral-700 my-4" {...props} />
                  ),
                  code: ({node, inline, ...props}) => 
                    inline 
                      ? <code className="bg-neutral-100 text-indigo-600 px-1.5 py-0.5 rounded text-sm font-mono" {...props} />
                      : <code className="block bg-neutral-900 text-green-400 p-4 rounded-lg overflow-x-auto text-sm font-mono" {...props} />,
                  ul: ({node, ...props}) => <ul className="list-disc pl-6 mb-4 space-y-1" {...props} />,
                  ol: ({node, ...props}) => <ol className="list-decimal pl-6 mb-4 space-y-1" {...props} />,
                  li: ({node, ...props}) => <li className="text-neutral-700" {...props} />,
                }}
              >
                {note.content}
              </ReactMarkdown>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="max-w-4xl mx-auto">
          <div className="glass-card rounded-2xl shadow-card border border-white/20 backdrop-blur-sm p-6">
            <div className="flex flex-wrap gap-4 justify-center sm:justify-start">
              {isOwner && (
                <Button
                  onClick={() => router.push(`/notes/${note.id}/edit`)}
                  className="btn-primary py-3 px-6 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center gap-2"
                >
                  <span>✏️</span>
                  Edit Note
                </Button>
              )}
              
              {note.visibility_status === 'public' && (
                <Button
                  onClick={handleCopyLink}
                  className="bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
                >
                  <span>🔗</span>
                  Copy Public Link
                </Button>
              )}
              
              <Button
                onClick={() => router.push('/notes')}
                className="bg-neutral-500 hover:bg-neutral-600 text-white py-3 px-6 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200 flex items-center gap-2"
              >
                <span>←</span>
                Back to Notes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewNotePage;