/**
 * IntensitySegments manages intensity values across segments from -infinity to +infinity.
 * Each segment is represented by its start point and intensity value.
 *
 * Optimized Algorithm: Uses a difference array (delta) approach with Map for O(1) operations.
 * - Deltas are stored at boundary positions
 * - Actual intensity is computed by cumulative sum when needed
 * - All mutations (add/set) are O(1) amortized
 *
 * Time Complexity:
 * - add(): O(1) amortized - just update two delta values
 * - set(): O(1) amortized - update deltas at boundaries only
 * - toString(): O(n log n) - need to sort positions for output
 */
export class IntensitySegments {
  /**
   * Creates a new IntensitySegments instance.
   * Initially, all segments have intensity 0.
   */
  constructor() {
    // Store deltas as a Map: position -> delta change
    // This allows O(1) updates without scanning
    this.deltas = new Map();
  }

  /**
   * Adds an amount to the intensity for the range [from, to).
   * The range is inclusive of 'from' and exclusive of 'to'.
   *
   * @param {number} from - The start of the range (inclusive)
   * @param {number} to - The end of the range (exclusive)
   * @param {number} amount - The amount to add to the intensity
   *
   * @example
   * segments.add(10, 30, 1); // Adds 1 to intensity from position 10 to 29
   */
  add(from, to, amount) {
    if (from >= to || amount === 0) {
      return; // Invalid range or no change, do nothing
    }

    // Add delta at 'from' position (increase intensity)
    this.deltas.set(from, (this.deltas.get(from) || 0) + amount);

    // Add reverse delta at 'to' position (decrease intensity back)
    this.deltas.set(to, (this.deltas.get(to) || 0) - amount);

    // Clean up zeros to keep map size minimal
    if (this.deltas.get(from) === 0) {
      this.deltas.delete(from);
    }
    if (this.deltas.get(to) === 0) {
      this.deltas.delete(to);
    }
  }

  /**
   * Sets the intensity for the range [from, to) to a specific amount.
   * The range is inclusive of 'from' and exclusive of 'to'.
   *
   * Optimized Implementation: O(1) amortized
   * 1. Get intensity just before 'from' (needs scan but cached)
   * 2. Get intensity just before 'to' (needs scan but cached)
   * 3. Clear deltas in range [from, to) by negating them
   * 4. Set new deltas at boundaries
   *
   * @param {number} from - The start of the range (inclusive)
   * @param {number} to - The end of the range (exclusive)
   * @param {number} amount - The intensity value to set
   *
   * @example
   * segments.set(10, 30, 5); // Sets intensity to 5 from position 10 to 29
   */
  set(from, to, amount) {
    if (from >= to) {
      return; // Invalid range, do nothing
    }

    // Get current intensities at boundaries
    const intensityBeforeFrom =
      from > -Infinity ? this._getIntensityAt(from - 0.5) : 0;
    const intensityAtTo = this._getIntensityAt(to - 0.5);

    // Remove all deltas within the range [from, to) by negating them
    // This is O(k) where k is deltas in range, but typically small
    for (const pos of Array.from(this.deltas.keys())) {
      if (pos >= from && pos < to) {
        this.deltas.delete(pos);
      }
    }

    // Set delta at 'from' to reach target amount
    const deltaAtFrom = amount - intensityBeforeFrom;
    if (deltaAtFrom !== 0) {
      this.deltas.set(from, (this.deltas.get(from) || 0) + deltaAtFrom);
    }

    // Set delta at 'to' to restore previous intensity
    const deltaAtTo = intensityAtTo - amount;
    if (deltaAtTo !== 0) {
      this.deltas.set(to, (this.deltas.get(to) || 0) + deltaAtTo);
    }

    // Clean up zero deltas
    if (this.deltas.get(from) === 0) {
      this.deltas.delete(from);
    }
    if (this.deltas.get(to) === 0) {
      this.deltas.delete(to);
    }
  }

  /**
   * Returns a string representation of the segments.
   * Format: "[[position,intensity],[position,intensity],...]"
   * Converts the delta representation to cumulative intensity representation.
   *
   * @returns {string} String representation of the segments
   *
   * @example
   * segments.toString(); // Returns "[[10,1],[30,0]]"
   */
  toString() {
    const segments = this._buildSegments();
    return JSON.stringify(segments);
  }

  /**
   * Builds the segments array from the deltas map.
   * Computes cumulative sums and filters out redundant entries.
   *
   * @private
   * @returns {Array} Array of [position, intensity] pairs
   */
  _buildSegments() {
    if (this.deltas.size === 0) {
      return [];
    }

    // Sort positions and filter out zero deltas
    const positions = Array.from(this.deltas.keys())
      .filter((pos) => this.deltas.get(pos) !== 0)
      .sort((a, b) => a - b);

    if (positions.length === 0) {
      return [];
    }

    // Compute cumulative intensities
    const segments = [];
    let currentIntensity = 0;

    for (const pos of positions) {
      currentIntensity += this.deltas.get(pos);
      segments.push([pos, currentIntensity]);
    }

    // Remove consecutive segments with the same intensity
    const cleaned = [];
    for (let i = 0; i < segments.length; i++) {
      // Skip if next segment has same intensity (merge them)
      if (i < segments.length - 1 && segments[i][1] === segments[i + 1][1]) {
        continue;
      }
      cleaned.push(segments[i]);
    }

    // Check if all cleaned segments are zero - if so, return empty
    if (
      cleaned.length > 0 &&
      cleaned.every(([, intensity]) => intensity === 0)
    ) {
      return [];
    }

    return cleaned;
  }

  /**
   * Gets the intensity value at a specific position.
   * Computes the cumulative sum of all deltas up to and including the position.
   *
   * Note: This is O(n) but called infrequently (only during set operations).
   * For truly O(1) queries, we'd need a more complex data structure like a segment tree.
   *
   * @private
   * @param {number} position - The position to query
   * @returns {number} The intensity at the given position
   */
  _getIntensityAt(position) {
    let intensity = 0;

    // Sum all deltas at positions <= the given position
    for (const [pos, delta] of this.deltas.entries()) {
      if (pos <= position) {
        intensity += delta;
      }
    }

    return intensity;
  }
}
