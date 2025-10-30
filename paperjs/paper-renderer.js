/**
 * Paper.js Renderer Module
 * 
 * Core rendering system that provides Paper.js-based implementations of the original
 * SVG rendering functions. This module serves as the foundation for all Paper.js
 * rendering operations in the Shan Shui landscape generator.
 * 
 * Provides Paper.js equivalents for:
 * - SVG path and polygon creation
 * - Color parsing and management
 * - Coordinate transformations
 * - Style application
 * - Group management
 * 
 * Dependencies: Paper.js library
 * 
 * @namespace PaperRenderer
 */
var PaperRenderer = new function () {

    /**
     * Parse color string into Paper.js Color object
     * Supports rgba(), rgb(), hex, and named colors
     * @param {string} colorStr - Color string to parse
     * @returns {paper.Color} Paper.js Color object
     */
    this.parseColor = function (colorStr) {
        if (!colorStr || colorStr === 'none') {
            return null;
        }

        try {
            // Handle rgba() format
            var rgbaMatch = colorStr.match(/rgba?\(([^)]+)\)/);
            if (rgbaMatch) {
                var values = rgbaMatch[1].split(',').map(function (v) { return parseFloat(v.trim()); });
                if (values.length >= 3) {
                    var alpha = values.length > 3 ? values[3] : 1;
                    return new paper.Color(values[0] / 255, values[1] / 255, values[2] / 255, alpha);
                }
            }

            // Handle hex colors
            if (colorStr.startsWith('#')) {
                return new paper.Color(colorStr);
            }

            // Handle named colors
            return new paper.Color(colorStr);
        } catch (e) {
            console.warn('Failed to parse color:', colorStr, e);
            return new paper.Color('black');
        }
    };

    /**
     * Transform coordinates (currently pass-through, can be extended for coordinate system changes)
     * @param {number} x - X coordinate
     * @param {number} y - Y coordinate
     * @returns {Array} Transformed coordinates [x, y]
     */
    this.transformCoordinates = function (x, y) {
        return [x, y];
    };

    /**
     * Create Paper.js Path from point array
     * @param {Array} points - Array of [x, y] coordinate pairs
     * @param {Object} [args] - Styling arguments
     * @param {number} [args.xof=0] - X offset
     * @param {number} [args.yof=0] - Y offset
     * @param {string} [args.fil] - Fill color
     * @param {string} [args.str] - Stroke color
     * @param {number} [args.wid=0] - Stroke width
     * @returns {paper.Path} Paper.js Path object
     */
    this.createPath = function (points, args) {
        var opts = args || {};
        var xof = opts.xof || 0;
        var yof = opts.yof || 0;

        var path = new paper.Path();

        // Add points to path
        for (var i = 0; i < points.length; i++) {
            var point = new paper.Point(points[i][0] + xof, points[i][1] + yof);
            if (i === 0) {
                path.moveTo(point);
            } else {
                path.lineTo(point);
            }
        }

        // Apply styling
        this.applyStyle(path, opts);

        return path;
    };

    /**
     * Create Paper.js closed polygon from point array
     * @param {Array} points - Array of [x, y] coordinate pairs
     * @param {Object} [args] - Styling arguments
     * @param {number} [args.xof=0] - X offset
     * @param {number} [args.yof=0] - Y offset
     * @param {string} [args.fil] - Fill color
     * @param {string} [args.str] - Stroke color
     * @param {number} [args.wid=0] - Stroke width
     * @returns {paper.Path} Paper.js closed Path object
     */
    this.createPolygon = function (points, args) {
        var path = this.createPath(points, args);
        path.closed = true;
        return path;
    };

    /**
     * Create Paper.js Group
     * @returns {paper.Group} New Paper.js Group object
     */
    this.createGroup = function () {
        return new paper.Group();
    };

    /**
     * Apply styling to Paper.js item
     * @param {paper.Item} item - Paper.js item to style
     * @param {Object} style - Style properties
     * @param {string} [style.fil] - Fill color
     * @param {string} [style.fill] - Fill color (alternative)
     * @param {string} [style.str] - Stroke color
     * @param {string} [style.stroke] - Stroke color (alternative)
     * @param {number} [style.wid] - Stroke width
     * @param {number} [style.strokeWidth] - Stroke width (alternative)
     * @param {number} [style.opacity] - Opacity (0-1)
     * @param {string} [style.blendMode] - Blend mode
     */
    this.applyStyle = function (item, style) {
        if (!item || !style) return;

        // Fill color
        var fillColor = style.fil || style.fill;
        if (fillColor && fillColor !== 'none') {
            item.fillColor = this.parseColor(fillColor);
        } else if (fillColor === 'none') {
            item.fillColor = null;
        }

        // Stroke color and width
        var strokeColor = style.str || style.stroke;
        var strokeWidth = style.wid !== undefined ? style.wid : style.strokeWidth;

        if (strokeColor && strokeColor !== 'none' && strokeWidth > 0) {
            item.strokeColor = this.parseColor(strokeColor);
            item.strokeWidth = strokeWidth;
        } else if (strokeColor === 'none' || strokeWidth === 0) {
            item.strokeColor = null;
            item.strokeWidth = 0;
        }

        // Other properties
        if (style.opacity !== undefined) {
            item.opacity = style.opacity;
        }
        if (style.blendMode) {
            item.blendMode = style.blendMode;
        }
    };

    /**
     * Create organic blob shape using Paper.js
     * @param {number} x - Center X coordinate
     * @param {number} y - Center Y coordinate
     * @param {Object} [args] - Blob options
     * @param {number} [args.len=20] - Length
     * @param {number} [args.wid=5] - Width
     * @param {number} [args.ang=0] - Rotation angle
     * @param {string} [args.col='rgba(200,200,200,0.9)'] - Color
     * @param {number} [args.noi=0.5] - Noise factor
     * @param {Function} [args.fun] - Shape function
     * @returns {paper.Path} Paper.js Path representing the blob
     */
    this.createBlob = function (x, y, args) {
        var opts = args || {};
        var len = opts.len !== undefined ? opts.len : 20;
        var wid = opts.wid !== undefined ? opts.wid : 5;
        var ang = opts.ang !== undefined ? opts.ang : 0;
        var col = opts.col !== undefined ? opts.col : 'rgba(200,200,200,0.9)';
        var noi = opts.noi !== undefined ? opts.noi : 0.5;
        var fun = opts.fun !== undefined ? opts.fun : function (x) {
            return x <= 1 ? Math.pow(Math.sin(x * Math.PI), 0.5) : -Math.pow(Math.sin((x + 1) * Math.PI), 0.5);
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
        var points = [];
        for (var i = 0; i < lalist.length; i++) {
            var ns = nslist[i] * noi + (1 - noi);
            var nx = x + Math.cos(lalist[i][1] + ang) * lalist[i][0] * ns;
            var ny = y + Math.sin(lalist[i][1] + ang) * lalist[i][0] * ns;
            points.push([nx, ny]);
        }

        return this.createPolygon(points, { fil: col, str: col, wid: 0 });
    };

    /**
     * Create surface texture using Paper.js paths
     * @param {Array} ptlist - 2D array of points defining surface layers
     * @param {Object} [args] - Texture options
     * @param {number} [args.xof=0] - X offset
     * @param {number} [args.yof=0] - Y offset
     * @param {number} [args.tex=400] - Number of texture lines
     * @param {number} [args.wid=1.5] - Line width
     * @param {number} [args.len=0.2] - Line length factor
     * @param {number} [args.sha=0] - Shadow width
     * @param {Function} [args.noi] - Noise function for texture variation
     * @param {Function} [args.col] - Color function for texture lines
     * @param {Function} [args.dis] - Distribution function for texture placement
     * @returns {paper.Group} Group containing texture paths
     */
    this.createTexture = function (ptlist, args) {
        var opts = args || {};
        var xof = opts.xof !== undefined ? opts.xof : 0;
        var yof = opts.yof !== undefined ? opts.yof : 0;
        var tex = opts.tex !== undefined ? opts.tex : 400;
        var wid = opts.wid !== undefined ? opts.wid : 1.5;
        var len = opts.len !== undefined ? opts.len : 0.2;
        var sha = opts.sha !== undefined ? opts.sha : 0;
        var noi = opts.noi !== undefined ? opts.noi : function (x) { return 30 / x; };
        var col = opts.col !== undefined ? opts.col : function (x) {
            return 'rgba(100,100,100,' + (Math.random() * 0.3).toFixed(3) + ')';
        };
        var dis = opts.dis !== undefined ? opts.dis : function () {
            if (Math.random() > 0.5) {
                return (1 / 3) * Math.random();
            } else {
                return (1 * 2) / 3 + (1 / 3) * Math.random();
            }
        };

        var reso = [ptlist.length, ptlist[0].length];
        var textureGroup = new paper.Group();
        var texlist = [];

        for (var i = 0; i < tex; i++) {
            var mid = (dis() * reso[1]) | 0;
            var hlen = Math.floor(Math.random() * (reso[1] * len));
            var start = Math.min(Math.max(mid - hlen, 0), reso[1]);
            var end = Math.min(Math.max(mid + hlen, 0), reso[1]);
            var layer = (i / tex) * (reso[0] - 1);

            texlist.push([]);
            for (var j = start; j < end; j++) {
                var p = layer - Math.floor(layer);
                var x = ptlist[Math.floor(layer)][j][0] * p + ptlist[Math.ceil(layer)][j][0] * (1 - p);
                var y = ptlist[Math.floor(layer)][j][1] * p + ptlist[Math.ceil(layer)][j][1] * (1 - p);
                var ns = [
                    noi(layer + 1) * (Noise.noise(x, j * 0.5) - 0.5),
                    noi(layer + 1) * (Noise.noise(y, j * 0.5) - 0.5)
                ];
                texlist[texlist.length - 1].push([x + ns[0] + xof, y + ns[1] + yof]);
            }
        }

        // Create shadow strokes
        if (sha) {
            for (var j = 0; j < texlist.length; j += 1 + (sha != 0)) {
                if (texlist[j].length >= 2) {
                    var shadowPath = this.createPath(texlist[j], {
                        str: 'rgba(100,100,100,0.1)',
                        wid: sha
                    });
                    textureGroup.addChild(shadowPath);
                }
            }
        }

        // Create main texture strokes
        for (var j = 0 + sha; j < texlist.length; j += 1 + sha) {
            if (texlist[j].length >= 2) {
                var texturePath = this.createPath(texlist[j], {
                    str: col(j / texlist.length),
                    wid: wid
                });
                textureGroup.addChild(texturePath);
            }
        }

        return textureGroup;
    };
}();