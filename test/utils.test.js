import { parseTrigger, parseInterval } from "../src/utils.js";
import { expect, describe, test } from 'vitest'

describe('Utils', () => {
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

  describe('Parse Trigger', () => {
    test('returns undefined for undefined input', () => {
      expect(parseTrigger(undefined)).toBeUndefined();
    });

    test('parses event correctly', () => {
      expect(parseTrigger('click')).toEqual({
        event: 'click',
        modifiers: {},
      });
    });

    test('parses simple modifiers correctly', () => {
      expect(parseTrigger('click once prevent capture passive')).toEqual({
        event: 'click',
        modifiers: {
          once: true,
          prevent: true,
          capture: true,
          passive: true,
        },
      });
    });

    test('parses complex modifiers correctly', () => {
      expect(parseTrigger('scroll throttle:100ms debounce:200ms')).toEqual({
        event: 'scroll',
        modifiers: {
          throttle: 100,
          debounce: 200,
        },
      });
    });

    test('ignores empty modifiers', () => {
      expect(parseTrigger('click once  passive')).toEqual({
        event: 'click',
        modifiers: {
          once: true,
          passive: true,
        },
      });
    });

    test('ignores unknown modifiers', () => {
      expect(parseTrigger('click once unknown passive')).toEqual({
        event: 'click',
        modifiers: {
          once: true,
          passive: true,
        },
      });
    });

    test('ignores invalid modifiers', () => {
      expect(parseTrigger('click invalid:100ms')).toEqual({
        event: 'click',
        modifiers: {}
      });
    });

    test('returns undefined for invalid input', () => {
      expect(parseTrigger('')).toBeUndefined();
    });
  });
});

