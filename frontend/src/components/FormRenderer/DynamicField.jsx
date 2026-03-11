
import { useRef, useState } from 'react';
import axios from 'axios';

export default function DynamicField({ field, value, onChange, error, designConfig, previewMode = false }) {
  const borderRadius = designConfig?.borderRadius || 8;
  const accentColor = designConfig?.accentColor || '#6366f1';
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedFileName, setUploadedFileName] = useState('');
  const inputStyle = {
    borderRadius: `${borderRadius}px`,
    borderColor: error ? '#ef4444' : '#d1d5db',
    textAlign: field.textAlign || 'left',
    fontFamily: designConfig?.fontFamily || 'Inter',
  };

  const inputClasses = `w-full px-4 py-2.5 border bg-white text-gray-800 placeholder-gray-400
    focus:outline-none focus:ring-2 transition-all duration-200 text-sm`;

  const focusRingStyle = { '--tw-ring-color': accentColor };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be under 5MB');
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:5000';
      const { data } = await axios.post(`${baseUrl}/api/upload`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });

      setUploadedFileName(file.name);
      onChange(data.url);
    } catch (err) {
      console.error('Upload failed:', err);
      alert('File upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  const renderInput = () => {
    switch (field.kind) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            style={{ ...inputStyle, ...focusRingStyle }}
            className={inputClasses}
            disabled={previewMode}
            aria-label={field.label}
          />
        );

      case 'email':
        return (
          <input
            type="email"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            style={{ ...inputStyle, ...focusRingStyle }}
            className={inputClasses}
            disabled={previewMode}
            aria-label={field.label}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            style={{ ...inputStyle, ...focusRingStyle }}
            className={inputClasses}
            disabled={previewMode}
            aria-label={field.label}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            style={{ ...inputStyle, ...focusRingStyle }}
            className={inputClasses}
            disabled={previewMode}
            aria-label={field.label}
          />
        );

      case 'textarea':
        return (
          <textarea
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            placeholder={field.placeholder}
            style={{ ...inputStyle, ...focusRingStyle }}
            className={`${inputClasses} resize-none`}
            rows={4}
            disabled={previewMode}
            aria-label={field.label}
          />
        );

      case 'dropdown':
        return (
          <select
            value={value || ''}
            onChange={(e) => onChange(e.target.value)}
            style={{ ...inputStyle, ...focusRingStyle }}
            className={inputClasses}
            disabled={previewMode}
            aria-label={field.label}
          >
            <option value="">{field.placeholder || 'Select an option'}</option>
            {(field.options || []).map((opt, i) => (
              <option key={i} value={opt}>{opt}</option>
            ))}
          </select>
        );

      case 'checkbox':
        return (
          <div className="space-y-2">
            {(field.options || []).map((opt, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={(value || []).includes(opt)}
                  onChange={(e) => {
                    const current = value || [];
                    const updated = e.target.checked
                      ? [...current, opt]
                      : current.filter((v) => v !== opt);
                    onChange(updated);
                  }}
                  className="w-4 h-4 rounded border-gray-300"
                  style={{ accentColor }}
                  disabled={previewMode}
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt}</span>
              </label>
            ))}
          </div>
        );

      case 'radio':
        return (
          <div className="space-y-2">
            {(field.options || []).map((opt, i) => (
              <label key={i} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="radio"
                  name={field.fieldId}
                  value={opt}
                  checked={value === opt}
                  onChange={() => onChange(opt)}
                  className="w-4 h-4 border-gray-300"
                  style={{ accentColor }}
                  disabled={previewMode}
                />
                <span className="text-sm text-gray-700 group-hover:text-gray-900">{opt}</span>
              </label>
            ))}
          </div>
        );

      case 'file':
        return (
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              disabled={previewMode || uploading}
              aria-label={field.label}
            />
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                uploading ? 'border-blue-300 bg-blue-50/50' : 'hover:border-gray-400'
              }`}
              style={{ borderRadius: `${borderRadius}px`, borderColor: error ? '#ef4444' : uploading ? '#93c5fd' : '#d1d5db' }}
              onClick={() => !previewMode && !uploading && fileInputRef.current?.click()}
            >
              {uploading ? (
                <>
                  <i className="ri-loader-4-line text-2xl text-blue-500 mb-2 block animate-spin"></i>
                  <p className="text-sm text-blue-600">Uploading...</p>
                </>
              ) : uploadedFileName || value ? (
                <>
                  <i className="ri-check-line text-2xl text-green-500 mb-2 block"></i>
                  <p className="text-sm text-green-600 font-medium">{uploadedFileName || 'File uploaded'}</p>
                  <p className="text-xs text-gray-400 mt-1">Click to change file</p>
                </>
              ) : (
                <>
                  <i className="ri-upload-cloud-line text-2xl text-gray-400 mb-2 block"></i>
                  <p className="text-sm text-gray-500">{field.placeholder || 'Click to upload'}</p>
                </>
              )}
            </div>
            <p className="text-xs text-gray-400 text-right mt-1">Max 5MB</p>
          </div>
        );

      default:
        return <p className="text-sm text-gray-400">Unknown field type: {field.kind}</p>;
    }
  };

  return (
    <div className="w-full">
      {}
      <label
        className="block text-sm font-medium mb-1.5"
        style={{ color: '#374151', fontFamily: designConfig?.fontFamily, textAlign: field.textAlign }}
      >
        {field.label}
        {field.isRequired && <span className="text-red-500 ml-1">*</span>}
      </label>

      {}
      {renderInput()}

      {}
      {field.helpText && (
        <p className="text-xs mt-1.5" style={{ color: '#9ca3af', textAlign: field.textAlign }}>
          {field.helpText}
        </p>
      )}

      {}
      {error && (
        <p className="text-xs mt-1.5 text-red-500 flex items-center gap-1">
          <i className="ri-error-warning-line"></i>
          {error}
        </p>
      )}
    </div>
  );
}
