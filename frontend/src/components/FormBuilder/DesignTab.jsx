
import { useContext } from 'react';
import { motion } from 'framer-motion';
import { FormBuilderContext } from '../../context/FormBuilderContext';
import { tabSlide } from '../../utils/animationVariants';

const FONT_OPTIONS = [
  'Inter', 'Outfit', 'Roboto', 'Poppins', 'Open Sans',
  'Lato', 'Montserrat', 'Nunito', 'Raleway', 'Source Sans Pro',
];

export default function DesignTab() {
  const { design, updateDesign } = useContext(FormBuilderContext);

  return (
    <motion.div variants={tabSlide} initial="hidden" animate="visible" exit="exit" className="space-y-6 max-w-xl">
      <h3 className="text-lg font-display font-semibold text-white">Form Appearance</h3>

      {}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm font-medium text-surface-300 mb-2">Background Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={design.bgColor}
              onChange={(e) => updateDesign({ bgColor: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer border-2 border-surface-600"
              aria-label="Background color"
            />
            <input
              type="text"
              value={design.bgColor}
              onChange={(e) => updateDesign({ bgColor: e.target.value })}
              className="input-field flex-1"
              placeholder="#ffffff"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-surface-300 mb-2">Accent Color</label>
          <div className="flex items-center gap-3">
            <input
              type="color"
              value={design.accentColor}
              onChange={(e) => updateDesign({ accentColor: e.target.value })}
              className="w-10 h-10 rounded-lg cursor-pointer border-2 border-surface-600"
              aria-label="Accent color"
            />
            <input
              type="text"
              value={design.accentColor}
              onChange={(e) => updateDesign({ accentColor: e.target.value })}
              className="input-field flex-1"
              placeholder="#6366f1"
            />
          </div>
        </div>
      </div>

      {}
      <div>
        <label className="block text-sm font-medium text-surface-300 mb-2">Font Family</label>
        <select
          value={design.fontFamily}
          onChange={(e) => updateDesign({ fontFamily: e.target.value })}
          className="input-field"
        >
          {FONT_OPTIONS.map((font) => (
            <option key={font} value={font}>{font}</option>
          ))}
        </select>
      </div>

      {}
      <div>
        <label className="block text-sm font-medium text-surface-300 mb-2">
          Border Radius — <span className="text-brand-400">{design.borderRadius}px</span>
        </label>
        <input
          type="range"
          min={0} max={24} step={2}
          value={design.borderRadius}
          onChange={(e) => updateDesign({ borderRadius: Number(e.target.value) })}
          className="w-full accent-brand-500"
        />
      </div>

      {}
      <div>
        <label className="block text-sm font-medium text-surface-300 mb-2">
          Field Spacing — <span className="text-brand-400">{design.fieldSpacing}px</span>
        </label>
        <input
          type="range"
          min={8} max={48} step={4}
          value={design.fieldSpacing}
          onChange={(e) => updateDesign({ fieldSpacing: Number(e.target.value) })}
          className="w-full accent-brand-500"
        />
      </div>

      {}
      <div>
        <label className="block text-sm font-medium text-surface-300 mb-2">
          Form Padding — <span className="text-brand-400">{design.formPadding}px</span>
        </label>
        <input
          type="range"
          min={16} max={64} step={4}
          value={design.formPadding}
          onChange={(e) => updateDesign({ formPadding: Number(e.target.value) })}
          className="w-full accent-brand-500"
        />
      </div>

      {}
      <div>
        <label className="block text-sm font-medium text-surface-300 mb-2">
          Max Width — <span className="text-brand-400">{design.maxWidth}px</span>
        </label>
        <input
          type="range"
          min={400} max={1000} step={20}
          value={design.maxWidth}
          onChange={(e) => updateDesign({ maxWidth: Number(e.target.value) })}
          className="w-full accent-brand-500"
        />
      </div>

      {}
      <div className="mt-4 p-4 rounded-xl border border-surface-700/30" style={{ backgroundColor: design.bgColor }}>
        <p style={{ fontFamily: design.fontFamily, color: design.accentColor }} className="text-sm">
          Preview text using {design.fontFamily}
        </p>
        <div
          className="mt-2 h-8 rounded"
          style={{
            backgroundColor: design.accentColor,
            borderRadius: `${design.borderRadius}px`,
            width: '120px',
          }}
        />
      </div>
    </motion.div>
  );
}
