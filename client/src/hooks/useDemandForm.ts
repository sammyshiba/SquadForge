import { useState, useCallback } from 'react';

import type { DemandFormFields, FieldErrors, DemandCriteria } from '../types';

const INITIAL_FORM: DemandFormFields = {
  squadIntent: '',
  projectCode: '',
  requiredRole: '',
  requiredSkills: [],
  urgency: '',
  durationWeeks: '',
  businessDomain: '',
};

interface UseDemandFormReturn {
  form: DemandFormFields;
  errors: FieldErrors;
  updateField: (field: keyof DemandFormFields, value: string) => void;
  addSkill: (skill: string) => void;
  removeSkill: (skill: string) => void;
  validate: () => boolean;
  getSubmitData: () => DemandCriteria;
  reset: () => void;
}

export const useDemandForm = (): UseDemandFormReturn => {
  const [form, setForm] = useState<DemandFormFields>(INITIAL_FORM);
  const [errors, setErrors] = useState<FieldErrors>({});

  const updateField = useCallback((field: keyof DemandFormFields, value: string): void => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  }, []);

  const addSkill = useCallback((skill: string): void => {
    const trimmed = skill.trim();
    if (!trimmed) return;
    setForm((prev) => {
      if (prev.requiredSkills.includes(trimmed)) return prev;
      return { ...prev, requiredSkills: [...prev.requiredSkills, trimmed] };
    });
    setErrors((prev) => ({ ...prev, requiredSkills: undefined }));
  }, []);

  const removeSkill = useCallback((skill: string): void => {
    setForm((prev) => ({
      ...prev,
      requiredSkills: prev.requiredSkills.filter((s) => s !== skill),
    }));
  }, []);

  const validate = useCallback((): boolean => {
    const newErrors: FieldErrors = {};

    if (!form.squadIntent.trim()) {
      newErrors.squadIntent = 'Enter a squad intent.';
    }
    if (!form.projectCode.trim()) {
      newErrors.projectCode = 'Enter a project code.';
    }
    if (!form.requiredRole) {
      newErrors.requiredRole = 'Select a required role.';
    }
    if (form.requiredSkills.length === 0) {
      newErrors.requiredSkills = 'Add at least one required competency.';
    }
    if (!form.urgency) {
      newErrors.urgency = 'Select an urgency level.';
    }
    if (!form.durationWeeks || Number(form.durationWeeks) <= 0) {
      newErrors.durationWeeks = 'Enter an expected duration.';
    }
    if (!form.businessDomain.trim()) {
      newErrors.businessDomain = 'Select a business domain.';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }, [form]);

  const getSubmitData = useCallback((): DemandCriteria => {
    return {
      squadIntent: form.squadIntent.trim(),
      projectCode: form.projectCode.trim(),
      requiredRole: form.requiredRole,
      requiredSkills: form.requiredSkills,
      urgency: form.urgency,
      durationWeeks: Number(form.durationWeeks),
      businessDomain: form.businessDomain.trim(),
    };
  }, [form]);

  const reset = useCallback((): void => {
    setForm(INITIAL_FORM);
    setErrors({});
  }, []);

  return {
    form,
    errors,
    updateField,
    addSkill,
    removeSkill,
    validate,
    getSubmitData,
    reset,
  };
};
