
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { overlayVariant, modalVariant } from '../../utils/animationVariants';

export default function CreateFormModal({ isOpen, onClose, onCreate }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    await onCreate(title.trim(), description.trim());
    setTitle('');
    setDescription('');
    setIsSubmitting(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          variants={overlayVariant}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
          onClick={onClose}
        >
          <motion.div
            variants={modalVariant}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="glass-card w-full max-w-lg p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-display font-bold text-white">Create New Form</h3>
              <button onClick={onClose} className="text-surface-400 hover:text-white transition-colors" aria-label="Close modal">
                <i className="ri-close-line text-2xl"></i>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label htmlFor="form-title" className="block text-sm font-medium text-surface-300 mb-1.5">
                  Form Title <span className="text-red-400">*</span>
                </label>
                <input
                  id="form-title"
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="input-field"
                  placeholder="e.g. Customer Feedback Survey"
                  autoFocus
                />
              </div>

              <div>
                <label htmlFor="form-desc" className="block text-sm font-medium text-surface-300 mb-1.5">
                  Description <span className="text-surface-500">(optional)</span>
                </label>
                <textarea
                  id="form-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="input-field resize-none"
                  placeholder="Brief description of your form..."
                  rows={3}
                />
              </div>

              <div className="flex gap-3 justify-end pt-2">
                <button type="button" onClick={onClose} className="btn-ghost">Cancel</button>
                <button type="submit" disabled={!title.trim() || isSubmitting} className="btn-primary">
                  {isSubmitting ? 'Creating...' : 'Create Form'}
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
