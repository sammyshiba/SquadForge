import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { clsx } from 'clsx';

import { useSquadContext } from '../context/SquadContext';
import { ProposedSquadBar } from '../components/ProposedSquadBar';
import { assignMember, removeMember, resetSquad, createSquad, fetchEmployees } from '../api/client';

import type { ScoredCandidate, Employee } from '../types';

const getAvailabilityBadge = (allocation: number): { label: string; className: string } => {
  if (allocation === 0) return { label: 'Fully Available', className: 'bg-secondary-container text-on-secondary-container' };
  if (allocation <= 50) return { label: 'Partially Available', className: 'bg-tertiary-fixed text-on-tertiary-fixed' };
  return { label: 'Limited', className: 'bg-error-container text-on-error-container' };
};

interface ScoreBarProps {
  label: string;
  score: number;
  maxWeight: number;
  colorClass: string;
}

const ScoreBar = ({ label, score, maxWeight, colorClass }: ScoreBarProps): JSX.Element => {
  const weighted = (score / 100) * maxWeight;
  const percentage = (weighted / maxWeight) * 100;

  return (
    <div className="flex items-center gap-xs">
      <span className="w-24 font-body text-label-sm text-on-surface-variant">{label}</span>
      <div className="flex-1 rounded-full bg-surface-container-high h-2" role="progressbar" aria-valuenow={score} aria-valuemin={0} aria-valuemax={100} aria-label={`${label} score`}>
        <div
          className={clsx('rounded-full h-2 transition-all', colorClass)}
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="w-12 text-right font-mono text-label-sm text-on-surface">
        {weighted.toFixed(0)}/{maxWeight}
      </span>
    </div>
  );
};

interface CandidateCardProps {
  candidate: ScoredCandidate;
  isInSquad: boolean;
  onAssign: (candidate: ScoredCandidate) => void;
}

const CandidateCard = ({ candidate, isInSquad, onAssign }: CandidateCardProps): JSX.Element => {
  const badge = getAvailabilityBadge(candidate.currentAllocationPercentage);

  return (
    <article
      className="rounded-xl bg-surface-container p-md shadow-elevation-2"
      aria-label={`Candidate ${candidate.fullName}`}
    >
      <div className="flex items-start justify-between">
        <div>
          <h3 className="font-headline text-headline-md text-on-surface">
            #{candidate.rank} {candidate.fullName}
          </h3>
          <p className="mt-base font-body text-body-sm text-on-surface-variant">
            {candidate.primaryRole}
          </p>
        </div>
        <div className="text-right">
          <span className="font-mono text-headline-md text-primary">
            {candidate.sTotal.toFixed(1)}%
          </span>
          <span className={clsx('mt-base block rounded-full px-xs py-base text-center text-label-sm', badge.className)}>
            {badge.label}
          </span>
        </div>
      </div>

      {/* Score Breakdown */}
      <div className="mt-sm space-y-xs">
        <ScoreBar label="Skills" score={candidate.sSkill} maxWeight={50} colorClass="bg-primary" />
        <ScoreBar label="Availability" score={candidate.sAvail} maxWeight={30} colorClass="bg-secondary" />
        <ScoreBar label="Role" score={candidate.sRole} maxWeight={20} colorClass="bg-tertiary" />
      </div>

      {/* Reason */}
      <p className="mt-sm font-body text-body-sm text-on-surface-variant italic">
        {candidate.reason}
      </p>

      {/* Assign Button */}
      <div className="mt-sm">
        <button
          type="button"
          onClick={() => onAssign(candidate)}
          disabled={isInSquad}
          aria-label={isInSquad ? `${candidate.fullName} already assigned` : `Assign ${candidate.fullName} to squad`}
          className={clsx(
            'w-full rounded-lg px-sm py-xs font-body text-label-md focus:outline-none focus:ring-2 focus:ring-primary/20',
            isInSquad
              ? 'bg-surface-container-high text-on-surface-variant cursor-not-allowed'
              : 'bg-primary text-on-primary hover:bg-primary-container',
          )}
        >
          {isInSquad ? 'Assigned to Squad' : 'Assign to Squad'}
        </button>
      </div>
    </article>
  );
};

export const CandidateList = (): JSX.Element => {
  const { state, dispatch } = useSquadContext();
  const navigate = useNavigate();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [isLoadingPool, setIsLoadingPool] = useState(false);

  // Load all employees as a browsable pool when no scored candidates exist
  useEffect(() => {
    if (state.candidateList.length === 0) {
      setIsLoadingPool(true);
      fetchEmployees()
        .then((data) => setEmployees(data))
        .catch((error) => console.error('[CandidateList] Failed to load employee pool:', error))
        .finally(() => setIsLoadingPool(false));
    }
  }, [state.candidateList.length]);

  const ensureSquadCreated = async (): Promise<string | null> => {
    if (state.squadId) return state.squadId;
    if (!state.demandId || !state.demandCriteria) return null;

    try {
      const result = await createSquad(state.demandId, `Squad for ${state.demandCriteria.projectCode}`);
      dispatch({ type: 'SET_SQUAD_ID', payload: result.id });
      return result.id;
    } catch (error) {
      console.error('[CandidateList] Failed to create squad:', error);
      return null;
    }
  };

  const handleAssign = async (candidate: ScoredCandidate): Promise<void> => {
    const squadId = await ensureSquadCreated();
    if (!squadId) return;

    try {
      await assignMember(squadId, candidate.employeeId);
      dispatch({
        type: 'ADD_TO_SQUAD',
        payload: {
          employeeId: candidate.employeeId,
          fullName: candidate.fullName,
          primaryRole: candidate.primaryRole,
          sTotal: candidate.sTotal,
        },
      });
    } catch (error) {
      console.error('[CandidateList] Failed to assign member:', error);
    }
  };

  const handleRemove = async (employeeId: string): Promise<void> => {
    if (!state.squadId) return;
    try {
      await removeMember(state.squadId, employeeId);
      dispatch({ type: 'REMOVE_FROM_SQUAD', payload: employeeId });
    } catch (error) {
      console.error('[CandidateList] Failed to remove member:', error);
    }
  };

  const handleReset = async (): Promise<void> => {
    if (!state.squadId) return;
    try {
      await resetSquad(state.squadId);
      dispatch({ type: 'RESET_SQUAD' });
    } catch (error) {
      console.error('[CandidateList] Failed to reset squad:', error);
    }
  };

  const handleFinalize = (): void => {
    navigate('/squad-summary');
  };

  if (state.candidateList.length === 0) {
    return (
      <div className="p-sm pb-xl md:p-lg md:pb-xl">
        <div className="mx-auto max-w-grid">
          <header className="mb-lg flex items-center justify-between">
            <div>
              <h1 className="font-headline text-headline-lg text-on-surface">
                Resource Queue
              </h1>
              <p className="mt-xs font-body text-body-md text-on-surface-variant">
                {isLoadingPool
                  ? 'Loading employees...'
                  : `${employees.length} employees in the pool. Submit a demand to rank them by suitability.`}
              </p>
            </div>
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-lg bg-primary px-sm py-xs font-body text-label-md text-on-primary hover:bg-primary-container focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              Create Demand
            </button>
          </header>

          {/* Unscored employee grid */}
          {employees.length > 0 && (
            <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
              {employees.map((emp) => {
                const badge = getAvailabilityBadge(emp.currentAllocationPercentage);
                return (
                  <article
                    key={emp.id}
                    className="rounded-xl bg-surface-container p-md shadow-elevation-2"
                    aria-label={`Employee ${emp.fullName}`}
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-headline text-headline-md text-on-surface">
                          {emp.fullName}
                        </h3>
                        <p className="mt-base font-body text-body-sm text-on-surface-variant">
                          {emp.primaryRole}
                        </p>
                      </div>
                      <span className={clsx('rounded-full px-xs py-base text-label-sm', badge.className)}>
                        {badge.label}
                      </span>
                    </div>
                    <div className="mt-sm space-y-xs">
                      {emp.skills.map((skill) => (
                        <div key={skill.id} className="flex items-center gap-xs">
                          <span className="w-24 font-mono text-label-sm text-on-surface-variant truncate" title={skill.skill}>
                            {skill.skill}
                          </span>
                          <div className="flex-1 rounded-full bg-surface-container-high h-2" role="progressbar" aria-valuenow={skill.proficiencyLevel} aria-valuemin={0} aria-valuemax={5} aria-label={`${skill.skill} proficiency`}>
                            <div
                              className={clsx(
                                'rounded-full h-2 transition-all',
                                skill.proficiencyLevel >= 4 ? 'bg-primary' : skill.proficiencyLevel >= 3 ? 'bg-secondary' : 'bg-outline',
                              )}
                              style={{ width: `${(skill.proficiencyLevel / 5) * 100}%` }}
                            />
                          </div>
                          <span className="w-8 text-right font-mono text-label-sm text-on-surface">
                            L{skill.proficiencyLevel}
                          </span>
                        </div>
                      ))}
                    </div>
                    <p className="mt-sm font-mono text-label-sm text-on-surface-variant">
                      {emp.geographicLocation} · {emp.currentAllocationPercentage}% allocated
                    </p>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="p-sm pb-xl md:p-lg md:pb-xl">
      <div className="mx-auto max-w-grid">
        <header className="mb-lg flex items-center justify-between">
          <div>
            <h1 className="font-headline text-headline-lg text-on-surface">
              Ranked Candidates
            </h1>
            <p className="mt-xs font-body text-body-md text-on-surface-variant">
              {state.candidateList.length} candidates scored and ranked by suitability.
            </p>
          </div>
          <div className="flex gap-xs">
            <button
              type="button"
              onClick={() => navigate('/')}
              className="rounded-lg border border-outline-variant px-sm py-xs font-body text-label-md text-on-surface hover:bg-surface-container-high focus:outline-none focus:ring-2 focus:ring-primary/20"
            >
              New Search
            </button>
          </div>
        </header>

        {/* Candidate Grid */}
        <div className="grid grid-cols-1 gap-gutter md:grid-cols-2 lg:grid-cols-3">
          {state.candidateList.map((candidate) => (
            <CandidateCard
              key={candidate.employeeId}
              candidate={candidate}
              isInSquad={state.squad.some((m) => m.employeeId === candidate.employeeId)}
              onAssign={handleAssign}
            />
          ))}
        </div>
      </div>

      {/* Proposed Squad Bar */}
      <ProposedSquadBar
        squad={state.squad}
        onRemove={handleRemove}
        onReset={handleReset}
        onFinalize={handleFinalize}
      />
    </div>
  );
};
