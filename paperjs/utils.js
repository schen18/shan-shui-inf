/**
 * Mathematical utilities and helper functions for Shan Shui landscape generation - Paper.js Compatible Version
 * Dependencies: prng.js, noise.js, polytools.js
 * 
 * Updated for Paper.js compatibility - can work with both array points and Paper.js Point objects.
 */

/**
 * Convert Paper.js Point to array format if needed
 * @param {Array|paper.Point} point - Point in either format
 * @returns {Array} Point as [x, y] array
 */
function toArrayPoint(point) {
  if (point && typeof point.x !== 'undefined' && typeof point.y !== 'undefined') {
    return [point.x, point.y];
  }
  return point;
}

/**
 * Convert array point to Paper.js Point if Paper.js is available
 * @param {Array|paper.Point} point - Point in either format
 * @returns {paper.Point|Array} Paper.js Point if available, otherwise array
 */
function toPaperPoint(point) {
  if (typeof paper !== 'undefined' && paper.Point) {
    if (Array.isArray(point) && point.length >= 2) {
      return new paper.Point(point[0], point[1]);
    }
  }
  return point;
}

/**
 * Create a Paper.js Point from coordinates
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate
 * @returns {paper.Point|Array} Paper.js Point if available, otherwise array
 */
function createPoint(x, y) {
  if (typeof paper !== 'undefined' && paper.Point) {
    return new paper.Point(x, y);
  }
  return [x, y];
}

/**
 * Replace NaN and undefined values with fallback values
 * @param {*} plist - Value or array to clean
 * @returns {*} Cleaned value or array
 */
function unNan(plist) {
  if (typeof plist != "object" || plist == null) {
    return plist || 0;
  } else if (Array.isArray(plist)) {
    return plist.map(unNan);
  } else {
    return plist || 0;
  }
}

/**
 * Calculate Euclidean distance between two points
 * @param {Array|paper.Point} p0 - First point [x, y] or Paper.js Point
 * @param {Array|paper.Point} p1 - Second point [x, y] or Paper.js Point
 * @returns {number} Distance between points
 */
function distance(p0, p1) {
  var pt0 = toArrayPoint(p0);
  var pt1 = toArrayPoint(p1);
  return Math.sqrt(Math.pow(pt0[0] - pt1[0], 2) + Math.pow(pt0[1] - pt1[1], 2));
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
}

/**
 * Generate smooth Bezier curve through control points
 * @param {Array} P - Array of control points (can be Paper.js Points or arrays)
 * @param {number} w - Weight parameter (default: 1)
 * @returns {Array} Array of points forming the curve
 */
function bezmh(P, w) {
  w = w == undefined ? 1 : w;
  
  // Ensure P is an array and convert Paper.js Points to arrays if needed
  if (!Array.isArray(P)) {
    console.warn('bezmh: P is not an array, returning empty array');
    return [];
  }
  P = P.map(toArrayPoint);
  
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
 * @param {Array} plist - Array of points to interpolate (can be Paper.js Points or arrays)
 * @param {number} reso - Resolution (points per segment)
 * @returns {Array} Interpolated point array
 */
function div(plist, reso) {
  // Ensure plist is an array and convert Paper.js Points to arrays if needed
  if (!Array.isArray(plist)) {
    console.warn('div: plist is not an array, returning empty array');
    return [];
  }
  plist = plist.map(toArrayPoint);
  
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