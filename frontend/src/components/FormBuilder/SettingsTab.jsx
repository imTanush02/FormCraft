
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { FormBuilderContext } from '../../context/FormBuilderContext';
import { tabSlide } from '../../utils/animationVariants';

export default function SettingsTab() {
  const { settings, updateSettings } = useContext(FormBuilderContext);

  return (
    <motion.div variants={tabSlide} initial="hidden" animate="visible" exit="exit" className="space-y-6 max-w-xl">
      <h3 className="text-lg font-display font-semibold text-white">Form Settings</h3>

      {}
      <div className="flex items-center justify-between p-4 glass-card">
        <div>
          <p className="text-sm font-medium text-white">Allow Multiple Submissions</p>
          <p className="text-xs text-surface-400 mt-0.5">Let users submit the form more than once</p>
        </div>
        <button
          onClick={() => updateSettings({ allowMultipleSubmissions: !settings.allowMultipleSubmissions })}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
            settings.allowMultipleSubmissions ? 'bg-brand-500' : 'bg-surface-600'
          }`}
          aria-label="Toggle multiple submissions"
          aria-pressed={settings.allowMultipleSubmissions}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
              settings.allowMultipleSubmissions ? 'translate-x-6' : ''
            }`}
          />
        </button>
      </div>

      {}
      <div className="flex items-center justify-between p-4 glass-card">
        <div>
          <p className="text-sm font-medium text-white">Show Progress Bar</p>
          <p className="text-xs text-surface-400 mt-0.5">Display a progress indicator while filling the form</p>
        </div>
        <button
          onClick={() => updateSettings({ showProgressBar: !settings.showProgressBar })}
          className={`relative w-12 h-6 rounded-full transition-colors duration-200 ${
            settings.showProgressBar ? 'bg-brand-500' : 'bg-surface-600'
          }`}
          aria-label="Toggle progress bar"
          aria-pressed={settings.showProgressBar}
        >
          <span
            className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${
              settings.showProgressBar ? 'translate-x-6' : ''
            }`}
          />
        </button>
      </div>

      {}
      <div>
        <label className="block text-sm font-medium text-surface-300 mb-1.5">Submit Button Text</label>
        <input
          type="text"
          value={settings.submitButtonText}
          onChange={(e) => updateSettings({ submitButtonText: e.target.value })}
          className="input-field"
          placeholder="Submit"
        />
      </div>

      {}
      <div>
        <label className="block text-sm font-medium text-surface-300 mb-1.5">Success Message</label>
        <textarea
          value={settings.successMessage}
          onChange={(e) => updateSettings({ successMessage: e.target.value })}
          className="input-field resize-none"
          rows={3}
          placeholder="Thank you for your submission!"
        />
      </div>
    </motion.div>
  );
}
