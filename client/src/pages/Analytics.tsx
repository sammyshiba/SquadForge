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

  // Role coverage
  const roleCounts: Record<string, number> = {};
  employees.forEach((e) => {
    roleCounts[e.primaryRole] = (roleCounts[e.primaryRole] || 0) + 1;
  });

  // Availability breakdown
  const availabilityBreakdown = {
    available: employees.filter((e) => e.currentAllocationPercentage === 0).length,
    partial: employees.filter((e) => e.currentAllocationPercentage > 0 && e.currentAllocationPercentage <= 50).length,
    limited: employees.filter((e) => e.currentAllocationPercentage > 50).length,
  };

  // Location distribution
  const locationCounts: Record<string, number> = {};
  employees.forEach((e) => {
    locationCounts[e.geographicLocation] = (locationCounts[e.geographicLocation] || 0) + 1;
  });

  // Top skills across the pool
  const skillCounts: Record<string, number> = {};
  employees.forEach((e) => {
    e.skills.forEach((s) => {
      skillCounts[s.skill] = (skillCounts[s.skill] || 0) + 1;
    });
  });
  const topSkills = Object.entries(skillCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12);

  // Average allocation
  const avgAllocation = totalPool > 0
    ? Math.round(employees.reduce((sum, e) => sum + e.currentAllocationPercentage, 0) / totalPool)
    : 0;

  return (
    <div className="p-sm md:p-lg">
      <div className="mx-auto max-w-grid">
        {/* Header */}
        <header className="mb-lg">
          <h2 className="font-headline text-headline-lg text-on-surface">Analytics</h2>
          <p className="mt-xs font-body text-body-md text-on-surface-variant">
            Resource pool overview and squad composition outcomes.
          </p>
        </header>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 gap-gutter sm:grid-cols-2 lg:grid-cols-4 mb-lg">
          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-sm">
            <span className="block font-body text-label-sm text-on-surface-variant">Resource Pool</span>
            <span className="block mt-xs font-headline text-headline-md text-on-surface">
              {isLoadingEmployees ? '...' : totalPool}
            </span>
            <span className="block mt-base font-mono text-label-sm text-on-surface-variant">
              {totalScored > 0 ? `${totalScored} scored` : 'Total employees'}
            </span>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-sm">
            <span className="block font-body text-label-sm text-on-surface-variant">Avg. Allocation</span>
            <span className="block mt-xs font-headline text-headline-md text-primary">
              {isLoadingEmployees ? '...' : `${avgAllocation}%`}
            </span>
            <span className="block mt-base font-mono text-label-sm text-on-surface-variant">
              {avgAllocation <= 30 ? 'Good capacity' : avgAllocation <= 60 ? 'Moderate load' : 'High utilization'}
            </span>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-sm">
            <span className="block font-body text-label-sm text-on-surface-variant">Filled Seats</span>
            <span className="block mt-xs font-headline text-headline-md text-secondary">
              {filledSeats} / {maxSeats}
            </span>
            <span className="block mt-base font-mono text-label-sm text-on-surface-variant">
              {Math.round((filledSeats / maxSeats) * 100)}% filled
            </span>
          </div>

          <div className="rounded-xl border border-outline-variant bg-surface-container-lowest p-sm">
            <span className="block font-body text-label-sm text-on-surface-variant">Avg. Suitability</span>
            <span className="block mt-xs font-headline text-headline-md text-on-surface">
              {averageSuitability > 0 ? `${averageSuitability.toFixed(1)}%` : '—'}
            </span>
            <span className="block mt-base font-mono text-label-sm text-on-surface-variant">
              {averageSuitability >= 70 ? 'Strong pool' : averageSuitability > 0 ? 'Fair pool' : 'Score to see'}
            </span>
          </div>
        </div>

        {/* Availability Breakdown */}
        {totalPool > 0 && (
          <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-sm mb-lg">
            <h3 className="font-headline text-headline-md text-on-surface mb-sm">Availability Breakdown</h3>
            <div className="grid grid-cols-3 gap-gutter">
              <div className="rounded-lg bg-secondary-container/10 p-xs text-center">
                <span className="block font-headline text-headline-md text-secondary">{availabilityBreakdown.available}</span>
                <span className="block mt-base font-body text-body-sm text-on-surface-variant">Fully Available</span>
                <span className="block font-mono text-label-sm text-secondary">0% allocated</span>
              </div>
              <div className="rounded-lg bg-tertiary-fixed/20 p-xs text-center">
                <span className="block font-headline text-headline-md text-on-tertiary-fixed-variant">{availabilityBreakdown.partial}</span>
                <span className="block mt-base font-body text-body-sm text-on-surface-variant">Partial Capacity</span>
                <span className="block font-mono text-label-sm text-on-tertiary-fixed-variant">1–50% allocated</span>
              </div>
              <div className="rounded-lg bg-error-container/20 p-xs text-center">
                <span className="block font-headline text-headline-md text-error">{availabilityBreakdown.limited}</span>
                <span className="block mt-base font-body text-body-sm text-on-surface-variant">Limited</span>
                <span className="block font-mono text-label-sm text-error">&gt;50% allocated</span>
              </div>
            </div>
          </section>
        )}

        {/* Role Coverage */}
        {Object.keys(roleCounts).length > 0 && (
          <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-sm mb-lg">
            <h3 className="font-headline text-headline-md text-on-surface mb-sm">Role Coverage</h3>
            <div className="space-y-xs">
              {Object.entries(roleCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([role, count]) => (
                  <div key={role} className="flex items-center gap-xs">
                    <span className="w-28 font-body text-body-sm text-on-surface">{role}</span>
                    <div className="flex-1 rounded-full bg-surface-container-high h-3">
                      <div
                        className="rounded-full bg-primary h-3 transition-all"
                        style={{ width: `${(count / totalPool) * 100}%` }}
                      />
                    </div>
                    <span className="w-8 text-right font-mono text-label-md text-primary">{count}</span>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Top Skills */}
        {topSkills.length > 0 && (
          <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-sm mb-lg">
            <h3 className="font-headline text-headline-md text-on-surface mb-sm">Top Skills in Pool</h3>
            <div className="space-y-xs">
              {topSkills.map(([skill, count]) => (
                <div key={skill} className="flex items-center gap-xs">
                  <span className="w-32 font-mono text-body-sm text-on-surface truncate" title={skill}>{skill}</span>
                  <div className="flex-1 rounded-full bg-surface-container-high h-2">
                    <div
                      className="rounded-full bg-secondary h-2 transition-all"
                      style={{ width: `${(count / totalPool) * 100}%` }}
                    />
                  </div>
                  <span className="w-12 text-right font-mono text-label-sm text-on-surface-variant">{count} ppl</span>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Location Distribution */}
        {Object.keys(locationCounts).length > 0 && (
          <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-sm mb-lg">
            <h3 className="font-headline text-headline-md text-on-surface mb-sm">Location Distribution</h3>
            <div className="grid grid-cols-2 gap-xs sm:grid-cols-3 lg:grid-cols-4">
              {Object.entries(locationCounts)
                .sort((a, b) => b[1] - a[1])
                .map(([location, count]) => (
                  <div key={location} className="flex items-center justify-between rounded-lg bg-surface-container p-xs">
                    <span className="font-body text-body-sm text-on-surface">{location.replace(', ZA', '')}</span>
                    <span className="font-mono text-label-md text-primary">{count}</span>
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Active Demand */}
        {state.demandCriteria && (
          <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-sm mb-lg">
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
        {totalPool === 0 && !isLoadingEmployees && (
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
