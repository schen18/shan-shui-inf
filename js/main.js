/**
 * Main.js - Application Logic and Chunk Management
 * 
 * This module contains the main application logic, memory management,
 * landscape planning, chunk rendering, and coordinate system management.
 */

// Global memory object for application state
var MEM = {
  canv: "",
  chunks: [],
  xmin: 0,
  xmax: 0,
  cwid: 512,
  cursx: 0,
  lasttick: 0,
  windx: 3000,
  windy: 800,
  planmtx: [],
};

// Global element toggles
var ELEMENT_TOGGLES = {
  trees: true,
  buildings: true,
  boats: true,
  water: true
};

// Store original architecture and tree functions
var OriginalArch = null;
var OriginalTree = null;

/**
 * Initialize architecture function wrappers
 */
function initArchitectureToggles() {
  if (!OriginalArch && typeof Arch !== 'undefined') {
    // Store original functions
    OriginalArch = {
      arch01: Arch.arch01,
      arch02: Arch.arch02,
      arch03: Arch.arch03,
      arch04: Arch.arch04
    };
    
    // Wrap architecture functions to respect toggles
    Arch.arch01 = function(x, y, seed, args) {
      var toggles = typeof getElementToggles === 'function' ? getElementToggles() : ELEMENT_TOGGLES;
      if (!toggles.buildings) {
        return ''; // Return empty string if buildings are disabled
      }
      return OriginalArch.arch01(x, y, seed, args);
    };
    
    Arch.arch02 = function(x, y, seed, args) {
      var toggles = typeof getElementToggles === 'function' ? getElementToggles() : ELEMENT_TOGGLES;
      if (!toggles.buildings) {
        return '';
      }
      return OriginalArch.arch02(x, y, seed, args);
    };
    
    Arch.arch03 = function(x, y, seed, args) {
      var toggles = typeof getElementToggles === 'function' ? getElementToggles() : ELEMENT_TOGGLES;
      if (!toggles.buildings) {
        return '';
      }
      return OriginalArch.arch03(x, y, seed, args);
    };
    
    Arch.arch04 = function(x, y, seed, args) {
      var toggles = typeof getElementToggles === 'function' ? getElementToggles() : ELEMENT_TOGGLES;
      if (!toggles.buildings) {
        return '';
      }
      return OriginalArch.arch04(x, y, seed, args);
    };
    
    console.log("Architecture toggles initialized");
  }
}

/**
 * Initialize tree function wrappers
 */
function initTreeToggles() {
  if (!OriginalTree && typeof Tree !== 'undefined') {
    // Store original tree functions
    OriginalTree = {
      tree01: Tree.tree01,
      tree02: Tree.tree02,
      tree03: Tree.tree03,
      tree04: Tree.tree04,
      tree05: Tree.tree05,
      tree06: Tree.tree06,
      tree07: Tree.tree07,
      tree08: Tree.tree08
    };
    
    // Wrap tree functions to respect toggles
    Tree.tree01 = function(x, y, args) {
      var toggles = typeof getElementToggles === 'function' ? getElementToggles() : ELEMENT_TOGGLES;
      if (!toggles.trees) {
        return ''; // Return empty string if trees are disabled
      }
      return OriginalTree.tree01(x, y, args);
    };
    
    Tree.tree02 = function(x, y, args) {
      var toggles = typeof getElementToggles === 'function' ? getElementToggles() : ELEMENT_TOGGLES;
      if (!toggles.trees) {
        return '';
      }
      return OriginalTree.tree02(x, y, args);
    };
    
    Tree.tree03 = function(x, y, args) {
      var toggles = typeof getElementToggles === 'function' ? getElementToggles() : ELEMENT_TOGGLES;
      if (!toggles.trees) {
        return '';
      }
      return OriginalTree.tree03(x, y, args);
    };
    
    Tree.tree04 = function(x, y, args) {
      var toggles = typeof getElementToggles === 'function' ? getElementToggles() : ELEMENT_TOGGLES;
      if (!toggles.trees) {
        return '';
      }
      return OriginalTree.tree04(x, y, args);
    };
    
    Tree.tree05 = function(x, y, args) {
      var toggles = typeof getElementToggles === 'function' ? getElementToggles() : ELEMENT_TOGGLES;
      if (!toggles.trees) {
        return '';
      }
      return OriginalTree.tree05(x, y, args);
    };
    
    Tree.tree06 = function(x, y, args) {
      var toggles = typeof getElementToggles === 'function' ? getElementToggles() : ELEMENT_TOGGLES;
      if (!toggles.trees) {
        return '';
      }
      return OriginalTree.tree06(x, y, args);
    };
    
    Tree.tree07 = function(x, y, args) {
      var toggles = typeof getElementToggles === 'function' ? getElementToggles() : ELEMENT_TOGGLES;
      if (!toggles.trees) {
        return '';
      }
      return OriginalTree.tree07(x, y, args);
    };
    
    Tree.tree08 = function(x, y, args) {
      var toggles = typeof getElementToggles === 'function' ? getElementToggles() : ELEMENT_TOGGLES;
      if (!toggles.trees) {
        return '';
      }
      return OriginalTree.tree08(x, y, args);
    };
    
    console.log("Tree toggles initialized");
  }
}

/**
 * Initialize all element toggles
 */
function initElementToggles() {
  initArchitectureToggles();
  initTreeToggles();
}

// Mouse tracking variables
var mouseX = 0;
var mouseY = 0;

/**
 * Generate mountain with element toggles applied
 * @param {number} x - X coordinate
 * @param {number} y - Y coordinate  
 * @param {number} seed - Random seed
 * @param {Object} toggles - Element toggle states
 * @returns {string} SVG markup for mountain
 */
function generateMountainWithToggles(x, y, seed, toggles) {
  // Initialize all element toggles if not done yet
  initElementToggles();
  
  // Generate mountain (trees and buildings will be controlled by function wrappers)
  return Mount.mountain(x, y, seed, {
    veg: true // Always pass true, let the wrapper functions handle the toggle
  });
}

/**
 * Parse URL parameters and execute corresponding functions
 * @param {Object} key2f - Object mapping parameter names to functions
 */
function parseArgs(key2f) {
  var par = window.location.href.split("?")[1];
  if (par == undefined) {
    return;
  }
  par = par.split("&");
  for (var i = 0; i < par.length; i++) {
    var e = par[i].split("=");
    try {
      key2f[e[0]](e[1]);
    } catch (e) {
      console.log(e);
    }
  }
}

/**
 * Calculate SVG viewBox for current viewport
 * @returns {string} ViewBox string for SVG
 */
function calcViewBox() {
  var zoom = 1.142;
  return "" + MEM.cursx + " 0 " + MEM.windx / zoom + " " + MEM.windy / zoom;
}

/**
 * Check if landscape needs to be updated
 * @returns {boolean} True if update is needed
 */
function needupdate() {
  return true;
  // Commented out original logic for always updating
  // if (MEM.xmin < MEM.cursx && MEM.cursx < MEM.xmax - MEM.windx) {
  //   return false;
  // }
  // return true;
}

/**
 * Plan mountain and landscape element placement
 * @param {number} xmin - Minimum X coordinate
 * @param {number} xmax - Maximum X coordinate
 * @returns {Array} Array of planned landscape elements
 */
function mountplanner(xmin, xmax) {
  function locmax(x, y, f, r) {
    var z0 = f(x, y);
    if (z0 <= 0.3) {
      return false;
    }
    for (var i = x - r; i < x + r; i++) {
      for (var j = y - r; j < y + r; j++) {
        if (f(i, j) > z0) {
          return false;
        }
      }
    }
    return true;
  }

  function chadd(r, mind) {
    mind = mind == undefined ? 10 : mind;
    for (var k = 0; k < reg.length; k++) {
      if (Math.abs(reg[k].x - r.x) < mind) {
        return false;
      }
    }
    console.log("+");
    reg.push(r);
    return true;
  }

  var reg = [];
  var samp = 0.03;
  var ns = function(x, y) {
    return Math.max(Noise.noise(x * samp) - 0.55, 0) * 2;
  };
  var nns = function(x) {
    return 1 - Noise.noise(x * samp);
  };
  var nnns = function(x, y) {
    return Math.max(Noise.noise(x * samp * 2, 2) - 0.55, 0) * 2;
  };
  var yr = function(x) {
    return Noise.noise(x * 0.01, Math.PI);
  };

  var xstep = 5;
  var mwid = 200;
  for (var i = xmin; i < xmax; i += xstep) {
    var i1 = Math.floor(i / xstep);
    MEM.planmtx[i1] = MEM.planmtx[i1] || 0;
  }

  for (var i = xmin; i < xmax; i += xstep) {
    for (var j = 0; j < yr(i) * 480; j += 30) {
      if (locmax(i, j, ns, 2)) {
        var xof = i + 2 * (Math.random() - 0.5) * 500;
        var yof = j + 300;
        var r = { tag: "mount", x: xof, y: yof, h: ns(i, j) };
        var res = chadd(r);
        if (res) {
          for (
            var k = Math.floor((xof - mwid) / xstep);
            k < (xof + mwid) / xstep;
            k++
          ) {
            MEM.planmtx[k] += 1;
          }
        }
      }
    }
    if (Math.abs(i) % 1000 < Math.max(1, xstep - 1)) {
      var r = {
        tag: "distmount",
        x: i,
        y: 280 - Math.random() * 50,
        h: ns(i, j),
      };
      chadd(r);
    }
  }
  console.log([xmin, xmax]);
  for (var i = xmin; i < xmax; i += xstep) {
    if (MEM.planmtx[Math.floor(i / xstep)] == 0) {
      if (Math.random() < 0.01) {
        for (var j = 0; j < 4 * Math.random(); j++) {
          var r = {
            tag: "flatmount",
            x: i + 2 * (Math.random() - 0.5) * 700,
            y: 700 - j * 50,
            h: ns(i, j),
          };
          chadd(r);
        }
      }
    }
  }

  for (var i = xmin; i < xmax; i += xstep) {
    if (Math.random() < 0.2) {
      var r = { tag: "boat", x: i, y: 300 + Math.random() * 390 };
      chadd(r, 400);
    }
  }

  return reg;
}

/**
 * Load landscape chunks for the specified range
 * @param {number} xmin - Minimum X coordinate
 * @param {number} xmax - Maximum X coordinate
 */
function chunkloader(xmin, xmax) {
  var add = function(nch) {
    if (nch.canv.includes("NaN")) {
      console.log("gotcha:");
      console.log(nch.tag);
      nch.canv = nch.canv.replace(/NaN/g, -1000);
    }
    if (MEM.chunks.length == 0) {
      MEM.chunks.push(nch);
      return;
    } else {
      if (nch.y <= MEM.chunks[0].y) {
        MEM.chunks.unshift(nch);
        return;
      } else if (nch.y >= MEM.chunks[MEM.chunks.length - 1].y) {
        MEM.chunks.push(nch);
        return;
      } else {
        for (var j = 0; j < MEM.chunks.length - 1; j++) {
          if (MEM.chunks[j].y <= nch.y && nch.y <= MEM.chunks[j + 1].y) {
            MEM.chunks.splice(j + 1, 0, nch);
            return;
          }
        }
      }
    }
    console.log("EH?WTF!");
    console.log(MEM.chunks);
    console.log(nch);
  };

  while (xmax > MEM.xmax - MEM.cwid || xmin < MEM.xmin + MEM.cwid) {
    console.log("generating new chunk...");

    var plan;
    if (xmax > MEM.xmax - MEM.cwid) {
      plan = mountplanner(MEM.xmax, MEM.xmax + MEM.cwid);
      MEM.xmax = MEM.xmax + MEM.cwid;
    } else {
      plan = mountplanner(MEM.xmin - MEM.cwid, MEM.xmin);
      MEM.xmin = MEM.xmin - MEM.cwid;
    }

    // Get element toggle states
    var toggles = typeof getElementToggles === 'function' ? getElementToggles() : ELEMENT_TOGGLES;

    for (var i = 0; i < plan.length; i++) {
      if (plan[i].tag == "mount") {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv: generateMountainWithToggles(plan[i].x, plan[i].y, i * 2 * Math.random(), toggles),
        });
        if (toggles.water) {
          add({
            tag: plan[i].tag,
            x: plan[i].x,
            y: plan[i].y - 10000,
            canv: water(plan[i].x, plan[i].y, i * 2),
          });
        }
      } else if (plan[i].tag == "flatmount") {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv: Mount.flatMount(
            plan[i].x,
            plan[i].y,
            2 * Math.random() * Math.PI,
            {
              wid: 600 + Math.random() * 400,
              hei: 100,
              cho: 0.5 + Math.random() * 0.2,
            },
          ),
        });
      } else if (plan[i].tag == "distmount") {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv: Mount.distMount(plan[i].x, plan[i].y, Math.random() * 100, {
            hei: 150,
            len: randChoice([500, 1000, 1500]),
          }),
        });
      } else if (plan[i].tag == "boat" && toggles.boats) {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv: Arch.boat01(plan[i].x, plan[i].y, Math.random(), {
            sca: plan[i].y / 800,
            fli: randChoice([true, false]),
          }),
        });
      } else if (plan[i].tag == "redcirc") {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv:
            "<circle cx='" +
            plan[i].x +
            "' cy='" +
            plan[i].y +
            "' r='20' stroke='black' fill='red' />",
        });
      } else if (plan[i].tag == "greencirc") {
        add({
          tag: plan[i].tag,
          x: plan[i].x,
          y: plan[i].y,
          canv:
            "<circle cx='" +
            plan[i].x +
            "' cy='" +
            plan[i].y +
            "' r='20' stroke='black' fill='green' />",
        });
      }
    }
  }
}

/**
 * Render landscape chunks for the specified range
 * @param {number} xmin - Minimum X coordinate
 * @param {number} xmax - Maximum X coordinate
 */
function chunkrender(xmin, xmax) {
  MEM.canv = "";

  for (var i = 0; i < MEM.chunks.length; i++) {
    if (
      xmin - MEM.cwid < MEM.chunks[i].x &&
      MEM.chunks[i].x < xmax + MEM.cwid
    ) {
      MEM.canv += MEM.chunks[i].canv;
    }
  }
}

/**
 * Mouse event handlers for tracking mouse position
 */
function onMouseUpdate(e) {
  mouseX = e.pageX;
  mouseY = e.pageY;
}

// Set up mouse event listeners
document.addEventListener("mousemove", onMouseUpdate, false);
document.addEventListener("mouseenter", onMouseUpdate, false);

// Expose chunkloader to global scope for compatibility
self.chunkloader = chunkloader;
self.chunkrender = chunkrender;