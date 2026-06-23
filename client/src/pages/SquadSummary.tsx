import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

import { useSquadContext } from '../context/SquadContext';
import { fetchSquads, finalizeSquad, exportSquad, resetSquad } from '../api/client';
import { downloadSquadExport } from '../utils/export-squad';

import type { SquadListItem } from '../api/client';

export const SquadSummary = (): JSX.Element => {
  const { state, dispatch } = useSquadContext();
  const navigate = useNavigate();
  const [squads, setSquads] = useState<SquadListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);
  const [actioningId, setActioningId] = useState<string | null>(null);

  const loadSquads = async (): Promise<void> => {
    try {
      const data = await fetchSquads();
      setSquads(data);
    } catch (error) {
      console.error('[SquadSummary] Failed to load squads:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void loadSquads();
  }, []);

  const showToast = (message: string): void => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleFinalize = async (squadId: string): Promise<void> => {
    setActioningId(squadId);
    try {
      await finalizeSquad(squadId);
      if (state.squadId === squadId) {
        dispatch({ type: 'FINALIZE_SQUAD' });
      }
      showToast('Squad finalized successfully!');
      await loadSquads();
    } catch (error) {
      const msg = error instanceof Error ? error.message : 'Failed to finalize squad.';
      showToast(msg);
    } finally {
      setActioningId(null);
    }
  };

  const handleExport = async (squadId: string): Promise<void> => {
    setActioningId(squadId);
    try {
      const data = await exportSquad(squadId);
      downloadSquadExport(data);
    } catch (error) {
      showToast('Failed to export squad data.');
    } finally {
      setActioningId(null);
    }
  };

  const handleReset = async (squadId: string): Promise<void> => {
    setActioningId(squadId);
    try {
      await resetSquad(squadId);
      if (state.squadId === squadId) {
        dispatch({ type: 'RESET_SQUAD' });
      }
      showToast('Squad reset successfully.');
      await loadSquads();
    } catch (error) {
      showToast('Failed to reset squad.');
    } finally {
      setActioningId(null);
    }
  };

  const handleNewSquad = (): void => {
    dispatch({ type: 'RESET' });
    navigate('/');
  };

  // Combine: show persisted squads from API + current in-memory squad if not yet persisted
  const currentSquadInList = squads.find((s) => s.id === state.squadId);
  const showCurrentSquad = state.squad.length > 0 && !currentSquadInList && state.squadStatus !== 'finalized';

  return (
    <div className="p-sm md:p-lg">
      <div className="mx-auto max-w-grid">
        {/* Toast */}
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
        <header className="mb-lg flex items-center justify-between">
          <div>
            <h2 className="font-headline text-headline-lg text-on-surface">Squad Summary</h2>
            <p className="mt-xs font-body text-body-md text-on-surface-variant">
              View and manage all proposed squads.
            </p>
          </div>
          <button
            type="button"
            onClick={handleNewSquad}
            className="rounded-lg bg-primary px-sm py-xs font-body text-label-md text-on-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary/20"
          >
            New Demand + Squad
          </button>
        </header>

        {/* Current in-progress squad (not yet persisted) */}
        {showCurrentSquad && (
          <section className="mb-lg rounded-xl border-2 border-primary bg-surface-container-lowest p-sm shadow-elevation-2">
            <div className="flex items-center justify-between mb-sm">
              <div>
                <h3 className="font-headline text-headline-md text-on-surface">
                  Current Squad (In Progress)
                </h3>
                {state.demandCriteria && (
                  <p className="font-mono text-label-sm text-on-surface-variant">
                    {state.demandCriteria.projectCode} · {state.demandCriteria.businessDomain}
                  </p>
                )}
              </div>
              <span className="rounded-full bg-tertiary-fixed px-sm py-base font-mono text-label-sm text-on-tertiary-fixed">
                Draft
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant">
                    <th className="px-sm py-xs font-body text-label-sm text-on-surface-variant">#</th>
                    <th className="px-sm py-xs font-body text-label-sm text-on-surface-variant">Name</th>
                    <th className="px-sm py-xs font-body text-label-sm text-on-surface-variant">Role</th>
                    <th className="px-sm py-xs font-body text-label-sm text-on-surface-variant text-right">Score</th>
                  </tr>
                </thead>
                <tbody>
                  {state.squad.map((member, idx) => (
                    <tr key={member.employeeId} className="border-b border-outline-variant/50 last:border-0">
                      <td className="px-sm py-xs font-mono text-body-sm text-on-surface-variant">{idx + 1}</td>
                      <td className="px-sm py-xs font-body text-body-md text-on-surface">{member.fullName}</td>
                      <td className="px-sm py-xs font-body text-body-sm text-on-surface-variant">{member.primaryRole}</td>
                      <td className="px-sm py-xs font-mono text-body-md text-primary text-right">{member.sTotal.toFixed(1)}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="mt-sm flex gap-xs">
              <button
                type="button"
                onClick={() => navigate('/candidates')}
                className="rounded-lg border border-outline-variant px-sm py-xs font-body text-label-md text-on-surface hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20"
              >
                Continue Building
              </button>
            </div>
          </section>
        )}

        {/* Loading */}
        {isLoading && (
          <div className="text-center py-xl">
            <p className="font-body text-body-md text-on-surface-variant">Loading squads...</p>
          </div>
        )}

        {/* Persisted squads */}
        {!isLoading && squads.length === 0 && !showCurrentSquad && (
          <div className="text-center py-xl">
            <p className="font-body text-body-lg text-on-surface-variant mb-md">
              No squads created yet. Start by capturing a demand and building a squad.
            </p>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-lg bg-primary px-md py-xs font-body text-label-md text-on-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              Go to Demand Center
            </button>
          </div>
        )}

        {!isLoading && squads.length > 0 && (
          <div className="space-y-md">
            {squads.map((squad) => (
              <section
                key={squad.id}
                className={clsx(
                  'rounded-xl border bg-surface-container-lowest p-sm shadow-elevation-2',
                  squad.status === 'FINALIZED' ? 'border-secondary/30' : 'border-outline-variant',
                )}
              >
                <div className="flex items-start justify-between mb-sm">
                  <div>
                    <h3 className="font-headline text-headline-md text-on-surface">{squad.squadName}</h3>
                    <p className="font-mono text-label-sm text-on-surface-variant">
                      {squad.projectCode} · {squad.businessDomain} · {squad.squadIntent}
                    </p>
                  </div>
                  <span
                    className={clsx(
                      'rounded-full px-sm py-base font-mono text-label-sm',
                      squad.status === 'FINALIZED'
                        ? 'bg-secondary-container text-on-secondary-container'
                        : squad.status === 'ABANDONED'
                          ? 'bg-error-container text-on-error-container'
                          : 'bg-tertiary-fixed text-on-tertiary-fixed',
                    )}
                  >
                    {squad.status}
                  </span>
                </div>

                {/* Members */}
                {squad.members.length > 0 ? (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-outline-variant">
                          <th className="px-sm py-xs font-body text-label-sm text-on-surface-variant">#</th>
                          <th className="px-sm py-xs font-body text-label-sm text-on-surface-variant">Name</th>
                          <th className="px-sm py-xs font-body text-label-sm text-on-surface-variant">Role</th>
                        </tr>
                      </thead>
                      <tbody>
                        {squad.members.map((member, idx) => (
                          <tr key={member.employeeId} className="border-b border-outline-variant/50 last:border-0">
                            <td className="px-sm py-xs font-mono text-body-sm text-on-surface-variant">{idx + 1}</td>
                            <td className="px-sm py-xs font-body text-body-md text-on-surface">{member.name}</td>
                            <td className="px-sm py-xs font-body text-body-sm text-on-surface-variant">{member.primaryRole}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <p className="font-body text-body-sm text-on-surface-variant italic">No members assigned.</p>
                )}

                {/* Actions */}
                <div className="mt-sm flex flex-wrap gap-xs">
                  {squad.status === 'DRAFT' && (
                    <>
                      <button
                        type="button"
                        onClick={() => handleFinalize(squad.id)}
                        disabled={actioningId === squad.id || squad.members.length === 0}
                        className={clsx(
                          'rounded-lg bg-secondary px-sm py-xs font-body text-label-md text-on-secondary',
                          'focus:outline-none focus:ring-2 focus:ring-secondary/30',
                          (actioningId === squad.id || squad.members.length === 0) && 'opacity-50 cursor-not-allowed',
                        )}
                      >
                        Finalize
                      </button>
                      <button
                        type="button"
                        onClick={() => handleReset(squad.id)}
                        disabled={actioningId === squad.id}
                        className={clsx(
                          'rounded-lg border border-outline-variant px-sm py-xs font-body text-label-md text-on-surface',
                          'hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20',
                          actioningId === squad.id && 'opacity-50 cursor-not-allowed',
                        )}
                      >
                        Reset
                      </button>
                    </>
                  )}
                  <button
                    type="button"
                    onClick={() => handleExport(squad.id)}
                    disabled={actioningId === squad.id}
                    className={clsx(
                      'rounded-lg border border-outline-variant px-sm py-xs font-body text-label-md text-on-surface',
                      'hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20',
                      actioningId === squad.id && 'opacity-50 cursor-not-allowed',
                    )}
                  >
                    Export
                  </button>
                </div>

                {/* Metadata */}
                <p className="mt-xs font-mono text-label-sm text-on-surface-variant">
                  {squad.filledSeats} member{squad.filledSeats !== 1 ? 's' : ''} · Created {new Date(squad.createdAt).toLocaleDateString()}
                </p>
              </section>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
