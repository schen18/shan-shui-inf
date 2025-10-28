/**
 * PRNG (Pseudo Random Number Generator) Module
 * 
 * Provides deterministic random number generation for reproducible landscapes.
 * This module implements a custom PRNG algorithm that ensures the same seed
 * will always produce the same sequence of random numbers, which is essential
 * for generating consistent landscape features.
 * 
 * The PRNG uses a quadratic congruential generator with carefully chosen
 * parameters to ensure good distribution and period length.
 * 
 * @namespace Prng
 */
var Prng = new function() {
  this.s = 1234;
  this.p = 999979; //9887//983
  this.q = 999983; //9967//991
  this.m = this.p * this.q;
  /**
   * Hash function to convert arbitrary input to numeric seed
   * @param {*} x - Input value to hash (can be any type)
   * @returns {number} Numeric hash value
   */
  this.hash = function(x) {
    var y = window.btoa(JSON.stringify(x));
    var z = 0;
    for (var i = 0; i < y.length; i++) {
      z += y.charCodeAt(i) * Math.pow(128, i);
    }
    return z;
  };
  /**
   * Initialize the PRNG with a seed value
   * @param {number} [x] - Seed value (uses current time if undefined)
   */
  this.seed = function(x) {
    if (x == undefined) {
      x = new Date().getTime();
    }
    var y = 0;
    var z = 0;
    function redo() {
      y = (Prng.hash(x) + z) % Prng.m;
      z += 1;
    }
    while (y % Prng.p == 0 || y % Prng.q == 0 || y == 0 || y == 1) {
      redo();
    }
    Prng.s = y;
    console.log(["int seed", Prng.s]);
    for (var i = 0; i < 10; i++) {
      Prng.next();
    }
  };
  /**
   * Generate the next random number in the sequence
   * @returns {number} Random number between 0 and 1
   */
  this.next = function() {
    Prng.s = (Prng.s * Prng.s) % Prng.m;
    return Prng.s / Prng.m;
  };
  /**
   * Test the distribution quality of the PRNG
   * @param {Function} [f] - Optional function to test (defaults to Prng.next)
   * @returns {Array} Distribution chart showing frequency in each decile
   */
  this.test = function(f) {
    var F =
      f ||
      function() {
        return Prng.next();
      };
    var t0 = new Date().getTime();
    var chart = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
    for (var i = 0; i < 10000000; i++) {
      chart[Math.floor(F() * 10)] += 1;
    }
    console.log(chart);
    console.log("finished in " + (new Date().getTime() - t0));
    return chart;
  };
}();

/**
 * Override Math.random to use our deterministic PRNG
 * This ensures all random number generation in the application is reproducible
 * @returns {number} Random number between 0 and 1
 */
Math.random = function() {
  return Prng.next();
};

/**
 * Add Math.seed function to initialize the PRNG
 * @param {number} x - Seed value for the PRNG
 */
Math.seed = function(x) {
  return Prng.seed(x);
};
