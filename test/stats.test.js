const stats = require('../stats');

describe('Statistics Functions', () => {
  describe('average', () => {
    test('should calculate correct average', () => {
      expect(stats.average([1, 2, 3, 4, 5])).toBe(3);
      expect(stats.average([10, 20, 30])).toBe(20);
      expect(stats.average([100])).toBe(100);
    });

    test('should handle decimal values', () => {
      expect(stats.average([1.5, 2.5, 3.5])).toBeCloseTo(2.5);
    });

    test('should handle empty array', () => {
      expect(stats.average([])).toBeNaN();
    });
  });

  describe('median', () => {
    test('should calculate median for odd number of values', () => {
      expect(stats.median([1, 3, 5, 7, 9])).toBe(5);
      expect(stats.median([10, 20, 30])).toBe(20);
    });

    test('should calculate median for even number of values', () => {
      expect(stats.median([1, 2, 3, 4])).toBe(2.5);
      expect(stats.median([10, 20, 30, 40])).toBe(25);
    });

    test('should handle single value', () => {
      expect(stats.median([42])).toBe(42);
    });

    test('should sort values before calculating', () => {
      expect(stats.median([5, 1, 9, 3, 7])).toBe(5);
      expect(stats.median([40, 10, 30, 20])).toBe(25);
    });

    test('should handle unsorted decimal values', () => {
      expect(stats.median([3.7, 1.2, 5.8, 2.1, 4.5])).toBe(3.7);
    });
  });

  describe('quartile', () => {
    test('should calculate quartiles correctly', () => {
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

      expect(stats.quartile(values, 0.25)).toBe(3.25); // Q1
      expect(stats.quartile(values, 0.5)).toBe(5.5);   // Q2 (median)
      expect(stats.quartile(values, 0.75)).toBe(7.75); // Q3
      expect(stats.quartile(values, 0.9)).toBe(9.1);   // 90th percentile
    });

    test('should handle edge cases', () => {
      const values = [1, 2, 3, 4, 5];

      expect(stats.quartile(values, 0)).toBe(1);     // Minimum
      expect(stats.quartile(values, 1)).toBe(5);     // Maximum
    });

    test('should handle single value', () => {
      expect(stats.quartile([42], 0.5)).toBe(42);
    });

    test('should sort values before calculating', () => {
      const unsorted = [5, 1, 9, 3, 7, 2, 8, 4, 6];
      expect(stats.quartile(unsorted, 0.5)).toBe(5);
    });

    test('should handle decimal percentiles', () => {
      const values = [10, 20, 30, 40, 50, 60, 70, 80, 90, 100];
      expect(stats.quartile(values, 0.33)).toBeCloseTo(39.7, 1);
      expect(stats.quartile(values, 0.67)).toBeCloseTo(70.3, 1);
    });
  });

  describe('jitter', () => {
    test('should calculate jitter as average of consecutive differences', () => {
      const values = [10, 15, 12, 18, 14];
      // Differences: |15-10|=5, |12-15|=3, |18-12|=6, |14-18|=4
      // Average: (5+3+6+4)/4 = 4.5
      expect(stats.jitter(values)).toBe(4.5);
    });

    test('should handle two values', () => {
      expect(stats.jitter([10, 20])).toBe(10);
    });

    test('should handle identical values', () => {
      expect(stats.jitter([5, 5, 5, 5])).toBe(0);
    });

    test('should handle single value', () => {
      expect(stats.jitter([42])).toBe(0); // No consecutive pairs, average of empty array is 0
    });

    test('should handle decimal values', () => {
      const values = [1.5, 2.7, 1.9, 3.1];
      // Differences: |2.7-1.5|=1.2, |1.9-2.7|=0.8, |3.1-1.9|=1.2
      // Average: (1.2+0.8+1.2)/3 = 1.0667
      expect(stats.jitter(values)).toBeCloseTo(1.0667, 4);
    });

    test('should handle negative values', () => {
      const values = [-5, -2, -8, -1];
      // Differences: |-2-(-5)|=3, |-8-(-2)|=6, |-1-(-8)|=7
      // Average: (3+6+7)/3 = 5.333
      expect(stats.jitter(values)).toBeCloseTo(5.333, 3);
    });
  });
});
