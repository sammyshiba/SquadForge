import { SCORING_WEIGHTS } from './scoring.config.js';

export const calculateSkillScore = (
  requiredSkills: string[],
  candidateSkills: { skill: string; proficiencyLevel: number }[],
): number => {
  if (requiredSkills.length === 0) return 0;

  const scores: number[] = requiredSkills.map((requiredSkill) => {
    const found = candidateSkills.find(
      (s) => s.skill.toLowerCase() === requiredSkill.toLowerCase(),
    );
    if (!found) return 0;
    return found.proficiencyLevel >= 4 ? 100 : 80;
  });

  return scores.reduce((a, b) => a + b, 0) / scores.length;
};

export const calculateAvailabilityScore = (allocationPercentage: number): number => {
  if (allocationPercentage === 0) return 100;
  if (allocationPercentage <= 50) return 70;
  return 20;
};

export const calculateRoleScore = (requestedRole: string, candidateRole: string): number => {
  return requestedRole.toUpperCase() === candidateRole.toUpperCase() ? 100 : 0;
};

export const calculateTotalScore = (sSkill: number, sAvail: number, sRole: number): number => {
  const total =
    SCORING_WEIGHTS.skill * sSkill +
    SCORING_WEIGHTS.availability * sAvail +
    SCORING_WEIGHTS.role * sRole;
  return Math.round(total * 100) / 100;
};

export const generateReason = (sSkill: number, sAvail: number, sRole: number): string => {
  const highSkill = sSkill >= 80;
  const mediumSkill = sSkill >= 50 && sSkill < 80;
  const highAvail = sAvail >= 70;
  const roleMatch = sRole === 100;

  if (highSkill && highAvail && roleMatch) {
    return 'Strong skill alignment, high availability, and exact role match.';
  }
  if (highSkill && highAvail && !roleMatch) {
    return 'Strong skill alignment and high availability, but role does not match.';
  }
  if (highSkill && !highAvail && roleMatch) {
    return 'Excellent skill match and role alignment but limited availability.';
  }
  if (highSkill && !highAvail && !roleMatch) {
    return 'Excellent skill match but limited availability and no role alignment.';
  }
  if (mediumSkill && highAvail && roleMatch) {
    return 'Moderate skill match with high availability and role alignment.';
  }
  if (mediumSkill && highAvail && !roleMatch) {
    return 'Moderate skill match and available, but role does not align.';
  }
  if (!highSkill && !mediumSkill && highAvail && roleMatch) {
    return 'Low skill match but highly available with correct role.';
  }
  return 'Limited overall suitability based on current criteria.';
};
