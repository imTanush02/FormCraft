
const fieldTypeConfig = {
  text: {
    label: 'Text Input',
    icon: 'ri-text',
    hasOptions: false,
    defaultProps: {
      placeholder: 'Enter text...',
      helpText: '',
    },
  },
  email: {
    label: 'Email',
    icon: 'ri-mail-line',
    hasOptions: false,
    defaultProps: {
      placeholder: 'you@example.com',
      helpText: '',
    },
  },
  number: {
    label: 'Number',
    icon: 'ri-hashtag',
    hasOptions: false,
    defaultProps: {
      placeholder: '0',
      helpText: '',
    },
  },
  date: {
    label: 'Date Picker',
    icon: 'ri-calendar-line',
    hasOptions: false,
    defaultProps: {
      placeholder: '',
      helpText: '',
    },
  },
  textarea: {
    label: 'Long Text',
    icon: 'ri-file-text-line',
    hasOptions: false,
    defaultProps: {
      placeholder: 'Write your response...',
      helpText: '',
    },
  },
  dropdown: {
    label: 'Dropdown',
    icon: 'ri-arrow-down-s-line',
    hasOptions: true,
    defaultProps: {
      placeholder: 'Select an option',
      helpText: '',
      options: ['Option 1', 'Option 2', 'Option 3'],
    },
  },
  checkbox: {
    label: 'Checkboxes',
    icon: 'ri-checkbox-line',
    hasOptions: true,
    defaultProps: {
      placeholder: '',
      helpText: 'Select all that apply',
      options: ['Choice A', 'Choice B', 'Choice C'],
    },
  },
  radio: {
    label: 'Radio Buttons',
    icon: 'ri-radio-button-line',
    hasOptions: true,
    defaultProps: {
      placeholder: '',
      helpText: 'Choose one',
      options: ['Option A', 'Option B', 'Option C'],
    },
  },
  file: {
    label: 'File Upload',
    icon: 'ri-upload-cloud-line',
    hasOptions: false,
    defaultProps: {
      placeholder: 'Click to upload',
      helpText: 'Max 5MB',
    },
  },
};

export default fieldTypeConfig;
