import { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';
import apiClient from '../../lib/api';
import NoteFilter from '../../components/notes/NoteFilter';
import SearchBar from '../../components/notes/SearchBar';
import Button from '../../components/common/Button';
import LoadingSpinner from '../../components/common/LoadingSpinner';
import Notification from '../../components/common/Notification';
import InputField from '../../components/common/InputField';
import Swal from 'sweetalert2';
import { X } from 'lucide-react';

const MyNotesPage = () => {
  const { isAuthenticated, loading: authLoading, user } = useAuth();
  const router = useRouter();
  const [notes, setNotes] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [notesLoading, setNotesLoading] = useState(true);
  const [error, setError] = useState(null);
  const [notification, setNotification] = useState(null);
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [noteToShareId, setNoteToShareId] = useState(null);
  const [shareEmail, setShareEmail] = useState('');
  const [shareLoading, setShareLoading] = useState(false);
  const [shareError, setShareError] = useState(null);
  const [showFullContent, setShowFullContent] = useState({});

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push('/login');
    }
  }, [authLoading, isAuthenticated, router]);

  useEffect(() => {
    if (isAuthenticated) {
      fetchNotes();
    }
  }, [isAuthenticated, filter, searchQuery]);

  const fetchNotes = async () => {
    setNotesLoading(true);
    setError(null);
    try {
      const params = {};
      if (filter !== 'all') {
        params.status = filter;
      }
      if (searchQuery) {
        params.q = searchQuery;
      }
      const response = await apiClient.get('/notes/', { params });
      setNotes(response.data);
    } catch (err) {
      console.error('Failed to fetch notes:', err.response?.data || err.message);
      setError('Failed to load notes. Please try again.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Failed to load notes. Please try again.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'bg-white/90 backdrop-blur-md shadow-xl',
          title: 'text-neutral-800 font-heading',
          content: 'text-neutral-700',
        },
      });
    } finally {
      setNotesLoading(false);
    }
  };

  const handleDelete = async (noteId) => {
    const result = await Swal.fire({
      title: 'Are you sure?',
      text: 'This note will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      cancelButtonText: 'Cancel',
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#a3a3a3',
      customClass: {
        popup: 'bg-white/90 backdrop-blur-md shadow-xl',
        title: 'text-neutral-800 font-heading',
        content: 'text-neutral-700',
      },
    });

    if (result.isConfirmed) {
      try {
        await apiClient.delete(`/notes/${noteId}`);
        Swal.fire({
          icon: 'success',
          title: 'Deleted!',
          text: 'Your note has been deleted.',
          timer: 2000,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: {
            popup: 'bg-white/90 backdrop-blur-md shadow-xl',
            title: 'text-neutral-800 font-heading',
            content: 'text-neutral-700',
          },
        });
        fetchNotes();
      } catch (err) {
        console.error('Failed to delete note:', err.response?.data || err.message);
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'Failed to delete note. You might not have permission.',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: {
            popup: 'bg-white/90 backdrop-blur-md shadow-xl',
            title: 'text-neutral-800 font-heading',
            content: 'text-neutral-700',
          },
        });
      }
    }
  };

  const handleShareClick = (noteId) => {
    setNoteToShareId(noteId);
    setShareModalOpen(true);
    setShareEmail('');
    setShareError(null);
  };

  const handleShareSubmit = async (e) => {
    e.preventDefault();
    setShareLoading(true);
    setShareError(null);
    try {
      const userLookupResponse = await apiClient.get(`/auth/users?email=${shareEmail}`);
      const targetUser = userLookupResponse.data[0];

      if (!targetUser) {
        setShareError("User with that email not found.");
        Swal.fire({
          icon: 'error',
          title: 'Error',
          text: 'User with that email not found.',
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
          customClass: {
            popup: 'bg-white/90 backdrop-blur-md shadow-xl',
            title: 'text-neutral-800 font-heading',
            content: 'text-neutral-700',
          },
        });
        return;
      }

      await apiClient.post(`/notes/${noteToShareId}/share`, { user_id: targetUser.id });
      Swal.fire({
        icon: 'success',
        title: 'Shared!',
        text: `Note shared with ${targetUser.email}!`,
        timer: 2000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'bg-white/90 backdrop-blur-md shadow-xl',
          title: 'text-neutral-800 font-heading',
          content: 'text-neutral-700',
        },
      });
      setShareModalOpen(false);
      fetchNotes();
    } catch (err) {
      console.error('Failed to share note:', err.response?.data || err.message);
      setShareError(err.response?.data?.detail || 'Failed to share note.');
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.detail || 'Failed to share note. Ensure user exists and note not already shared.',
        timer: 3000,
        timerProgressBar: true,
        showConfirmButton: false,
        customClass: {
          popup: 'bg-white/90 backdrop-blur-md shadow-xl',
          title: 'text-neutral-800 font-heading',
          content: 'text-neutral-700',
        },
      });
    } finally {
      setShareLoading(false);
    }
  };

  const truncateContent = (content, maxLength = 100) => {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  };

  const toggleContent = (noteId) => {
    setShowFullContent((prevState) => ({
      ...prevState,
      [noteId]: !prevState[noteId],
    }));
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'private':
        return '🔒';
      case 'shared':
        return '👥';
      case 'public':
        return '🌍';
      default:
        return '📝';
    }
  };

  const getStatusColorClass = (status) => {
    switch (status) {
      case 'private':
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      case 'shared':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'public':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  if (authLoading || !isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-purple-50">
        <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-neutral-200">
          <LoadingSpinner size="lg" className="text-blue-600 animate-pulse" />
          <p className="text-gradient font-heading font-semibold mt-4">Loading your notes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-6 px-4 sm:px-6 lg:px-8 font-sans bg-gradient-to-br from-blue-40 to-purple-50">
      {/* Floating background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
        <div className="absolute top-1/5 left-1/5 w-72 h-72 bg-blue-200/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute top-3/4 right-1/5 w-96 h-96 bg-purple-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-2/5 left-3/4 w-64 h-64 bg-green-200/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
      </div>

      <div className="container mx-auto max-w-7xl relative z-10">
        {/* Header Section */}
        <div className="text-center mb-12 animate-fade-in">
          <h1 className="text-4xl sm:text-5xl font-heading font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
            My Notes
          </h1>
          <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto">
            Capture, organize, and share your ideas seamlessly
          </p>
        </div>

        {/* Notification */}
        {notification && (
          <div className="mb-8 animate-slide-in">
            <Notification
              message={notification.message}
              type={notification.type}
              duration={4000}
            />
          </div>
        )}

        {/* Control Panel */}
        <div className="mb-10 bg-white/90 backdrop-blur-md p-6 rounded-2xl shadow-xl border border-neutral-200 animate-slide-in" style={{ animationDelay: '0.2s' }}>
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4 sm:gap-6">
            <div className="w-full sm:w-1/3">
              <h3 className="text-base font-semibold text-neutral-700 mb-2">Filter Notes</h3>
              <NoteFilter currentFilter={filter} onFilterChange={setFilter} />
            </div>
            <div className="w-full sm:w-1/3">
              <h3 className="text-base font-semibold text-neutral-700 mb-2">Search Notes</h3>
              <SearchBar onSearch={setSearchQuery} />
            </div>
            <Button
              className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg text-base font-semibold shadow-lg hover:shadow-xl transition-all duration-300 w-full sm:w-auto"
              onClick={() => router.push('/notes/create')}
            >
              Create Note
            </Button>
          </div>
        </div>

        {/* Notes Display */}
        <div className="animate-slide-in" style={{ animationDelay: '0.4s' }}>
          {notesLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="bg-white/90 backdrop-blur-md p-8 rounded-2xl shadow-xl border border-neutral-200">
                <LoadingSpinner size="lg" className="text-blue-600 animate-pulse" />
                <p className="text-gradient font-heading font-semibold mt-4">Loading notes...</p>
              </div>
            </div>
          ) : error ? (
            <div className="text-center py-16">
              <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-red-200 max-w-md mx-auto">
                <Notification message={error} type="error" />
                <Button
                  onClick={fetchNotes}
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg mt-6"
                >
                  Try Again
                </Button>
              </div>
            </div>
          ) : notes.length === 0 ? (
            <div className="text-center py-16">
              <div className="bg-white/90 backdrop-blur-md p-10 rounded-2xl shadow-xl border border-neutral-200 max-w-md mx-auto">
                <h3 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4">
                  No Notes Yet
                </h3>
                <p className="text-neutral-600 mb-6">Start by creating your first note!</p>
                <Button
                  className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white px-6 py-3 rounded-lg font-semibold shadow-lg hover:shadow-xl"
                  onClick={() => router.push('/notes/create')}
                >
                  Create Note
                </Button>
              </div>
            </div>
          ) : (
            <>
              {/* Desktop Table */}
              <div className="hidden md:block bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-neutral-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-neutral-100">
                    <thead className="bg-blue-50">
                      <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider rounded-tl-2xl">
                          Title
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                          Content
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                          Status
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                          Tags
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider">
                          Updated
                        </th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-neutral-700 uppercase tracking-wider rounded-tr-2xl">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-neutral-100">
                      {notes.map((note, index) => {
                        const isOwner = user && note.owner_id === user.id;
                        const displayContent = showFullContent[note.id] ? note.content : truncateContent(note.content);
                        const needsTruncation = note.content.length > 100;

                        return (
                          <tr
                            key={note.id}
                            className="hover:bg-blue-50/50 transition-colors duration-200 animate-slide-in"
                            style={{ animationDelay: `${index * 0.05}s` }}
                          >
                            <td className="px-6 py-4 text-sm font-medium text-neutral-900">{note.title}</td>
                            <td className="px-6 py-4 text-sm text-neutral-700 max-w-xs">
                              <div className="relative">
                                {displayContent}
                                {needsTruncation && (
                                  <button
                                    onClick={() => toggleContent(note.id)}
                                    className="text-blue-600 hover:underline text-xs ml-2"
                                  >
                                    {showFullContent[note.id] ? '(Less)' : '(More)'}
                                  </button>
                                )}
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span
                                className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColorClass(
                                  note.visibility_status
                                )}`}
                              >
                                <span className="mr-1">{getStatusIcon(note.visibility_status)}</span>
                                {note.visibility_status}
                              </span>
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-700">
                              {note.tags ? (
                                note.tags
                                  .split(',')
                                  .slice(0, 2)
                                  .map((tag, i) => (
                                    <span
                                      key={i}
                                      className="inline-block bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs mr-1"
                                    >
                                      #{tag.trim()}
                                    </span>
                                  ))
                              ) : (
                                '-'
                              )}
                            </td>
                            <td className="px-6 py-4 text-sm text-neutral-500">
                              {new Date(note.updated_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex flex-col space-y-2">
                                <Button
                                  onClick={() => router.push(`/notes/${note.id}`)}
                                  className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-4 rounded-lg text-xs font-semibold"
                                >
                                  View
                                </Button>
                                {isOwner && (
                                  <>
                                    <Button
                                      onClick={() => router.push(`/notes/${note.id}/edit`)}
                                      className="bg-yellow-500 hover:bg-yellow-600 text-neutral-900 py-1.5 px-4 rounded-lg text-xs font-semibold"
                                    >
                                      Edit
                                    </Button>
                                    <Button
                                      onClick={() => handleShareClick(note.id)}
                                      className="bg-purple-500 hover:bg-purple-600 text-white py-1.5 px-4 rounded-lg text-xs font-semibold"
                                    >
                                      Share
                                    </Button>
                                    <Button
                                      onClick={() => handleDelete(note.id)}
                                      className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded-lg text-xs font-semibold"
                                    >
                                      Delete
                                    </Button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Mobile Card Layout */}
              <div className="md:hidden space-y-4">
                {notes.map((note, index) => {
                  const isOwner = user && note.owner_id === user.id;
                  const displayContent = showFullContent[note.id] ? note.content : truncateContent(note.content);
                  const needsTruncation = note.content.length > 100;

                  return (
                    <div
                      key={note.id}
                      className="bg-white/90 backdrop-blur-md rounded-2xl shadow-xl border border-neutral-200 p-4 animate-slide-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <h3 className="text-lg font-semibold text-neutral-900 mb-2">{note.title}</h3>
                      <p className="text-sm text-neutral-700 mb-3">
                        {displayContent}
                        {needsTruncation && (
                          <button
                            onClick={() => toggleContent(note.id)}
                            className="text-blue-600 hover:underline text-xs ml-2"
                          >
                            {showFullContent[note.id] ? '(Less)' : '(More)'}
                          </button>
                        )}
                      </p>
                      <div className="flex justify-between items-center mb-3">
                        <span
                          className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColorClass(
                            note.visibility_status
                          )}`}
                        >
                          <span className="mr-1">{getStatusIcon(note.visibility_status)}</span>
                          {note.visibility_status}
                        </span>
                        <span className="text-sm text-neutral-500">
                          {new Date(note.updated_at).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex flex-wrap gap-2 mb-3">
                        {note.tags ? (
                          note.tags
                            .split(',')
                            .slice(0, 2)
                            .map((tag, i) => (
                              <span
                                key={i}
                                className="inline-block bg-blue-100 text-blue-700 rounded-full px-2 py-0.5 text-xs"
                              >
                                #{tag.trim()}
                              </span>
                            ))
                        ) : (
                          <span className="text-sm text-neutral-500">-</span>
                        )}
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <Button
                          onClick={() => router.push(`/notes/${note.id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white py-1.5 px-4 rounded-lg text-xs font-semibold"
                        >
                          View
                        </Button>
                        {isOwner && (
                          <>
                            <Button
                              onClick={() => router.push(`/notes/${note.id}/edit`)}
                              className="bg-yellow-500 hover:bg-yellow-600 text-neutral-900 py-1.5 px-4 rounded-lg text-xs font-semibold"
                            >
                              Edit
                            </Button>
                            <Button
                              onClick={() => handleShareClick(note.id)}
                              className="bg-purple-500 hover:bg-purple-600 text-white py-1.5 px-4 rounded-lg text-xs font-semibold"
                            >
                              Share
                            </Button>
                            <Button
                              onClick={() => handleDelete(note.id)}
                              className="bg-red-500 hover:bg-red-600 text-white py-1.5 px-4 rounded-lg text-xs font-semibold"
                            >
                              Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>

        {/* Enhanced Share Modal */}
        {shareModalOpen && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
            <div className="bg-white/90 backdrop-blur-md p-6 rounded-2xl w-full max-w-md shadow-2xl border border-neutral-200 relative">
              <button
                onClick={() => setShareModalOpen(false)}
                className="absolute top-4 right-4 text-neutral-600 hover:text-neutral-800"
                aria-label="Close"
              >
                <X size={20} />
              </button>
              <h3 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 mb-4 text-center font-heading">
                Share Note
              </h3>
              <form onSubmit={handleShareSubmit} className="space-y-4">
                <InputField
                  label="User Email"
                  id="shareEmail"
                  type="email"
                  value={shareEmail}
                  onChange={(e) => setShareEmail(e.target.value)}
                  required
                  placeholder="user@example.com"
                  className="bg-neutral-100/50 border border-neutral-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
                {shareError && <p className="text-red-500 text-sm text-center">{shareError}</p>}
                <div className="flex gap-3 mt-4">
                  <Button
                    type="button"
                    onClick={() => setShareModalOpen(false)}
                    className="flex-1 bg-neutral-200 hover:bg-neutral-300 text-neutral-700 py-2.5 rounded-lg font-semibold transition-all duration-200"
                    disabled={shareLoading}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white py-2.5 rounded-lg font-semibold transition-all duration-200"
                    disabled={shareLoading}
                  >
                    {shareLoading ? (
                      <div className="flex items-center justify-center gap-2">
                        <LoadingSpinner size="sm" className="text-white" />
                        Sharing...
                      </div>
                    ) : (
                      'Share'
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyNotesPage;