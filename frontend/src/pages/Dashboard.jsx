
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import useForm from '../hooks/useForm';
import DashboardItem from '../components/Dashboard/DashboardItem';
import CreateFormModal from '../components/Dashboard/CreateFormModal';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { listFadeIn, itemSlideUp } from '../utils/animationVariants';

export default function Dashboard() {
  const { currentUser, logout } = useAuth();
  const { forms, isLoading, fetchForms, createForm, deleteForm, togglePublish, duplicateForm } = useForm();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchForms();
  }, [fetchForms]);

  const handleCreate = async (title, description) => {
    const newForm = await createForm(title, description);
    if (newForm) {
      navigate(`/builder/${newForm._id}`);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Delete this form and all its responses? This cannot be undone.')) {
      await deleteForm(id);
      fetchForms();
    }
  };

  const handleDuplicate = async (id) => {
    await duplicateForm(id);
    fetchForms();
  };
  const filteredForms = forms.filter((f) =>
    f.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-surface-950">
      {}
      <header className="sticky top-0 z-40 bg-surface-900/80 backdrop-blur-xl border-b border-surface-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 bg-brand-500/20 rounded-xl flex items-center justify-center">
              <i className="ri-quill-pen-line text-lg text-brand-400"></i>
            </div>
            <span className="text-xl font-display font-bold text-white">FormCraft</span>
          </div>

          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-surface-400">
              Hey, <span className="text-surface-200 font-medium">{currentUser?.name}</span>
            </span>
            <button
              onClick={logout}
              className="text-sm text-surface-400 hover:text-red-400 transition-colors flex items-center gap-1.5"
            >
              <i className="ri-logout-box-r-line"></i>
              Logout
            </button>
          </div>
        </div>
      </header>

      {}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8"
        >
          <div>
            <h1 className="text-3xl font-display font-bold text-white">Your Forms</h1>
            <p className="text-surface-400 mt-1">
              {forms.length} form{forms.length !== 1 ? 's' : ''} created
            </p>
          </div>

          <button
            onClick={() => setShowCreateModal(true)}
            className="btn-primary flex items-center gap-2"
          >
            <i className="ri-add-line text-lg"></i>
            New Form
          </button>
        </motion.div>

        {}
        {forms.length > 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <div className="relative max-w-md">
              <i className="ri-search-line absolute left-3 top-1/2 -translate-y-1/2 text-surface-400"></i>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search forms..."
                className="input-field pl-10"
              />
            </div>
          </motion.div>
        )}

        {}
        {isLoading ? (
          <div className="flex justify-center py-20">
            <LoadingSpinner size="lg" />
          </div>
        ) : filteredForms.length > 0 ? (
          <motion.div
            variants={listFadeIn}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
          >
            {filteredForms.map((form) => (
              <motion.div key={form._id} variants={itemSlideUp}>
                <DashboardItem
                  form={form}
                  onDelete={handleDelete}
                  onTogglePublish={togglePublish}
                  onDuplicate={handleDuplicate}
                />
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-20"
          >
            <div className="w-20 h-20 bg-surface-800/50 rounded-2xl flex items-center justify-center mx-auto mb-6">
              <i className="ri-file-add-line text-4xl text-surface-500"></i>
            </div>
            <h3 className="text-xl font-display font-semibold text-surface-300 mb-2">
              {searchQuery ? 'No forms match your search' : 'No forms yet'}
            </h3>
            <p className="text-surface-500 mb-6">
              {searchQuery
                ? 'Try a different search term'
                : 'Create your first form to get started'}
            </p>
            {!searchQuery && (
              <button onClick={() => setShowCreateModal(true)} className="btn-primary">
                <i className="ri-add-line mr-2"></i>
                Create Your First Form
              </button>
            )}
          </motion.div>
        )}
      </main>

      <CreateFormModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreate}
      />
    </div>
  );
}
