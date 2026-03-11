
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

export default function FormCard({ form, onDelete, onTogglePublish, onDuplicate }) {
  const navigate = useNavigate();
  const [copied, setCopied] = useState(false);

  const publicUrl = `${window.location.origin}/form/${form.slug}`;

  const handleCopyLink = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(publicUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const timeSince = (dateStr) => {
    const seconds = Math.floor((Date.now() - new Date(dateStr)) / 1000);
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    return `${days}d ago`;
  };

  return (
    <motion.div
      whileHover={{ scale: 1.02, y: -4 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className="glass-card p-5 flex flex-col gap-4 cursor-pointer group"
      onClick={() => navigate(`/builder/${form._id}`)}
    >
      {}
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <h3 className="text-lg font-semibold text-white truncate group-hover:text-brand-300 transition-colors">
            {form.title}
          </h3>
          {form.description && (
            <p className="text-surface-400 text-sm mt-1 line-clamp-2">{form.description}</p>
          )}
        </div>
        <span
          className={`status-badge ml-3 flex-shrink-0 ${
            form.isPublished
              ? 'bg-emerald-500/15 text-emerald-400 ring-1 ring-emerald-500/20'
              : 'bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20'
          }`}
        >
          <i className={`ri-${form.isPublished ? 'global' : 'draft'}-line text-xs`}></i>
          {form.isPublished ? 'Published' : 'Draft'}
        </span>
      </div>

      {}
      <div className="flex items-center gap-4 text-sm text-surface-400">
        <span className="flex items-center gap-1.5">
          <i className="ri-inbox-line"></i>
          {form.submissionCount || 0} responses
        </span>
        <span className="flex items-center gap-1.5">
          <i className="ri-time-line"></i>
          {timeSince(form.updatedAt)}
        </span>
      </div>

      {/* Public URL bar — only shown when published */}
      <AnimatePresence>
        {form.isPublished && form.slug && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20"
            onClick={(e) => e.stopPropagation()}
          >
            <i className="ri-link text-emerald-400 text-sm flex-shrink-0"></i>
            <span className="text-xs text-emerald-300/80 truncate flex-1 font-mono select-all">
              {publicUrl}
            </span>
            <button
              onClick={handleCopyLink}
              className={`flex-shrink-0 text-xs px-2.5 py-1 rounded-md font-medium transition-all ${
                copied
                  ? 'bg-emerald-500/30 text-emerald-300'
                  : 'bg-surface-700/60 text-surface-300 hover:bg-surface-600/60 hover:text-white'
              }`}
              aria-label="Copy public link"
            >
              <i className={`ri-${copied ? 'check' : 'file-copy'}-line mr-1`}></i>
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {}
      <div className="flex items-center gap-2 pt-2 border-t border-surface-700/50">
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/builder/${form._id}`); }}
          className="flex-1 text-sm py-2 rounded-lg text-surface-300 hover:bg-surface-700/50 hover:text-white transition-all flex items-center justify-center gap-1.5"
          aria-label="Edit form"
        >
          <i className="ri-edit-line"></i> Edit
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); navigate(`/responses/${form._id}`); }}
          className="flex-1 text-sm py-2 rounded-lg text-surface-300 hover:bg-surface-700/50 hover:text-white transition-all flex items-center justify-center gap-1.5"
          aria-label="View responses"
        >
          <i className="ri-bar-chart-line"></i> Responses
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onTogglePublish(form._id); }}
          className="flex-1 text-sm py-2 rounded-lg text-surface-300 hover:bg-surface-700/50 hover:text-white transition-all flex items-center justify-center gap-1.5"
          aria-label={form.isPublished ? 'Unpublish form' : 'Publish form'}
        >
          <i className={`ri-${form.isPublished ? 'eye-off' : 'eye'}-line`}></i>
          {form.isPublished ? 'Unpublish' : 'Publish'}
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDuplicate(form._id); }}
          className="text-sm py-2 px-3 rounded-lg text-surface-300 hover:bg-surface-700/50 hover:text-white transition-all"
          aria-label="Duplicate form"
        >
          <i className="ri-file-copy-line"></i>
        </button>
        <button
          onClick={(e) => { e.stopPropagation(); onDelete(form._id); }}
          className="text-sm py-2 px-3 rounded-lg text-surface-300 hover:bg-red-500/10 hover:text-red-400 transition-all"
          aria-label="Delete form"
        >
          <i className="ri-delete-bin-line"></i>
        </button>
      </div>
    </motion.div>
  );
}
