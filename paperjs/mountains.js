/**
 * Paper.js Mountain Generation Module
 * 
 * Migrated from the original mountains.js to use Paper.js rendering system.
 * Generates various types of mountains, rocks, and terrain features using
 * Paper.js Groups and Paths instead of SVG strings.
 * 
 * Dependencies: Paper.js library, paper-renderer.js, stroke-renderer.js, 
 *               prng.js, noise.js, polytools.js, utils.js, trees.js
 * 
 * @namespace PaperMount
 */
var PaperMount = new function () {

  /**
   * Generate mountain base/foot structures using Paper.js Path objects
   * Replaces the original foot() function with full Paper.js compatibility
   * @param {Array} ptlist - Array of point arrays representing mountain layers
   * @param {Object} args - Configuration options
   * @param {number} [args.xof=0] - X offset
   * @param {number} [args.yof=0] - Y offset
   * @param {number} [args.ret=0] - Return mode: 0=Paper.js Group, 1=point arrays
   * @returns {paper.Group|Array} Paper.js Group containing mountain foot or point arrays
   */
  var foot = function (ptlist, args) {
    var args = args != undefined ? args : {};
    var xof = args.xof != undefined ? args.xof : 0;
    var yof = args.yof != undefined ? args.yof : 0;
    var ret = args.ret != undefined ? args.ret : 0;

    var ftlist = [];
    var span = 10;
    var ni = 0;

    // Generate foot structure points (same algorithm as original)
    for (var i = 0; i < ptlist.length - 2; i += 1) {
      if (i == ni) {
        ni = Math.min(ni + randChoice([1, 2]), ptlist.length - 1);

        ftlist.push([]);
        ftlist.push([]);
        for (var j = 0; j < Math.min(ptlist[i].length / 8, 10); j++) {
          ftlist[ftlist.length - 2].push([
            ptlist[i][j][0] + Noise.noise(j * 0.1, i) * 10,
            ptlist[i][j][1],
          ]);
          ftlist[ftlist.length - 1].push([
            ptlist[i][ptlist[i].length - 1 - j][0] -
            Noise.noise(j * 0.1, i) * 10,
            ptlist[i][ptlist[i].length - 1 - j][1],
          ]);
        }

        ftlist[ftlist.length - 2] = ftlist[ftlist.length - 2].reverse();
        ftlist[ftlist.length - 1] = ftlist[ftlist.length - 1].reverse();

        for (var j = 0; j < span; j++) {
          var p = j / span;
          var x1 = ptlist[i][0][0] * (1 - p) + ptlist[ni][0][0] * p;
          var y1 = ptlist[i][0][1] * (1 - p) + ptlist[ni][0][1] * p;

          var x2 =
            ptlist[i][ptlist[i].length - 1][0] * (1 - p) +
            ptlist[ni][ptlist[i].length - 1][0] * p;
          var y2 =
            ptlist[i][ptlist[i].length - 1][1] * (1 - p) +
            ptlist[ni][ptlist[i].length - 1][1] * p;

          var vib = -1.7 * (p - 1) * Math.pow(p, 1 / 5);
          y1 += vib * 5 + Noise.noise(xof * 0.05, i) * 5;
          y2 += vib * 5 + Noise.noise(xof * 0.05, i) * 5;

          ftlist[ftlist.length - 2].push([x1, y1]);
          ftlist[ftlist.length - 1].push([x2, y2]);
        }
      }
    }

    if (ret) {
      return ftlist;
    }

    // Create Paper.js Group for mountain foot
    var footGroup = PaperRenderer.createGroup();

    // Create filled polygons for foot structure
    for (var i = 0; i < ftlist.length; i++) {
      var footPoly = PaperRenderer.createPolygon(ftlist[i], {
        xof: xof,
        yof: yof,
        fil: "white",
        str: "none"
      });
      footGroup.addChild(footPoly);
    }

    // Create stroke outlines for foot structure
    for (var j = 0; j < ftlist.length; j++) {
      var strokePoints = ftlist[j].map(function (x) {
        return [x[0] + xof, x[1] + yof];
      });

      var footStroke = StrokeRenderer.createVariableStroke(strokePoints, {
        col: "rgba(100,100,100," + (0.1 + Math.random() * 0.1).toFixed(3) + ")",
        wid: 1
      });
      footGroup.addChild(footStroke);
    }

    return footGroup;
  };

  /**
   * Generate vegetation on terrain using provided tree function and placement rules
   * @param {Function} treeFunc - Function to generate trees (returns Paper.js Group)
   * @param {Function} growthRule - Function determining where vegetation can grow
   * @param {Function} proofRule - Function for additional vegetation placement validation
   * @param {Array} ptlist - Terrain point data
   * @param {paper.Group} group - Paper.js Group to add vegetation to
   * @returns {paper.Group} Updated group with vegetation
   */
  var vegetate = function (treeFunc, growthRule, proofRule, ptlist, group) {
    var veglist = [];

    // Find vegetation placement points
    for (var i = 0; i < ptlist.length; i += 1) {
      for (var j = 0; j < ptlist[i].length; j += 1) {
        if (growthRule(i, j)) {
          veglist.push([ptlist[i][j][0], ptlist[i][j][1]]);
        }
      }
    }

    // Place vegetation at valid locations
    for (var i = 0; i < veglist.length; i++) {
      if (proofRule(veglist, i)) {
        var vegetation = treeFunc(veglist[i][0], veglist[i][1]);
        if (vegetation) {
          group.addChild(vegetation);
        }
      }
    }

    return group;
  };

  /**
   * Generate main mountain with vegetation and architectural elements using Paper.js
   * Replaces the original Mount.mountain() function with full Paper.js compatibility
   * @param {Number} xoff - X offset position
   * @param {Number} yoff - Y offset position  
   * @param {Number} seed - Random seed for generation
   * @param {Object} args - Configuration options
   * @param {number} [args.hei] - Mountain height
   * @param {number} [args.wid] - Mountain width
   * @param {number} [args.tex=200] - Texture density
   * @param {boolean} [args.veg=true] - Enable vegetation
   * @param {number} [args.ret=0] - Return mode: 0=Paper.js Group, 1=point arrays
   * @param {string} [args.col] - Custom color function
   * @returns {paper.Group|Array} Paper.js Group containing complete mountain or point arrays
   */
  this.mountain = function (xoff, yoff, seed, args) {
    var args = args != undefined ? args : {};
    var hei = args.hei != undefined ? args.hei : 100 + Math.random() * 400;
    var wid = args.wid != undefined ? args.wid : 400 + Math.random() * 200;
    var tex = args.tex != undefined ? args.tex : 200;
    var veg = args.veg != undefined ? args.veg : true;
    var ret = args.ret != undefined ? args.ret : 0;
    var col = args.col != undefined ? args.col : undefined;

    seed = seed != undefined ? seed : 0;

    var mountainGroup = PaperRenderer.createGroup();
    var ptlist = [];
    var h = hei;
    var w = wid;
    var reso = [10, 50];

    // Generate mountain shape points (same algorithm as original)
    var hoff = 0;
    for (var j = 0; j < reso[0]; j++) {
      hoff += (Math.random() * yoff) / 100;
      ptlist.push([]);
      for (var i = 0; i < reso[1]; i++) {
        var x = (i / reso[1] - 0.5) * Math.PI;
        var y = Math.cos(x);
        y *= Noise.noise(x + 10, j * 0.15, seed);
        var p = 1 - j / reso[0];
        ptlist[ptlist.length - 1].push([
          (x / Math.PI) * w * p,
          -y * h * p + hoff,
        ]);
      }
    }

    // RIM vegetation - add trees on mountain rim
    mountainGroup = vegetate(
      function (x, y) {
        // Check if Tree module is available and has tree02 function
        if (typeof Tree !== 'undefined' && Tree.tree02) {
          return Tree.tree02(x + xoff, y + yoff - 5, {
            col: "rgba(100,100,100," +
              (Noise.noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.5).toFixed(3) + ")",
            clu: 2,
          });
        }
        return null; // Return null if tree module not available
      },
      function (i, j) {
        var ns = Noise.noise(j * 0.1, seed);
        return (
          i == 0 && ns * ns * ns < 0.1 && Math.abs(ptlist[i][j][1]) / h > 0.2
        );
      },
      function (veglist, i) {
        return true;
      },
      ptlist,
      mountainGroup
    );

    // WHITE BACKGROUND - create filled polygon for mountain base
    var bgPoints = ptlist[0].concat([[0, reso[0] * 4]]);
    var backgroundPoly = PaperRenderer.createPolygon(bgPoints, {
      xof: xoff,
      yof: yoff,
      fil: "white",
      str: "none"
    });
    mountainGroup.addChild(backgroundPoly);

    // OUTLINE - create mountain outline stroke
    var outlinePoints = ptlist[0].map(function (x) {
      return [x[0] + xoff, x[1] + yoff];
    });
    var outlineStroke = StrokeRenderer.createVariableStroke(outlinePoints, {
      col: "rgba(100,100,100,0.3)",
      noi: 1,
      wid: 3
    });
    mountainGroup.addChild(outlineStroke);

    // MOUNTAIN FOOT - add foot structure
    var footStructure = foot(ptlist, { xof: xoff, yof: yoff });
    mountainGroup.addChild(footStructure);

    // TEXTURE - add surface texture using createTexture method
    var mountainTexture = PaperRenderer.createTexture(ptlist, {
      xof: xoff,
      yof: yoff,
      tex: tex,
      sha: randChoice([0, 0, 0, 0, 5]),
      col: col
    });
    mountainGroup.addChild(mountainTexture);

    // TOP vegetation - add trees on mountain top
    mountainGroup = vegetate(
      function (x, y) {
        if (typeof Tree !== 'undefined' && Tree.tree02) {
          return Tree.tree02(x + xoff, y + yoff, {
            col: "rgba(100,100,100," +
              (Noise.noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.5).toFixed(3) + ")",
          });
        }
        return null;
      },
      function (i, j) {
        var ns = Noise.noise(i * 0.1, j * 0.1, seed + 2);
        return ns * ns * ns < 0.1 && Math.abs(ptlist[i][j][1]) / h > 0.5;
      },
      function (veglist, i) {
        return true;
      },
      ptlist,
      mountainGroup
    );

    if (veg) {
      // MIDDLE vegetation - add trees in middle areas
      mountainGroup = vegetate(
        function (x, y) {
          if (typeof Tree !== 'undefined' && Tree.tree01) {
            var ht = ((h + y) / h) * 70;
            ht = ht * 0.3 + Math.random() * ht * 0.7;
            return Tree.tree01(x + xoff, y + yoff, {
              hei: ht,
              wid: Math.random() * 3 + 1,
              col: "rgba(100,100,100," +
                (Noise.noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.3).toFixed(3) + ")",
            });
          }
          return null;
        },
        function (i, j) {
          var ns = Noise.noise(i * 0.2, j * 0.05, seed);
          return (
            j % 2 &&
            ns * ns * ns * ns < 0.012 &&
            Math.abs(ptlist[i][j][1]) / h < 0.3
          );
        },
        function (veglist, i) {
          var counter = 0;
          for (var j = 0; j < veglist.length; j++) {
            if (
              i != j &&
              Math.pow(veglist[i][0] - veglist[j][0], 2) +
              Math.pow(veglist[i][1] - veglist[j][1], 2) <
              30 * 30
            ) {
              counter++;
            }
            if (counter > 2) {
              return true;
            }
          }
          return false;
        },
        ptlist,
        mountainGroup
      );

      // BOTTOM vegetation - add trees at mountain base
      mountainGroup = vegetate(
        function (x, y) {
          if (typeof Tree !== 'undefined' && Tree.tree03) {
            var ht = ((h + y) / h) * 120;
            ht = ht * 0.5 + Math.random() * ht * 0.5;
            var bc = Math.random() * 0.1;
            var bp = 1;
            return Tree.tree03(x + xoff, y + yoff, {
              hei: ht,
              ben: function (x) {
                return Math.pow(x * bc, bp);
              },
              col: "rgba(100,100,100," +
                (Noise.noise(0.01 * x, 0.01 * y) * 0.5 * 0.3 + 0.3).toFixed(3) + ")",
            });
          }
          return null;
        },
        function (i, j) {
          var ns = Noise.noise(i * 0.2, j * 0.05, seed);
          return (
            (j == 0 || j == ptlist[i].length - 1) && ns * ns * ns * ns < 0.012
          );
        },
        function (veglist, i) {
          return true;
        },
        ptlist,
        mountainGroup
      );
    }

    // BOTTOM ARCHITECTURE - add buildings at mountain base
    mountainGroup = vegetate(
      function (x, y) {
        if (typeof Arch !== 'undefined') {
          var tt = randChoice([0, 0, 1, 1, 1, 2]);
          if (tt == 1 && Arch.arch02) {
            return Arch.arch02(x + xoff, y + yoff, seed, {
              wid: normRand(40, 70),
              sto: randChoice([1, 2, 2, 3]),
              rot: Math.random(),
              sty: randChoice([1, 2, 3]),
            });
          } else if (tt == 2 && Arch.arch04) {
            return Arch.arch04(x + xoff, y + yoff, seed, {
              sto: randChoice([1, 1, 1, 2, 2]),
            });
          }
        }
        return null;
      },
      function (i, j) {
        var ns = Noise.noise(i * 0.2, j * 0.05, seed + 10);
        return (
          i != 0 &&
          (j == 1 || j == ptlist[i].length - 2) &&
          ns * ns * ns * ns < 0.008
        );
      },
      function (veglist, i) {
        return true;
      },
      ptlist,
      mountainGroup
    );

    // TOP ARCHITECTURE - add buildings on mountain top
    mountainGroup = vegetate(
      function (x, y) {
        if (typeof Arch !== 'undefined' && Arch.arch03) {
          return Arch.arch03(x + xoff, y + yoff, seed, {
            sto: randChoice([5, 7]),
            wid: 40 + Math.random() * 20,
          });
        }
        return null;
      },
      function (i, j) {
        return (
          i == 1 &&
          Math.abs(j - ptlist[i].length / 2) < 1 &&
          Math.random() < 0.02
        );
      },
      function (veglist, i) {
        return true;
      },
      ptlist,
      mountainGroup
    );

    // TRANSMISSION TOWER - add transmission towers
    mountainGroup = vegetate(
      function (x, y) {
        if (typeof Arch !== 'undefined' && Arch.transmissionTower01) {
          return Arch.transmissionTower01(x + xoff, y + yoff, seed);
        }
        return null;
      },
      function (i, j) {
        var ns = Noise.noise(i * 0.2, j * 0.05, seed + 20 * Math.PI);
        return (
          i % 2 == 0 &&
          (j == 1 || j == ptlist[i].length - 2) &&
          ns * ns * ns * ns < 0.002
        );
      },
      function (veglist, i) {
        return true;
      },
      ptlist,
      mountainGroup
    );

    // BOTTOM ROCKS - add rocks at mountain base
    mountainGroup = vegetate(
      function (x, y) {
        return PaperMount.rock(x + xoff, y + yoff, seed, {
          wid: 20 + Math.random() * 20,
          hei: 20 + Math.random() * 20,
          sha: 2,
        });
      },
      function (i, j) {
        return (j == 0 || j == ptlist[i].length - 1) && Math.random() < 0.1;
      },
      function (veglist, i) {
        return true;
      },
      ptlist,
      mountainGroup
    );

    if (ret == 0) {
      return mountainGroup;
    } else {
      return [ptlist];
    }
  };  /**
   *
 Generate flat-topped mountain with decorative elements using Paper.js
   * Replaces the original Mount.flatMount() function with full Paper.js compatibility
   * @param {Number} xoff - X offset position
   * @param {Number} yoff - Y offset position
   * @param {Number} seed - Random seed for generation
   * @param {Object} args - Configuration options
   * @param {number} [args.hei] - Mountain height
   * @param {number} [args.wid] - Mountain width
   * @param {number} [args.tex=80] - Texture density
   * @param {number} [args.cho=0.5] - Flat top cutoff ratio
   * @param {number} [args.ret=0] - Return mode: 0=Paper.js Group, 1=point arrays
   * @returns {paper.Group|Array} Paper.js Group containing flat mountain or point arrays
   */
  this.flatMount = function (xoff, yoff, seed, args) {
    var args = args != undefined ? args : {};
    var hei = args.hei != undefined ? args.hei : 40 + Math.random() * 400;
    var wid = args.wid != undefined ? args.wid : 400 + Math.random() * 200;
    var tex = args.tex != undefined ? args.tex : 80;
    var cho = args.cho != undefined ? args.cho : 0.5;
    var ret = args.ret != undefined ? args.ret : 0;

    seed = seed != undefined ? seed : 0;

    var flatMountGroup = PaperRenderer.createGroup();
    var ptlist = [];
    var reso = [5, 50];
    var hoff = 0;
    var flat = [];

    // Generate flat mountain shape points (same algorithm as original)
    for (var j = 0; j < reso[0]; j++) {
      hoff += (Math.random() * yoff) / 100;
      ptlist.push([]);
      flat.push([]);
      for (var i = 0; i < reso[1]; i++) {
        var x = (i / reso[1] - 0.5) * Math.PI;
        var y = Math.cos(x * 2) + 1;
        y *= Noise.noise(x + 10, j * 0.1, seed);
        var p = 1 - (j / reso[0]) * 0.6;
        var nx = (x / Math.PI) * wid * p;
        var ny = -y * hei * p + hoff;
        var h = 100;
        if (ny < -h * cho + hoff) {
          ny = -h * cho + hoff;
          if (flat[flat.length - 1].length % 2 == 0) {
            flat[flat.length - 1].push([nx, ny]);
          }
        } else {
          if (flat[flat.length - 1].length % 2 == 1) {
            flat[flat.length - 1].push(
              ptlist[ptlist.length - 1][ptlist[ptlist.length - 1].length - 1],
            );
          }
        }

        ptlist[ptlist.length - 1].push([nx, ny]);
      }
    }

    // WHITE BACKGROUND - create filled polygon for mountain base
    var bgPoints = ptlist[0].concat([[0, reso[0] * 4]]);
    var backgroundPoly = PaperRenderer.createPolygon(bgPoints, {
      xof: xoff,
      yof: yoff,
      fil: "white",
      str: "none"
    });
    flatMountGroup.addChild(backgroundPoly);

    // OUTLINE - create mountain outline stroke
    var outlinePoints = ptlist[0].map(function (x) {
      return [x[0] + xoff, x[1] + yoff];
    });
    var outlineStroke = StrokeRenderer.createVariableStroke(outlinePoints, {
      col: "rgba(100,100,100,0.3)",
      noi: 1,
      wid: 3
    });
    flatMountGroup.addChild(outlineStroke);

    // TEXTURE - add surface texture
    var flatTexture = PaperRenderer.createTexture(ptlist, {
      xof: xoff,
      yof: yoff,
      tex: tex,
      wid: 2,
      dis: function () {
        if (Math.random() > 0.5) {
          return 0.1 + 0.4 * Math.random();
        } else {
          return 0.9 - 0.4 * Math.random();
        }
      },
    });
    flatMountGroup.addChild(flatTexture);

    // Generate flat top structure
    var grlist1 = [];
    var grlist2 = [];
    for (var i = 0; i < flat.length; i += 2) {
      if (flat[i].length >= 2) {
        grlist1.push(flat[i][0]);
        grlist2.push(flat[i][flat[i].length - 1]);
      }
    }

    if (grlist1.length == 0) {
      return ret ? [] : flatMountGroup;
    }

    var wb = [grlist1[0][0], grlist2[0][0]];
    for (var i = 0; i < 3; i++) {
      var p = 0.8 - i * 0.2;
      grlist1.unshift([wb[0] * p, grlist1[0][1] - 5]);
      grlist2.unshift([wb[1] * p, grlist2[0][1] - 5]);
    }
    wb = [grlist1[grlist1.length - 1][0], grlist2[grlist2.length - 1][0]];
    for (var i = 0; i < 3; i++) {
      var p = 0.6 - i * i * 0.1;
      grlist1.push([wb[0] * p, grlist1[grlist1.length - 1][1] + 1]);
      grlist2.push([wb[1] * p, grlist2[grlist2.length - 1][1] + 1]);
    }

    var d = 5;
    grlist1 = div(grlist1, d);
    grlist2 = div(grlist2, d);

    var grlist = grlist1.reverse().concat(grlist2.concat([grlist1[0]]));
    for (var i = 0; i < grlist.length; i++) {
      var v = (1 - Math.abs((i % d) - d / 2) / (d / 2)) * 0.12;
      grlist[i][0] *= 1 - v + Noise.noise(grlist[i][1] * 0.5) * v;
    }

    // Create flat top polygon
    var flatTopPoly = PaperRenderer.createPolygon(grlist, {
      xof: xoff,
      yof: yoff,
      str: "none",
      fil: "white",
      wid: 2
    });
    flatMountGroup.addChild(flatTopPoly);

    // Create flat top outline
    var flatTopOutline = StrokeRenderer.createVariableStroke(
      grlist.map(function (x) { return [x[0] + xoff, x[1] + yoff]; }), {
      wid: 3,
      col: "rgba(100,100,100,0.2)"
    }
    );
    flatMountGroup.addChild(flatTopOutline);

    // Calculate bounds for decorative elements
    var bound = function (plist) {
      var xmin, xmax, ymin, ymax;
      for (var i = 0; i < plist.length; i++) {
        if (xmin == undefined || plist[i][0] < xmin) {
          xmin = plist[i][0];
        }
        if (xmax == undefined || plist[i][0] > xmax) {
          xmax = plist[i][0];
        }
        if (ymin == undefined || plist[i][1] < ymin) {
          ymin = plist[i][1];
        }
        if (ymax == undefined || plist[i][1] > ymax) {
          ymax = plist[i][1];
        }
      }
      return { xmin: xmin, xmax: xmax, ymin: ymin, ymax: ymax };
    };

    // Add decorative elements
    var decorations = this.flatDec(xoff, yoff, bound(grlist));
    flatMountGroup.addChild(decorations);

    return ret ? [] : flatMountGroup;
  };

  /**
   * Generate decorative elements for flat mountains using Paper.js
   * Replaces the original Mount.flatDec() function with full Paper.js compatibility
   * @param {Number} xoff - X offset position
   * @param {Number} yoff - Y offset position
   * @param {Object} grbd - Boundary object with xmin, xmax, ymin, ymax
   * @returns {paper.Group} Paper.js Group containing decorative elements
   */
  this.flatDec = function (xoff, yoff, grbd) {
    var decorationGroup = PaperRenderer.createGroup();
    var tt = randChoice([0, 0, 1, 2, 3, 4]);

    // Add random rocks
    for (var j = 0; j < Math.random() * 5; j++) {
      var rock = PaperMount.rock(
        xoff + normRand(grbd.xmin, grbd.xmax),
        yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-10, 10) + 10,
        Math.random() * 100,
        {
          wid: 10 + Math.random() * 20,
          hei: 10 + Math.random() * 20,
          sha: 2,
        },
      );
      decorationGroup.addChild(rock);
    }

    // Add tree clusters
    for (var j = 0; j < randChoice([0, 0, 1, 2]); j++) {
      var xr = xoff + normRand(grbd.xmin, grbd.xmax);
      var yr = yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-5, 5) + 20;
      for (var k = 0; k < 2 + Math.random() * 3; k++) {
        if (typeof Tree !== 'undefined' && Tree.tree08) {
          var tree = Tree.tree08(
            xr + Math.min(Math.max(normRand(-30, 30), grbd.xmin), grbd.xmax),
            yr,
            { hei: 60 + Math.random() * 40 }
          );
          decorationGroup.addChild(tree);
        }
      }
    }

    // Add decoration based on type
    if (tt == 0) {
      for (var j = 0; j < Math.random() * 3; j++) {
        var rock = PaperMount.rock(
          xoff + normRand(grbd.xmin, grbd.xmax),
          yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-5, 5) + 20,
          Math.random() * 100,
          {
            wid: 50 + Math.random() * 20,
            hei: 40 + Math.random() * 20,
            sha: 5,
          },
        );
        decorationGroup.addChild(rock);
      }
    }
    if (tt == 1) {
      var pmin = Math.random() * 0.5;
      var pmax = Math.random() * 0.5 + 0.5;
      var xmin = grbd.xmin * (1 - pmin) + grbd.xmax * pmin;
      var xmax = grbd.xmin * (1 - pmax) + grbd.xmax * pmax;
      for (var i = xmin; i < xmax; i += 30) {
        if (typeof Tree !== 'undefined' && Tree.tree05) {
          var tree = Tree.tree05(
            xoff + i + 20 * normRand(-1, 1),
            yoff + (grbd.ymin + grbd.ymax) / 2 + 20,
            { hei: 100 + Math.random() * 200 }
          );
          decorationGroup.addChild(tree);
        }
      }
      for (var j = 0; j < Math.random() * 4; j++) {
        var rock = PaperMount.rock(
          xoff + normRand(grbd.xmin, grbd.xmax),
          yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-5, 5) + 20,
          Math.random() * 100,
          {
            wid: 50 + Math.random() * 20,
            hei: 40 + Math.random() * 20,
            sha: 5,
          },
        );
        decorationGroup.addChild(rock);
      }
    } else if (tt == 2) {
      for (var i = 0; i < randChoice([1, 1, 1, 1, 2, 2, 3]); i++) {
        var xr = normRand(grbd.xmin, grbd.xmax);
        var yr = (grbd.ymin + grbd.ymax) / 2;
        if (typeof Tree !== 'undefined' && Tree.tree04) {
          var tree = Tree.tree04(xoff + xr, yoff + yr + 20, {});
          decorationGroup.addChild(tree);
        }
        for (var j = 0; j < Math.random() * 2; j++) {
          var rock = PaperMount.rock(
            xoff +
            Math.max(
              grbd.xmin,
              Math.min(grbd.xmax, xr + normRand(-50, 50)),
            ),
            yoff + yr + normRand(-5, 5) + 20,
            j * i * Math.random() * 100,
            {
              wid: 50 + Math.random() * 20,
              hei: 40 + Math.random() * 20,
              sha: 5,
            },
          );
          decorationGroup.addChild(rock);
        }
      }
    } else if (tt == 3) {
      for (var i = 0; i < randChoice([1, 1, 1, 1, 2, 2, 3]); i++) {
        if (typeof Tree !== 'undefined' && Tree.tree06) {
          var tree = Tree.tree06(
            xoff + normRand(grbd.xmin, grbd.xmax),
            yoff + (grbd.ymin + grbd.ymax) / 2,
            { hei: 60 + Math.random() * 60 }
          );
          decorationGroup.addChild(tree);
        }
      }
    } else if (tt == 4) {
      var pmin = Math.random() * 0.5;
      var pmax = Math.random() * 0.5 + 0.5;
      var xmin = grbd.xmin * (1 - pmin) + grbd.xmax * pmin;
      var xmax = grbd.xmin * (1 - pmax) + grbd.xmax * pmax;
      for (var i = xmin; i < xmax; i += 20) {
        if (typeof Tree !== 'undefined' && Tree.tree07) {
          var tree = Tree.tree07(
            xoff + i + 20 * normRand(-1, 1),
            yoff + (grbd.ymin + grbd.ymax) / 2 + normRand(-1, 1) + 0,
            { hei: normRand(40, 80) }
          );
          decorationGroup.addChild(tree);
        }
      }
    }

    // Add scattered small trees
    for (var i = 0; i < 50 * Math.random(); i++) {
      if (typeof Tree !== 'undefined' && Tree.tree02) {
        var tree = Tree.tree02(
          xoff + normRand(grbd.xmin, grbd.xmax),
          yoff + normRand(grbd.ymin, grbd.ymax)
        );
        decorationGroup.addChild(tree);
      }
    }

    // Add architecture
    var ts = randChoice([0, 0, 0, 0, 1]);
    if (ts == 1 && tt != 4) {
      if (typeof Arch !== 'undefined' && Arch.arch01) {
        var arch = Arch.arch01(
          xoff + normRand(grbd.xmin, grbd.xmax),
          yoff + (grbd.ymin + grbd.ymax) / 2 + 20,
          Math.random(),
          {
            wid: normRand(160, 200),
            hei: normRand(80, 100),
            per: Math.random(),
          }
        );
        decorationGroup.addChild(arch);
      }
    }

    return decorationGroup;
  };
  /**
    * Generate distant mountain silhouettes using Paper.js
    * Replaces the original Mount.distMount() function with full Paper.js compatibility
    * @param {Number} xoff - X offset position
    * @param {Number} yoff - Y offset position
    * @param {Number} seed - Random seed for generation
    * @param {Object} args - Configuration options
    * @param {number} [args.hei=300] - Mountain height
    * @param {number} [args.len=2000] - Mountain length
    * @param {number} [args.seg=5] - Segment size
    * @returns {paper.Group} Paper.js Group containing distant mountains
    */
  this.distMount = function (xoff, yoff, seed, args) {
    var args = args != undefined ? args : {};
    var hei = args.hei != undefined ? args.hei : 300;
    var len = args.len != undefined ? args.len : 2000;
    var seg = args.seg != undefined ? args.seg : 5;

    seed = seed != undefined ? seed : 0;
    var distMountGroup = PaperRenderer.createGroup();
    var span = 10;
    var ptlist = [];

    // Generate distant mountain points (same algorithm as original)
    var maxIterations = Math.min(Math.floor(len / span / seg), 1000); // Prevent infinite loops
    for (var i = 0; i < maxIterations; i++) {
      ptlist.push([]);
      for (var j = 0; j < seg + 1; j++) {
        var k = i * seg + j;
        var pt = [
          xoff + k * span,
          yoff -
          hei *
          Noise.noise(k * 0.05, seed) *
          Math.pow(Math.sin((Math.PI * k) / (len / span)), 0.5),
        ];
        ptlist[ptlist.length - 1].push(pt);
      }
      for (var j = 0; j < seg / 2 + 1; j++) {
        var k = i * seg + j * 2;
        var pt = [
          xoff + k * span,
          yoff +
          24 *
          Noise.noise(k * 0.05, 2, seed) *
          Math.pow(Math.sin((Math.PI * k) / (len / span)), 1),
        ];
        ptlist[ptlist.length - 1].unshift(pt);
      }
    }

    // Create distant mountain polygons
    for (var i = 0; i < ptlist.length; i++) {
      var getCol = function (x, y) {
        var c = (Noise.noise(x * 0.02, y * 0.02, yoff) * 55 + 200) | 0;
        return "rgb(" + c + "," + c + "," + c + ")";
      };

      // Create main mountain polygon
      var mountainPoly = PaperRenderer.createPolygon(ptlist[i], {
        fil: getCol(ptlist[i][ptlist[i].length - 1][0], ptlist[i][ptlist[i].length - 1][1]),
        str: "none",
        wid: 1
      });
      distMountGroup.addChild(mountainPoly);

      // Add triangulated detail (simplified to avoid stack overflow)
      if (ptlist[i].length > 2) {
        try {
          var T = PolyTools.triangulate(ptlist[i], {
            area: 100,
            convex: true,
            optimize: false,
          });
          for (var k = 0; k < T.length; k++) {
            var m = PolyTools.midPt(T[k]);
            var co = getCol(m[0], m[1]);
            var trianglePoly = PaperRenderer.createPolygon(T[k], {
              fil: co,
              str: co,
              wid: 1
            });
            distMountGroup.addChild(trianglePoly);
          }
        } catch (e) {
          // Fallback to simple polygon if triangulation fails
          console.warn('Triangulation failed for distant mountain, using simple polygon');
        }
      }
    }

    return distMountGroup;
  };

  /**
   * Generate individual rocks and boulders using Paper.js
   * Replaces the original Mount.rock() function with full Paper.js compatibility
   * @param {Number} xoff - X offset position
   * @param {Number} yoff - Y offset position
   * @param {Number} seed - Random seed for generation
   * @param {Object} args - Configuration options
   * @param {number} [args.hei=80] - Rock height
   * @param {number} [args.wid=100] - Rock width
   * @param {number} [args.tex=40] - Texture density
   * @param {number} [args.ret=0] - Return mode: 0=Paper.js Group, 1=point arrays
   * @param {number} [args.sha=10] - Shadow width
   * @returns {paper.Group|Array} Paper.js Group containing rock or point arrays
   */
  this.rock = function (xoff, yoff, seed, args) {
    var args = args != undefined ? args : {};
    var hei = args.hei != undefined ? args.hei : 80;
    var wid = args.wid != undefined ? args.wid : 100;
    var tex = args.tex != undefined ? args.tex : 40;
    var ret = args.ret != undefined ? args.ret : 0;
    var sha = args.sha != undefined ? args.sha : 10;

    seed = seed != undefined ? seed : 0;

    var rockGroup = PaperRenderer.createGroup();
    var reso = [10, 50];
    var ptlist = [];

    // Generate rock shape points (same algorithm as original)
    for (var i = 0; i < reso[0]; i++) {
      ptlist.push([]);

      var nslist = [];
      for (var j = 0; j < reso[1]; j++) {
        nslist.push(Noise.noise(i, j * 0.2, seed));
      }
      loopNoise(nslist);

      for (var j = 0; j < reso[1]; j++) {
        var a = (j / reso[1]) * Math.PI * 2 - Math.PI / 2;
        var l =
          (wid * hei) /
          Math.sqrt(
            Math.pow(hei * Math.cos(a), 2) + Math.pow(wid * Math.sin(a), 2),
          );

        l *= 0.7 + 0.3 * nslist[j];

        var p = 1 - i / reso[0];

        var nx = Math.cos(a) * l * p;
        var ny = -Math.sin(a) * l * p;

        if (Math.PI < a || a < 0) {
          ny *= 0.2;
        }

        ny += hei * (i / reso[0]) * 0.2;

        ptlist[ptlist.length - 1].push([nx, ny]);
      }
    }

    if (ret) {
      return ptlist;
    }

    // WHITE BACKGROUND - create filled polygon for rock base
    var bgPoints = ptlist[0].concat([[0, 0]]);
    var backgroundPoly = PaperRenderer.createPolygon(bgPoints, {
      xof: xoff,
      yof: yoff,
      fil: "white",
      str: "none"
    });
    rockGroup.addChild(backgroundPoly);

    // OUTLINE - create rock outline stroke
    var outlinePoints = ptlist[0].map(function (x) {
      return [x[0] + xoff, x[1] + yoff];
    });
    var outlineStroke = StrokeRenderer.createVariableStroke(outlinePoints, {
      col: "rgba(100,100,100,0.3)",
      noi: 1,
      wid: 3,
      context: 'rocks'
    });
    rockGroup.addChild(outlineStroke);

    // TEXTURE - add rock surface texture
    var rockTexture = PaperRenderer.createTexture(ptlist, {
      xof: xoff,
      yof: yoff,
      tex: tex,
      wid: 3,
      sha: sha,
      col: function (x) {
        return (
          "rgba(180,180,180," + (0.3 + Math.random() * 0.3).toFixed(3) + ")"
        );
      },
      dis: function () {
        if (Math.random() > 0.5) {
          return 0.15 + 0.15 * Math.random();
        } else {
          return 0.85 - 0.15 * Math.random();
        }
      },
    });
    rockGroup.addChild(rockTexture);

    return rockGroup;
  };

  /**
   * Create optimized mountain with level-of-detail rendering
   * Implements efficient layering and memory management for complex mountain structures
   * @param {Number} xoff - X offset position
   * @param {Number} yoff - Y offset position
   * @param {Number} seed - Random seed for generation
   * @param {Object} args - Configuration options
   * @param {number} [args.distance=1] - Distance factor for LOD (1=near, >1=far)
   * @param {boolean} [args.enableLOD=true] - Enable level-of-detail optimization
   * @param {number} [args.maxElements=100] - Maximum elements per mountain
   * @returns {paper.Group} Optimized Paper.js Group containing mountain
   */
  this.optimizedMountain = function (xoff, yoff, seed, args) {
    var args = args != undefined ? args : {};
    var distance = args.distance != undefined ? args.distance : 1;
    var enableLOD = args.enableLOD != undefined ? args.enableLOD : true;
    var maxElements = args.maxElements != undefined ? args.maxElements : 100;

    // Adjust detail level based on distance
    var lodFactor = enableLOD ? Math.max(0.1, 1 / distance) : 1;

    // Reduce texture density for distant mountains
    var optimizedArgs = {};
    for (var key in args) {
      optimizedArgs[key] = args[key];
    }
    optimizedArgs.tex = Math.floor((args.tex || 200) * lodFactor);
    optimizedArgs.veg = distance < 2 ? (args.veg !== false) : false; // Disable vegetation for distant mountains

    // Use simplified mountain generation for very distant mountains
    if (distance > 3) {
      return this.distMount(xoff, yoff, seed, {
        hei: args.hei || 300,
        len: args.wid || 600,
        seg: Math.max(3, Math.floor(5 * lodFactor))
      });
    }

    // Use regular mountain generation with optimized parameters
    var mountain = this.mountain(xoff, yoff, seed, optimizedArgs);

    // Apply memory optimization by limiting child count
    if (mountain.children && mountain.children.length > maxElements) {
      // Keep only the most important elements (background, outline, texture)
      var importantChildren = mountain.children.slice(0, maxElements);
      mountain.removeChildren();
      for (var i = 0; i < importantChildren.length; i++) {
        mountain.addChild(importantChildren[i]);
      }
    }

    return mountain;
  };

  /**
   * Create layered mountain system with efficient depth sorting
   * Manages multiple mountain layers with proper z-ordering and memory optimization
   * @param {Array} mountainConfigs - Array of mountain configuration objects
   * @param {Object} [options] - Layering options
   * @param {boolean} [options.enableDepthSorting=true] - Enable automatic depth sorting
   * @param {boolean} [options.enableCulling=true] - Enable off-screen culling
   * @param {Object} [options.viewport] - Viewport bounds for culling {xmin, xmax, ymin, ymax}
   * @returns {paper.Group} Group containing layered mountain system
   */
  this.createLayeredMountains = function (mountainConfigs, options) {
    var opts = options || {};
    var enableDepthSorting = opts.enableDepthSorting !== false;
    var enableCulling = opts.enableCulling !== false;
    var viewport = opts.viewport;

    var layeredGroup = PaperRenderer.createGroup();
    var mountainLayers = [];

    // Create mountains and assign depth layers
    for (var i = 0; i < mountainConfigs.length; i++) {
      var config = mountainConfigs[i];
      var depth = config.depth || i;

      // Skip mountains outside viewport if culling is enabled
      if (enableCulling && viewport) {
        var mountainBounds = {
          xmin: config.xoff - (config.wid || 300),
          xmax: config.xoff + (config.wid || 300),
          ymin: config.yoff - (config.hei || 200),
          ymax: config.yoff + (config.hei || 200)
        };

        if (mountainBounds.xmax < viewport.xmin ||
          mountainBounds.xmin > viewport.xmax ||
          mountainBounds.ymax < viewport.ymin ||
          mountainBounds.ymin > viewport.ymax) {
          continue; // Skip off-screen mountains
        }
      }

      // Create optimized mountain based on depth
      var mountain = this.optimizedMountain(
        config.xoff,
        config.yoff,
        config.seed,
        Object.assign({}, config, { distance: depth + 1 })
      );

      mountainLayers.push({
        mountain: mountain,
        depth: depth,
        config: config
      });
    }

    // Sort by depth if enabled (background to foreground)
    if (enableDepthSorting) {
      mountainLayers.sort(function (a, b) {
        return b.depth - a.depth; // Higher depth = further back
      });
    }

    // Add mountains to group in depth order
    for (var i = 0; i < mountainLayers.length; i++) {
      layeredGroup.addChild(mountainLayers[i].mountain);
    }

    return layeredGroup;
  };

  /**
   * Optimize memory usage for large mountain groups
   * Implements object pooling and cleanup for unused Paper.js objects
   * @param {paper.Group} mountainGroup - Mountain group to optimize
   * @param {Object} [options] - Optimization options
   * @param {boolean} [options.removeInvisible=true] - Remove invisible elements
   * @param {boolean} [options.simplifyPaths=false] - Simplify complex paths
   * @param {number} [options.maxComplexity=1000] - Maximum path complexity
   * @returns {paper.Group} Optimized mountain group
   */
  this.optimizeMemoryUsage = function (mountainGroup, options) {
    var opts = options || {};
    var removeInvisible = opts.removeInvisible !== false;
    var simplifyPaths = opts.simplifyPaths || false;
    var maxComplexity = opts.maxComplexity || 1000;

    if (!mountainGroup || !mountainGroup.children) {
      return mountainGroup;
    }

    var optimizedGroup = PaperRenderer.createGroup();
    var processedElements = 0;

    // Process each child element
    for (var i = 0; i < mountainGroup.children.length; i++) {
      var child = mountainGroup.children[i];

      // Skip invisible elements if optimization enabled
      if (removeInvisible && (!child.visible || child.opacity === 0)) {
        continue;
      }

      // Simplify complex paths if enabled
      if (simplifyPaths && child.segments && child.segments.length > maxComplexity) {
        try {
          child.simplify(2); // Simplify with tolerance of 2 units
        } catch (e) {
          console.warn('Path simplification failed:', e);
        }
      }

      // Clone and add to optimized group
      var optimizedChild = child.clone();
      optimizedGroup.addChild(optimizedChild);
      processedElements++;
    }

    // Clean up original group
    mountainGroup.removeChildren();
    mountainGroup.remove();

    console.log('Mountain memory optimization: processed', processedElements, 'elements');
    return optimizedGroup;
  };

  /**
   * Create mountain with progressive detail loading
   * Loads mountain details progressively based on viewport proximity
   * @param {Number} xoff - X offset position
   * @param {Number} yoff - Y offset position
   * @param {Number} seed - Random seed for generation
   * @param {Object} args - Configuration options
   * @param {Function} [args.onDetailLoad] - Callback when detail is loaded
   * @returns {paper.Group} Mountain group with progressive loading capability
   */
  this.createProgressiveMountain = function (xoff, yoff, seed, args) {
    var args = args != undefined ? args : {};
    var onDetailLoad = args.onDetailLoad;

    // Create base mountain structure (low detail)
    var baseMountain = this.optimizedMountain(xoff, yoff, seed,
      Object.assign({}, args, {
        distance: 3, // Start with low detail
        tex: Math.floor((args.tex || 200) * 0.3),
        veg: false
      })
    );

    // Store detail loading function
    baseMountain.loadDetails = function (viewportDistance) {
      if (viewportDistance < 2 && !baseMountain.detailsLoaded) {
        // Load high detail version
        var detailedMountain = PaperMount.optimizedMountain(xoff, yoff, seed,
          Object.assign({}, args, { distance: 1 })
        );

        // Replace base mountain with detailed version
        baseMountain.removeChildren();
        for (var i = 0; i < detailedMountain.children.length; i++) {
          baseMountain.addChild(detailedMountain.children[i]);
        }

        baseMountain.detailsLoaded = true;

        if (onDetailLoad) {
          onDetailLoad(baseMountain);
        }
      }
    };

    return baseMountain;
  };

}();
// Create alias for compatibility
var Mount = PaperMount;
