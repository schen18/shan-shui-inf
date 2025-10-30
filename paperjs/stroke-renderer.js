/**
 * Stroke Renderer Module
 * 
 * Specialized component for handling complex stroke rendering with variable width
 * and broken stroke effects. This replaces the original stroke() function and
 * provides Paper.js-based implementations of the traditional Chinese painting
 * brush effects.
 * 
 * Dependencies: Paper.js library, paper-renderer.js, utils.js, noise.js
 * 
 * @namespace StrokeRenderer
 */
var StrokeRenderer = new function() {
  
  /**
   * Check if broken strokes are enabled globally via UI toggle
   * @returns {boolean} True if broken strokes are enabled globally
   */
  this.isBrokenStrokeEnabled = function() {
    if (typeof document !== 'undefined') {
      var brokenCheckbox = document.getElementById('BROKEN_STROKES');
      return brokenCheckbox && brokenCheckbox.checked;
    }
    return false;
  };
  
  /**
   * Create a variable-width stroke using Paper.js compound paths
   * Replaces the original stroke() function with full Paper.js compatibility
   * @param {Array} points - Array of [x, y] coordinate pairs defining the stroke path
   * @param {Object} [options] - Stroke options matching original stroke() function
   * @param {number} [options.xof=0] - X offset
   * @param {number} [options.yof=0] - Y offset
   * @param {number} [options.wid=2] - Base stroke width
   * @param {string} [options.col='rgba(200,200,200,0.9)'] - Stroke color
   * @param {number} [options.noi=0.5] - Noise factor for width variation
   * @param {number} [options.out=1] - Outline width for stroke edge
   * @param {Function} [options.fun] - Width function along path
   * @param {boolean} [options.broken] - Enable broken stroke effect (auto-detect from UI if undefined)
   * @param {string} [options.context] - Context hint: 'architecture', 'figures', 'boats', 'rocks' to exclude broken strokes
   * @param {number} [options.breakProb=0.2] - Break probability for broken strokes
   * @param {number} [options.minSegLen=4] - Minimum segment length for broken strokes
   * @param {number} [options.maxSegLen=15] - Maximum segment length for broken strokes
   * @param {string} [options.strokeCap='round'] - Stroke end cap style
   * @param {string} [options.strokeJoin='round'] - Stroke join style
   * @returns {paper.Group} Group containing the variable-width stroke
   */
  this.createVariableStroke = function(points, options) {
    if (!points || points.length < 2) {
      return new paper.Group();
    }
    
    var opts = options || {};
    var xof = opts.xof != undefined ? opts.xof : 0;
    var yof = opts.yof != undefined ? opts.yof : 0;
    var baseWidth = opts.wid != undefined ? opts.wid : 2;
    var color = opts.col != undefined ? opts.col : 'rgba(200,200,200,0.9)';
    var noiseAmount = opts.noi != undefined ? opts.noi : 0.5;
    var outline = opts.out != undefined ? opts.out : 1;
    var widthFunc = opts.fun != undefined ? opts.fun : function(x) { return Math.sin(x * Math.PI); };
    var strokeCap = opts.strokeCap || 'round';
    var strokeJoin = opts.strokeJoin || 'round';
    
    // Check if broken strokes are enabled globally (only if not explicitly set)
    var broken = opts.broken;
    if (broken === undefined) {
      var brokenStrokesEnabled = false;
      if (typeof document !== 'undefined') {
        var brokenCheckbox = document.getElementById('BROKEN_STROKES');
        brokenStrokesEnabled = brokenCheckbox && brokenCheckbox.checked;
      }
      broken = brokenStrokesEnabled;
    }
    
    // Exclude broken strokes for certain contexts
    var excludedContexts = ['architecture', 'figures', 'boats', 'rocks', 'trees'];
    if (broken && opts.context && excludedContexts.indexOf(opts.context) !== -1) {
      broken = false;
    }
    
    // Use original rendering.js settings for water broken strokes
    if (broken && opts.context === 'water') {
      opts.breakProb = 0.2;   // Use original default break probability
      opts.minSegLen = 4;     // Use original default minimum segments
      opts.maxSegLen = 15;    // Use original default maximum segments
    }
    
    // Apply coordinate offsets to points
    var offsetPoints = points.map(function(pt) {
      return [pt[0] + xof, pt[1] + yof];
    });
    
    var group = new paper.Group();
    
    // If broken stroke is enabled, segment the path
    if (broken) {
      // Don't pass coordinate offsets again since we already applied them
      var brokenOpts = {};
      for (var key in opts) {
        brokenOpts[key] = opts[key];
      }
      brokenOpts.xof = 0; // Reset offsets since already applied
      brokenOpts.yof = 0;
      
      // For thin strokes, make the broken effect more pronounced
      if (baseWidth < 3) {
        brokenOpts.breakProb = 0.5;
        brokenOpts.minSegLen = 2;
        brokenOpts.maxSegLen = 4;
      }
      
      return this.createBrokenStroke(offsetPoints, brokenOpts);
    }
    
    // Skip first and last points for width calculation (like original)
    if (offsetPoints.length < 3) {
      // For very short paths, create simple stroke
      var path = PaperRenderer.createPath(offsetPoints, {
        str: color,
        wid: baseWidth
      });
      // Apply stroke cap and join settings
      if (path.strokeColor) {
        path.strokeCap = strokeCap;
        path.strokeJoin = strokeJoin;
      }
      group.addChild(path);
      return group;
    }
    
    var vtxlist0 = [];
    var vtxlist1 = [];
    var n0 = Math.random() * 10;
    
    // Calculate variable width points (skip first and last like original)
    for (var i = 1; i < offsetPoints.length - 1; i++) {
      var t = i / offsetPoints.length;
      var w = baseWidth * widthFunc(t);
      w = w * (1 - noiseAmount) + w * noiseAmount * Noise.noise(i * 0.5, n0);
      
      // Calculate angles to previous and next points
      var a1 = Math.atan2(
        offsetPoints[i][1] - offsetPoints[i - 1][1],
        offsetPoints[i][0] - offsetPoints[i - 1][0]
      );
      var a2 = Math.atan2(
        offsetPoints[i][1] - offsetPoints[i + 1][1],
        offsetPoints[i][0] - offsetPoints[i + 1][0]
      );
      
      // Average angle for perpendicular direction
      var a = (a1 + a2) / 2;
      if (a < a2) {
        a += Math.PI;
      }
      
      // Calculate offset points for variable width
      vtxlist0.push([
        offsetPoints[i][0] + w * Math.cos(a),
        offsetPoints[i][1] + w * Math.sin(a)
      ]);
      vtxlist1.push([
        offsetPoints[i][0] - w * Math.cos(a),
        offsetPoints[i][1] - w * Math.sin(a)
      ]);
    }
    
    // Combine points to form stroke shape (like original algorithm)
    var vtxlist = [offsetPoints[0]]
      .concat(vtxlist0)
      .concat(vtxlist1.concat([offsetPoints[offsetPoints.length - 1]]).reverse())
      .concat([offsetPoints[0]]);
    
    // Create the stroke polygon
    var strokePath = PaperRenderer.createPolygon(vtxlist, {
      fil: color,
      str: color,
      wid: outline
    });
    
    // Apply stroke cap and join settings if stroke is present
    if (strokePath.strokeColor) {
      strokePath.strokeCap = strokeCap;
      strokePath.strokeJoin = strokeJoin;
    }
    
    group.addChild(strokePath);
    return group;
  };
  
  /**
   * Create broken stroke effects that simulate brush lifting from paper
   * Segments paths with gaps to create natural broken stroke appearance
   * @param {Array} points - Array of [x, y] coordinate pairs
   * @param {Object} [options] - Stroke options
   * @param {number} [options.xof=0] - X offset
   * @param {number} [options.yof=0] - Y offset
   * @param {number} [options.breakProb=0.3] - Probability of creating gaps between segments
   * @param {number} [options.minSegLen=3] - Minimum points per segment
   * @param {number} [options.maxSegLen=8] - Maximum points per segment
   * @param {number} [options.wid=2] - Base stroke width
   * @param {string} [options.col='rgba(200,200,200,0.9)'] - Stroke color
   * @param {number} [options.noi=0.5] - Noise factor for width variation
   * @param {Function} [options.fun] - Width function along path
   * @returns {paper.Group} Group containing broken stroke segments
   */
  this.createBrokenStroke = function(points, options) {
    if (!points || points.length < 2) {
      return new paper.Group();
    }
    
    // console.log('Creating broken stroke with', points.length, 'points');
    
    var opts = options || {};
    var xof = opts.xof != undefined ? opts.xof : 0;
    var yof = opts.yof != undefined ? opts.yof : 0;
    var breakProb = opts.breakProb != undefined ? opts.breakProb : 0.4;
    var minSegLen = opts.minSegLen != undefined ? opts.minSegLen : 2;
    var maxSegLen = opts.maxSegLen != undefined ? opts.maxSegLen : 6;
    
    // Apply coordinate offsets to points
    var offsetPoints = points.map(function(pt) {
      return [pt[0] + xof, pt[1] + yof];
    });
    
    var group = new paper.Group();
    var segments = [];
    var i = 0;
    
    // Split path into segments with gaps (matching original algorithm)
    while (i < offsetPoints.length) {
      // Start a new segment
      var currentSegment = [offsetPoints[i]];
      var segmentLength = Math.max(2, minSegLen + Math.floor(Math.random() * (maxSegLen - minSegLen)));
      
      // Add points to current segment
      for (var j = 1; j < segmentLength && i + j < offsetPoints.length; j++) {
        currentSegment.push(offsetPoints[i + j]);
      }
      
      // Add segment if it has enough points
      if (currentSegment.length >= 2) {
        segments.push(currentSegment);
      }
      
      // Move to next segment start
      i += currentSegment.length;
      
      // Add a random gap (skip some points) - use original rendering.js logic
      if (i < offsetPoints.length && Math.random() < breakProb) {
        var gapSize = 1 + Math.floor(Math.random() * 3); // Original: 1-3 points gap
        i += gapSize;
      }
    }
    
    // Ensure we have at least 2 segments for broken effect
    if (segments.length < 2 && offsetPoints.length > 4) {
      // Force split into multiple segments for more obvious broken effect
      segments = [];
      var segmentSize = Math.max(3, Math.floor(offsetPoints.length / 3));
      
      for (var s = 0; s < offsetPoints.length; s += segmentSize + 1) {
        var segEnd = Math.min(s + segmentSize, offsetPoints.length);
        var segment = offsetPoints.slice(s, segEnd);
        if (segment.length >= 2) {
          segments.push(segment);
        }
      }
    }
    
    // console.log('Created', segments.length, 'broken stroke segments');
    
    // Render each segment as a separate stroke
    for (var k = 0; k < segments.length; k++) {
      if (segments[k].length >= 2) {
        // Create a copy of options and explicitly set broken to false
        var segmentOpts = {};
        for (var key in opts) {
          segmentOpts[key] = opts[key];
        }
        segmentOpts.broken = false; // Prevent infinite recursion
        segmentOpts.xof = 0; // Don't apply offsets again
        segmentOpts.yof = 0; // Don't apply offsets again
        
        // Use consistent variation for all elements (matching original rendering.js)
        if (segmentOpts.col && segmentOpts.col.includes('rgba')) {
          var opacityVariation = 0.6 + Math.random() * 0.4;
          segmentOpts.col = segmentOpts.col.replace(/,\s*[\d.]+\)/, ',' + opacityVariation + ')');
        }
        
        // Consistent width variation for all elements
        segmentOpts.wid = (segmentOpts.wid || 2) * (0.8 + Math.random() * 0.4);
        
        var segment = this.createVariableStroke(segments[k], segmentOpts);
        group.addChild(segment);
      }
    }
    
    return group;
  };
  
  /**
   * Apply stroke styling to a Paper.js item
   * @param {paper.Item} item - Paper.js item to style
   * @param {Object} style - Style properties
   * @param {string} [style.color] - Fill/stroke color
   * @param {number} [style.opacity] - Opacity (0-1)
   * @param {string} [style.blendMode] - Blend mode
   * @param {string} [style.strokeCap] - Stroke cap style ('round', 'square', 'butt')
   * @param {string} [style.strokeJoin] - Stroke join style ('round', 'bevel', 'miter')
   * @param {number} [style.miterLimit] - Miter limit for stroke joins
   */
  this.applyStrokeStyle = function(item, style) {
    if (!item || !style) return;
    
    if (style.color) {
      item.fillColor = PaperRenderer.parseColor(style.color);
      if (item.strokeColor) {
        item.strokeColor = PaperRenderer.parseColor(style.color);
      }
    }
    if (style.opacity !== undefined) {
      item.opacity = style.opacity;
    }
    if (style.blendMode) {
      item.blendMode = style.blendMode;
    }
    if (style.strokeCap) {
      item.strokeCap = style.strokeCap;
    }
    if (style.strokeJoin) {
      item.strokeJoin = style.strokeJoin;
    }
    if (style.miterLimit !== undefined) {
      item.miterLimit = style.miterLimit;
    }
  };
  
  /**
   * Create a compound path for complex stroke shapes
   * @param {Array} pathSegments - Array of path segments, each containing points
   * @param {Object} [options] - Styling options
   * @returns {paper.CompoundPath} Paper.js CompoundPath object
   */
  this.createCompoundStroke = function(pathSegments, options) {
    var opts = options || {};
    var compoundPath = new paper.CompoundPath();
    
    for (var i = 0; i < pathSegments.length; i++) {
      if (pathSegments[i].length >= 2) {
        var segment = this.createVariableStroke(pathSegments[i], opts);
        if (segment.children && segment.children.length > 0) {
          compoundPath.addChild(segment.children[0]);
        }
      }
    }
    
    this.applyStrokeStyle(compoundPath, opts);
    return compoundPath;
  };
}();