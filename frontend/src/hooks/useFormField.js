
import { useContext, useMemo } from 'react';
import { FormBuilderContext } from '../context/FormBuilderContext';

export default function useFormField(fieldId) {
  const ctx = useContext(FormBuilderContext);

  const field = useMemo(
    () => ctx.fields.find((f) => f.fieldId === fieldId),
    [ctx.fields, fieldId]
  );

  const update = (updates) => ctx.updateField(fieldId, updates);
  const remove = () => ctx.removeField(fieldId);
  const duplicate = () => ctx.duplicateField(fieldId);
  const isSelected = ctx.selectedFieldId === fieldId;
  const select = () => ctx.setSelectedFieldId(fieldId);

  return { field, update, remove, duplicate, isSelected, select };
}
