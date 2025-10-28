import { describe, it, expect, beforeEach } from "vitest";
import { IntensitySegments } from "../src/IntensitySegments.js";

describe("IntensitySegments", () => {
  let segments;

  beforeEach(() => {
    segments = new IntensitySegments();
  });

  describe("Initial state", () => {
    it("should start with an empty segments array", () => {
      expect(segments.toString()).toBe("[]");
    });
  });

  describe("Example Sequence 1", () => {
    it("should handle the first example sequence correctly", () => {
      // Initial state
      expect(segments.toString()).toBe("[]");

      // Add intensity 1 from 10 to 30
      segments.add(10, 30, 1);
      expect(segments.toString()).toBe("[[10,1],[30,0]]");

      // Add intensity 1 from 20 to 40
      segments.add(20, 40, 1);
      expect(segments.toString()).toBe("[[10,1],[20,2],[30,1],[40,0]]");

      // Add intensity -2 from 10 to 40
      segments.add(10, 40, -2);
      expect(segments.toString()).toBe("[[10,-1],[20,0],[30,-1],[40,0]]");
    });
  });

  describe("Example Sequence 2", () => {
    it("should handle the second example sequence correctly", () => {
      // Initial state
      expect(segments.toString()).toBe("[]");

      // Add intensity 1 from 10 to 30
      segments.add(10, 30, 1);
      expect(segments.toString()).toBe("[[10,1],[30,0]]");

      // Add intensity 1 from 20 to 40
      segments.add(20, 40, 1);
      expect(segments.toString()).toBe("[[10,1],[20,2],[30,1],[40,0]]");

      // Add intensity -1 from 10 to 40
      segments.add(10, 40, -1);
      expect(segments.toString()).toBe("[[20,1],[30,0]]");

      // Add intensity -1 from 10 to 40 again
      segments.add(10, 40, -1);
      expect(segments.toString()).toBe("[[10,-1],[20,0],[30,-1],[40,0]]");
    });
  });

  describe("add() method", () => {
    it("should add intensity to a range", () => {
      segments.add(5, 15, 3);
      expect(segments.toString()).toBe("[[5,3],[15,0]]");
    });

    it("should handle overlapping ranges", () => {
      segments.add(10, 20, 1);
      segments.add(15, 25, 1);
      expect(segments.toString()).toBe("[[10,1],[15,2],[20,1],[25,0]]");
    });

    it("should handle negative amounts", () => {
      segments.add(10, 20, 5);
      segments.add(10, 20, -3);
      expect(segments.toString()).toBe("[[10,2],[20,0]]");
    });

    it("should handle adjacent ranges", () => {
      segments.add(10, 20, 1);
      segments.add(20, 30, 1);
      expect(segments.toString()).toBe("[[10,1],[30,0]]");
    });

    it("should handle non-overlapping ranges", () => {
      segments.add(10, 20, 1);
      segments.add(30, 40, 2);
      expect(segments.toString()).toBe("[[10,1],[20,0],[30,2],[40,0]]");
    });

    it("should handle invalid ranges (from >= to)", () => {
      segments.add(20, 10, 1);
      expect(segments.toString()).toBe("[]");

      segments.add(10, 10, 1);
      expect(segments.toString()).toBe("[]");
    });

    it("should handle zero amount", () => {
      segments.add(10, 20, 0);
      expect(segments.toString()).toBe("[]");
    });

    it("should handle completely overlapping ranges", () => {
      segments.add(10, 30, 1);
      segments.add(15, 25, 1);
      expect(segments.toString()).toBe("[[10,1],[15,2],[25,1],[30,0]]");
    });

    it("should handle range that cancels out existing intensity", () => {
      segments.add(10, 30, 2);
      segments.add(10, 30, -2);
      expect(segments.toString()).toBe("[]");
    });
  });

  describe("set() method", () => {
    it("should set intensity for a range", () => {
      segments.set(10, 20, 5);
      expect(segments.toString()).toBe("[[10,5],[20,0]]");
    });

    it("should overwrite existing intensity in a range", () => {
      segments.add(10, 30, 2);
      segments.set(15, 25, 5);
      expect(segments.toString()).toBe("[[10,2],[15,5],[25,2],[30,0]]");
    });

    it("should set intensity to zero", () => {
      segments.add(10, 30, 3);
      segments.set(15, 25, 0);
      expect(segments.toString()).toBe("[[10,3],[15,0],[25,3],[30,0]]");
    });

    it("should handle overlapping set operations", () => {
      segments.set(10, 30, 2);
      segments.set(20, 40, 3);
      expect(segments.toString()).toBe("[[10,2],[20,3],[40,0]]");
    });

    it("should handle set on empty segments", () => {
      segments.set(5, 15, 7);
      expect(segments.toString()).toBe("[[5,7],[15,0]]");
    });

    it("should handle invalid ranges (from >= to)", () => {
      segments.set(20, 10, 5);
      expect(segments.toString()).toBe("[]");

      segments.set(10, 10, 5);
      expect(segments.toString()).toBe("[]");
    });

    it("should handle set with negative values", () => {
      segments.set(10, 20, -3);
      expect(segments.toString()).toBe("[[10,-3],[20,0]]");
    });

    it("should handle complex scenario with add and set", () => {
      segments.add(10, 30, 2);
      segments.add(20, 40, 3);
      segments.set(15, 35, 1);
      expect(segments.toString()).toBe("[[10,2],[15,1],[35,3],[40,0]]");
    });
  });

  describe("Edge cases", () => {
    it("should handle very large ranges", () => {
      segments.add(-1000000, 1000000, 1);
      expect(segments.toString()).toBe("[[-1000000,1],[1000000,0]]");
    });

    it("should handle negative positions", () => {
      segments.add(-20, -10, 2);
      segments.add(-15, -5, 1);
      expect(segments.toString()).toBe("[[-20,2],[-15,3],[-10,1],[-5,0]]");
    });

    it("should handle multiple operations resulting in empty segments", () => {
      segments.add(10, 20, 1);
      segments.add(20, 30, 1);
      segments.add(10, 30, -1);
      expect(segments.toString()).toBe("[]");
    });

    it("should maintain correct state after many operations", () => {
      segments.add(0, 10, 1);
      segments.add(5, 15, 1);
      segments.add(10, 20, 1);
      segments.add(15, 25, 1);
      segments.add(20, 30, 1);

      // After all operations, the intensity at each range:
      // [0,5): 1, [5,10): 2, [10,15): 2, [15,20): 2, [20,25): 2, [25,30): 1
      // Consecutive equal intensities are merged
      expect(segments.toString()).toBe("[[0,1],[5,2],[25,1],[30,0]]");
    });

    it("should handle fractional positions", () => {
      segments.add(10.5, 20.5, 2);
      expect(segments.toString()).toBe("[[10.5,2],[20.5,0]]");
    });
  });

  describe("toString() method", () => {
    it("should return valid JSON format", () => {
      segments.add(10, 20, 1);
      const result = segments.toString();
      expect(() => JSON.parse(result)).not.toThrow();
    });

    it("should return empty array string for no segments", () => {
      expect(segments.toString()).toBe("[]");
    });

    it("should format segments correctly", () => {
      segments.add(10, 20, 1);
      segments.add(30, 40, 2);
      const result = segments.toString();
      const parsed = JSON.parse(result);

      expect(parsed).toEqual([
        [10, 1],
        [20, 0],
        [30, 2],
        [40, 0],
      ]);
    });
  });

  describe("Complex scenarios", () => {
    it("should handle interleaved add and set operations", () => {
      segments.add(10, 30, 1);
      segments.set(20, 40, 2);
      segments.add(15, 35, 1);

      expect(segments.toString()).toBe("[[10,1],[15,2],[20,3],[35,2],[40,0]]");
    });

    it("should handle multiple ranges with same boundaries", () => {
      segments.add(10, 20, 1);
      segments.add(10, 20, 1);
      segments.add(10, 20, 1);

      expect(segments.toString()).toBe("[[10,3],[20,0]]");
    });

    it("should handle alternating positive and negative additions", () => {
      segments.add(10, 20, 5);
      segments.add(15, 25, -3);
      segments.add(18, 30, 2);

      // Manually computed:
      // [10,15): 5, [15,18): 2, [18,20): 4, [20,25): -1, [25,30): 2
      expect(segments.toString()).toBe(
        "[[10,5],[15,2],[18,4],[20,-1],[25,2],[30,0]]"
      );
    });
  });
});
