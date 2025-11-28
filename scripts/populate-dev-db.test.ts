/**
 * Property-Based Tests for populate-dev-db script
 * 
 * These tests verify the correctness properties defined in the design document.
 */

import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import { resolve } from 'path';

/**
 * Feature: dev-db-population, Property 6: Fatal error immediate exit
 * 
 * Property: For any fatal error during initialization (invalid credentials, 
 * network failure, safety check failure), the script should exit immediately 
 * with a clear error message and non-zero exit code.
 * 
 * Validates: Requirements 5.4
 */
describe('Property 6: Fatal error immediate exit', () => {
  const scriptPath = resolve(__dirname, 'populate-dev-db.ts');

  /**
   * Helper to execute the script and capture exit code and output
   */
  const executeScript = (args: string[] = []): { exitCode: number; output: string; error: string } => {
    const result = spawnSync('tsx', [scriptPath, ...args], {
      encoding: 'utf-8',
      timeout: 5000, // 5 second timeout
    });
    
    return {
      exitCode: result.status || 0,
      output: result.stdout || '',
      error: result.stderr || '',
    };
  };

  it('should exit with non-zero code when target is production', () => {
    const result = executeScript(['--target=production']);
    
    expect(result.exitCode).not.toBe(0);
    
    const combinedOutput = result.output + result.error;
    expect(combinedOutput).toMatch(/ERROR.*production/i);
    expect(combinedOutput).toMatch(/dev.*staging/i);
  });

  it('should exit with non-zero code when target is prod', () => {
    const result = executeScript(['--target=prod']);
    
    expect(result.exitCode).not.toBe(0);
    
    const combinedOutput = result.output + result.error;
    expect(combinedOutput).toMatch(/ERROR.*production/i);
  });

  it('should exit with non-zero code when target is invalid', () => {
    const result = executeScript(['--target=invalid']);
    
    expect(result.exitCode).not.toBe(0);
    
    const combinedOutput = result.output + result.error;
    expect(combinedOutput).toMatch(/ERROR.*Invalid target/i);
    expect(combinedOutput).toContain('invalid');
  });

  it('should exit immediately on fatal error without processing collections', () => {
    const startTime = Date.now();
    const result = executeScript(['--target=production']);
    const duration = Date.now() - startTime;
    
    expect(result.exitCode).not.toBe(0);
    expect(duration).toBeLessThan(3000); // Should exit very quickly
    
    const combinedOutput = result.output + result.error;
    expect(combinedOutput).not.toMatch(/copying collection/i);
    expect(combinedOutput).not.toMatch(/documents copied/i);
    expect(combinedOutput).toMatch(/ERROR/i);
  });

  it('should provide clear error messages with error indicator', () => {
    const result = executeScript(['--target=production']);
    
    expect(result.exitCode).not.toBe(0);
    
    const combinedOutput = result.output + result.error;
    expect(combinedOutput).toMatch(/❌.*ERROR/);
    
    const errorLines = combinedOutput.split('\n').filter(line => line.includes('ERROR'));
    expect(errorLines.length).toBeGreaterThan(0);
    expect(errorLines.some(line => line.length > 20)).toBe(true);
  });
});
