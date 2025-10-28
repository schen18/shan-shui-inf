/**
 * Mathematical utilities and helper functions for Shan Shui landscape generation
 * Dependencies: prng.js, noise.js, polytools.js
 */

/**
 * Replace NaN and undefined values with fallback values
 * @param {*} plist - Value or array to clean
 * @returns {*} Cleaned value or array
 */
function unNan(plist) {
  if (typeof plist != "object" || plist == null) {
    return plist || 0;
  } else {
    return plist.map(unNan);
  }
}

/**
 * Calculate Euclidean distance between two points
 * @param {Array} p0 - First point [x, y]
 * @param {Array} p1 - Second point [x, y]
 * @returns {number} Distance between points
 */
function distance(p0, p1) {
  return Math.sqrt(Math.pow(p0[0] - p1[0], 2) + Math.pow(p0[1] - p1[1], 2));
}

/**
 * Map a value from one range to another
 * @param {number} value - Value to map
 * @param {number} istart - Input range start
 * @param {number} istop - Input range end
 * @param {number} ostart - Output range start
 * @param {number} ostop - Output range end
 * @returns {number} Mapped value
 */
function mapval(value, istart, istop, ostart, ostop) {
  return (
    ostart + (ostop - ostart) * (((value - istart) * 1.0) / (istop - istart))
  );
}

/**
 * Adjust noise list to create seamless loops
 * @param {Array} nslist - Array of noise values to adjust
 */
function loopNoise(nslist) {
  var dif = nslist[nslist.length - 1] - nslist[0];
  var bds = [100, -100];
  for (var i = 0; i < nslist.length; i++) {
    nslist[i] += (dif * (nslist.length - 1 - i)) / (nslist.length - 1);
    if (nslist[i] < bds[0]) bds[0] = nslist[i];
    if (nslist[i] > bds[1]) bds[1] = nslist[i];
  }
  for (var i = 0; i < nslist.length; i++) {
    nslist[i] = mapval(nslist[i], bds[0], bds[1], 0, 1);
  }
}

/**
 * Choose a random element from an array
 * @param {Array} arr - Array to choose from
 * @returns {*} Random element from array
 */
function randChoice(arr) {
  return arr[Math.floor(arr.length * Math.random())];
}

/**
 * Generate random number in specified range
 * @param {number} m - Minimum value
 * @param {number} M - Maximum value
 * @returns {number} Random number between m and M
 */
function normRand(m, M) {
  return mapval(Math.random(), 0, 1, m, M);
}

/**
 * Generate weighted random number using rejection sampling
 * @param {Function} func - Weight function
 * @returns {number} Weighted random value
 */
function wtrand(func) {
  var x = Math.random();
  var y = Math.random();
  if (y < func(x)) {
    return x;
  } else {
    return wtrand(func);
  }
}

/**
 * Generate Gaussian-distributed random number
 * @returns {number} Gaussian random value between -1 and 1
 */
function randGaussian() {
  return (
    wtrand(function(x) {
      return Math.pow(Math.E, -24 * Math.pow(x - 0.5, 2));
    }) *
      2 -
    1
  );
}/**
 
* Generate smooth Bezier curve through control points
 * @param {Array} P - Array of control points
 * @param {number} w - Weight parameter (default: 1)
 * @returns {Array} Array of points forming the curve
 */
function bezmh(P, w) {
  w = w == undefined ? 1 : w;
  if (P.length == 2) {
    P = [P[0], PolyTools.midPt(P[0], P[1]), P[1]];
  }
  var plist = [];
  for (var j = 0; j < P.length - 2; j++) {
    var p0;
    var p1;
    var p2;
    if (j == 0) {
      p0 = P[j];
    } else {
      p0 = PolyTools.midPt(P[j], P[j + 1]);
    }
    p1 = P[j + 1];
    if (j == P.length - 3) {
      p2 = P[j + 2];
    } else {
      p2 = PolyTools.midPt(P[j + 1], P[j + 2]);
    }
    var pl = 20;
    for (var i = 0; i < pl + (j == P.length - 3); i += 1) {
      var t = i / pl;
      var u = Math.pow(1 - t, 2) + 2 * t * (1 - t) * w + t * t;
      plist.push([
        (Math.pow(1 - t, 2) * p0[0] +
          2 * t * (1 - t) * p1[0] * w +
          t * t * p2[0]) /
          u,
        (Math.pow(1 - t, 2) * p0[1] +
          2 * t * (1 - t) * p1[1] * w +
          t * t * p2[1]) /
          u,
      ]);
    }
  }
  return plist;
}

/**
 * Interpolate points along a path with specified resolution
 * @param {Array} plist - Array of points to interpolate
 * @param {number} reso - Resolution (points per segment)
 * @returns {Array} Interpolated point array
 */
function div(plist, reso) {
  var tl = (plist.length - 1) * reso;
  var lx = 0;
  var ly = 0;
  var rlist = [];

  for (var i = 0; i < tl; i += 1) {
    var lastp = plist[Math.floor(i / reso)];
    var nextp = plist[Math.ceil(i / reso)];
    var p = (i % reso) / reso;
    var nx = lastp[0] * (1 - p) + nextp[0] * p;
    var ny = lastp[1] * (1 - p) + nextp[1] * p;

    var ang = Math.atan2(ny - ly, nx - lx);

    rlist.push([nx, ny]);
    lx = nx;
    ly = ny;
  }

  if (plist.length > 0) {
    rlist.push(plist[plist.length - 1]);
  }
  return rlist;
}