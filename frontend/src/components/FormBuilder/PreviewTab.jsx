
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { FormBuilderContext } from '../../context/FormBuilderContext';
import DynamicField from '../FormRenderer/DynamicField';
import { tabSlide } from '../../utils/animationVariants';

export default function PreviewTab() {
  const { formTitle, formDescription, fields, design, settings } = useContext(FormBuilderContext);

  const formStyle = {
    backgroundColor: design.bgColor,
    fontFamily: design.fontFamily,
    borderRadius: `${design.borderRadius}px`,
    padding: `${design.formPadding}px`,
    maxWidth: `${design.maxWidth}px`,
  };

  const accentStyle = {
    backgroundColor: design.accentColor,
    borderRadius: `${design.borderRadius}px`,
  };

  return (
    <motion.div variants={tabSlide} initial="hidden" animate="visible" exit="exit" className="flex justify-center">
      <div className="w-full" style={{ maxWidth: `${design.maxWidth}px` }}>
        {}
        <div className="text-center mb-4">
          <span className="status-badge bg-surface-700/50 text-surface-300">
            <i className="ri-eye-line text-xs"></i> Live Preview
          </span>
        </div>

        {}
        <div style={formStyle} className="shadow-2xl border border-surface-200/10">
          {}
          {settings.showProgressBar && (
            <div className="w-full h-2 rounded-full bg-gray-200 mb-6 overflow-hidden">
              <div className="h-full rounded-full transition-all duration-500" style={{ ...accentStyle, width: '30%' }} />
            </div>
          )}

          <h2
            className="text-2xl font-bold mb-2"
            style={{ color: design.accentColor, fontFamily: design.fontFamily }}
          >
            {formTitle || 'Untitled Form'}
          </h2>

          {formDescription && (
            <p className="text-sm mb-6" style={{ color: '#6b7280', fontFamily: design.fontFamily }}>
              {formDescription}
            </p>
          )}

          {}
          <div className="flex flex-wrap" style={{ gap: `${design.fieldSpacing}px` }}>
            {fields.length === 0 ? (
              <p className="text-gray-400 text-sm italic w-full text-center py-8">
                No fields added yet — go to the Fields tab to add some.
              </p>
            ) : (
              fields.map((field) => (
                <div
                  key={field.fieldId}
                  style={{
                    width: field.widthPercent === 100
                      ? '100%'
                      : `calc(${field.widthPercent}% - ${design.fieldSpacing / 2}px)`,
                  }}
                >
                  <DynamicField
                    field={field}
                    value=""
                    onChange={() => {}}
                    designConfig={design}
                    previewMode
                  />
                </div>
              ))
            )}
          </div>

          {}
          {fields.length > 0 && (
            <button
              className="mt-6 w-full py-3 text-white font-medium transition-all hover:opacity-90"
              style={accentStyle}
              disabled
            >
              {settings.submitButtonText || 'Submit'}
            </button>
          )}
        </div>
      </div>
    </motion.div>
  );
}
