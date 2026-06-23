import { describe, it, expect } from 'vitest';

import { generateReason, getScoreColor, getScoreBarColor, getAvailabilityLabel } from '../src/utils/generate-reason';

describe('generateReason', () => {
  it('returns "Strong skill alignment" for sSkill >= 80', () => {
    const result = generateReason(90, 100, 100, 0);
    expect(result).toContain('Strong skill alignment');
  });

  it('returns "Moderate skill match" for sSkill >= 50 and < 80', () => {
    const result = generateReason(60, 100, 100, 0);
    expect(result).toContain('Moderate skill match');
  });

  it('returns "Weak skill match" for sSkill < 50', () => {
    const result = generateReason(30, 100, 100, 0);
    expect(result).toContain('Weak skill match');
  });

  it('returns "fully available" when sAvail is 100', () => {
    const result = generateReason(80, 100, 100, 0);
    expect(result).toContain('fully available');
  });

  it('returns "good availability" with allocation when sAvail is 70', () => {
    const result = generateReason(80, 70, 100, 40);
    expect(result).toContain('good availability (40% allocated)');
  });

  it('returns "limited availability" when sAvail < 70', () => {
    const result = generateReason(80, 20, 100, 80);
    expect(result).toContain('limited availability (80% allocated)');
  });

  it('returns "exact role match" when sRole is 100', () => {
    const result = generateReason(80, 100, 100, 0);
    expect(result).toContain('exact role match');
  });

  it('returns "role mismatch" when sRole is not 100', () => {
    const result = generateReason(80, 100, 0, 0);
    expect(result).toContain('role mismatch');
  });

  it('ends with a period', () => {
    const result = generateReason(50, 70, 0, 25);
    expect(result.endsWith('.')).toBe(true);
  });
});

describe('getScoreColor', () => {
  it('returns green for value >= 80', () => {
    expect(getScoreColor(80)).toBe('text-green-600');
    expect(getScoreColor(100)).toBe('text-green-600');
  });

  it('returns amber for value >= 60 and < 80', () => {
    expect(getScoreColor(60)).toBe('text-amber-600');
    expect(getScoreColor(79)).toBe('text-amber-600');
  });

  it('returns red for value < 60', () => {
    expect(getScoreColor(0)).toBe('text-red-600');
    expect(getScoreColor(59)).toBe('text-red-600');
  });
});

describe('getScoreBarColor', () => {
  it('returns green for value >= 80', () => {
    expect(getScoreBarColor(80)).toBe('bg-green-500');
    expect(getScoreBarColor(100)).toBe('bg-green-500');
  });

  it('returns amber for value >= 60 and < 80', () => {
    expect(getScoreBarColor(60)).toBe('bg-amber-500');
    expect(getScoreBarColor(79)).toBe('bg-amber-500');
  });

  it('returns red for value < 60', () => {
    expect(getScoreBarColor(0)).toBe('bg-red-500');
    expect(getScoreBarColor(59)).toBe('bg-red-500');
  });
});

describe('getAvailabilityLabel', () => {
  it('returns "Available Now" for allocation 0', () => {
    const result = getAvailabilityLabel(0);
    expect(result.label).toBe('Available Now');
  });

  it('returns "Partial Capacity" for allocation 1-50', () => {
    expect(getAvailabilityLabel(1).label).toBe('Partial Capacity');
    expect(getAvailabilityLabel(25).label).toBe('Partial Capacity');
    expect(getAvailabilityLabel(50).label).toBe('Partial Capacity');
  });

  it('returns "Limited Capacity" for allocation > 50', () => {
    expect(getAvailabilityLabel(51).label).toBe('Limited Capacity');
    expect(getAvailabilityLabel(100).label).toBe('Limited Capacity');
  });
});
