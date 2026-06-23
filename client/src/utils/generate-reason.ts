export const generateReason = (
  sSkill: number,
  sAvail: number,
  sRole: number,
  allocation: number,
): string => {
  const parts: string[] = [];

  // Skill assessment
  if (sSkill >= 80) parts.push('Strong skill alignment');
  else if (sSkill >= 50) parts.push('Moderate skill match');
  else parts.push('Weak skill match');

  // Availability
  if (sAvail === 100) parts.push('fully available');
  else if (sAvail === 70) parts.push(`good availability (${allocation}% allocated)`);
  else parts.push(`limited availability (${allocation}% allocated)`);

  // Role
  if (sRole === 100) parts.push('exact role match');
  else parts.push('role mismatch');

  return parts.join(', ') + '.';
};

export const getScoreColor = (value: number): string => {
  if (value >= 80) return 'text-green-600';
  if (value >= 60) return 'text-amber-600';
  return 'text-red-600';
};

export const getScoreBarColor = (value: number): string => {
  if (value >= 80) return 'bg-green-500';
  if (value >= 60) return 'bg-amber-500';
  return 'bg-red-500';
};

interface AvailabilityInfo {
  label: string;
  className: string;
}

export const getAvailabilityLabel = (allocation: number): AvailabilityInfo => {
  if (allocation === 0) return { label: 'Available Now', className: 'bg-secondary-container/10 text-secondary' };
  if (allocation <= 50) return { label: 'Partial Capacity', className: 'bg-tertiary-fixed text-on-tertiary-fixed' };
  return { label: 'Limited Capacity', className: 'bg-error-container text-on-error-container' };
};
