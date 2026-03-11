
import { createContext, useState, useCallback } from 'react';
import { nanoid } from '../utils/idGen';
import fieldTypeConfig from '../utils/fieldTypeConfig';

export const FormBuilderContext = createContext(null);

export function FormBuilderProvider({ children, initialForm }) {

  const [formTitle, setFormTitle] = useState(initialForm?.title || 'Untitled Form');
  const [formDescription, setFormDescription] = useState(initialForm?.description || '');
  const [fields, setFields] = useState(initialForm?.fields || []);
  const [design, setDesign] = useState(initialForm?.design || {
    bgColor: '#ffffff',
    accentColor: '#6366f1',
    fontFamily: 'Inter',
    borderRadius: 8,
    fieldSpacing: 16,
    formPadding: 32,
    maxWidth: 640,
  });
  const [settings, setSettings] = useState(initialForm?.settings || {
    allowMultipleSubmissions: true,
    showProgressBar: false,
    submitButtonText: 'Submit',
    successMessage: 'Thank you! Your response has been recorded.',
  });
  const [selectedFieldId, setSelectedFieldId] = useState(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const addField = useCallback((kind) => {
    const config = fieldTypeConfig[kind];
    if (!config) return;

    const newField = {
      fieldId: nanoid(),
      kind,
      label: config.label,
      placeholder: config.defaultProps.placeholder,
      helpText: config.defaultProps.helpText,
      isRequired: false,
      widthPercent: 100,
      textAlign: 'left',
      options: config.defaultProps.options || [],
      order: fields.length,
      conditionalRules: [],
    };

    setFields((prev) => [...prev, newField]);
    setSelectedFieldId(newField.fieldId);
    setHasUnsavedChanges(true);
  }, [fields.length]);

  const removeField = useCallback((fieldId) => {
    setFields((prev) => prev.filter((f) => f.fieldId !== fieldId));
    setSelectedFieldId((prev) => (prev === fieldId ? null : prev));
    setHasUnsavedChanges(true);
  }, []);

  const updateField = useCallback((fieldId, updates) => {
    setFields((prev) =>
      prev.map((f) => (f.fieldId === fieldId ? { ...f, ...updates } : f))
    );
    setHasUnsavedChanges(true);
  }, []);

  const moveFieldUp = useCallback((index) => {
    if (index <= 0) return;
    setFields((prev) => {
      const updated = [...prev];
      [updated[index - 1], updated[index]] = [updated[index], updated[index - 1]];
      return updated.map((f, i) => ({ ...f, order: i }));
    });
    setHasUnsavedChanges(true);
  }, []);

  const moveFieldDown = useCallback((index) => {
    setFields((prev) => {
      if (index >= prev.length - 1) return prev;
      const updated = [...prev];
      [updated[index], updated[index + 1]] = [updated[index + 1], updated[index]];
      return updated.map((f, i) => ({ ...f, order: i }));
    });
    setHasUnsavedChanges(true);
  }, []);

  const duplicateField = useCallback((fieldId) => {
    setFields((prev) => {
      const original = prev.find((f) => f.fieldId === fieldId);
      if (!original) return prev;
      const clone = { ...original, fieldId: nanoid(), label: `${original.label} (Copy)` };
      const insertIdx = prev.findIndex((f) => f.fieldId === fieldId) + 1;
      const updated = [...prev];
      updated.splice(insertIdx, 0, clone);
      return updated.map((f, i) => ({ ...f, order: i }));
    });
    setHasUnsavedChanges(true);
  }, []);

  const updateDesign = useCallback((updates) => {
    setDesign((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);

  const updateSettings = useCallback((updates) => {
    setSettings((prev) => ({ ...prev, ...updates }));
    setHasUnsavedChanges(true);
  }, []);

  const getFormPayload = useCallback(() => ({
    title: formTitle,
    description: formDescription,
    fields,
    design,
    settings,
  }), [formTitle, formDescription, fields, design, settings]);

  const markSaved = useCallback(() => setHasUnsavedChanges(false), []);

  const contextPayload = {
    formTitle, formDescription, fields, design, settings,
    selectedFieldId, hasUnsavedChanges,
    setFormTitle, setFormDescription, setSelectedFieldId,
    addField, removeField, updateField,
    moveFieldUp, moveFieldDown, duplicateField,
    
    updateDesign, updateSettings,
    getFormPayload, markSaved, setHasUnsavedChanges,
  };

  return (
    <FormBuilderContext.Provider value={contextPayload}>
      {children}
    </FormBuilderContext.Provider>
  );
}
