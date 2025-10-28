/**
 * SVG rendering functions for Shan Shui landscape generation
 * 
 * This module provides core rendering functions for generating SVG elements
 * with support for traditional Chinese painting aesthetics, including:
 * - Variable-width strokes with noise
 * - Broken stroke effects (simulating brush lifting from paper)
 * - Organic blob shapes for natural elements
 * - Surface texture patterns
 * 
 * Dependencies: utils.js, noise.js, polytools.js
 */

/**
 * Generate SVG polygon from point list
 * @param {Array} plist - Array of points [x, y]
 * @param {Object} args - Rendering options
 * @param {number} args.xof - X offset (default: 0)
 * @param {number} args.yof - Y offset (default: 0)
 * @param {string} args.fil - Fill color (default: "rgba(0,0,0,0)")
 * @param {string} args.str - Stroke color (default: same as fill)
 * @param {number} args.wid - Stroke width (default: 0)
 * @returns {string} SVG polyline element
 */
function poly(plist, args) {
  var args = args != undefined ? args : {};
  var xof = args.xof != undefined ? args.xof : 0;
  var yof = args.yof != undefined ? args.yof : 0;
  var fil = args.fil != undefined ? args.fil : "rgba(0,0,0,0)";
  var str = args.str != undefined ? args.str : fil;
  var wid = args.wid != undefined ? args.wid : 0;

  var canv = "<polyline points='";
  for (var i = 0; i < plist.length; i++) {
    canv +=
      " " +
      (plist[i][0] + xof).toFixed(1) +
      "," +
      (plist[i][1] + yof).toFixed(1);
  }
  canv +=
    "' style='fill:" +
    fil +
    ";stroke:" +
    str +
    ";stroke-width:" +
    wid +
    "'/>";
  return canv;
}

/**
 * Generate SVG stroke with variable width and noise
 * 
 * Creates natural-looking brush strokes with variable width and optional broken stroke effects.
 * Automatically detects global broken stroke setting from UI checkbox when not explicitly set.
 * 
 * @param {Array} ptlist - Array of points defining the path [[x1,y1], [x2,y2], ...]
 * @param {Object} args - Stroke options
 * @param {number} args.xof - X offset (default: 0)
 * @param {number} args.yof - Y offset (default: 0)
 * @param {number} args.wid - Base width (default: 2)
 * @param {string} args.col - Color (default: "rgba(200,200,200,0.9)")
 * @param {number} args.noi - Noise factor for width variation (default: 0.5)
 * @param {number} args.out - Outline width (default: 1)
 * @param {Function} args.fun - Width function along path (default: sine wave)
 * @param {boolean} args.broken - Enable broken stroke effect (default: auto-detect from UI)
 * @param {number} args.breakProb - Probability of breaks in broken mode (default: 0.2)
 * @param {number} args.minSegLen - Minimum segment length in broken mode (default: 4)
 * @param {number} args.maxSegLen - Maximum segment length in broken mode (default: 15)
 * @returns {string} SVG polygon representing the stroke
 */
function stroke(ptlist, args) {
  var args = args != undefined ? args : {};
  var xof = args.xof != undefined ? args.xof : 0;
  var yof = args.yof != undefined ? args.yof : 0;
  var wid = args.wid != undefined ? args.wid : 2;
  var col = args.col != undefined ? args.col : "rgba(200,200,200,0.9)";
  var noi = args.noi != undefined ? args.noi : 0.5;
  var out = args.out != undefined ? args.out : 1;
  var broken = args.broken != undefined ? args.broken : false;
  var fun =
    args.fun != undefined
      ? args.fun
      : function(x) {
          return Math.sin(x * Math.PI);
        };

  if (ptlist.length == 0) {
    return "";
  }

  // Check if broken strokes are enabled globally (only if not explicitly set)
  if (args.broken === undefined) {
    var brokenStrokesEnabled = false;
    if (typeof document !== 'undefined') {
      var brokenCheckbox = document.getElementById('BROKEN_STROKES');
      brokenStrokesEnabled = brokenCheckbox && brokenCheckbox.checked;
    }
    broken = brokenStrokesEnabled;
  }

  if (broken) {
    return brokenStroke(ptlist, args);
  }

  vtxlist0 = [];
  vtxlist1 = [];
  vtxlist = [];
  var n0 = Math.random() * 10;
  for (var i = 1; i < ptlist.length - 1; i++) {
    var w = wid * fun(i / ptlist.length);
    w = w * (1 - noi) + w * noi * Noise.noise(i * 0.5, n0);
    var a1 = Math.atan2(
      ptlist[i][1] - ptlist[i - 1][1],
      ptlist[i][0] - ptlist[i - 1][0],
    );
    var a2 = Math.atan2(
      ptlist[i][1] - ptlist[i + 1][1],
      ptlist[i][0] - ptlist[i + 1][0],
    );
    var a = (a1 + a2) / 2;
    if (a < a2) {
      a += Math.PI;
    }
    vtxlist0.push([
      ptlist[i][0] + w * Math.cos(a),
      ptlist[i][1] + w * Math.sin(a),
    ]);
    vtxlist1.push([
      ptlist[i][0] - w * Math.cos(a),
      ptlist[i][1] - w * Math.sin(a),
    ]);
  }

  vtxlist = [ptlist[0]]
    .concat(
      vtxlist0.concat(vtxlist1.concat([ptlist[ptlist.length - 1]]).reverse()),
    )
    .concat([ptlist[0]]);

  var canv = poly(
    vtxlist.map(function(x) {
      return [x[0] + xof, x[1] + yof];
    }),
    { fil: col, str: col, wid: out },
  );
  return canv;
}

/**
 * Generate broken stroke effect by splitting path into segments with gaps
 * 
 * Simulates traditional Chinese painting technique where the brush is lifted from paper,
 * creating natural breaks in the stroke. Splits the path into random-length segments
 * with gaps between them to create the broken effect.
 * 
 * @param {Array} ptlist - Array of points defining the path [[x1,y1], [x2,y2], ...]
 * @param {Object} args - Stroke options (same as stroke function)
 * @param {number} args.breakProb - Probability of creating a gap between segments (default: 0.2)
 * @param {number} args.minSegLen - Minimum points per segment (default: 4)
 * @param {number} args.maxSegLen - Maximum points per segment (default: 15)
 * @returns {string} SVG markup for broken stroke segments
 */
function brokenStroke(ptlist, args) {
  var args = args != undefined ? args : {};
  var breakProb = args.breakProb != undefined ? args.breakProb : 0.2;
  var minSegLen = args.minSegLen != undefined ? args.minSegLen : 4;
  var maxSegLen = args.maxSegLen != undefined ? args.maxSegLen : 15;
  
  if (ptlist.length < 2) {
    return "";
  }

  var segments = [];
  var currentSegment = [];
  var i = 0;

  while (i < ptlist.length) {
    // Start a new segment
    currentSegment = [ptlist[i]];
    var segmentLength = minSegLen + Math.floor(Math.random() * (maxSegLen - minSegLen));
    
    // Add points to current segment
    for (var j = 1; j < segmentLength && i + j < ptlist.length; j++) {
      currentSegment.push(ptlist[i + j]);
    }
    
    // Add segment if it has enough points
    if (currentSegment.length >= 2) {
      segments.push(currentSegment);
    }
    
    // Move to next segment start
    i += segmentLength;
    
    // Add a random gap (skip some points)
    if (i < ptlist.length && Math.random() < breakProb) {
      var gapSize = 1 + Math.floor(Math.random() * 3);
      i += gapSize;
    }
  }

  // Render each segment as a separate stroke
  var canv = "";
  for (var k = 0; k < segments.length; k++) {
    if (segments[k].length >= 2) {
      // Create a copy of args and explicitly set broken to false to avoid infinite recursion
      var segmentArgs = {};
      for (var key in args) {
        segmentArgs[key] = args[key];
      }
      segmentArgs.broken = false; // Explicitly disable broken strokes for recursive calls
      canv += stroke(segments[k], segmentArgs);
    }
  }

  return canv;
}/**
 *
 Generate organic blob shape
 * @param {number} x - Center X coordinate
 * @param {number} y - Center Y coordinate
 * @param {Object} args - Blob options
 * @param {number} args.len - Length (default: 20)
 * @param {number} args.wid - Width (default: 5)
 * @param {number} args.ang - Rotation angle (default: 0)
 * @param {string} args.col - Color (default: "rgba(200,200,200,0.9)")
 * @param {number} args.noi - Noise factor (default: 0.5)
 * @param {number} args.ret - Return mode: 0=SVG, 1=points (default: 0)
 * @param {Function} args.fun - Shape function
 * @returns {string|Array} SVG polygon or point array
 */
function blob(x, y, args) {
  var args = args != undefined ? args : {};
  var len = args.len != undefined ? args.len : 20;
  var wid = args.wid != undefined ? args.wid : 5;
  var ang = args.ang != undefined ? args.ang : 0;
  var col = args.col != undefined ? args.col : "rgba(200,200,200,0.9)";
  var noi = args.noi != undefined ? args.noi : 0.5;
  var ret = args.ret != undefined ? args.ret : 0;
  var fun =
    args.fun != undefined
      ? args.fun
      : function(x) {
          return x <= 1
            ? Math.pow(Math.sin(x * Math.PI), 0.5)
            : -Math.pow(Math.sin((x + 1) * Math.PI), 0.5);
        };

  var reso = 20.0;
  var lalist = [];
  for (var i = 0; i < reso + 1; i++) {
    var p = (i / reso) * 2;
    var xo = len / 2 - Math.abs(p - 1) * len;
    var yo = (fun(p) * wid) / 2;
    var a = Math.atan2(yo, xo);
    var l = Math.sqrt(xo * xo + yo * yo);
    lalist.push([l, a]);
  }
  var nslist = [];
  var n0 = Math.random() * 10;
  for (var i = 0; i < reso + 1; i++) {
    nslist.push(Noise.noise(i * 0.05, n0));
  }

  loopNoise(nslist);
  var plist = [];
  for (var i = 0; i < lalist.length; i++) {
    var ns = nslist[i] * noi + (1 - noi);
    var nx = x + Math.cos(lalist[i][1] + ang) * lalist[i][0] * ns;
    var ny = y + Math.sin(lalist[i][1] + ang) * lalist[i][0] * ns;
    plist.push([nx, ny]);
  }

  if (ret == 0) {
    return poly(plist, { fil: col, str: col, wid: 0 });
  } else {
    return plist;
  }
}

/**
 * Generate surface texture pattern
 * 
 * Creates natural surface textures using multiple stroke lines with noise variation.
 * Supports broken stroke effects when globally enabled via UI checkbox.
 * 
 * @param {Array} ptlist - 2D array of points defining surface layers
 * @param {Object} args - Texture options
 * @param {number} args.xof - X offset (default: 0)
 * @param {number} args.yof - Y offset (default: 0)
 * @param {number} args.tex - Number of texture lines (default: 400)
 * @param {number} args.wid - Line width (default: 1.5)
 * @param {number} args.len - Line length factor (default: 0.2)
 * @param {number} args.sha - Shadow width (default: 0)
 * @param {number} args.ret - Return mode: 0=SVG, 1=points (default: 0)
 * @param {boolean} args.broken - Enable broken stroke effect (default: auto-detect from UI)
 * @param {Function} args.noi - Noise function for texture variation
 * @param {Function} args.col - Color function for texture lines
 * @param {Function} args.dis - Distribution function for texture placement
 * @returns {string|Array} SVG texture markup or texture point arrays
 */
var texture = function(ptlist, args) {
  var args = args != undefined ? args : {};
  var xof = args.xof != undefined ? args.xof : 0;
  var yof = args.yof != undefined ? args.yof : 0;
  var tex = args.tex != undefined ? args.tex : 400;
  var wid = args.wid != undefined ? args.wid : 1.5;
  var len = args.len != undefined ? args.len : 0.2;
  var sha = args.sha != undefined ? args.sha : 0;
  var ret = args.ret != undefined ? args.ret : 0;
  var noi =
    args.noi != undefined
      ? args.noi
      : function(x) {
          return 30 / x;
        };
  var col =
    args.col != undefined
      ? args.col
      : function(x) {
          return "rgba(100,100,100," + (Math.random() * 0.3).toFixed(3) + ")";
        };
  var dis =
    args.dis != undefined
      ? args.dis
      : function() {
          if (Math.random() > 0.5) {
            return (1 / 3) * Math.random();
          } else {
            return (1 * 2) / 3 + (1 / 3) * Math.random();
          }
        };
  var reso = [ptlist.length, ptlist[0].length];
  var texlist = [];
  for (var i = 0; i < tex; i++) {
    var mid = (dis() * reso[1]) | 0;
    //mid = (reso[1]/3+reso[1]/3*Math.random())|0

    var hlen = Math.floor(Math.random() * (reso[1] * len));

    var start = mid - hlen;
    var end = mid + hlen;
    start = Math.min(Math.max(start, 0), reso[1]);
    end = Math.min(Math.max(end, 0), reso[1]);

    var layer = (i / tex) * (reso[0] - 1);

    texlist.push([]);
    for (var j = start; j < end; j++) {
      var p = layer - Math.floor(layer);

      var x =
        ptlist[Math.floor(layer)][j][0] * p +
        ptlist[Math.ceil(layer)][j][0] * (1 - p);

      var y =
        ptlist[Math.floor(layer)][j][1] * p +
        ptlist[Math.ceil(layer)][j][1] * (1 - p);

      var ns = [
        noi(layer + 1) * (Noise.noise(x, j * 0.5) - 0.5),
        noi(layer + 1) * (Noise.noise(y, j * 0.5) - 0.5),
      ];

      texlist[texlist.length - 1].push([x + ns[0], y + ns[1]]);
    }
  }
  var canv = "";
  //SHADE
  if (sha) {
    for (var j = 0; j < texlist.length; j += 1 + (sha != 0)) {
      canv += stroke(
        texlist[j].map(function(x) {
          return [x[0] + xof, x[1] + yof];
        }),
        { col: "rgba(100,100,100,0.1)", wid: sha },
      );
    }
  }
  //TEXTURE
  for (var j = 0 + sha; j < texlist.length; j += 1 + sha) {
    canv += stroke(
      texlist[j].map(function(x) {
        return [x[0] + xof, x[1] + yof];
      }),
      { col: col(j / texlist.length), wid: wid, broken: args.broken },
    );
  }
  return ret ? texlist : canv;
};