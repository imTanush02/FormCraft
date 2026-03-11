
import { useState, useEffect, useMemo } from 'react';
import { useParams } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../utils/api';
import SmartInput from '../components/FormRenderer/SmartInput';
import useConditionalLogic from '../hooks/useConditionalLogic';
import { validateAllFields } from '../utils/validators';
import LoadingSpinner from '../components/Common/LoadingSpinner';
import { listFadeIn, itemSlideUp, checkMarkPop } from '../utils/animationVariants';

export default function FormRenderer() {
  const { slug } = useParams();
  const [form, setForm] = useState(null);
  const [answers, setAnswers] = useState({});
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { checkIfShouldShow } = useConditionalLogic();
  useEffect(() => {
    const loadForm = async () => {
      try {
        const { data } = await api.get(`/forms/public/${slug}`);
        setForm(data.form);
      } catch (err) {
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    };
    loadForm();
  }, [slug]);
  const visibleFields = useMemo(() => {
    if (!form) return [];
    return form.fields.filter((field) => {
      const { visible } = checkIfShouldShow(field.conditionalRules, answers);
      return visible;
    });
  }, [form, answers, checkIfShouldShow]);
  const filledCount = useMemo(() => {
    return visibleFields.filter((f) => {
      const v = answers[f.fieldId];
      return v !== undefined && v !== null && v !== '' && (!Array.isArray(v) || v.length > 0);
    }).length;
  }, [visibleFields, answers]);

  const progressPercent = visibleFields.length > 0 ? Math.round((filledCount / visibleFields.length) * 100) : 0;

  const handleFieldChange = (fieldId, value) => {
    setAnswers((prev) => ({ ...prev, [fieldId]: value }));
    if (errors[fieldId]) {
      setErrors((prev) => { const e = { ...prev }; delete e[fieldId]; return e; });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const fieldErrors = validateAllFields(answers, visibleFields);
    if (Object.keys(fieldErrors).length > 0) {
      setErrors(fieldErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      await api.post(`/responses/${form.id}`, { answers });
      setIsSuccess(true);
    } catch (err) {
      const msg = err.response?.data?.message || 'Failed to submit — please try again';
      setErrors({ _global: msg });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <i className="ri-file-unknow-line text-5xl text-gray-300 mb-4 block"></i>
          <h2 className="text-xl font-semibold text-gray-600 mb-2">Form Not Found</h2>
          <p className="text-gray-400">This form doesn't exist or is no longer published.</p>
        </div>
      </div>
    );
  }

  if (isSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
        <motion.div
          variants={checkMarkPop}
          initial="hidden"
          animate="visible"
          className="text-center max-w-md"
        >
          <div className="w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-6">
            <motion.i
              className="ri-check-line text-4xl text-green-600"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 400, damping: 15, delay: 0.2 }}
            />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">
            {form.settings?.successMessage || 'Thank you! Your response has been recorded.'}
          </h2>
          <p className="text-gray-500 text-sm">You may close this page now.</p>
        </motion.div>
      </div>
    );
  }

  const design = form.design || {};
  const settings = form.settings || {};

  const formStyle = {
    backgroundColor: design.bgColor || '#ffffff',
    fontFamily: design.fontFamily || 'Inter',
    borderRadius: `${design.borderRadius || 8}px`,
    padding: `${design.formPadding || 32}px`,
    maxWidth: `${design.maxWidth || 640}px`,
  };

  const accentColor = design.accentColor || '#6366f1';

  return (
    <div className="min-h-screen bg-gray-50 flex items-start justify-center p-4 sm:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full shadow-xl"
        style={formStyle}
      >
        {}
        {settings.showProgressBar && (
          <div className="w-full h-2 rounded-full bg-gray-200 mb-6 overflow-hidden">
            <motion.div
              className="h-full rounded-full"
              style={{ backgroundColor: accentColor }}
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        )}

        <h1 className="text-2xl font-bold mb-2" style={{ color: accentColor, fontFamily: design.fontFamily }}>
          {form.title}
        </h1>
        {form.description && (
          <p className="text-sm text-gray-500 mb-6" style={{ fontFamily: design.fontFamily }}>
            {form.description}
          </p>
        )}

        {}
        {errors._global && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm flex items-center gap-2">
            <i className="ri-error-warning-line"></i>
            {errors._global}
          </div>
        )}

        {}
        <form onSubmit={handleSubmit}>
          <motion.div
            variants={listFadeIn}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap"
            style={{ gap: `${design.fieldSpacing || 16}px` }}
          >
            <AnimatePresence>
              {visibleFields.map((field) => (
                <motion.div
                  key={field.fieldId}
                  variants={itemSlideUp}
                  initial="hidden"
                  animate="visible"
                  exit={{ opacity: 0, height: 0, transition: { duration: 0.2 } }}
                  style={{
                    width: field.widthPercent === 100
                      ? '100%'
                      : `calc(${field.widthPercent}% - ${(design.fieldSpacing || 16) / 2}px)`,
                  }}
                >
                  <SmartInput
                    field={field}
                    value={answers[field.fieldId]}
                    onChange={(val) => handleFieldChange(field.fieldId, val)}
                    error={errors[field.fieldId]}
                    designConfig={design}
                  />
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {}
          <button
            type="submit"
            disabled={isSubmitting}
            className="mt-6 w-full py-3 text-white font-medium transition-all hover:opacity-90 disabled:opacity-50"
            style={{ backgroundColor: accentColor, borderRadius: `${design.borderRadius || 8}px` }}
          >
            {isSubmitting ? (
              <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 1.4, repeat: Infinity }}>
                Submitting...
              </motion.span>
            ) : (
              settings.submitButtonText || 'Submit'
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
