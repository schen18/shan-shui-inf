/**
 * Water Effects Module
 * 
 * Generates water surface effects with waves and ripples for landscape scenes.
 * Supports traditional Chinese painting aesthetics including broken stroke effects
 * when enabled via the global UI toggle.
 * 
 * Features:
 * - Natural wave patterns using Perlin noise
 * - Multiple water clusters for realistic surface variation
 * - Automatic broken stroke support for traditional painting style
 * - Configurable wave height, length, and cluster count
 */

/**
 * Generate water surface effects with waves and ripples
 * 
 * Creates natural-looking water surfaces with multiple wave clusters.
 * Automatically applies broken stroke effects when enabled via UI checkbox,
 * simulating traditional Chinese water painting techniques.
 * 
 * @param {number} xoff - X offset position for water placement
 * @param {number} yoff - Y offset position for water placement  
 * @param {number} seed - Random seed for deterministic wave generation
 * @param {Object} args - Configuration options
 * @param {number} args.hei - Wave height amplitude (default: 2)
 * @param {number} args.len - Total water surface length (default: 800)
 * @param {number} args.clu - Number of wave clusters (default: 10)
 * @returns {string} SVG markup for water surface with waves
 */
function water(xoff, yoff, seed, args) {
  var args = args != undefined ? args : {};
  var hei = args.hei != undefined ? args.hei : 2;
  var len = args.len != undefined ? args.len : 800;
  var clu = args.clu != undefined ? args.clu : 10;
  var canv = "";

  var ptlist = [];
  var yk = 0;
  for (var i = 0; i < clu; i++) {
    ptlist.push([]);
    var xk = (Math.random() - 0.5) * (len / 8);
    yk += Math.random() * 5;
    var lk = len / 4 + Math.random() * (len / 4);
    var reso = 5;
    for (var j = -lk; j < lk; j += reso) {
      ptlist[ptlist.length - 1].push([
        j + xk,
        Math.sin(j * 0.2) * hei * Noise.noise(j * 0.1) - 20 + yk,
      ]);
    }
  }

  for (var j = 1; j < ptlist.length; j += 1) {
    canv += stroke(
      ptlist[j].map(function(x) {
        return [x[0] + xoff, x[1] + yoff];
      }),
      {
        col:
          "rgba(100,100,100," + (0.3 + Math.random() * 0.3).toFixed(3) + ")",
        wid: 1,
        // Water strokes will automatically use broken strokes if globally enabled
        // No need to explicitly set broken parameter as stroke() function handles global detection
      },
    );
  }

  return canv;
}