import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

import { useSquadContext } from '../context/SquadContext';
import { finalizeSquad, exportSquad } from '../api/client';
import { downloadSquadExport } from '../utils/export-squad';

export const SquadSummary = (): JSX.Element => {
  const { state, dispatch } = useSquadContext();
  const navigate = useNavigate();
  const [isExporting, setIsExporting] = useState(false);
  const [isFinalizing, setIsFinalizing] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const isFinalized = state.squadStatus === 'finalized';

  const handleFinalize = async (): Promise<void> => {
    if (!state.squadId) return;
    setIsFinalizing(true);
    try {
      await finalizeSquad(state.squadId);
      dispatch({ type: 'FINALIZE_SQUAD' });
      setToast('Squad finalized successfully!');
      setTimeout(() => setToast(null), 3000);
    } catch (error) {
      console.error('[SquadSummary] Failed to finalize:', error);
      setToast('Failed to finalize squad. Please try again.');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsFinalizing(false);
    }
  };

  const handleExport = async (): Promise<void> => {
    if (!state.squadId) return;
    setIsExporting(true);
    try {
      const data = await exportSquad(state.squadId);
      downloadSquadExport(data);
    } catch (error) {
      console.error('[SquadSummary] Failed to export:', error);
      setToast('Failed to export squad data.');
      setTimeout(() => setToast(null), 3000);
    } finally {
      setIsExporting(false);
    }
  };

  if (state.squad.length === 0) {
    return (
      <div className="p-sm md:p-lg">
        <div className="mx-auto max-w-grid text-center">
          <h1 className="font-headline text-headline-lg text-on-surface mb-sm">
            No Squad Assembled
          </h1>
          <p className="font-body text-body-md text-on-surface-variant mb-md">
            Go back to candidates and assign members to your squad.
          </p>
          <button
            type="button"
            onClick={() => navigate('/candidates')}
            className="rounded-lg bg-primary px-md py-xs font-body text-label-md text-on-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            Back to Candidates
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-sm md:p-lg">
      <div className="mx-auto max-w-grid">
        {/* Toast notification */}
        {toast && (
          <div
            className="fixed top-sm right-sm z-50 rounded-lg bg-secondary-container px-md py-xs font-body text-body-sm text-on-secondary-container shadow-elevation-2"
            role="alert"
            aria-live="polite"
          >
            {toast}
          </div>
        )}

        {/* Header */}
        <header className="mb-lg">
          <h1 className="font-headline text-headline-lg text-on-surface">
            Squad Summary
          </h1>
          {state.demandCriteria && (
            <div className="mt-sm grid grid-cols-1 gap-xs sm:grid-cols-3">
              <div className="rounded-lg bg-surface-container p-sm">
                <span className="block font-body text-label-sm text-on-surface-variant">Project Code</span>
                <span className="font-mono text-body-md text-on-surface">{state.demandCriteria.projectCode}</span>
              </div>
              <div className="rounded-lg bg-surface-container p-sm">
                <span className="block font-body text-label-sm text-on-surface-variant">Business Domain</span>
                <span className="font-body text-body-md text-on-surface">{state.demandCriteria.businessDomain}</span>
              </div>
              <div className="rounded-lg bg-surface-container p-sm">
                <span className="block font-body text-label-sm text-on-surface-variant">Squad Intent</span>
                <span className="font-body text-body-md text-on-surface">{state.demandCriteria.squadIntent}</span>
              </div>
            </div>
          )}
        </header>

        {/* Status badge */}
        <div className="mb-md">
          <span
            className={clsx(
              'inline-block rounded-full px-sm py-base font-body text-label-sm',
              isFinalized
                ? 'bg-secondary-container text-on-secondary-container'
                : 'bg-tertiary-fixed text-on-tertiary-fixed',
            )}
          >
            {isFinalized ? 'Finalized' : 'Draft'}
          </span>
        </div>

        {/* Members table */}
        <section className="rounded-xl bg-surface-container p-md shadow-elevation-2">
          <h2 className="font-headline text-headline-md text-on-surface mb-sm">
            Squad Members ({state.squad.length})
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="border-b border-outline-variant">
                  <th className="px-sm py-xs font-body text-label-sm text-on-surface-variant">#</th>
                  <th className="px-sm py-xs font-body text-label-sm text-on-surface-variant">Name</th>
                  <th className="px-sm py-xs font-body text-label-sm text-on-surface-variant">Role</th>
                  <th className="px-sm py-xs font-body text-label-sm text-on-surface-variant text-right">Suitability Score</th>
                </tr>
              </thead>
              <tbody>
                {state.squad.map((member, index) => (
                  <tr
                    key={member.employeeId}
                    className="border-b border-outline-variant/50 last:border-0"
                  >
                    <td className="px-sm py-xs font-mono text-body-sm text-on-surface-variant">{index + 1}</td>
                    <td className="px-sm py-xs font-body text-body-md text-on-surface">{member.fullName}</td>
                    <td className="px-sm py-xs font-body text-body-sm text-on-surface-variant">{member.primaryRole}</td>
                    <td className="px-sm py-xs font-mono text-body-md text-primary text-right">{member.sTotal.toFixed(1)}%</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Footer actions */}
        <footer className="mt-lg flex flex-wrap items-center justify-between gap-sm">
          <button
            type="button"
            onClick={() => navigate('/candidates')}
            className="rounded-lg border border-outline-variant px-md py-xs font-body text-label-md text-on-surface hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            Back
          </button>
          <div className="flex gap-xs">
            <button
              type="button"
              onClick={handleExport}
              disabled={isExporting}
              className={clsx(
                'rounded-lg border border-outline-variant px-md py-xs font-body text-label-md text-on-surface',
                'hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20',
                isExporting && 'opacity-50 cursor-not-allowed',
              )}
            >
              {isExporting ? 'Exporting...' : 'Export Summary'}
            </button>
            {!isFinalized && (
              <button
                type="button"
                onClick={handleFinalize}
                disabled={isFinalizing}
                className={clsx(
                  'rounded-lg bg-secondary px-md py-xs font-body text-label-md text-on-secondary',
                  'hover:bg-secondary-container focus:outline-none focus:ring-2 focus:ring-secondary/30',
                  isFinalizing && 'opacity-50 cursor-not-allowed',
                )}
              >
                {isFinalizing ? 'Finalizing...' : 'Confirm Finalize'}
              </button>
            )}
            {isFinalized && (
              <button
                type="button"
                onClick={() => navigate('/')}
                className="rounded-lg bg-primary px-md py-xs font-body text-label-md text-on-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                Done
              </button>
            )}
          </div>
        </footer>
      </div>
    </div>
  );
};
