import { describe, it, expect } from 'vitest';

import {
  calculateSkillScore,
  calculateAvailabilityScore,
  calculateRoleScore,
  calculateTotalScore,
  generateReason,
} from '../src/services/scoring-service.js';

describe('calculateSkillScore', () => {
  it('returns 100 for exact match with proficiency level 5', () => {
    const result = calculateSkillScore(
      ['React'],
      [{ skill: 'React', proficiencyLevel: 5 }],
    );
    expect(result).toBe(100);
  });

  it('returns 100 for exact match with proficiency level 4', () => {
    const result = calculateSkillScore(
      ['TypeScript'],
      [{ skill: 'TypeScript', proficiencyLevel: 4 }],
    );
    expect(result).toBe(100);
  });

  it('returns 80 for match with proficiency level 3', () => {
    const result = calculateSkillScore(
      ['Node.js'],
      [{ skill: 'Node.js', proficiencyLevel: 3 }],
    );
    expect(result).toBe(80);
  });

  it('returns 0 when skill is not found', () => {
    const result = calculateSkillScore(
      ['GraphQL'],
      [{ skill: 'React', proficiencyLevel: 5 }],
    );
    expect(result).toBe(0);
  });

  it('handles multiple skills with mixed proficiencies', () => {
    const result = calculateSkillScore(
      ['React', 'TypeScript', 'GraphQL'],
      [
        { skill: 'React', proficiencyLevel: 5 },
        { skill: 'TypeScript', proficiencyLevel: 3 },
      ],
    );
    // React: 100, TypeScript: 80, GraphQL: 0 → (100 + 80 + 0) / 3 = 60
    expect(result).toBeCloseTo(60, 2);
  });

  it('returns 0 for empty required skills', () => {
    const result = calculateSkillScore(
      [],
      [{ skill: 'React', proficiencyLevel: 5 }],
    );
    expect(result).toBe(0);
  });

  it('is case-insensitive for skill matching', () => {
    const result = calculateSkillScore(
      ['react'],
      [{ skill: 'React', proficiencyLevel: 5 }],
    );
    expect(result).toBe(100);
  });

  it('returns 80 for proficiency level 1', () => {
    const result = calculateSkillScore(
      ['CSS'],
      [{ skill: 'CSS', proficiencyLevel: 1 }],
    );
    expect(result).toBe(80);
  });
});

describe('calculateAvailabilityScore', () => {
  it('returns 100 for 0% allocation', () => {
    expect(calculateAvailabilityScore(0)).toBe(100);
  });

  it('returns 70 for 25% allocation', () => {
    expect(calculateAvailabilityScore(25)).toBe(70);
  });

  it('returns 70 for 50% allocation', () => {
    expect(calculateAvailabilityScore(50)).toBe(70);
  });

  it('returns 20 for 75% allocation', () => {
    expect(calculateAvailabilityScore(75)).toBe(20);
  });

  it('returns 20 for 100% allocation', () => {
    expect(calculateAvailabilityScore(100)).toBe(20);
  });

  it('returns 70 for 1% allocation', () => {
    expect(calculateAvailabilityScore(1)).toBe(70);
  });

  it('returns 20 for 51% allocation', () => {
    expect(calculateAvailabilityScore(51)).toBe(20);
  });
});

describe('calculateRoleScore', () => {
  it('returns 100 for exact role match', () => {
    expect(calculateRoleScore('FRONTEND', 'FRONTEND')).toBe(100);
  });

  it('returns 0 for no role match', () => {
    expect(calculateRoleScore('FRONTEND', 'BACKEND')).toBe(0);
  });

  it('is case-insensitive', () => {
    expect(calculateRoleScore('frontend', 'FRONTEND')).toBe(100);
  });
});

describe('calculateTotalScore', () => {
  it('returns correct weighted sum for known values', () => {
    // (0.50 × 100) + (0.30 × 100) + (0.20 × 100) = 100
    expect(calculateTotalScore(100, 100, 100)).toBe(100);
  });

  it('returns 0 when all scores are 0', () => {
    expect(calculateTotalScore(0, 0, 0)).toBe(0);
  });

  it('returns correct weighted sum for mixed values', () => {
    // (0.50 × 80) + (0.30 × 70) + (0.20 × 100) = 40 + 21 + 20 = 81
    expect(calculateTotalScore(80, 70, 100)).toBe(81);
  });

  it('rounds to 2 decimal places', () => {
    // (0.50 × 93.33) + (0.30 × 70) + (0.20 × 100) = 46.665 + 21 + 20 = 87.665 → 87.67
    expect(calculateTotalScore(93.33, 70, 100)).toBe(87.67);
  });

  it('handles high skill only scenario', () => {
    // (0.50 × 100) + (0.30 × 0) + (0.20 × 0) = 50
    expect(calculateTotalScore(100, 0, 0)).toBe(50);
  });

  it('handles high availability only scenario', () => {
    // (0.50 × 0) + (0.30 × 100) + (0.20 × 0) = 30
    expect(calculateTotalScore(0, 100, 0)).toBe(30);
  });
});

describe('generateReason', () => {
  it('generates strong reason for high skill, high avail, role match', () => {
    const reason = generateReason(100, 100, 100);
    expect(reason).toBe('Strong skill alignment, high availability, and exact role match.');
  });

  it('generates limited availability reason', () => {
    const reason = generateReason(100, 20, 100);
    expect(reason).toBe('Excellent skill match and role alignment but limited availability.');
  });

  it('generates low suitability reason', () => {
    const reason = generateReason(30, 20, 0);
    expect(reason).toBe('Limited overall suitability based on current criteria.');
  });
});
