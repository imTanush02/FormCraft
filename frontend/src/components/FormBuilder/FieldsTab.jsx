
import { useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FormBuilderContext } from '../../context/FormBuilderContext';
import fieldTypeConfig from '../../utils/fieldTypeConfig';
import { listFadeIn, itemSlideUp, fieldAppear } from '../../utils/animationVariants';
import ConditionalLogicBuilder from './ConditionalLogicBuilder';

export default function FieldsTab() {
  const {
    fields, selectedFieldId, setSelectedFieldId,
    addField, removeField, updateField,
    moveFieldUp, moveFieldDown, duplicateField,
  } = useContext(FormBuilderContext);

  const selectedField = fields.find((f) => f.fieldId === selectedFieldId);

  return (
    <div className="flex flex-col lg:flex-row gap-6 h-full">
      {/* Left sidebar — add field buttons + field list */}
      <div className="lg:w-72 flex-shrink-0 space-y-5">
        {}
        <div>
          <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-3">
            Add Field
          </h3>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(fieldTypeConfig).map(([kind, config]) => (
              <button
                key={kind}
                onClick={() => addField(kind)}
                className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-surface-800/60 border border-surface-700/40
                           text-sm text-surface-300 hover:bg-brand-500/10 hover:border-brand-500/30 hover:text-brand-300
                           transition-all duration-200 group"
              >
                <i className={`${config.icon} text-base text-surface-400 group-hover:text-brand-400 transition-colors`}></i>
                <span className="truncate">{config.label}</span>
              </button>
            ))}
          </div>
        </div>

        {}
        <div>
          <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider mb-3">
            Fields ({fields.length})
          </h3>
          {fields.length === 0 ? (
            <p className="text-surface-500 text-sm italic">No fields added yet. Click a field type above to add one.</p>
          ) : (
            <motion.div variants={listFadeIn} initial="hidden" animate="visible" className="space-y-2">
              <AnimatePresence mode="popLayout">
                {fields.map((field, idx) => (
                  <motion.div
                    key={field.fieldId}
                    variants={fieldAppear}
                    initial="hidden"
                    animate="visible"
                    exit="exit"
                    layout
                    className={`flex items-center gap-2 px-3 py-2.5 rounded-lg cursor-pointer border transition-all duration-200 ${
                      selectedFieldId === field.fieldId
                        ? 'bg-brand-500/10 border-brand-500/40 text-brand-300'
                        : 'bg-surface-800/40 border-surface-700/30 text-surface-300 hover:bg-surface-700/50'
                    }`}
                    onClick={() => setSelectedFieldId(field.fieldId)}
                  >
                    <i className={`${fieldTypeConfig[field.kind]?.icon || 'ri-input-method-line'} text-sm`}></i>
                    <span className="flex-1 truncate text-sm">{field.label}</span>
                    <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100">
                      <button onClick={(e) => { e.stopPropagation(); moveFieldUp(idx); }}
                              className="p-1 hover:text-white transition-colors" aria-label="Move up"
                              disabled={idx === 0}>
                        <i className="ri-arrow-up-s-line text-xs"></i>
                      </button>
                      <button onClick={(e) => { e.stopPropagation(); moveFieldDown(idx); }}
                              className="p-1 hover:text-white transition-colors" aria-label="Move down"
                              disabled={idx === fields.length - 1}>
                        <i className="ri-arrow-down-s-line text-xs"></i>
                      </button>
                    </div>
                    {field.isRequired && (
                      <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" title="Required"></span>
                    )}
                  </motion.div>
                ))}
              </AnimatePresence>
            </motion.div>
          )}
        </div>
      </div>

      {/* Right panel — field editor */}
      <div className="flex-1 min-w-0">
        <AnimatePresence mode="wait">
          {selectedField ? (
            <motion.div
              key={selectedField.fieldId}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              className="glass-card p-5 space-y-5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-white flex items-center gap-2">
                  <i className={`${fieldTypeConfig[selectedField.kind]?.icon} text-brand-400`}></i>
                  Edit {fieldTypeConfig[selectedField.kind]?.label || 'Field'}
                </h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => duplicateField(selectedField.fieldId)}
                    className="text-sm px-3 py-1.5 rounded-lg text-surface-400 hover:bg-surface-700 hover:text-surface-200 transition-all"
                    aria-label="Duplicate field"
                  >
                    <i className="ri-file-copy-line mr-1"></i> Duplicate
                  </button>
                  <button
                    onClick={() => removeField(selectedField.fieldId)}
                    className="text-sm px-3 py-1.5 rounded-lg text-red-400 hover:bg-red-500/10 transition-all"
                    aria-label="Delete field"
                  >
                    <i className="ri-delete-bin-line mr-1"></i> Delete
                  </button>
                </div>
              </div>

              {}
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">Label</label>
                <input
                  type="text"
                  value={selectedField.label}
                  onChange={(e) => updateField(selectedField.fieldId, { label: e.target.value })}
                  className="input-field"
                  placeholder="Field label"
                />
              </div>

              {}
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">Placeholder</label>
                <input
                  type="text"
                  value={selectedField.placeholder}
                  onChange={(e) => updateField(selectedField.fieldId, { placeholder: e.target.value })}
                  className="input-field"
                  placeholder="Placeholder text"
                />
              </div>

              {}
              <div>
                <label className="block text-sm font-medium text-surface-300 mb-1.5">Help Text</label>
                <input
                  type="text"
                  value={selectedField.helpText}
                  onChange={(e) => updateField(selectedField.fieldId, { helpText: e.target.value })}
                  className="input-field"
                  placeholder="Additional instructions for the user"
                />
              </div>

              {/* Options (for dropdown, checkbox, radio) */}
              {fieldTypeConfig[selectedField.kind]?.hasOptions && (
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Options</label>
                  <div className="space-y-2">
                    {(selectedField.options || []).map((opt, oi) => (
                      <div key={oi} className="flex items-center gap-2">
                        <input
                          type="text"
                          value={opt}
                          onChange={(e) => {
                            const newOpts = [...selectedField.options];
                            newOpts[oi] = e.target.value;
                            updateField(selectedField.fieldId, { options: newOpts });
                          }}
                          className="input-field flex-1"
                          placeholder={`Option ${oi + 1}`}
                        />
                        <button
                          onClick={() => {
                            const newOpts = selectedField.options.filter((_, i) => i !== oi);
                            updateField(selectedField.fieldId, { options: newOpts });
                          }}
                          className="p-2 text-surface-400 hover:text-red-400 transition-colors"
                          aria-label="Remove option"
                        >
                          <i className="ri-close-line"></i>
                        </button>
                      </div>
                    ))}
                    <button
                      onClick={() => {
                        const newOpts = [...(selectedField.options || []), `Option ${(selectedField.options?.length || 0) + 1}`];
                        updateField(selectedField.fieldId, { options: newOpts });
                      }}
                      className="text-sm text-brand-400 hover:text-brand-300 flex items-center gap-1 transition-colors"
                    >
                      <i className="ri-add-line"></i> Add option
                    </button>
                  </div>
                </div>
              )}

              {/* Row: Required, Width, Alignment */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {}
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Required</label>
                  <button
                    onClick={() => updateField(selectedField.fieldId, { isRequired: !selectedField.isRequired })}
                    className={`w-full py-2 rounded-lg text-sm font-medium transition-all ${
                      selectedField.isRequired
                        ? 'bg-brand-500/20 text-brand-300 border border-brand-500/40'
                        : 'bg-surface-800 text-surface-400 border border-surface-600/40 hover:bg-surface-700'
                    }`}
                  >
                    {selectedField.isRequired ? 'Required' : 'Optional'}
                  </button>
                </div>

                {}
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Width</label>
                  <select
                    value={selectedField.widthPercent}
                    onChange={(e) => updateField(selectedField.fieldId, { widthPercent: Number(e.target.value) })}
                    className="input-field"
                  >
                    <option value={100}>Full (100%)</option>
                    <option value={50}>Half (50%)</option>
                    <option value={33}>Third (33%)</option>
                  </select>
                </div>

                {}
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Text Align</label>
                  <div className="flex rounded-lg overflow-hidden border border-surface-600/40">
                    {['left', 'center', 'right'].map((align) => (
                      <button
                        key={align}
                        onClick={() => updateField(selectedField.fieldId, { textAlign: align })}
                        className={`flex-1 py-2 text-sm transition-all ${
                          selectedField.textAlign === align
                            ? 'bg-brand-500/20 text-brand-300'
                            : 'bg-surface-800 text-surface-400 hover:bg-surface-700'
                        }`}
                      >
                        <i className={`ri-align-${align}`}></i>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              {}
              <ConditionalLogicBuilder
                field={selectedField}
                onUpdate={(rules) => updateField(selectedField.fieldId, { conditionalRules: rules })}
              />
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center h-64 text-center"
            >
              <i className="ri-cursor-line text-4xl text-surface-600 mb-3"></i>
              <p className="text-surface-400">Select a field to edit its properties</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
