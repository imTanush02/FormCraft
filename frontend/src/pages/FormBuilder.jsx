
import { useState, useEffect, useCallback, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import useForm from '../hooks/useForm';
import { FormBuilderProvider, FormBuilderContext } from '../context/FormBuilderContext';
import FieldsTab from '../components/FormBuilder/FieldsTab';
import DesignTab from '../components/FormBuilder/DesignTab';
import SettingsTab from '../components/FormBuilder/SettingsTab';
import PreviewTab from '../components/FormBuilder/PreviewTab';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { tabSlide } from '../utils/animationVariants';

const TABS = [
  { id: 'fields', label: 'Fields', icon: 'ri-list-check-2' },
  { id: 'design', label: 'Design', icon: 'ri-palette-line' },
  { id: 'settings', label: 'Settings', icon: 'ri-settings-3-line' },
  { id: 'preview', label: 'Preview', icon: 'ri-eye-line' },
];

function BuilderInner({ formId }) {
  const [activeTab, setActiveTab] = useState('fields');
  const { updateForm } = useForm();
  const navigate = useNavigate();
  const ctx = useContext(FormBuilderContext);

  const handleSave = useCallback(async () => {
    const payload = ctx.getFormPayload();
    const updated = await updateForm(formId, payload);
    if (updated) {
      ctx.markSaved();
    }
  }, [formId, ctx, updateForm]);

  const renderTab = () => {
    switch (activeTab) {
      case 'fields': return <FieldsTab />;
      case 'design': return <DesignTab />;
      case 'settings': return <SettingsTab />;
      case 'preview': return <PreviewTab />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-surface-950 flex flex-col">
      {}
      <header className="sticky top-0 z-40 bg-surface-900/80 backdrop-blur-xl border-b border-surface-700/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/dashboard')}
              className="text-surface-400 hover:text-white transition-colors"
              aria-label="Back to dashboard"
            >
              <i className="ri-arrow-left-line text-xl"></i>
            </button>
            <div>
              <input
                type="text"
                value={ctx.formTitle}
                onChange={(e) => { ctx.setFormTitle(e.target.value); ctx.setHasUnsavedChanges(true); }}
                className="bg-transparent text-lg font-display font-bold text-white border-none outline-none focus:ring-0 w-64"
                placeholder="Form Title"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            {ctx.hasUnsavedChanges && (
              <span className="text-xs text-amber-400 flex items-center gap-1">
                <i className="ri-error-warning-line"></i> Unsaved changes
              </span>
            )}
            <button onClick={handleSave} className="btn-primary text-sm flex items-center gap-2">
              <i className="ri-save-line"></i>
              Save
            </button>
          </div>
        </div>

        {}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex gap-1 -mb-px">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium border-b-2 transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'border-brand-500 text-brand-300'
                    : 'border-transparent text-surface-400 hover:text-surface-200 hover:border-surface-600'
                }`}
              >
                <i className={`${tab.icon} text-base`}></i>
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </header>

      {}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-6">
        <AnimatePresence mode="wait">
          <motion.div key={activeTab} variants={tabSlide} initial="hidden" animate="visible" exit="exit">
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
}

export default function FormBuilder() {
  const { id } = useParams();
  const { fetchFormById, isLoading } = useForm();
  const [formData, setFormData] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const loadForm = async () => {
      const form = await fetchFormById(id);
      if (!form) {
        toast.error('Form not found');
        navigate('/dashboard');
        return;
      }
      setFormData(form);
    };
    loadForm();
  }, [id]);

  if (isLoading || !formData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-surface-950">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <FormBuilderProvider initialForm={formData}>
      <BuilderInner formId={id} />
    </FormBuilderProvider>
  );
}
