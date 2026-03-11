
const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema(
  {
    targetFieldId: { type: String, required: true },    // field whose value we watch
    operator: {
      type: String,
      enum: ['equals', 'notEquals', 'contains', 'greaterThan', 'lessThan', 'isEmpty', 'isNotEmpty'],
      required: true,
    },
    compareValue: { type: String, default: '' },         // value to compare against
    action: {
      type: String,
      enum: ['show', 'hide', 'makeRequired', 'makeOptional'],
      required: true,
    },
    chainMode: { type: String, enum: ['AND', 'OR'], default: 'AND' }, // how multiple rules combine
  },
  { _id: false }
);

const fieldSchema = new mongoose.Schema(
  {
    fieldId: { type: String, required: true },           // unique within the form
    kind: {
      type: String,
      enum: ['text', 'email', 'number', 'date', 'textarea', 'dropdown', 'checkbox', 'radio', 'file'],
      required: true,
    },
    label: { type: String, required: true, default: 'Untitled Field' },
    placeholder: { type: String, default: '' },
    helpText: { type: String, default: '' },
    isRequired: { type: Boolean, default: false },
    widthPercent: { type: Number, default: 100, enum: [33, 50, 100] },
    textAlign: { type: String, enum: ['left', 'center', 'right'], default: 'left' },
    options: [{ type: String }],                         // for dropdown, checkbox, radio
    order: { type: Number, default: 0 },                 // rendering sequence
    conditionalRules: [ruleSchema],                      // rules that control this field's visibility
  },
  { _id: false }
);

const designSchema = new mongoose.Schema(
  {
    bgColor: { type: String, default: '#ffffff' },
    accentColor: { type: String, default: '#6366f1' },
    fontFamily: { type: String, default: 'Inter' },
    borderRadius: { type: Number, default: 8 },          // px
    fieldSpacing: { type: Number, default: 16 },          // px between fields
    formPadding: { type: Number, default: 32 },           // px inside form container
    maxWidth: { type: Number, default: 640 },             // px
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    allowMultipleSubmissions: { type: Boolean, default: true },
    showProgressBar: { type: Boolean, default: false },
    submitButtonText: { type: String, default: 'Submit' },
    successMessage: { type: String, default: 'Thank you! Your response has been recorded.' },
  },
  { _id: false }
);

const formBlueprint = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Form title is required'],
      trim: true,
      maxlength: [120, 'Title cannot exceed 120 characters'],
    },
    description: { type: String, default: '', maxlength: 500 },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    creatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    fields: [fieldSchema],
    design: { type: designSchema, default: () => ({}) },
    settings: { type: settingsSchema, default: () => ({}) },
    isPublished: { type: Boolean, default: false },
    replyCount: { type: Number, default: 0 },       // denormalized counter for quick access
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Form', formBlueprint);
