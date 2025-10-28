/**
 * IntensitySegments manages intensity values across segments from -infinity to +infinity.
 * Each segment is represented by its start point and intensity value.
 *
 * Algorithm: Uses a difference array approach where we store intensity deltas at boundaries.
 * The actual intensity at any point is the cumulative sum of all deltas up to that point.
 *
 * Time Complexity:
 * - add(): O(1)
 * - set(): O(n) where n is the number of existing segments
 * - toString(): O(n log n) for sorting
 */
export class IntensitySegments {
  /**
   * Creates a new IntensitySegments instance.
   * Initially, all segments have intensity 0.
   */
  constructor() {
    // Store deltas as a Map: position -> delta
    // This allows O(1) updates without array shifting
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
  }  /**
   * Sets the intensity for the range [from, to) to a specific amount.
   * The range is inclusive of 'from' and exclusive of 'to'.
   *
   * Implementation: To set a range, we need to:
   * 1. Get current intensity just before 'from'
   * 2. Get current intensity just before 'to'
   * 3. Clear all deltas within [from, to)
   * 4. Set delta at 'from' to reach target amount
   * 5. Set delta at 'to' to restore previous intensity
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

    // Get the current intensity just before the range starts and at the end
    const intensityBeforeFrom = from > -Infinity ? this._getIntensityAt(from - 0.5) : 0;
    const intensityAtTo = this._getIntensityAt(to);

    // Remove all deltas within the range [from, to)
    const positionsToDelete = [];
    for (const pos of this.deltas.keys()) {
      if (pos >= from && pos < to) {
        positionsToDelete.push(pos);
      }
    }
    for (const pos of positionsToDelete) {
      this.deltas.delete(pos);
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
  }  /**
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
    if (cleaned.length > 0 && cleaned.every(([, intensity]) => intensity === 0)) {
      return [];
    }

    return cleaned;
  }  /**
   * Gets the intensity value at a specific position.
   * Computes the cumulative sum of all deltas up to and including the position.
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
