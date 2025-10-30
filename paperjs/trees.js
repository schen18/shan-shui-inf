/**
 * Paper.js Tree Generation Module
 * 
 * This module contains all tree generation algorithms for the Shan Shui landscape generator,
 * migrated to use Paper.js rendering instead of SVG string generation.
 * It provides eight different tree types with various visual characteristics and styles.
 * 
 * Dependencies: paper.js, paper-renderer.js, stroke-renderer.js, utils.js, noise.js, prng.js
 */

var Tree = new function() {
  
  /**
   * Check if trees are enabled via UI toggle
   * @returns {boolean} True if trees should be rendered
   */
  this.isEnabled = function() {
    if (typeof document !== 'undefined') {
      var treeCheckbox = document.getElementById('ENABLE_TREES');
      return treeCheckbox ? treeCheckbox.checked : true;
    }
    return true;
  };
  
  /**
   * Tree01 - Simple line trees with leaves (Paper.js version)
   * Creates trees with dual trunk lines and scattered leaf blobs using Paper.js Groups
   * 
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate  
   * @param {Object} args - Configuration options
   * @param {number} args.hei - Height of tree (default: 50)
   * @param {number} args.wid - Width of trunk (default: 3)
   * @param {string} args.col - Color in rgba format (default: "rgba(100,100,100,0.5)")
   * @param {number} args.noi - Noise factor (default: 0.5)
   * @returns {paper.Group} Paper.js Group containing the tree elements
   */
  this.tree01 = function(x, y, args) {
    // Return empty group if trees are disabled
    if (!Tree.isEnabled()) {
      return new paper.Group();
    }
    
    var args = args != undefined ? args : {};
    var hei = args.hei != undefined ? args.hei : 50;
    var wid = args.wid != undefined ? args.wid : 3;
    var col = args.col != undefined ? args.col : "rgba(100,100,100,0.5)";
    var noi = args.noi != undefined ? args.noi : 0.5;

    var reso = 10;
    var nslist = [];
    for (var i = 0; i < reso; i++) {
      nslist.push([Noise.noise(i * 0.5), Noise.noise(i * 0.5, 0.5)]);
    }

    var leafcol;
    if (col.includes("rgba(")) {
      leafcol = col
        .replace("rgba(", "")
        .replace(")", "")
        .split(",");
    } else {
      leafcol = ["100", "100", "100", "0.5"];
    }
    
    var treeGroup = new paper.Group();
    var line1 = [];
    var line2 = [];
    
    // Generate trunk lines and leaf blobs
    for (var i = 0; i < reso; i++) {
      var nx = x;
      var ny = y - (i * hei) / reso;
      
      // Add leaf blobs in upper portion of tree
      if (i >= reso / 4) {
        for (var j = 0; j < (reso - i) / 5; j++) {
          var leafBlob = PaperRenderer.createBlob(
            nx + (Math.random() - 0.5) * wid * 1.2 * (reso - i),
            ny + (Math.random() - 0.5) * wid,
            {
              len: Math.random() * 20 * (reso - i) * 0.2 + 10,
              wid: Math.random() * 6 + 3,
              ang: ((Math.random() - 0.5) * Math.PI) / 6,
              col:
                "rgba(" +
                leafcol[0] +
                "," +
                leafcol[1] +
                "," +
                leafcol[2] +
                "," +
                (Math.random() * 0.2 + parseFloat(leafcol[3])).toFixed(1) +
                ")",
            }
          );
          treeGroup.addChild(leafBlob);
        }
      }
      
      line1.push([nx + (nslist[i][0] - 0.5) * wid - wid / 2, ny]);
      line2.push([nx + (nslist[i][1] - 0.5) * wid + wid / 2, ny]);
    }
    
    // Create trunk lines using StrokeRenderer
    var trunk1 = StrokeRenderer.createVariableStroke(line1, { 
      col: col, 
      wid: 1.5,
      context: 'trees'
    });
    var trunk2 = StrokeRenderer.createVariableStroke(line2, { 
      col: col, 
      wid: 1.5,
      context: 'trees'
    });
    
    treeGroup.addChild(trunk1);
    treeGroup.addChild(trunk2);
    
    return treeGroup;
  };

  /**
   * Tree02 - Clustered blob trees (Paper.js version)
   * Creates trees composed of multiple organic blob shapes clustered together
   * 
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Object} args - Configuration options
   * @param {number} args.hei - Height of tree (default: 16)
   * @param {number} args.wid - Width of tree (default: 8)
   * @param {number} args.clu - Number of clusters (default: 5)
   * @param {string} args.col - Color in rgba format (default: "rgba(100,100,100,0.5)")
   * @param {number} args.noi - Noise factor (default: 0.5)
   * @returns {paper.Group} Paper.js Group containing the tree elements
   */
  this.tree02 = function(x, y, args) {
    // Return empty group if trees are disabled
    if (!Tree.isEnabled()) {
      return new paper.Group();
    }
    
    var args = args != undefined ? args : {};
    var hei = args.hei != undefined ? args.hei : 16;
    var wid = args.wid != undefined ? args.wid : 8;
    var clu = args.clu != undefined ? args.clu : 5;
    var col = args.col != undefined ? args.col : "rgba(100,100,100,0.5)";
    var noi = args.noi != undefined ? args.noi : 0.5;

    var leafcol;
    if (col.includes("rgba(")) {
      leafcol = col
        .replace("rgba(", "")
        .replace(")", "")
        .split(",");
    } else {
      leafcol = ["100", "100", "100", "0.5"];
    }

    var treeGroup = new paper.Group();
    
    for (var i = 0; i < clu; i++) {
      var clusterBlob = PaperRenderer.createBlob(
        x + randGaussian() * clu * 4,
        y + randGaussian() * clu * 4,
        {
          ang: Math.PI / 2,
          fun: function(x) {
            return x <= 1
              ? Math.pow(Math.sin(x * Math.PI) * x, 0.5)
              : -Math.pow(Math.sin((x - 2) * Math.PI * (x - 2)), 0.5);
          },
          wid: Math.random() * wid * 0.75 + wid * 0.5,
          len: Math.random() * hei * 0.75 + hei * 0.5,
          col: col,
        }
      );
      treeGroup.addChild(clusterBlob);
    }
    
    return treeGroup;
  };

  /**
   * Tree03 - Bent trees with detailed foliage (Paper.js version)
   * Creates trees with curved trunks and detailed leaf placement
   * 
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Object} args - Configuration options
   * @param {number} args.hei - Height of tree (default: 50)
   * @param {number} args.wid - Width of trunk (default: 5)
   * @param {Function} args.ben - Bending function (default: returns 0)
   * @param {string} args.col - Color in rgba format (default: "rgba(100,100,100,0.5)")
   * @param {number} args.noi - Noise factor (default: 0.5)
   * @returns {paper.Group} Paper.js Group containing the tree elements
   */
  this.tree03 = function(x, y, args) {
    // Return empty group if trees are disabled
    if (!Tree.isEnabled()) {
      return new paper.Group();
    }
    
    var args = args != undefined ? args : {};
    var hei = args.hei != undefined ? args.hei : 50;
    var wid = args.wid != undefined ? args.wid : 5;
    var ben =
      args.ben != undefined
        ? args.ben
        : function(x) {
            return 0;
          };
    var col = args.col != undefined ? args.col : "rgba(100,100,100,0.5)";
    var noi = args.noi != undefined ? args.noi : 0.5;

    var reso = 10;
    var nslist = [];
    for (var i = 0; i < reso; i++) {
      nslist.push([Noise.noise(i * 0.5), Noise.noise(i * 0.5, 0.5)]);
    }

    var leafcol;
    if (col.includes("rgba(")) {
      leafcol = col
        .replace("rgba(", "")
        .replace(")", "")
        .split(",");
    } else {
      leafcol = ["100", "100", "100", "0.5"];
    }
    
    var treeGroup = new paper.Group();
    var line1 = [];
    var line2 = [];
    
    // Generate trunk lines and leaf blobs with bending
    for (var i = 0; i < reso; i++) {
      var nx = x + ben(i / reso) * 100;
      var ny = y - (i * hei) / reso;
      
      // Add leaf blobs in upper portion
      if (i >= reso / 5) {
        for (var j = 0; j < (reso - i) * 2; j++) {
          var shape = function(x) {
            return Math.log(50 * x + 1) / 3.95;
          };
          var ox = Math.random() * wid * 2 * shape((reso - i) / reso);
          var leafBlob = PaperRenderer.createBlob(
            nx + ox * randChoice([-1, 1]),
            ny + (Math.random() - 0.5) * wid * 2,
            {
              len: ox * 2,
              wid: Math.random() * 6 + 3,
              ang: ((Math.random() - 0.5) * Math.PI) / 6,
              col:
                "rgba(" +
                leafcol[0] +
                "," +
                leafcol[1] +
                "," +
                leafcol[2] +
                "," +
                (Math.random() * 0.2 + parseFloat(leafcol[3])).toFixed(3) +
                ")",
            }
          );
          treeGroup.addChild(leafBlob);
        }
      }
      
      line1.push([
        nx + (((nslist[i][0] - 0.5) * wid - wid / 2) * (reso - i)) / reso,
        ny,
      ]);
      line2.push([
        nx + (((nslist[i][1] - 0.5) * wid + wid / 2) * (reso - i)) / reso,
        ny,
      ]);
    }
    
    // Create trunk as filled polygon
    var lc = line1.concat(line2.reverse());
    var trunkPath = PaperRenderer.createPolygon(lc, { 
      fil: "white", 
      str: col, 
      wid: 1.5 
    });
    treeGroup.addChild(trunkPath);
    
    return treeGroup;
  };

  /**
   * Tree04 - Complex branching trees with bark (Paper.js version)
   * Creates detailed trees with branching structure and bark texture
   * 
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Object} args - Configuration options
   * @param {number} args.hei - Height of tree (default: 300)
   * @param {number} args.wid - Width of trunk (default: 6)
   * @param {string} args.col - Color in rgba format (default: "rgba(100,100,100,0.5)")
   * @param {number} args.noi - Noise factor (default: 0.5)
   * @returns {paper.Group} Paper.js Group containing the tree elements
   */
  this.tree04 = function(x, y, args) {
    // Return empty group if trees are disabled
    if (!Tree.isEnabled()) {
      return new paper.Group();
    }
    
    var args = args != undefined ? args : {};
    var hei = args.hei != undefined ? args.hei : 300;
    var wid = args.wid != undefined ? args.wid : 6;
    var col = args.col != undefined ? args.col : "rgba(100,100,100,0.5)";
    var noi = args.noi != undefined ? args.noi : 0.5;

    var treeGroup = new paper.Group();

    var trlist = Tree.branch({ hei: hei, wid: wid, ang: -Math.PI / 2 });
    var barkTexture = Tree.barkify(x, y, trlist);
    treeGroup.addChild(barkTexture);
    
    trlist = trlist[0].concat(trlist[1].reverse());

    var trmlist = [];

    for (var i = 0; i < trlist.length; i++) {
      if (
        (i >= trlist.length * 0.3 &&
          i <= trlist.length * 0.7 &&
          Math.random() < 0.1) ||
        i == trlist.length / 2 - 1
      ) {
        var ba = Math.PI * 0.2 - Math.PI * 1.4 * (i > trlist.length / 2);
        var brlist = Tree.branch({
          hei: hei * (Math.random() + 1) * 0.3,
          wid: wid * 0.5,
          ang: ba,
        });

        brlist[0].splice(0, 1);
        brlist[1].splice(0, 1);
        var foff = function(v) {
          return [v[0] + trlist[i][0], v[1] + trlist[i][1]];
        };
        var branchBark = Tree.barkify(x, y, [brlist[0].map(foff), brlist[1].map(foff)]);
        treeGroup.addChild(branchBark);

        for (var j = 0; j < brlist[0].length; j++) {
          if (Math.random() < 0.2 || j == brlist[0].length - 1) {
            var twigGroup = Tree.twig(
              brlist[0][j][0] + trlist[i][0] + x,
              brlist[0][j][1] + trlist[i][1] + y,
              1,
              {
                wid: hei / 300,
                ang: ba > -Math.PI / 2 ? ba : ba + Math.PI,
                sca: (0.5 * hei) / 300,
                dir: ba > -Math.PI / 2 ? 1 : -1,
              }
            );
            treeGroup.addChild(twigGroup);
          }
        }
        brlist = brlist[0].concat(brlist[1].reverse());
        trmlist = trmlist.concat(
          brlist.map(function(v) {
            return [v[0] + trlist[i][0], v[1] + trlist[i][1]];
          })
        );
      } else {
        trmlist.push(trlist[i]);
      }
    }
    
    var trunkPath = PaperRenderer.createPolygon(trmlist, { 
      xof: x, 
      yof: y, 
      fil: "white", 
      str: col, 
      wid: 0 
    });
    treeGroup.addChild(trunkPath);

    trmlist.splice(0, 1);
    trmlist.splice(trmlist.length - 1, 1);
    var trunkStroke = StrokeRenderer.createVariableStroke(
      trmlist.map(function(v) {
        return [v[0] + x, v[1] + y];
      }),
      {
        col: "rgba(100,100,100," + (0.4 + Math.random() * 0.1).toFixed(3) + ")",
        wid: 2.5,
        fun: function(x) {
          return Math.sin(1);
        },
        noi: 0.9,
        out: 0,
        context: 'trees'
      }
    );
    treeGroup.addChild(trunkStroke);

    return treeGroup;
  };

  /**
   * Tree05 - Drooping branch trees (Paper.js version)
   * Creates trees with drooping branches and sparse foliage
   * 
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Object} args - Configuration options
   * @param {number} args.hei - Height of tree (default: 300)
   * @param {number} args.wid - Width of trunk (default: 5)
   * @param {string} args.col - Color in rgba format (default: "rgba(100,100,100,0.5)")
   * @param {number} args.noi - Noise factor (default: 0.5)
   * @returns {paper.Group} Paper.js Group containing the tree elements
   */
  this.tree05 = function(x, y, args) {
    // Return empty group if trees are disabled
    if (!Tree.isEnabled()) {
      return new paper.Group();
    }
    
    var args = args != undefined ? args : {};
    var hei = args.hei != undefined ? args.hei : 300;
    var wid = args.wid != undefined ? args.wid : 5;
    var col = args.col != undefined ? args.col : "rgba(100,100,100,0.5)";
    var noi = args.noi != undefined ? args.noi : 0.5;

    var treeGroup = new paper.Group();

    var trlist = Tree.branch({ hei: hei, wid: wid, ang: -Math.PI / 2, ben: 0 });
    var barkTexture = Tree.barkify(x, y, trlist);
    treeGroup.addChild(barkTexture);
    
    trlist = trlist[0].concat(trlist[1].reverse());

    var trmlist = [];

    for (var i = 0; i < trlist.length; i++) {
      var p = Math.abs(i - trlist.length * 0.5) / (trlist.length * 0.5);
      if (
        (i >= trlist.length * 0.2 &&
          i <= trlist.length * 0.8 &&
          i % 3 == 0 &&
          Math.random() > p) ||
        i == trlist.length / 2 - 1
      ) {
        var bar = Math.random() * 0.2;
        var ba =
          -bar * Math.PI - (1 - bar * 2) * Math.PI * (i > trlist.length / 2);
        var brlist = Tree.branch({
          hei: hei * (0.3 * p - Math.random() * 0.05),
          wid: wid * 0.5,
          ang: ba,
          ben: 0.5,
        });

        brlist[0].splice(0, 1);
        brlist[1].splice(0, 1);

        for (var j = 0; j < brlist[0].length; j++) {
          if (j % 20 == 0 || j == brlist[0].length - 1) {
            var twigGroup = Tree.twig(
              brlist[0][j][0] + trlist[i][0] + x,
              brlist[0][j][1] + trlist[i][1] + y,
              0,
              {
                wid: hei / 300,
                ang: ba > -Math.PI / 2 ? ba : ba + Math.PI,
                sca: (0.2 * hei) / 300,
                dir: ba > -Math.PI / 2 ? 1 : -1,
                lea: [true, 5],
              }
            );
            treeGroup.addChild(twigGroup);
          }
        }
        brlist = brlist[0].concat(brlist[1].reverse());
        trmlist = trmlist.concat(
          brlist.map(function(v) {
            return [v[0] + trlist[i][0], v[1] + trlist[i][1]];
          })
        );
      } else {
        trmlist.push(trlist[i]);
      }
    }

    var trunkPath = PaperRenderer.createPolygon(trmlist, { 
      xof: x, 
      yof: y, 
      fil: "white", 
      str: col, 
      wid: 0 
    });
    treeGroup.addChild(trunkPath);

    trmlist.splice(0, 1);
    trmlist.splice(trmlist.length - 1, 1);
    var trunkStroke = StrokeRenderer.createVariableStroke(
      trmlist.map(function(v) {
        return [v[0] + x, v[1] + y];
      }),
      {
        col: "rgba(100,100,100," + (0.4 + Math.random() * 0.1).toFixed(3) + ")",
        wid: 2.5,
        fun: function(x) {
          return Math.sin(1);
        },
        noi: 0.9,
        out: 0,
        context: 'trees'
      }
    );
    treeGroup.addChild(trunkStroke);

    return treeGroup;
  };

  /**
   * Tree06 - Fractal trees (Paper.js version)
   * Creates trees with recursive fractal branching patterns
   * 
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Object} args - Configuration options
   * @param {number} args.hei - Height of tree (default: 100)
   * @param {number} args.wid - Width of trunk (default: 6)
   * @param {string} args.col - Color in rgba format (default: "rgba(100,100,100,0.5)")
   * @param {number} args.noi - Noise factor (default: 0.5)
   * @returns {paper.Group} Paper.js Group containing the tree elements
   */
  this.tree06 = function(x, y, args) {
    // Return empty group if trees are disabled
    if (!Tree.isEnabled()) {
      return new paper.Group();
    }
    
    var args = args != undefined ? args : {};
    var hei = args.hei != undefined ? args.hei : 100;
    var wid = args.wid != undefined ? args.wid : 6;
    var col = args.col != undefined ? args.col : "rgba(100,100,100,0.5)";
    var noi = args.noi != undefined ? args.noi : 0.5;

    var treeGroup = new paper.Group();
    var barkGroup = new paper.Group();
    var twigGroup = new paper.Group();

    function fracTree(xoff, yoff, dep, args) {
      var args = args != undefined ? args : {};
      var hei = args.hei != undefined ? args.hei : 300;
      var wid = args.wid != undefined ? args.wid : 5;
      var ang = args.ang != undefined ? args.ang : 0;
      var ben = args.ben != undefined ? args.ben : Math.PI * 0.2;

      var trlist = Tree.branch({
        hei: hei,
        wid: wid,
        ang: ang,
        ben: ben,
        det: hei / 20,
      });
      var branchBark = Tree.barkify(xoff, yoff, trlist);
      barkGroup.addChild(branchBark);
      
      trlist = trlist[0].concat(trlist[1].reverse());

      var trmlist = [];

      for (var i = 0; i < trlist.length; i++) {
        var p = Math.abs(i - trlist.length * 0.5) / (trlist.length * 0.5);
        if (
          ((Math.random() < 0.025 &&
            i >= trlist.length * 0.2 &&
            i <= trlist.length * 0.8) ||
            i == ((trlist.length / 2) | 0) - 1 ||
            i == ((trlist.length / 2) | 0) + 1) &&
          dep > 0
        ) {
          var bar = 0.02 + Math.random() * 0.08;
          var ba =
            bar * Math.PI - bar * 2 * Math.PI * (i > trlist.length / 2);

          var brlist = fracTree(
            trlist[i][0] + xoff,
            trlist[i][1] + yoff,
            dep - 1,
            {
              hei: hei * (0.7 + Math.random() * 0.2),
              wid: wid * 0.6,
              ang: ang + ba,
              ben: 0.55,
            }
          );

          for (var j = 0; j < brlist.length; j++) {
            if (Math.random() < 0.03) {
              var branchTwig = Tree.twig(
                brlist[j][0] + trlist[i][0] + xoff,
                brlist[j][1] + trlist[i][1] + yoff,
                2,
                {
                  ang: ba * (Math.random() * 0.5 + 0.75),
                  sca: 0.3,
                  dir: ba > 0 ? 1 : -1,
                  lea: [false, 0],
                }
              );
              twigGroup.addChild(branchTwig);
            }
          }

          trmlist = trmlist.concat(
            brlist.map(function(v) {
              return [v[0] + trlist[i][0], v[1] + trlist[i][1]];
            })
          );
        } else {
          trmlist.push(trlist[i]);
        }
      }
      return trmlist;
    }

    var trmlist = fracTree(x, y, 3, {
      hei: hei,
      wid: wid,
      ang: -Math.PI / 2,
      ben: 0,
    });

    var trunkPath = PaperRenderer.createPolygon(trmlist, { 
      xof: x, 
      yof: y, 
      fil: "white", 
      str: col, 
      wid: 0 
    });
    treeGroup.addChild(trunkPath);

    trmlist.splice(0, 1);
    trmlist.splice(trmlist.length - 1, 1);
    var trunkStroke = StrokeRenderer.createVariableStroke(
      trmlist.map(function(v) {
        return [v[0] + x, v[1] + y];
      }),
      {
        col: "rgba(100,100,100," + (0.4 + Math.random() * 0.1).toFixed(3) + ")",
        wid: 2.5,
        fun: function(x) {
          return Math.sin(1);
        },
        noi: 0.9,
        out: 0,
        context: 'trees'
      }
    );
    treeGroup.addChild(trunkStroke);

    treeGroup.addChild(barkGroup);
    treeGroup.addChild(twigGroup);
    return treeGroup;
  }; 
 /**
   * Tree07 - Triangulated trees (Paper.js version)
   * Creates trees using triangulation for a geometric, faceted appearance
   * 
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Object} args - Configuration options
   * @param {number} args.hei - Height of tree (default: 60)
   * @param {number} args.wid - Width of trunk (default: 4)
   * @param {Function} args.ben - Bending function (default: sqrt(x) * 0.2)
   * @param {string} args.col - Color in rgba format (default: "rgba(100,100,100,1)")
   * @param {number} args.noi - Noise factor (default: 0.5)
   * @returns {paper.Group} Paper.js Group containing the tree elements
   */
  this.tree07 = function(x, y, args) {
    // Return empty group if trees are disabled
    if (!Tree.isEnabled()) {
      return new paper.Group();
    }
    
    var args = args != undefined ? args : {};
    var hei = args.hei != undefined ? args.hei : 60;
    var wid = args.wid != undefined ? args.wid : 4;
    var ben =
      args.ben != undefined
        ? args.ben
        : function(x) {
            return Math.sqrt(x) * 0.2;
          };
    var col = args.col != undefined ? args.col : "rgba(100,100,100,1)";
    var noi = args.noi != undefined ? args.noi : 0.5;

    var reso = 10;
    var nslist = [];
    for (var i = 0; i < reso; i++) {
      nslist.push([Noise.noise(i * 0.5), Noise.noise(i * 0.5, 0.5)]);
    }
    
    var leafcol;
    if (col.includes("rgba(")) {
      leafcol = col
        .replace("rgba(", "")
        .replace(")", "")
        .split(",");
    } else {
      leafcol = ["100", "100", "100", "1"];
    }
    
    var treeGroup = new paper.Group();
    var line1 = [];
    var line2 = [];
    var T = [];
    
    for (var i = 0; i < reso; i++) {
      var nx = x + ben(i / reso) * 100;
      var ny = y - (i * hei) / reso;
      
      if (i >= reso / 4) {
        for (var j = 0; j < 1; j++) {
          var bpl = PaperRenderer.createBlob(
            nx + (Math.random() - 0.5) * wid * 1.2 * (reso - i) * 0.5,
            ny + (Math.random() - 0.5) * wid * 0.5,
            {
              len: Math.random() * 50 + 20,
              wid: Math.random() * 12 + 12,
              ang: (-Math.random() * Math.PI) / 6,
              col:
                "rgba(" +
                leafcol[0] +
                "," +
                leafcol[1] +
                "," +
                leafcol[2] +
                "," +
                parseFloat(leafcol[3]).toFixed(3) +
                ")",
              fun: function(x) {
                return x <= 1
                  ? 2.75 * x * Math.pow(1 - x, 1 / 1.8)
                  : 2.75 * (x - 2) * Math.pow(x - 1, 1 / 1.8);
              },
              ret: 1,
            }
          );

          // Triangulate the blob points and create triangular faces
          if (bpl && bpl.length > 0) {
            var triangles = PolyTools.triangulate(bpl, {
              area: 50,
              convex: true,
              optimize: false,
            });
            T = T.concat(triangles);
          }
        }
      }
      line1.push([nx + (nslist[i][0] - 0.5) * wid - wid / 2, ny]);
      line2.push([nx + (nslist[i][1] - 0.5) * wid + wid / 2, ny]);
    }

    // Triangulate the trunk
    var trunkTriangles = PolyTools.triangulate(line1.concat(line2.reverse()), {
      area: 50,
      convex: true,
      optimize: true,
    });
    T = trunkTriangles.concat(T);

    // Create triangular faces with noise-based coloring
    for (var k = 0; k < T.length; k++) {
      var m = PolyTools.midPt(T[k]);
      var c = (Noise.noise(m[0] * 0.02, m[1] * 0.02) * 200 + 50) | 0;
      var co = "rgba(" + c + "," + c + "," + c + ",0.8)";
      var trianglePath = PaperRenderer.createPolygon(T[k], { 
        fil: co, 
        str: co, 
        wid: 0 
      });
      treeGroup.addChild(trianglePath);
    }
    
    return treeGroup;
  };

  /**
   * Tree08 - Minimalist line trees (Paper.js version)
   * Creates simple, elegant trees with minimal branching and clean lines
   * 
   * @param {number} x - X coordinate
   * @param {number} y - Y coordinate
   * @param {Object} args - Configuration options
   * @param {number} args.hei - Height of tree (default: 80)
   * @param {number} args.wid - Width of trunk (default: 1)
   * @param {string} args.col - Color in rgba format (default: "rgba(100,100,100,0.5)")
   * @param {number} args.noi - Noise factor (default: 0.5)
   * @returns {paper.Group} Paper.js Group containing the tree elements
   */
  this.tree08 = function(x, y, args) {
    // Return empty group if trees are disabled
    if (!Tree.isEnabled()) {
      return new paper.Group();
    }
    
    var args = args != undefined ? args : {};
    var hei = args.hei != undefined ? args.hei : 80;
    var wid = args.wid != undefined ? args.wid : 1;
    var col = args.col != undefined ? args.col : "rgba(100,100,100,0.5)";
    var noi = args.noi != undefined ? args.noi : 0.5;

    var treeGroup = new paper.Group();
    var twigGroup = new paper.Group();

    var ang = normRand(-1, 1) * Math.PI * 0.2;

    var trlist = Tree.branch({
      hei: hei,
      wid: wid,
      ang: -Math.PI / 2 + ang,
      ben: Math.PI * 0.2,
      det: hei / 20,
    });

    trlist = trlist[0].concat(trlist[1].reverse());

    function fracTree(xoff, yoff, dep, args) {
      var args = args != undefined ? args : {};
      var ang = args.ang != undefined ? args.ang : -Math.PI / 2;
      var len = args.len != undefined ? args.len : 15;
      var ben = args.ben != undefined ? args.ben : 0;

      var fun =
        dep == 0
          ? function(x) {
              return Math.cos(0.5 * Math.PI * x);
            }
          : function(x) {
              return 1;
            };
      var spt = [xoff, yoff];
      var ept = [xoff + Math.cos(ang) * len, yoff + Math.sin(ang) * len];

      var trmlist = [[xoff, yoff], [xoff + len, yoff]];

      var bfun = randChoice([
        function(x) {
          return Math.sin(x * Math.PI);
        },
        function(x) {
          return -Math.sin(x * Math.PI);
        },
      ]);

      trmlist = div(trmlist, 10);

      for (var i = 0; i < trmlist.length; i++) {
        trmlist[i][1] += bfun(i / trmlist.length) * 2;
      }
      for (var i = 0; i < trmlist.length; i++) {
        var d = distance(trmlist[i], spt);
        var a = Math.atan2(trmlist[i][1] - spt[1], trmlist[i][0] - spt[0]);
        trmlist[i][0] = spt[0] + d * Math.cos(a + ang);
        trmlist[i][1] = spt[1] + d * Math.sin(a + ang);
      }

      var branchStroke = StrokeRenderer.createVariableStroke(trmlist, {
        fun: fun,
        wid: 0.8,
        col: "rgba(100,100,100,0.5)",
        context: 'trees'
      });
      twigGroup.addChild(branchStroke);
      
      if (dep != 0) {
        var nben = ben + randChoice([-1, 1]) * Math.PI * 0.001 * dep * dep;
        if (Math.random() < 0.5) {
          fracTree(ept[0], ept[1], dep - 1, {
            ang:
              ang +
              ben +
              Math.PI *
                randChoice([normRand(-1, 0.5), normRand(0.5, 1)]) *
                0.2,
            len: len * normRand(0.8, 0.9),
            ben: nben,
          });
          fracTree(ept[0], ept[1], dep - 1, {
            ang:
              ang +
              ben +
              Math.PI *
                randChoice([normRand(-1, -0.5), normRand(0.5, 1)]) *
                0.2,
            len: len * normRand(0.8, 0.9),
            ben: nben,
          });
        } else {
          fracTree(ept[0], ept[1], dep - 1, {
            ang: ang + ben,
            len: len * normRand(0.8, 0.9),
            ben: nben,
          });
        }
      }
      return trmlist;
    }

    for (var i = 0; i < trlist.length; i++) {
      if (Math.random() < 0.2) {
        fracTree(
          x + trlist[i][0],
          y + trlist[i][1],
          Math.floor(4 * Math.random()),
          { hei: 20, ang: -Math.PI / 2 - ang * Math.random() }
        );
      } else if (i == Math.floor(trlist.length / 2)) {
        fracTree(x + trlist[i][0], y + trlist[i][1], 3, {
          hei: 25,
          ang: -Math.PI / 2 + ang,
        });
      }
    }

    var trunkPath = PaperRenderer.createPolygon(trlist, { 
      xof: x, 
      yof: y, 
      fil: "white", 
      str: col, 
      wid: 0 
    });
    treeGroup.addChild(trunkPath);

    var trunkStroke = StrokeRenderer.createVariableStroke(
      trlist.map(function(v) {
        return [v[0] + x, v[1] + y];
      }),
      {
        col: "rgba(100,100,100," + (0.6 + Math.random() * 0.1).toFixed(3) + ")",
        wid: 2.5,
        fun: function(x) {
          return Math.sin(1);
        },
        noi: 0.9,
        out: 0,
        context: 'trees'
      }
    );
    treeGroup.addChild(trunkStroke);

    treeGroup.addChild(twigGroup);
    return treeGroup;
  };

  // Helper Functions for Tree Generation

  /**
   * Branch - Generates tree branch structure (Paper.js version)
   * Creates the basic branching structure used by complex tree types
   * 
   * @param {Object} args - Configuration options
   * @param {number} args.hei - Height of branch (default: 300)
   * @param {number} args.wid - Width of branch (default: 6)
   * @param {number} args.ang - Angle of branch (default: 0)
   * @param {number} args.det - Detail level (default: 10)
   * @param {number} args.ben - Bend factor (default: Math.PI * 0.2)
   * @returns {Array} Array containing two point lists for branch sides
   */
  this.branch = function(args) {
    var args = args != undefined ? args : {};
    var hei = args.hei != undefined ? args.hei : 300;
    var wid = args.wid != undefined ? args.wid : 6;
    var ang = args.ang != undefined ? args.ang : 0;
    var det = args.det != undefined ? args.det : 10;
    var ben = args.ben != undefined ? args.ben : Math.PI * 0.2;

    var tlist;
    var nx = 0;
    var ny = 0;
    tlist = [[nx, ny]];
    var a0 = 0;
    var g = 3;
    for (var i = 0; i < g; i++) {
      a0 += (ben / 2 + (Math.random() * ben) / 2) * randChoice([-1, 1]);
      nx += (Math.cos(a0) * hei) / g;
      ny -= (Math.sin(a0) * hei) / g;
      tlist.push([nx, ny]);
    }
    var ta = Math.atan2(
      tlist[tlist.length - 1][1],
      tlist[tlist.length - 1][0]
    );

    for (var i = 0; i < tlist.length; i++) {
      var a = Math.atan2(tlist[i][1], tlist[i][0]);
      var d = Math.sqrt(
        tlist[i][0] * tlist[i][0] + tlist[i][1] * tlist[i][1]
      );
      tlist[i][0] = d * Math.cos(a - ta + ang);
      tlist[i][1] = d * Math.sin(a - ta + ang);
    }

    var trlist1 = [];
    var trlist2 = [];
    var span = det;
    var tl = (tlist.length - 1) * span;
    var lx = 0;
    var ly = 0;

    for (var i = 0; i < tl; i += 1) {
      var lastp = tlist[Math.floor(i / span)];
      var nextp = tlist[Math.ceil(i / span)];
      var p = (i % span) / span;
      var nx = lastp[0] * (1 - p) + nextp[0] * p;
      var ny = lastp[1] * (1 - p) + nextp[1] * p;

      var ang = Math.atan2(ny - ly, nx - lx);
      var woff = ((Noise.noise(i * 0.3) - 0.5) * wid * hei) / 80;

      var b = 0;
      if (p == 0) {
        b = Math.random() * wid;
      }

      var nw = wid * (((tl - i) / tl) * 0.5 + 0.5);
      trlist1.push([
        nx + Math.cos(ang + Math.PI / 2) * (nw + woff + b),
        ny + Math.sin(ang + Math.PI / 2) * (nw + woff + b),
      ]);
      trlist2.push([
        nx + Math.cos(ang - Math.PI / 2) * (nw - woff + b),
        ny + Math.sin(ang - Math.PI / 2) * (nw - woff + b),
      ]);
      lx = nx;
      ly = ny;
    }

    return [trlist1, trlist2];
  };

  /**
   * Twig - Generates small branch details and leaves (Paper.js version)
   * Creates detailed twig structures with optional leaf generation
   * 
   * @param {number} tx - X coordinate
   * @param {number} ty - Y coordinate
   * @param {number} dep - Recursion depth
   * @param {Object} args - Configuration options
   * @param {number} args.dir - Direction (default: 1)
   * @param {number} args.sca - Scale factor (default: 1)
   * @param {number} args.wid - Width (default: 1)
   * @param {number} args.ang - Angle (default: 0)
   * @param {Array} args.lea - Leaf settings [enabled, size] (default: [true, 12])
   * @returns {paper.Group} Paper.js Group containing the twig
   */
  this.twig = function(tx, ty, dep, args) {
    var args = args != undefined ? args : {};
    var dir = args.dir != undefined ? args.dir : 1;
    var sca = args.sca != undefined ? args.sca : 1;
    var wid = args.wid != undefined ? args.wid : 1;
    var ang = args.ang != undefined ? args.ang : 0;
    var lea = args.lea != undefined ? args.lea : [true, 12];

    var twigGroup = new paper.Group();
    var twlist = [];
    var tl = 10;
    var hs = Math.random() * 0.5 + 0.5;
    var fun1 = function(x) {
      return Math.pow(x, 0.5);
    };
    var fun2 = function(x) {
      return -1 / Math.pow(i / tl + 1, 5) + 1;
    };

    var tfun = randChoice([fun2]);
    var a0 = ((Math.random() * Math.PI) / 6) * dir + ang;
    for (var i = 0; i < tl; i++) {
      var mx = dir * tfun(i / tl) * 50 * sca * hs;
      var my = -i * 5 * sca;

      var a = Math.atan2(my, mx);
      var d = Math.pow(mx * mx + my * my, 0.5);

      var nx = Math.cos(a + a0) * d;
      var ny = Math.sin(a + a0) * d;

      twlist.push([nx + tx, ny + ty]);
      if ((i == ((tl / 3) | 0) || i == (((tl * 2) / 3) | 0)) && dep > 0) {
        var subTwig = Tree.twig(nx + tx, ny + ty, dep - 1, {
          ang: ang,
          sca: sca * 0.8,
          wid: wid,
          dir: dir * randChoice([-1, 1]),
          lea: lea,
        });
        twigGroup.addChild(subTwig);
      }
      if (i == tl - 1 && lea[0] == true) {
        for (var j = 0; j < 5; j++) {
          var dj = (j - 2.5) * 5;
          var leafBlob = PaperRenderer.createBlob(
            nx + tx + Math.cos(ang) * dj * wid,
            ny + ty + (Math.sin(ang) * dj - lea[1] / (dep + 1)) * wid,
            {
              wid: (6 + 3 * Math.random()) * wid,
              len: (15 + 12 * Math.random()) * wid,
              ang:
                ang / 2 + Math.PI / 2 + Math.PI * 0.2 * (Math.random() - 0.5),
              col: "rgba(100,100,100," + (0.5 + dep * 0.2).toFixed(3) + ")",
              fun: function(x) {
                return x <= 1
                  ? Math.pow(Math.sin(x * Math.PI) * x, 0.5)
                  : -Math.pow(Math.sin((x - 2) * Math.PI * (x - 2)), 0.5);
              },
            }
          );
          twigGroup.addChild(leafBlob);
        }
      }
    }
    
    var twigStroke = StrokeRenderer.createVariableStroke(twlist, {
      wid: 1,
      fun: function(x) {
        return Math.cos((x * Math.PI) / 2);
      },
      col: "rgba(100,100,100,0.5)",
      context: 'trees'
    });
    twigGroup.addChild(twigStroke);
    
    return twigGroup;
  };

  /**
   * Barkify - Generates bark texture for tree trunks (Paper.js version)
   * Adds realistic bark texture and surface details to tree branches
   * 
   * @param {number} x - X coordinate offset
   * @param {number} y - Y coordinate offset
   * @param {Array} trlist - Array of two point lists representing branch sides
   * @returns {paper.Group} Paper.js Group containing bark texture
   */
  this.barkify = function(x, y, trlist) {
    var barkGroup = new paper.Group();
    
    function bark(x, y, wid, ang) {
      var len = 10 + 10 * Math.random();
      var noi = 0.5;
      var fun = function(x) {
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
      var brklist = [];
      for (var i = 0; i < lalist.length; i++) {
        var ns = nslist[i] * noi + (1 - noi);
        var nx = x + Math.cos(lalist[i][1] + ang) * lalist[i][0] * ns;
        var ny = y + Math.sin(lalist[i][1] + ang) * lalist[i][0] * ns;
        brklist.push([nx, ny]);
      }
      var fr = Math.random();
      return StrokeRenderer.createVariableStroke(brklist, {
        wid: 0.8,
        noi: 0,
        col: "rgba(100,100,100,0.4)",
        out: 0,
        context: 'trees',
        fun: function(x) {
          return Math.sin((x + fr) * Math.PI * 3);
        },
      });
    }

    for (var i = 2; i < trlist[0].length - 1; i++) {
      var a0 = Math.atan2(
        trlist[0][i][1] - trlist[0][i - 1][1],
        trlist[0][i][0] - trlist[0][i - 1][0]
      );
      var a1 = Math.atan2(
        trlist[1][i][1] - trlist[1][i - 1][1],
        trlist[1][i][0] - trlist[1][i - 1][0]
      );
      var p = Math.random();
      var nx = trlist[0][i][0] * (1 - p) + trlist[1][i][0] * p;
      var ny = trlist[0][i][1] * (1 - p) + trlist[1][i][1] * p;
      if (Math.random() < 0.2) {
        var barkBlob = PaperRenderer.createBlob(nx + x, ny + y, {
          noi: 1,
          len: 15,
          wid: 6 - Math.abs(p - 0.5) * 10,
          ang: (a0 + a1) / 2,
          col: "rgba(100,100,100,0.6)",
        });
        barkGroup.addChild(barkBlob);
      } else {
        var barkStroke = bark(
          nx + x,
          ny + y,
          5 - Math.abs(p - 0.5) * 10,
          (a0 + a1) / 2
        );
        barkGroup.addChild(barkStroke);
      }

      if (Math.random() < 0.05) {
        var jl = Math.random() * 2 + 2;
        var xya = randChoice([
          [trlist[0][i][0], trlist[0][i][1], a0],
          [trlist[1][i][0], trlist[1][i][1], a1],
        ]);
        for (var j = 0; j < jl; j++) {
          var barkDetail = PaperRenderer.createBlob(
            xya[0] + x + Math.cos(xya[2]) * (j - jl / 2) * 4,
            xya[1] + y + Math.sin(xya[2]) * (j - jl / 2) * 4,
            {
              wid: 4,
              len: 4 + 6 * Math.random(),
              ang: a0 + Math.PI / 2,
              col: "rgba(100,100,100,0.6)",
            }
          );
          barkGroup.addChild(barkDetail);
        }
      }
    }
    
    var trflist = trlist[0].concat(trlist[1].slice().reverse());
    var rglist = [[]];
    for (var i = 0; i < trflist.length; i++) {
      if (Math.random() < 0.5) {
        rglist.push([]);
      } else {
        rglist[rglist.length - 1].push(trflist[i]);
      }
    }

    for (var i = 0; i < rglist.length; i++) {
      rglist[i] = div(rglist[i], 4);
      for (var j = 0; j < rglist[i].length; j++) {
        rglist[i][j][0] +=
          (Noise.noise(i, j * 0.1, 1) - 0.5) * (15 + 5 * randGaussian());
        rglist[i][j][1] +=
          (Noise.noise(i, j * 0.1, 2) - 0.5) * (15 + 5 * randGaussian());
      }
      var barkTexture = StrokeRenderer.createVariableStroke(
        rglist[i].map(function(v) {
          return [v[0] + x, v[1] + y];
        }),
        { wid: 1.5, col: "rgba(100,100,100,0.7)", out: 0, context: 'trees' }
      );
      barkGroup.addChild(barkTexture);
    }
    
    return barkGroup;
  };
}();