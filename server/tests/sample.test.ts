import { describe, it, expect } from 'vitest';

describe('Server Smoke Tests', () => {
  it('should pass basic arithmetic', () => {
    expect(2 + 3).toBe(5);
  });

  it('should have NODE_ENV default to test or development', () => {
    const env = process.env.NODE_ENV || 'development';
    expect(['development', 'test']).toContain(env);
  });
});
