/**
 * Example usage of the IntensitySegments class
 * Run with: node examples/usage.js
 */

import { IntensitySegments } from "../src/IntensitySegments.js";

console.log("=== Intensity Segments Examples ===\n");

// Example 1: Basic add operations
console.log("Example 1: Basic add operations");
const segments1 = new IntensitySegments();
console.log("Initial:", segments1.toString());

segments1.add(10, 30, 1);
console.log("After add(10, 30, 1):", segments1.toString());

segments1.add(20, 40, 1);
console.log("After add(20, 40, 1):", segments1.toString());

segments1.add(10, 40, -2);
console.log("After add(10, 40, -2):", segments1.toString());
console.log();

// Example 2: Set operations
console.log("Example 2: Set operations");
const segments2 = new IntensitySegments();

segments2.add(10, 30, 2);
console.log("After add(10, 30, 2):", segments2.toString());

segments2.set(15, 25, 5);
console.log("After set(15, 25, 5):", segments2.toString());
console.log();

// Example 3: Complex overlapping ranges
console.log("Example 3: Complex overlapping ranges");
const segments3 = new IntensitySegments();

segments3.add(0, 20, 1);
console.log("After add(0, 20, 1):", segments3.toString());

segments3.add(10, 30, 2);
console.log("After add(10, 30, 2):", segments3.toString());

segments3.add(20, 40, 1);
console.log("After add(20, 40, 1):", segments3.toString());
console.log();

// Example 4: Negative intensities
console.log("Example 4: Negative intensities");
const segments4 = new IntensitySegments();

segments4.add(10, 30, 5);
console.log("After add(10, 30, 5):", segments4.toString());

segments4.add(15, 25, -3);
console.log("After add(15, 25, -3):", segments4.toString());

segments4.add(20, 35, -2);
console.log("After add(20, 35, -2):", segments4.toString());
console.log();

// Example 5: Merging adjacent ranges
console.log("Example 5: Adjacent ranges with same intensity");
const segments5 = new IntensitySegments();

segments5.add(0, 10, 1);
console.log("After add(0, 10, 1):", segments5.toString());

segments5.add(10, 20, 1);
console.log("After add(10, 20, 1):", segments5.toString());
console.log("  → Notice how [0,10) and [10,20) merge into [0,20)");
console.log();

// Example 6: Canceling out intensity
console.log("Example 6: Canceling out intensity");
const segments6 = new IntensitySegments();

segments6.add(10, 30, 2);
console.log("After add(10, 30, 2):", segments6.toString());

segments6.add(10, 30, -2);
console.log("After add(10, 30, -2):", segments6.toString());
console.log("  → All intensity canceled out, result is empty");
console.log();

console.log("=== End of Examples ===");
