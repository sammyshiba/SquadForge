import { ScoreBar } from './ScoreBar';
import { SuitabilityScore } from './SuitabilityScore';
import { SkillChip } from './SkillChip';
import { generateReason } from '../utils/generate-reason';

import type { SkillProfile } from '../types';

interface CandidateBreakdownProps {
  sSkill: number;
  sAvail: number;
  sRole: number;
  sTotal: number;
  currentAllocationPercentage: number;
  skills?: SkillProfile[];
  requiredSkills?: string[];
}

export const CandidateBreakdown = ({
  sSkill,
  sAvail,
  sRole,
  sTotal,
  currentAllocationPercentage,
  skills = [],
  requiredSkills = [],
}: CandidateBreakdownProps): JSX.Element => {
  const reason = generateReason(sSkill, sAvail, sRole, currentAllocationPercentage);

  return (
    <div className="border-t border-outline-variant bg-surface-container-low p-sm mt-sm rounded-b-lg">
      {/* Score breakdown */}
      <div className="space-y-xs">
        <ScoreBar label="Skills Match" value={Math.round(sSkill)} max={100} />
        <ScoreBar label="Availability" value={Math.round(sAvail)} max={100} />
        <ScoreBar label="Role Fit" value={Math.round(sRole)} max={100} />
      </div>

      {/* Formula */}
      <p className="mt-sm font-mono text-label-sm text-on-surface-variant">
        Total = (50% × Skills) + (30% × Avail) + (20% × Role)
      </p>

      {/* Total Score */}
      <div className="mt-sm flex items-center gap-xs">
        <span className="font-body text-body-sm text-on-surface-variant">Total Score:</span>
        <SuitabilityScore value={sTotal} />
      </div>

      {/* Reason */}
      <p className="mt-sm font-body text-body-sm text-on-surface-variant italic">
        {reason}
      </p>

      {/* Skills chips */}
      {skills.length > 0 && (
        <div className="mt-sm flex flex-wrap gap-xs">
          {skills.map((skill) => (
            <SkillChip
              key={skill.id}
              name={skill.skill}
              level={skill.proficiencyLevel}
              isMatched={requiredSkills.includes(skill.skill)}
            />
          ))}
        </div>
      )}
    </div>
  );
};
