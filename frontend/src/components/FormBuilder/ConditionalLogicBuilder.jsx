
import { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormBuilderContext } from '../../context/FormBuilderContext';
import { modalVariant, overlayVariant } from '../../utils/animationVariants';

const OPERATORS = [
  { value: 'equals', label: 'Equals' },
  { value: 'notEquals', label: 'Not Equals' },
  { value: 'contains', label: 'Contains' },
  { value: 'greaterThan', label: 'Greater Than' },
  { value: 'lessThan', label: 'Less Than' },
  { value: 'isEmpty', label: 'Is Empty' },
  { value: 'isNotEmpty', label: 'Is Not Empty' },
];

const ACTIONS = [
  { value: 'show', label: 'Show this field' },
  { value: 'hide', label: 'Hide this field' },
  { value: 'makeRequired', label: 'Make required' },
  { value: 'makeOptional', label: 'Make optional' },
];

export default function ConditionalLogicBuilder({ field, onUpdate }) {
  const { fields } = useContext(FormBuilderContext);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRules, setEditRules] = useState(field.conditionalRules || []);

  const otherFields = fields.filter((f) => f.fieldId !== field.fieldId);

  const addRule = () => {
    setEditRules((prev) => [
      ...prev,
      {
        targetFieldId: otherFields[0]?.fieldId || '',
        operator: 'equals',
        compareValue: '',
        action: 'show',
        chainMode: 'AND',
      },
    ]);
  };

  const updateRule = (index, updates) => {
    setEditRules((prev) =>
      prev.map((r, i) => (i === index ? { ...r, ...updates } : r))
    );
  };

  const removeRule = (index) => {
    setEditRules((prev) => prev.filter((_, i) => i !== index));
  };

  const saveRules = () => {
    onUpdate(editRules);
    setIsModalOpen(false);
  };

  const openModal = () => {
    setEditRules(field.conditionalRules || []);
    setIsModalOpen(true);
  };

  const ruleCount = field.conditionalRules?.length || 0;

  return (
    <>
      {}
      <div className="border-t border-surface-700/50 pt-4">
        <button
          onClick={openModal}
          className="text-sm flex items-center gap-2 text-surface-400 hover:text-brand-300 transition-colors"
        >
          <i className="ri-git-branch-line"></i>
          Conditional Logic
          {ruleCount > 0 && (
            <span className="px-2 py-0.5 rounded-full bg-brand-500/20 text-brand-300 text-xs">
              {ruleCount} rule{ruleCount !== 1 ? 's' : ''}
            </span>
          )}
        </button>
      </div>

      {}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            variants={overlayVariant}
            initial="hidden" animate="visible" exit="exit"
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setIsModalOpen(false)}
          >
            <motion.div
              variants={modalVariant}
              initial="hidden" animate="visible" exit="exit"
              className="glass-card w-full max-w-2xl p-6 max-h-[80vh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-display font-bold text-white flex items-center gap-2">
                  <i className="ri-git-branch-line text-brand-400"></i>
                  Conditional Rules for "{field.label}"
                </h3>
                <button onClick={() => setIsModalOpen(false)} className="text-surface-400 hover:text-white">
                  <i className="ri-close-line text-2xl"></i>
                </button>
              </div>

              <p className="text-sm text-surface-400 mb-5">
                Define rules that control when this field is shown, hidden, or made required.
              </p>

              {}
              <div className="space-y-3 mb-5">
                {editRules.length === 0 ? (
                  <p className="text-surface-500 text-sm italic py-4 text-center">
                    No rules defined. This field will always be visible.
                  </p>
                ) : (
                  editRules.map((rule, idx) => (
                    <div key={idx} className="bg-surface-800/60 rounded-lg p-4 border border-surface-700/40 space-y-3">
                      
                      {idx > 0 && (
                        <div className="flex items-center gap-2 mb-2">
                          <select
                            value={rule.chainMode}
                            onChange={(e) => updateRule(idx, { chainMode: e.target.value })}
                            className="input-field w-20 py-1 text-xs"
                          >
                            <option value="AND">AND</option>
                            <option value="OR">OR</option>
                          </select>
                        </div>
                      )}

                      <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 items-end">
                        {}
                        <div>
                          <label className="block text-xs text-surface-400 mb-1">If field</label>
                          <select
                            value={rule.targetFieldId}
                            onChange={(e) => updateRule(idx, { targetFieldId: e.target.value })}
                            className="input-field py-1.5 text-sm"
                          >
                            {otherFields.map((f) => (
                              <option key={f.fieldId} value={f.fieldId}>{f.label}</option>
                            ))}
                          </select>
                        </div>

                        {}
                        <div>
                          <label className="block text-xs text-surface-400 mb-1">Condition</label>
                          <select
                            value={rule.operator}
                            onChange={(e) => updateRule(idx, { operator: e.target.value })}
                            className="input-field py-1.5 text-sm"
                          >
                            {OPERATORS.map((op) => (
                              <option key={op.value} value={op.value}>{op.label}</option>
                            ))}
                          </select>
                        </div>

                        <div>
                          <label className="block text-xs text-surface-400 mb-1">Value</label>
                          <input
                            type="text"
                            value={rule.compareValue}
                            onChange={(e) => updateRule(idx, { compareValue: e.target.value })}
                            className="input-field py-1.5 text-sm"
                            placeholder="Compare value"
                            disabled={rule.operator === 'isEmpty' || rule.operator === 'isNotEmpty'}
                          />
                        </div>

                        {}
                        <div className="flex items-end gap-2">
                          <div className="flex-1">
                            <label className="block text-xs text-surface-400 mb-1">Then</label>
                            <select
                              value={rule.action}
                              onChange={(e) => updateRule(idx, { action: e.target.value })}
                              className="input-field py-1.5 text-sm"
                            >
                              {ACTIONS.map((act) => (
                                <option key={act.value} value={act.value}>{act.label}</option>
                              ))}
                            </select>
                          </div>
                          <button
                            onClick={() => removeRule(idx)}
                            className="p-2 text-surface-400 hover:text-red-400 transition-colors"
                            aria-label="Remove rule"
                          >
                            <i className="ri-delete-bin-line"></i>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex items-center justify-between">
                <button
                  onClick={addRule}
                  className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                  disabled={otherFields.length === 0}
                >
                  <i className="ri-add-line"></i> Add Rule
                </button>
                <div className="flex gap-3">
                  <button onClick={() => setIsModalOpen(false)} className="btn-ghost text-sm">Cancel</button>
                  <button onClick={saveRules} className="btn-primary text-sm">Save Rules</button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
