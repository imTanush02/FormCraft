
const isBlank = (value) => {
  if (value === undefined || value === null) return true;
  if (typeof value === 'string') return value.trim() === '';
  if (Array.isArray(value)) return value.length === 0;
  return false;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validators = {
  text: (value, field) => {
    if (field.isRequired && isBlank(value)) return `${field.label} is required`;
    return null;
  },

  email: (value, field) => {
    if (field.isRequired && isBlank(value)) return `${field.label} is required`;
    if (!isBlank(value) && !emailPattern.test(value)) return 'Please enter a valid email address';
    return null;
  },

  number: (value, field) => {
    if (field.isRequired && isBlank(value)) return `${field.label} is required`;
    if (!isBlank(value) && isNaN(Number(value))) return 'Please enter a valid number';
    return null;
  },

  date: (value, field) => {
    if (field.isRequired && isBlank(value)) return `${field.label} is required`;
    return null;
  },

  textarea: (value, field) => {
    if (field.isRequired && isBlank(value)) return `${field.label} is required`;
    return null;
  },

  dropdown: (value, field) => {
    if (field.isRequired && isBlank(value)) return `Please select an option for ${field.label}`;
    return null;
  },

  checkbox: (value, field) => {
    if (field.isRequired && (!Array.isArray(value) || value.length === 0)) {
      return `Please select at least one option for ${field.label}`;
    }
    return null;
  },

  radio: (value, field) => {
    if (field.isRequired && isBlank(value)) return `Please choose an option for ${field.label}`;
    return null;
  },

  file: (value, field) => {
    if (field.isRequired && isBlank(value)) return `Please upload a file for ${field.label}`;
    return null;
  },
};

export const validateField = (value, field) => {
  const validatorFn = validators[field.kind];
  if (!validatorFn) return null; 
  return validatorFn(value, field);
};

export const validateAllFields = (answers, fields) => {
  const errors = {};
  fields.forEach((field) => {
    const error = validateField(answers[field.fieldId], field);
    if (error) errors[field.fieldId] = error;
  });
  return errors;
};
