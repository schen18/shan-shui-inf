/**
 * Perlin Noise Module
 * 
 * Provides Perlin noise implementation for natural-looking procedural generation.
 * This implementation is based on the p5.js noise function and generates smooth,
 * natural-looking random values that are essential for creating organic landscape features.
 * 
 * Perlin noise is used throughout the system for:
 * - Mountain and terrain height variations
 * - Tree and vegetation placement
 * - Water surface ripples
 * - Texture and surface detail generation
 * 
 * Based on https://raw.githubusercontent.com/processing/p5.js/master/src/math/noise.js
 * 
 * @namespace Noise
 */
var Noise = new function() {
  var PERLIN_YWRAPB = 4;
  var PERLIN_YWRAP = 1 << PERLIN_YWRAPB;
  var PERLIN_ZWRAPB = 8;
  var PERLIN_ZWRAP = 1 << PERLIN_ZWRAPB;
  var PERLIN_SIZE = 4095;
  var perlin_octaves = 4;
  var perlin_amp_falloff = 0.5;
  var scaled_cosine = function(i) {
    return 0.5 * (1.0 - Math.cos(i * Math.PI));
  };
  var perlin;
  
  /**
   * Generate 3D Perlin noise value
   * @param {number} x - X coordinate
   * @param {number} [y=0] - Y coordinate
   * @param {number} [z=0] - Z coordinate
   * @returns {number} Noise value between 0 and 1
   * @example
   * // Generate height variation for terrain
   * var height = Noise.noise(x * 0.01, y * 0.01) * 100;
   */
  this.noise = function(x, y, z) {
    y = y || 0;
    z = z || 0;
    if (perlin == null) {
      perlin = new Array(PERLIN_SIZE + 1);
      for (var i = 0; i < PERLIN_SIZE + 1; i++) {
        perlin[i] = Math.random();
      }
    }
    if (x < 0) {
      x = -x;
    }
    if (y < 0) {
      y = -y;
    }
    if (z < 0) {
      z = -z;
    }
    var xi = Math.floor(x),
      yi = Math.floor(y),
      zi = Math.floor(z);
    var xf = x - xi;
    var yf = y - yi;
    var zf = z - zi;
    var rxf, ryf;
    var r = 0;
    var ampl = 0.5;
    var n1, n2, n3;
    for (var o = 0; o < perlin_octaves; o++) {
      var of = xi + (yi << PERLIN_YWRAPB) + (zi << PERLIN_ZWRAPB);
      rxf = scaled_cosine(xf);
      ryf = scaled_cosine(yf);
      n1 = perlin[of & PERLIN_SIZE];
      n1 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n1);
      n2 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
      n2 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n2);
      n1 += ryf * (n2 - n1);
      of += PERLIN_ZWRAP;
      n2 = perlin[of & PERLIN_SIZE];
      n2 += rxf * (perlin[(of + 1) & PERLIN_SIZE] - n2);
      n3 = perlin[(of + PERLIN_YWRAP) & PERLIN_SIZE];
      n3 += rxf * (perlin[(of + PERLIN_YWRAP + 1) & PERLIN_SIZE] - n3);
      n2 += ryf * (n3 - n2);
      n1 += scaled_cosine(zf) * (n2 - n1);
      r += n1 * ampl;
      ampl *= perlin_amp_falloff;
      xi <<= 1;
      xf *= 2;
      yi <<= 1;
      yf *= 2;
      zi <<= 1;
      zf *= 2;
      if (xf >= 1.0) {
        xi++;
        xf--;
      }
      if (yf >= 1.0) {
        yi++;
        yf--;
      }
      if (zf >= 1.0) {
        zi++;
        zf--;
      }
    }
    return r;
  };
  
  /**
   * Configure noise generation parameters
   * @param {number} lod - Level of detail (number of octaves)
   * @param {number} falloff - Amplitude falloff for each octave
   */
  this.noiseDetail = function(lod, falloff) {
    if (lod > 0) {
      perlin_octaves = lod;
    }
    if (falloff > 0) {
      perlin_amp_falloff = falloff;
    }
  };
  
  /**
   * Initialize noise generator with a specific seed
   * @param {number} seed - Seed value for deterministic noise generation
   */
  this.noiseSeed = function(seed) {
    var lcg = (function() {
      var m = 4294967296,
        a = 1664525,
        c = 1013904223,
        seed,
        z;
      return {
        setSeed: function(val) {
          z = seed = (val == null ? Math.random() * m : val) >>> 0;
        },
        getSeed: function() {
          return seed;
        },
        rand: function() {
          z = (a * z + c) % m;
          return z / m;
        },
      };
    })();
    lcg.setSeed(seed);
    perlin = new Array(PERLIN_SIZE + 1);
    for (var i = 0; i < PERLIN_SIZE + 1; i++) {
      perlin[i] = lcg.rand();
    }
  };
}();