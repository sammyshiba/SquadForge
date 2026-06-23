import { useEffect, useState } from 'react';
import { clsx } from 'clsx';

import { fetchEmployees } from '../api/client';

import type { Employee } from '../types';

const getAvailabilityBadge = (allocation: number): { label: string; className: string } => {
  if (allocation === 0) return { label: 'Available', className: 'bg-secondary-container/10 text-secondary' };
  if (allocation <= 50) return { label: 'Partial', className: 'bg-tertiary-fixed text-on-tertiary-fixed' };
  return { label: 'Limited', className: 'bg-error-container text-on-error-container' };
};

export const TeamConfig = (): JSX.Element => {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('');

  useEffect(() => {
    const loadEmployees = async (): Promise<void> => {
      try {
        const data = await fetchEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('[TeamConfig] Failed to load employees:', error);
      } finally {
        setIsLoading(false);
      }
    };
    void loadEmployees();
  }, []);

  const roles = [...new Set(employees.map((e) => e.primaryRole))].sort();

  const filtered = employees.filter((emp) => {
    const matchesSearch = searchTerm === '' ||
      emp.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.skills.some((s) => s.skill.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesRole = roleFilter === '' || emp.primaryRole === roleFilter;
    const matchesAvailability =
      availabilityFilter === '' ||
      (availabilityFilter === 'available' && emp.currentAllocationPercentage === 0) ||
      (availabilityFilter === 'partial' && emp.currentAllocationPercentage > 0 && emp.currentAllocationPercentage <= 50) ||
      (availabilityFilter === 'limited' && emp.currentAllocationPercentage > 50);
    return matchesSearch && matchesRole && matchesAvailability;
  });

  return (
    <div className="p-sm md:p-lg">
      <div className="mx-auto max-w-grid">
        {/* Header */}
        <header className="mb-lg">
          <h2 className="font-headline text-headline-lg text-on-surface">Team Config</h2>
          <p className="mt-xs font-body text-body-md text-on-surface-variant">
            Review the mock candidate pool and scoring assumptions used by the prototype.
          </p>
        </header>

        {/* Scoring Weights Card */}
        <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-sm mb-lg">
          <h3 className="font-headline text-headline-md text-on-surface mb-sm">Scoring Weights</h3>
          <p className="font-body text-body-sm text-on-surface-variant mb-sm">
            Candidates are ranked using a deterministic weighted formula:
          </p>
          <div className="space-y-xs">
            <div className="flex items-center gap-xs">
              <span className="w-28 font-body text-body-sm text-on-surface">Skill Match</span>
              <div className="flex-1 rounded-full bg-surface-container-high h-3">
                <div className="rounded-full bg-primary h-3" style={{ width: '50%' }} />
              </div>
              <span className="w-10 text-right font-mono text-label-md text-primary">50%</span>
            </div>
            <div className="flex items-center gap-xs">
              <span className="w-28 font-body text-body-sm text-on-surface">Availability</span>
              <div className="flex-1 rounded-full bg-surface-container-high h-3">
                <div className="rounded-full bg-secondary h-3" style={{ width: '30%' }} />
              </div>
              <span className="w-10 text-right font-mono text-label-md text-secondary">30%</span>
            </div>
            <div className="flex items-center gap-xs">
              <span className="w-28 font-body text-body-sm text-on-surface">Role Alignment</span>
              <div className="flex-1 rounded-full bg-surface-container-high h-3">
                <div className="rounded-full bg-tertiary-fixed-dim h-3" style={{ width: '20%' }} />
              </div>
              <span className="w-10 text-right font-mono text-label-md text-on-tertiary-fixed-variant">20%</span>
            </div>
          </div>
          <p className="mt-sm font-mono text-label-sm text-on-surface-variant">
            S<sub>total</sub> = 0.50 × S<sub>skill</sub> + 0.30 × S<sub>avail</sub> + 0.20 × S<sub>role</sub>
          </p>
        </section>

        {/* Filters */}
        <section className="rounded-xl border border-outline-variant bg-surface-container-lowest p-sm mb-lg">
          <div className="flex flex-col gap-sm sm:flex-row sm:items-center">
            <input
              type="text"
              placeholder="Search by name or skill..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search employees"
              className="flex-1 rounded-lg border border-outline-variant bg-surface-container-low px-sm py-xs font-body text-body-sm text-on-surface placeholder:text-on-surface-variant/50 focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            />
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              aria-label="Filter by role"
              className="rounded-lg border border-outline-variant bg-surface-container-low px-sm py-xs font-body text-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            >
              <option value="">All Roles</option>
              {roles.map((role) => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
            <select
              value={availabilityFilter}
              onChange={(e) => setAvailabilityFilter(e.target.value)}
              aria-label="Filter by availability"
              className="rounded-lg border border-outline-variant bg-surface-container-low px-sm py-xs font-body text-body-sm text-on-surface focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary/20"
            >
              <option value="">All Availability</option>
              <option value="available">Fully Available (0%)</option>
              <option value="partial">Partial (1–50%)</option>
              <option value="limited">Limited (&gt;50%)</option>
            </select>
          </div>
          <p className="mt-xs font-mono text-label-sm text-on-surface-variant">
            Showing {filtered.length} of {employees.length} employees
          </p>
        </section>

        {/* Employee Table */}
        {isLoading ? (
          <div className="text-center py-xl">
            <p className="font-body text-body-md text-on-surface-variant">Loading team data...</p>
          </div>
        ) : (
          <section className="rounded-xl border border-outline-variant bg-surface-container-lowest overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-outline-variant bg-surface-container">
                    <th className="px-sm py-xs font-body text-label-sm text-on-surface-variant">Name</th>
                    <th className="px-sm py-xs font-body text-label-sm text-on-surface-variant">Role</th>
                    <th className="px-sm py-xs font-body text-label-sm text-on-surface-variant">Location</th>
                    <th className="px-sm py-xs font-body text-label-sm text-on-surface-variant">Allocation</th>
                    <th className="px-sm py-xs font-body text-label-sm text-on-surface-variant">Status</th>
                    <th className="px-sm py-xs font-body text-label-sm text-on-surface-variant">Skills</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((emp, index) => {
                    const badge = getAvailabilityBadge(emp.currentAllocationPercentage);
                    return (
                      <tr
                        key={emp.id}
                        className={clsx(
                          'border-b border-outline-variant/50 last:border-0 hover:bg-surface-container-low transition-colors',
                          index % 2 === 0 ? 'bg-surface-container-lowest' : 'bg-surface-container-low/30',
                        )}
                      >
                        <td className="px-sm py-xs">
                          <span className="font-body text-body-sm text-on-surface font-medium">{emp.fullName}</span>
                          <span className="block font-mono text-label-sm text-on-surface-variant">{emp.email}</span>
                        </td>
                        <td className="px-sm py-xs font-mono text-body-sm text-on-surface">{emp.primaryRole}</td>
                        <td className="px-sm py-xs font-body text-body-sm text-on-surface-variant">
                          {emp.geographicLocation.replace(', ZA', '')}
                        </td>
                        <td className="px-sm py-xs">
                          <div className="flex items-center gap-xs">
                            <div className="w-16 rounded-full bg-surface-container-high h-2">
                              <div
                                className={clsx(
                                  'rounded-full h-2',
                                  emp.currentAllocationPercentage === 0 ? 'bg-secondary' :
                                  emp.currentAllocationPercentage <= 50 ? 'bg-tertiary-fixed-dim' : 'bg-error',
                                )}
                                style={{ width: `${emp.currentAllocationPercentage}%` }}
                              />
                            </div>
                            <span className="font-mono text-label-sm text-on-surface-variant">
                              {emp.currentAllocationPercentage}%
                            </span>
                          </div>
                        </td>
                        <td className="px-sm py-xs">
                          <span className={clsx('rounded-full px-xs py-base font-mono text-label-sm', badge.className)}>
                            {badge.label}
                          </span>
                        </td>
                        <td className="px-sm py-xs">
                          <div className="flex flex-wrap gap-base max-w-xs">
                            {emp.skills.slice(0, 4).map((s) => (
                              <span
                                key={s.id}
                                className="rounded bg-surface-container px-base py-base font-mono text-label-sm text-on-surface-variant"
                                title={`${s.skill} - Level ${s.proficiencyLevel}`}
                              >
                                {s.skill}
                              </span>
                            ))}
                            {emp.skills.length > 4 && (
                              <span className="font-mono text-label-sm text-on-surface-variant">
                                +{emp.skills.length - 4}
                              </span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </div>
    </div>
  );
};
