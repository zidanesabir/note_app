import { useState, useEffect } from 'react';
import Button from '../common/Button';
import InputField from '../common/InputField';
import Notification from '../common/Notification';

const NoteForm = ({ note, onSubmit, loading, error, isEdit = false }) => {
  const [title, setTitle] = useState(note?.title || '');
  const [content, setContent] = useState(note?.content || '');
  const [tags, setTags] = useState(note?.tags || '');
  const [visibilityStatus, setVisibilityStatus] = useState(note?.visibility_status || 'private');
  const [formError, setFormError] = useState(null);

  useEffect(() => {
    if (note) {
      setTitle(note.title || '');
      setContent(note.content || '');
      setTags(note.tags || '');
      setVisibilityStatus(note.visibility_status || 'private');
    }
  }, [note]);

  useEffect(() => {
    setFormError(error);
  }, [error]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormError(null);
    if (!title || !content) {
      setFormError("Title and Content are required.");
      return;
    }
    onSubmit({
      title,
      content,
      tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag !== '').join(','),
      visibility_status: visibilityStatus,
    });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-40 via-white to-cyan-50 p-4 flex items-center justify-center">
      <div className="w-full max-w-2xl">
        <form
          onSubmit={handleSubmit}
          className="relative bg-white/80 backdrop-blur-xl rounded-3xl shadow-xl border border-white/30 p-8"
        >
          {/* Floating gradient effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 via-pink-400/10 to-indigo-400/10 animate-pulse pointer-events-none rounded-3xl -z-10" />

          <h2 className="text-4xl font-bold text-center bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent mb-6">
            {isEdit ? ' Edit Note' : ' Create New Note'}
          </h2>

          {formError && <Notification message={formError} type="error" />}

          <InputField
            label="Title"
            id="title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            className="mb-6 bg-white/60 backdrop-blur border-2 border-purple-200 rounded-xl shadow-md focus:ring-2 focus:ring-purple-400"
          />

          <div className="mb-6">
            <label htmlFor="content" className="block text-gray-700 text-sm font-bold mb-2">
              Content (Markdown allowed):
            </label>
            <textarea
              id="content"
              className="w-full px-4 py-3 bg-white/60 backdrop-blur border-2 border-purple-200 rounded-xl text-gray-800 focus:outline-none focus:border-purple-500 focus:bg-white/80 transition-all duration-300 shadow-lg resize-none h-48"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
              placeholder="Start writing your brilliant note..."
            ></textarea>
          </div>

          <InputField
            label="Tags (comma-separated)"
            id="tags"
            type="text"
            value={tags}
            onChange={(e) => setTags(e.target.value)}
            placeholder="e.g., work, idea, personal"
            className="mb-6 bg-white/60 backdrop-blur border-2 border-purple-200 rounded-xl shadow-md focus:ring-2 focus:ring-purple-400"
          />

          <div className="mb-8">
            <label htmlFor="visibility" className="block text-gray-700 text-sm font-bold mb-2">Visibility:</label>
            <select
              id="visibility"
              value={visibilityStatus}
              onChange={(e) => setVisibilityStatus(e.target.value)}
              className="w-full px-4 py-3 bg-white/60 backdrop-blur border-2 border-purple-200 rounded-xl text-gray-800 focus:outline-none focus:border-purple-500 focus:bg-white/80 transition-all duration-300 shadow-md"
            >
              <option value="private">🔒 Private</option>
              <option value="shared">👥 Shared</option>
              <option value="public">🌍 Public</option>
            </select>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-4 px-6 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold text-lg rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 disabled:opacity-60"
          >
            {loading ? (isEdit ? 'Saving...' : 'Creating...') : (isEdit ? ' Save Changes' : ' Create Note')}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;
