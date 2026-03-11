
import { useCallback } from 'react';

export default function useConditionalLogic() {

  const evaluateRule = useCallback((rule, answers) => {
    const actualValue = answers[rule.targetFieldId];
    const compareVal = rule.compareValue;

    switch (rule.operator) {
      case 'equals':
        return String(actualValue) === String(compareVal);
      case 'notEquals':
        return String(actualValue) !== String(compareVal);
      case 'contains':
        return String(actualValue || '').toLowerCase().includes(String(compareVal).toLowerCase());
      case 'greaterThan':
        return Number(actualValue) > Number(compareVal);
      case 'lessThan':
        return Number(actualValue) < Number(compareVal);
      case 'isEmpty':
        return !actualValue || (typeof actualValue === 'string' && actualValue.trim() === '') ||
               (Array.isArray(actualValue) && actualValue.length === 0);
      case 'isNotEmpty':
        return !!actualValue && !(typeof actualValue === 'string' && actualValue.trim() === '') &&
               !(Array.isArray(actualValue) && actualValue.length === 0);
      default:
        return false;
    }
  }, []);

  const evaluateFieldVisibility = useCallback((rules, answers) => {
    if (!rules || rules.length === 0) {
      return { visible: true, required: null };
    }

    let visible = true;
    let required = null;
    const showRules = rules.filter((r) => r.action === 'show');
    const hideRules = rules.filter((r) => r.action === 'hide');
    const reqRules = rules.filter((r) => r.action === 'makeRequired');
    const optRules = rules.filter((r) => r.action === 'makeOptional');

    // Process show rules — if present, field is hidden by default unless condition met
    if (showRules.length > 0) {
      const useOr = showRules.some((r) => r.chainMode === 'OR');
      const results = showRules.map((r) => evaluateRule(r, answers));
      visible = useOr ? results.some(Boolean) : results.every(Boolean);
    }

    // Process hide rules — if condition met, hide the field
    if (hideRules.length > 0) {
      const useOr = hideRules.some((r) => r.chainMode === 'OR');
      const results = hideRules.map((r) => evaluateRule(r, answers));
      const shouldHide = useOr ? results.some(Boolean) : results.every(Boolean);
      if (shouldHide) visible = false;
    }
    if (reqRules.length > 0) {
      const results = reqRules.map((r) => evaluateRule(r, answers));
      if (results.some(Boolean)) required = true;
    }
    if (optRules.length > 0) {
      const results = optRules.map((r) => evaluateRule(r, answers));
      if (results.some(Boolean)) required = false;
    }

    return { visible, required };
  }, [evaluateRule]);

  return { evaluateRule, evaluateFieldVisibility };
}
