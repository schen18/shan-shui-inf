/**
 * Water Effects Module for Paper.js
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
 * - Full Paper.js integration with Group-based organization
 * 
 * Dependencies: Paper.js library, paper-renderer.js, stroke-renderer.js, utils.js, noise.js
 */

/**
 * Water Effects Module for Paper.js
 * @namespace Water
 */
var Water = new function() {
  
  /**
   * Check if water is enabled via element toggles
   * @returns {boolean} True if water should be rendered
   */
  this.isEnabled = function() {
    // Check via getElementToggles function if available
    if (typeof getElementToggles === 'function') {
      var toggles = getElementToggles();
      return toggles.water !== false;
    }
    
    // Check via global ELEMENT_TOGGLES if available
    if (typeof ELEMENT_TOGGLES !== 'undefined') {
      return ELEMENT_TOGGLES.water !== false;
    }
    
    // Check via direct DOM element
    if (typeof document !== 'undefined') {
      var waterCheckbox = document.getElementById('ENABLE_WATER');
      return waterCheckbox ? waterCheckbox.checked : true;
    }
    
    // Default to enabled
    return true;
  };
  
  /**
   * Generate water surface effects with waves and ripples using Paper.js
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
   * @returns {paper.Group} Paper.js Group containing water surface with waves
   */
  this.water = function(xoff, yoff, seed, args) {
    // Return empty group if water is disabled
    if (!this.isEnabled()) {
      return new paper.Group();
    }
    var args = args != undefined ? args : {};
    var hei = args.hei != undefined ? args.hei : 2;
    var len = args.len != undefined ? args.len : 800;
    var clu = args.clu != undefined ? args.clu : 10;
    
    var waterGroup = new paper.Group();
    var ptlist = [];
    var yk = 0;
    
    // Generate wave clusters with noise-based variation
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
    
    // Create strokes for each wave cluster (skip first cluster like original)
    for (var j = 1; j < ptlist.length; j += 1) {
      if (ptlist[j].length >= 2) {
        // Apply offset to points
        var offsetPoints = ptlist[j].map(function(x) {
          return [x[0] + xoff, x[1] + yoff];
        });
        
        // Create stroke with variable width and broken stroke support
        var waveStroke = StrokeRenderer.createVariableStroke(offsetPoints, {
          col: "rgba(100,100,100," + (0.3 + Math.random() * 0.3).toFixed(3) + ")",
          wid: 1,
          context: 'water'
        });
        
        waterGroup.addChild(waveStroke);
      }
    }
    
    return waterGroup;
  };
  
  /**
   * Create simple water ripples effect
   * @param {number} x - Center X coordinate
   * @param {number} y - Center Y coordinate
   * @param {Object} [options] - Ripple options
   * @param {number} [options.radius=50] - Maximum ripple radius
   * @param {number} [options.rings=3] - Number of ripple rings
   * @param {number} [options.spacing=15] - Spacing between rings
   * @param {string} [options.color="rgba(100,100,100,0.4)"] - Ripple color
   * @param {number} [options.strokeWidth=1] - Stroke width
   * @returns {paper.Group} Group containing ripple rings
   */
  this.createRipples = function(x, y, options) {
    var opts = options || {};
    var radius = opts.radius || 50;
    var rings = opts.rings || 3;
    var spacing = opts.spacing || 15;
    var color = opts.color || "rgba(100,100,100,0.4)";
    var strokeWidth = opts.strokeWidth || 1;
    
    var rippleGroup = new paper.Group();
    
    for (var i = 0; i < rings; i++) {
      var ringRadius = spacing * (i + 1);
      if (ringRadius <= radius) {
        var circle = new paper.Path.Circle(new paper.Point(x, y), ringRadius);
        circle.strokeColor = PaperRenderer.parseColor(color);
        circle.strokeWidth = strokeWidth * (1 - i * 0.2); // Fade stroke width
        circle.fillColor = null;
        
        // Add slight organic variation to make ripples less perfect
        var segments = circle.segments;
        for (var j = 0; j < segments.length; j++) {
          var segment = segments[j];
          var noiseX = (Noise.noise(j * 0.1, i) - 0.5) * 2;
          var noiseY = (Noise.noise(j * 0.1 + 100, i) - 0.5) * 2;
          segment.point.x += noiseX;
          segment.point.y += noiseY;
        }
        
        rippleGroup.addChild(circle);
      }
    }
    
    return rippleGroup;
  };
  
  /**
   * Create water surface texture with multiple layers
   * @param {number} x - Start X coordinate
   * @param {number} y - Start Y coordinate
   * @param {number} width - Surface width
   * @param {number} height - Surface height
   * @param {Object} [options] - Texture options
   * @param {number} [options.density=100] - Number of texture strokes
   * @param {number} [options.strokeWidth=0.5] - Base stroke width
   * @param {string} [options.color="rgba(120,120,120,0.2)"] - Base color
   * @param {number} [options.layers=3] - Number of texture layers
   * @returns {paper.Group} Group containing water surface texture
   */
  this.createWaterTexture = function(x, y, width, height, options) {
    var opts = options || {};
    var density = opts.density || 100;
    var strokeWidth = opts.strokeWidth || 0.5;
    var color = opts.color || "rgba(120,120,120,0.2)";
    var layers = opts.layers || 3;
    
    var textureGroup = new paper.Group();
    
    for (var layer = 0; layer < layers; layer++) {
      var layerGroup = new paper.Group();
      var layerAlpha = 0.1 + (layer / layers) * 0.2;
      var layerColor = color.replace(/[\d\.]+\)$/, layerAlpha.toFixed(3) + ')');
      
      for (var i = 0; i < density; i++) {
        var startX = x + Math.random() * width;
        var startY = y + Math.random() * height;
        var length = 10 + Math.random() * 30;
        var angle = Math.random() * Math.PI * 2;
        
        var endX = startX + Math.cos(angle) * length;
        var endY = startY + Math.sin(angle) * length;
        
        // Add noise variation to stroke
        var midX = (startX + endX) / 2 + (Noise.noise(i * 0.1, layer) - 0.5) * 10;
        var midY = (startY + endY) / 2 + (Noise.noise(i * 0.1 + 100, layer) - 0.5) * 5;
        
        var strokePoints = [[startX, startY], [midX, midY], [endX, endY]];
        
        var textureStroke = StrokeRenderer.createVariableStroke(strokePoints, {
          col: layerColor,
          wid: strokeWidth * (0.5 + layer * 0.3),
          noi: 0.3,
          context: 'water'
        });
        
        layerGroup.addChild(textureStroke);
      }
      
      textureGroup.addChild(layerGroup);
    }
    
    return textureGroup;
  };
  
  /**
   * Create flowing water effect with directional strokes
   * @param {Array} pathPoints - Array of points defining the water flow path
   * @param {Object} [options] - Flow options
   * @param {number} [options.flowStrokes=20] - Number of flow strokes
   * @param {number} [options.strokeWidth=1] - Base stroke width
   * @param {string} [options.color="rgba(100,150,200,0.4)"] - Flow color
   * @param {number} [options.variation=10] - Amount of variation in flow lines
   * @returns {paper.Group} Group containing flowing water effect
   */
  this.createFlowingWater = function(pathPoints, options) {
    var opts = options || {};
    var flowStrokes = opts.flowStrokes || 20;
    var strokeWidth = opts.strokeWidth || 1;
    var color = opts.color || "rgba(100,150,200,0.4)";
    var variation = opts.variation || 10;
    
    if (!pathPoints || pathPoints.length < 2) {
      return new paper.Group();
    }
    
    var flowGroup = new paper.Group();
    
    for (var i = 0; i < flowStrokes; i++) {
      var flowPoints = [];
      var t = i / flowStrokes;
      
      // Create parallel flow lines with variation
      for (var j = 0; j < pathPoints.length; j++) {
        var basePoint = pathPoints[j];
        var offset = (Math.random() - 0.5) * variation;
        var noiseOffset = (Noise.noise(j * 0.1, i * 0.05) - 0.5) * variation * 0.5;
        
        flowPoints.push([
          basePoint[0] + offset + noiseOffset,
          basePoint[1] + offset * 0.3 + noiseOffset
        ]);
      }
      
      if (flowPoints.length >= 2) {
        var flowStroke = StrokeRenderer.createVariableStroke(flowPoints, {
          col: color,
          wid: strokeWidth * (0.5 + Math.random() * 0.5),
          noi: 0.4,
          context: 'water',
          fun: function(x) {
            // Taper the stroke at both ends
            return Math.sin(x * Math.PI) * (0.5 + Math.sin(x * Math.PI * 3) * 0.3);
          }
        });
        
        flowGroup.addChild(flowStroke);
      }
    }
    
    return flowGroup;
  };
}();

/**
 * Legacy function for backward compatibility with original water() function
 * @param {number} xoff - X offset position for water placement
 * @param {number} yoff - Y offset position for water placement  
 * @param {number} seed - Random seed for deterministic wave generation
 * @param {Object} args - Configuration options
 * @returns {paper.Group} Paper.js Group containing water surface
 */
function water(xoff, yoff, seed, args) {
  return Water.water(xoff, yoff, seed, args);
}