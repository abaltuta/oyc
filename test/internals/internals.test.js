import { parseInterval } from "oyc";

describe('Internals', () => {
  describe('Parse Interval', () => {
    it('returns undefined for undefined input', () => {
      expect(parseInterval(undefined)).toBeUndefined();
    });
  
    it('converts milliseconds correctly', () => {
      expect(parseInterval('100ms')).toBe(100);
      expect(parseInterval('0ms')).toBe(0);
    });
  
    it('converts seconds to milliseconds correctly', () => {
      expect(parseInterval('1s')).toBe(1000);
      expect(parseInterval('0s')).toBe(0);
    });
  
    it('converts minutes to milliseconds correctly', () => {
      expect(parseInterval('1m')).toBe(60000);
      expect(parseInterval('0m')).toBe(0);
    });
  
    it('returns undefined for invalid units', () => {
      expect(parseInterval('1h')).toBeUndefined();
    });
  
    it('returns the value for no units', () => {
      expect(parseInterval('100')).toBeUndefined();
    });
  });
});