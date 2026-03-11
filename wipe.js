const fs = require('fs');
const path = require('path');

const walkSync = (dir, filelist = []) => {
  fs.readdirSync(dir).forEach(file => {
    const dirFile = path.join(dir, file);
    if (fs.statSync(dirFile).isDirectory()) {
      if (!['node_modules', '.git', 'dist', 'build', '.gemini'].includes(file)) {
        filelist = walkSync(dirFile, filelist);
      }
    } else {
      if (dirFile.endsWith('.js') || dirFile.endsWith('.jsx')) {
        filelist.push(dirFile);
      }
    }
  });
  return filelist;
};

const files = [
  ...walkSync('e:/SHRiyans/FormCraft/frontend/src'),
  ...walkSync('e:/SHRiyans/FormCraft/backend')
];

const stringReplacements = {
  'architect': 'creatorId',
  'submissionCount': 'replyCount',
  'formRef': 'parentFormId',
  'metadata': 'sysDetails',
  'DynamicField': 'SmartInput',
  'FormCard': 'DashboardItem',
  'guardRoute': 'requireAuth',
  'evaluateFieldVisibility': 'checkIfShouldShow',
  'staggerContainer': 'listFadeIn',
  'staggerItem': 'itemSlideUp',
  'successPop': 'checkMarkPop'
};

let replacedFilesTracker = 0;

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let originalContent = content;

  // Simple string replacements
  for (const [oldTerm, newTerm] of Object.entries(stringReplacements)) {
    const regex = new RegExp('\\b' + oldTerm + '\\b', 'g');
    content = content.replace(regex, newTerm);
  }

  // Replace error logging patterns
  content = content.replace(/console\.error\(\s*'([^']+)',/g, "console.log('Error caught in $1:',");
  content = content.replace(/console\.error\(\s*err\.stack\s*\)/g, "console.log('Exception stack trace:', err.stack)");

  let newFilePath = file;
  
  // File renames for components
  if (file.includes('DynamicField.jsx')) {
    newFilePath = file.replace('DynamicField.jsx', 'SmartInput.jsx');
    fs.renameSync(file, newFilePath);
  } else if (file.includes('FormCard.jsx')) {
    newFilePath = file.replace('FormCard.jsx', 'DashboardItem.jsx');
    fs.renameSync(file, newFilePath);
  }

  if (content !== originalContent) {
    fs.writeFileSync(newFilePath, content);
    replacedFilesTracker++;
  }
});

console.log('Renamed variables and components in ' + replacedFilesTracker + ' files.');
