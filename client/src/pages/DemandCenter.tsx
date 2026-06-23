import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

import { submitDemand, scoreCandidates } from '../api/client';
import { useSquadContext } from '../context/SquadContext';
import { useDemandForm } from '../hooks/useDemandForm';

const ROLES = ['FRONTEND', 'BACKEND', 'FULLSTACK', 'DESIGN', 'QA', 'DATA', 'PLATFORM'] as const;
const URGENCY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const;

export const DemandCenter = (): JSX.Element => {
  const { dispatch } = useSquadContext();
  const { form, errors, updateField, addSkill, removeSkill, validate, getSubmitData, reset } =
    useDemandForm();
  const navigate = useNavigate();

  const [skillInput, setSkillInput] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleAddSkill = useCallback((): void => {
    if (skillInput.trim()) {
      addSkill(skillInput.trim());
      setSkillInput('');
    }
  }, [skillInput, addSkill]);

  const handleSkillKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLInputElement>): void => {
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddSkill();
      }
    },
    [handleAddSkill],
  );

  const handleSubmit = useCallback(
    async (e: React.FormEvent): Promise<void> => {
      e.preventDefault();
      setSubmitError(null);

      if (!validate()) return;

      setIsSubmitting(true);
      dispatch({ type: 'SET_LOADING', payload: true });

      try {
        const criteria = getSubmitData();
        const { demandId } = await submitDemand(criteria);

        dispatch({ type: 'SET_DEMAND', payload: { demandId, criteria } });

        const ranked = await scoreCandidates(demandId);
        dispatch({ type: 'SET_CANDIDATES', payload: ranked });

        navigate('/candidates');
      } catch (error) {
        const message = error instanceof Error ? error.message : 'An unexpected error occurred.';
        console.error('[DemandCenter] Submit failed:', error);
        setSubmitError(message);
      } finally {
        setIsSubmitting(false);
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    },
    [validate, getSubmitData, dispatch, navigate],
  );

  return (
    <div className="p-sm md:p-lg">
      <div className="mx-auto max-w-grid">
        <header className="mb-lg">
          <h1 className="font-headline text-headline-lg text-on-surface">Demand Center</h1>
          <p className="mt-xs font-body text-body-md text-on-surface-variant">
            Capture your delivery need and generate ranked candidate recommendations.
          </p>
        </header>

        <div className="grid grid-cols-1 gap-gutter lg:grid-cols-3">
          {/* Form Section */}
          <section className="lg:col-span-2" aria-labelledby="demand-form-heading">
            <h2 id="demand-form-heading" className="sr-only">
              Demand Request Form
            </h2>
            <form
              onSubmit={handleSubmit}
              noValidate
              className="rounded-xl bg-surface-container p-md shadow-elevation-2"
            >
              <div className="grid grid-cols-1 gap-sm md:grid-cols-2">
                {/* Squad Intent */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="squadIntent"
                    className="mb-base block font-body text-label-md text-on-surface"
                  >
                    Squad Intent
                  </label>
                  <input
                    id="squadIntent"
                    type="text"
                    value={form.squadIntent}
                    onChange={(e) => updateField('squadIntent', e.target.value)}
                    placeholder="Describe the work or goal..."
                    aria-invalid={!!errors.squadIntent}
                    aria-describedby={errors.squadIntent ? 'squadIntent-error' : undefined}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-sm py-xs font-body text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {errors.squadIntent && (
                    <p id="squadIntent-error" className="mt-base text-body-sm text-error" role="alert">
                      {errors.squadIntent}
                    </p>
                  )}
                </div>

                {/* Project Code */}
                <div>
                  <label
                    htmlFor="projectCode"
                    className="mb-base block font-body text-label-md text-on-surface"
                  >
                    Project Code
                  </label>
                  <input
                    id="projectCode"
                    type="text"
                    value={form.projectCode}
                    onChange={(e) => updateField('projectCode', e.target.value)}
                    placeholder="e.g. ZAF-2025-001"
                    aria-invalid={!!errors.projectCode}
                    aria-describedby={errors.projectCode ? 'projectCode-error' : undefined}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-sm py-xs font-body text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {errors.projectCode && (
                    <p id="projectCode-error" className="mt-base text-body-sm text-error" role="alert">
                      {errors.projectCode}
                    </p>
                  )}
                </div>

                {/* Business Domain */}
                <div>
                  <label
                    htmlFor="businessDomain"
                    className="mb-base block font-body text-label-md text-on-surface"
                  >
                    Business Domain
                  </label>
                  <input
                    id="businessDomain"
                    type="text"
                    value={form.businessDomain}
                    onChange={(e) => updateField('businessDomain', e.target.value)}
                    placeholder="e.g. Retail Banking"
                    aria-invalid={!!errors.businessDomain}
                    aria-describedby={errors.businessDomain ? 'businessDomain-error' : undefined}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-sm py-xs font-body text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {errors.businessDomain && (
                    <p id="businessDomain-error" className="mt-base text-body-sm text-error" role="alert">
                      {errors.businessDomain}
                    </p>
                  )}
                </div>

                {/* Urgency */}
                <div>
                  <label
                    htmlFor="urgency"
                    className="mb-base block font-body text-label-md text-on-surface"
                  >
                    Urgency
                  </label>
                  <select
                    id="urgency"
                    value={form.urgency}
                    onChange={(e) => updateField('urgency', e.target.value)}
                    aria-invalid={!!errors.urgency}
                    aria-describedby={errors.urgency ? 'urgency-error' : undefined}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-sm py-xs font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select urgency...</option>
                    {URGENCY_LEVELS.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                  {errors.urgency && (
                    <p id="urgency-error" className="mt-base text-body-sm text-error" role="alert">
                      {errors.urgency}
                    </p>
                  )}
                </div>

                {/* Required Role */}
                <div>
                  <label
                    htmlFor="requiredRole"
                    className="mb-base block font-body text-label-md text-on-surface"
                  >
                    Required Role
                  </label>
                  <select
                    id="requiredRole"
                    value={form.requiredRole}
                    onChange={(e) => updateField('requiredRole', e.target.value)}
                    aria-invalid={!!errors.requiredRole}
                    aria-describedby={errors.requiredRole ? 'requiredRole-error' : undefined}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-sm py-xs font-body text-body-md text-on-surface focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  >
                    <option value="">Select role...</option>
                    {ROLES.map((role) => (
                      <option key={role} value={role}>
                        {role}
                      </option>
                    ))}
                  </select>
                  {errors.requiredRole && (
                    <p id="requiredRole-error" className="mt-base text-body-sm text-error" role="alert">
                      {errors.requiredRole}
                    </p>
                  )}
                </div>

                {/* Duration Weeks */}
                <div>
                  <label
                    htmlFor="durationWeeks"
                    className="mb-base block font-body text-label-md text-on-surface"
                  >
                    Expected Duration (weeks)
                  </label>
                  <input
                    id="durationWeeks"
                    type="number"
                    min="1"
                    value={form.durationWeeks}
                    onChange={(e) => updateField('durationWeeks', e.target.value)}
                    placeholder="e.g. 8"
                    aria-invalid={!!errors.durationWeeks}
                    aria-describedby={errors.durationWeeks ? 'durationWeeks-error' : undefined}
                    className="w-full rounded-lg border border-outline-variant bg-surface-container-lowest px-sm py-xs font-body text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                  />
                  {errors.durationWeeks && (
                    <p id="durationWeeks-error" className="mt-base text-body-sm text-error" role="alert">
                      {errors.durationWeeks}
                    </p>
                  )}
                </div>

                {/* Required Skills */}
                <div className="md:col-span-2">
                  <label
                    htmlFor="skillInput"
                    className="mb-base block font-body text-label-md text-on-surface"
                  >
                    Required Skills
                  </label>
                  <div className="flex gap-xs">
                    <input
                      id="skillInput"
                      type="text"
                      value={skillInput}
                      onChange={(e) => setSkillInput(e.target.value)}
                      onKeyDown={handleSkillKeyDown}
                      placeholder="Type a skill and press Enter..."
                      aria-describedby={errors.requiredSkills ? 'skills-error' : 'skills-hint'}
                      className="flex-1 rounded-lg border border-outline-variant bg-surface-container-lowest px-sm py-xs font-body text-body-md text-on-surface placeholder:text-on-surface-variant focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                    <button
                      type="button"
                      onClick={handleAddSkill}
                      aria-label="Add skill"
                      className="rounded-lg bg-primary px-sm py-xs font-body text-label-md text-on-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      Add
                    </button>
                  </div>
                  <p id="skills-hint" className="mt-base text-body-sm text-on-surface-variant">
                    Press Enter or click Add to include a skill.
                  </p>
                  {errors.requiredSkills && (
                    <p id="skills-error" className="mt-base text-body-sm text-error" role="alert">
                      {errors.requiredSkills}
                    </p>
                  )}
                  {form.requiredSkills.length > 0 && (
                    <div className="mt-xs flex flex-wrap gap-xs" aria-label="Selected skills">
                      {form.requiredSkills.map((skill) => (
                        <span
                          key={skill}
                          className="inline-flex items-center gap-base rounded-full bg-primary-fixed px-sm py-base font-body text-label-sm text-on-primary-fixed"
                        >
                          {skill}
                          <button
                            type="button"
                            onClick={() => removeSkill(skill)}
                            aria-label={`Remove ${skill}`}
                            className="ml-base rounded-full text-on-primary-fixed hover:text-error focus:outline-none"
                          >
                            ×
                          </button>
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Submit Error */}
              {submitError && (
                <div className="mt-sm rounded-lg bg-error-container p-sm" role="alert">
                  <p className="font-body text-body-sm text-on-error-container">{submitError}</p>
                </div>
              )}

              {/* Submit Button */}
              <div className="mt-md">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full rounded-lg bg-primary px-md py-xs font-headline text-label-md text-on-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:opacity-50 disabled:cursor-not-allowed md:w-auto"
                >
                  {isSubmitting ? 'Generating...' : 'Generate Recommendations'}
                </button>
                <button
                  type="button"
                  onClick={reset}
                  className="ml-sm mt-xs rounded-lg border border-outline-variant px-md py-xs font-body text-label-md text-on-surface hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20 md:mt-0"
                >
                  Reset
                </button>
              </div>
            </form>
          </section>

          {/* Weights Panel */}
          <aside aria-labelledby="weights-heading">
            <div className="rounded-xl bg-surface-container p-md shadow-elevation-2">
              <h2
                id="weights-heading"
                className="font-headline text-headline-md text-on-surface mb-sm"
              >
                Suitability Weights
              </h2>
              <p className="font-body text-body-sm text-on-surface-variant mb-sm">
                Candidates are ranked using a weighted scoring formula:
              </p>
              <dl className="space-y-xs">
                <div className="flex items-center justify-between">
                  <dt className="font-body text-body-md text-on-surface">Skill Match</dt>
                  <dd className="font-mono text-label-md text-primary">50%</dd>
                </div>
                <div className="w-full rounded-full bg-surface-container-high h-2">
                  <div className="rounded-full bg-primary h-2" style={{ width: '50%' }} />
                </div>

                <div className="flex items-center justify-between">
                  <dt className="font-body text-body-md text-on-surface">Availability</dt>
                  <dd className="font-mono text-label-md text-secondary">30%</dd>
                </div>
                <div className="w-full rounded-full bg-surface-container-high h-2">
                  <div className="rounded-full bg-secondary h-2" style={{ width: '30%' }} />
                </div>

                <div className="flex items-center justify-between">
                  <dt className="font-body text-body-md text-on-surface">Role Alignment</dt>
                  <dd className="font-mono text-label-md text-tertiary-fixed-dim">20%</dd>
                </div>
                <div className="w-full rounded-full bg-surface-container-high h-2">
                  <div className="rounded-full bg-tertiary h-2" style={{ width: '20%' }} />
                </div>
              </dl>
              <p className="mt-sm font-mono text-label-sm text-on-surface-variant">
                S<sub>total</sub> = 0.50×S<sub>skill</sub> + 0.30×S<sub>avail</sub> + 0.20×S<sub>role</sub>
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
};
