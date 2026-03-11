
const mongoose = require('mongoose');

const ruleSchema = new mongoose.Schema(
  {
    targetFieldId: { type: String, required: true },    
    operator: {
      type: String,
      enum: ['equals', 'notEquals', 'contains', 'greaterThan', 'lessThan', 'isEmpty', 'isNotEmpty'],
      required: true,
    },
    compareValue: { type: String, default: '' },         
    action: {
      type: String,
      enum: ['show', 'hide', 'makeRequired', 'makeOptional'],
      required: true,
    },
    chainMode: { type: String, enum: ['AND', 'OR'], default: 'AND' }, 
  },
  { _id: false }
);

const fieldSchema = new mongoose.Schema(
  {
    fieldId: { type: String, required: true },           
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
    options: [{ type: String }],                         
    order: { type: Number, default: 0 },                 
    conditionalRules: [ruleSchema],                      
  },
  { _id: false }
);

const designSchema = new mongoose.Schema(
  {
    bgColor: { type: String, default: '#ffffff' },
    accentColor: { type: String, default: '#6366f1' },
    fontFamily: { type: String, default: 'Inter' },
    borderRadius: { type: Number, default: 8 },          
    fieldSpacing: { type: Number, default: 16 },          
    formPadding: { type: Number, default: 32 },           
    maxWidth: { type: Number, default: 640 },             
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
    replyCount: { type: Number, default: 0 },       
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Form', formBlueprint);
