import Link from 'next/link';
import Button from '../common/Button';
import { useAuth } from '../../contexts/AuthContext';
import { useRouter } from 'next/router';

const NoteCard = ({ note, onDelete, onShare }) => {
  const { user } = useAuth();
  const router = useRouter();
  const isOwner = user && note.owner_id === user.id;

  const truncateContent = (content, maxLength = 180) => {
    if (content.length <= maxLength) {
      return content;
    }
    return content.substring(0, maxLength) + '...';
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'private': return '🔒';
      case 'shared': return '👥';
      case 'public': return '🌍';
      default: return '📝';
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'private': return 'bg-neutral-100 text-neutral-800 border-neutral-200';
      case 'shared': return 'bg-primary-100 text-primary-800 border-primary-200';
      case 'public': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-neutral-100 text-neutral-800 border-neutral-200';
    }
  };

  return (
    <div className="note-card glass-card rounded-2xl p-6 h-full flex flex-col group relative overflow-hidden border border-neutral-200 hover:shadow-card-hover transition-all duration-300">
      {/* Top indicator line */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 rounded-t-2xl"></div>
      
      {/* Header */}
      <div className="mb-4">
        <div className="flex items-start justify-between mb-3">
          <h2 className="text-xl font-bold text-neutral-900 line-clamp-2 flex-1 group-hover:text-primary transition-colors duration-300">
            {note.title}
          </h2>
          <div className={`ml-3 px-3 py-1 rounded-full text-xs font-semibold border ${getStatusColor(note.visibility_status)} backdrop-blur-sm`}>
            <span className="mr-1">{getStatusIcon(note.visibility_status)}</span>
            {note.visibility_status}
          </div>
        </div>
        
        {/* Content Preview */}
        <p className="text-neutral-700 text-sm leading-relaxed line-clamp-4 mb-4">
          {truncateContent(note.content, 200)}
        </p>
      </div>

      {/* Tags */}
      {note.tags && (
        <div className="mb-4">
          <div className="flex flex-wrap gap-2">
            {note.tags.split(',').slice(0, 3).map((tag, index) => (
              <span
                key={index}
                className="inline-block bg-primary-light text-white text-xs px-3 py-1 rounded-full font-medium shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                #{tag.trim()}
              </span>
            ))}
            {note.tags.split(',').length > 3 && (
              <span className="text-xs text-neutral-500 px-2 py-1">
                +{note.tags.split(',').length - 3} more
              </span>
            )}
          </div>
        </div>
      )}

      {/* Spacer */}
      <div className="flex-grow"></div>

      {/* Timestamps */}
      <div className="mb-4 pt-4 border-t border-neutral-100">
        <div className="flex justify-between text-xs text-neutral-500 space-y-1">
          <div className="flex items-center gap-1">
            <span>📅</span>
            <span>Created: {new Date(note.created_at).toLocaleDateString()}</span>
          </div>
          <div className="flex items-center gap-1">
            <span>✏️</span>
            <span>Updated: {new Date(note.updated_at).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-3 mt-auto">
        <Button
          onClick={() => router.push(`/notes/${note.id}`)}
          className="col-span-2 btn-primary py-2.5 px-4 rounded-lg text-sm font-semibold hover:shadow-md"
        >
          <span className="mr-2">👁️</span>
          View Note
        </Button>
        
        {isOwner && (
          <>
            <Button
              onClick={() => router.push(`/notes/${note.id}/edit`)}
              className="bg-yellow-500 hover:bg-yellow-600 text-neutral-900 py-2.5 px-4 rounded-lg text-sm font-semibold"
            >
              <span className="mr-1">✏️</span>
              Edit
            </Button>
            
            <Button
              onClick={() => onShare(note.id)}
              className="bg-purple-500 hover:bg-purple-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold"
            >
              <span className="mr-1">🤝</span>
              Share
            </Button>
            
            <Button
              onClick={() => onDelete(note.id)}
              className="col-span-2 bg-red-500 hover:bg-red-600 text-white py-2.5 px-4 rounded-lg text-sm font-semibold mt-2"
            >
              <span className="mr-2">🗑️</span>
              Delete Note
            </Button>
          </>
        )}
      </div>
    </div>
  );
};

export default NoteCard;