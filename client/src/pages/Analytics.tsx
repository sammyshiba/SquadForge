import { useEffect, useState } from 'react';

import { useSquadContext } from '../context/SquadContext';
import { fetchEmployees } from '../api/client';

import type { Employee } from '../types';

export const Analytics = (): JSX.Element => {
  const { state } = useSquadContext();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingEmployees, setIsLoadingEmployees] = useState(true);

  useEffect(() => {
    const loadEmployees = async (): Promise<void> => {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('[Analytics] Failed to load employees:', error);
      } finally {
        setIsLoadingEmployees(false);
      }
    };
    void loadEmployees();
  }, []);

  const totalPool = employees.length;
  const totalScored = state.candidateList.length;
  const averageSuitability = totalScored > 0
    ? state.candidateList.reduce((sum, c) => sum + c.sTotal, 0) / totalScored
    : 0;
  const filledSeats = state.squad.length;
  const maxSeats = 5;

  // Role coverage from full employee pool
  const roleCounts: Record<string, number> = {};
  employees.forEach((e) => {
    roleCounts[e.primaryRole] = (roleCounts[e.primaryRole] || 0) + 1;
  });

  return (
    <div className="p-sm md:p-lg">
      <div className="mx-auto max-w-grid">
        {/* Header */}
        <header className="mb-lg">
          <h2 className="font-headline text-headline-lg text-on-surface">Analytics</h2>
          <p className="mt-xs font-body text-body-md text-on-surface-variant">
            Overview of recommendation and squad composition outcomes.
          </p>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4 mb-lg">
          {/* Total Candidates */}
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-sm">
            <span className="block font-body text-label-sm text-on-surface-variant">Resource Pool</span>
            <span className="block mt-xs font-headline text-headline-md text-on-surface">
              {isLoadingEmployees ? '...' : totalPool}
            </span>
            <span className="block mt-base font-mono text-label-sm text-on-surface-variant">
              {totalScored > 0 ? `${totalScored} scored` : 'Available employees'}
            </span>
          </div>

          {/* Average Suitability */}
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-sm">
            <span className="block font-body text-label-sm text-on-surface-variant">Avg. Suitability</span>
            <span className="block mt-xs font-headline text-headline-md text-primary">
              {averageSuitability > 0 ? `${averageSuitability.toFixed(1)}%` : '—'}
            </span>
            <span className="block mt-base font-mono text-label-sm text-on-surface-variant">
              {averageSuitability >= 70 ? 'Strong pool' : averageSuitability >= 50 ? 'Fair pool' : 'Generate recommendations'}
            </span>
          </div>

          {/* Filled Seats */}
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-sm">
            <span className="block font-body text-label-sm text-on-surface-variant">Filled Seats</span>
            <span className="block mt-xs font-headline text-headline-md text-secondary">
              {filledSeats} / {maxSeats}
            </span>
            <span className="block mt-base font-mono text-label-sm text-on-surface-variant">
              {Math.round((filledSeats / maxSeats) * 100)}% filled
            </span>
          </div>

          {/* Squad Status */}
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-sm">
            <span className="block font-body text-label-sm text-on-surface-variant">Squad Status</span>
            <span className="block mt-xs font-headline text-headline-md text-on-surface capitalize">
              {state.squadStatus}
            </span>
            <span className="block mt-base font-mono text-label-sm text-on-surface-variant">
              {state.squadId ? `ID: ${state.squadId.slice(0, 8)}...` : 'Not started'}
            </span>
          </div>
        </div>

        {/* Role Coverage — always show from pool */}
        {Object.keys(roleCounts).length > 0 && (
          <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-sm mb-lg">
            <h3 className="font-headline text-headline-md text-on-surface mb-sm">Role Coverage</h3>
            <div className="grid grid-cols-2 gap-xs sm:grid-cols-3 lg:grid-cols-4">
              {Object.entries(roleCounts).map(([role, count]) => (
                <div key={role} className="flex items-center justify-between rounded-lg bg-surface-container p-xs">
                  <span className="font-body text-body-sm text-on-surface">{role}</span>
                  <span className="font-mono text-label-md text-primary">{count}</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Demand info */}
        {state.demandCriteria && (
          <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-sm">
            <h3 className="font-headline text-headline-md text-on-surface mb-sm">Active Demand</h3>
            <div className="grid grid-cols-1 gap-xs sm:grid-cols-2 lg:grid-cols-3">
              <div className="rounded-lg bg-surface-container p-xs">
                <span className="block font-body text-label-sm text-on-surface-variant">Project Code</span>
                <span className="font-mono text-body-md text-on-surface">{state.demandCriteria.projectCode}</span>
              </div>
              <div className="rounded-lg bg-surface-container p-xs">
                <span className="block font-body text-label-sm text-on-surface-variant">Business Domain</span>
                <span className="font-body text-body-md text-on-surface">{state.demandCriteria.businessDomain}</span>
              </div>
              <div className="rounded-lg bg-surface-container p-xs">
                <span className="block font-body text-label-sm text-on-surface-variant">Required Role</span>
                <span className="font-body text-body-md text-on-surface">{state.demandCriteria.requiredRole}</span>
              </div>
              <div className="rounded-lg bg-surface-container p-xs">
                <span className="block font-body text-label-sm text-on-surface-variant">Urgency</span>
                <span className="font-body text-body-md text-on-surface">{state.demandCriteria.urgency}</span>
              </div>
              <div className="rounded-lg bg-surface-container p-xs">
                <span className="block font-body text-label-sm text-on-surface-variant">Duration</span>
                <span className="font-mono text-body-md text-on-surface">{state.demandCriteria.durationWeeks} weeks</span>
              </div>
              <div className="rounded-lg bg-surface-container p-xs">
                <span className="block font-body text-label-sm text-on-surface-variant">Skills Required</span>
                <span className="font-body text-body-md text-on-surface">{state.demandCriteria.requiredSkills.join(', ')}</span>
              </div>
            </div>
          </section>
        )}

        {/* Empty state */}
        {totalPool === 0 && !isLoadingEmployees && !state.demandCriteria && (
          <div className="text-center py-xl">
            <p className="font-body text-body-lg text-on-surface-variant">
              No employees found. Check database connection.
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
