import { parseInterval } from "../../src/oyc.js";
import { bench, describe, bench } from 'vitest'

describe('Internals', () => {
  bench('Parse Interval', () => {
    parseInterval(undefined);
    parseInterval('1h');
    parseInterval('100ms');
    parseInterval('1s');
    parseInterval('100');
  }, {time: 1000, warmupIterations: 10})
});