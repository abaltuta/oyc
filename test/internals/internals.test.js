import { parseInterval } from "../../src/utils.js";
import { expect, describe, test } from 'vitest'

describe('Internals', () => {
  describe('Parse Interval', () => {
    test('returns undefined for undefined input', () => {
      expect(parseInterval(undefined)).toBeUndefined();
    });
  
    test('converts milliseconds correctly', () => {
      expect(parseInterval('100ms')).toBe(100);
      expect(parseInterval('0ms')).toBe(0);
    });
  
    test('converts seconds to milliseconds correctly', () => {
      expect(parseInterval('1s')).toBe(1000);
      expect(parseInterval('0s')).toBe(0);
    });
  
    test('converts minutes to milliseconds correctly', () => {
      expect(parseInterval('1m')).toBe(60000);
      expect(parseInterval('0m')).toBe(0);
    });
  
    test('returns undefined for invalid units', () => {
      expect(parseInterval('1h')).toBeUndefined();
    });
  
    test('returns the value for no units', () => {
      expect(parseInterval('100')).toBeUndefined();
    });
  });
});