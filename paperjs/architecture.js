/**
 * Architecture Module - Paper.js Implementation
 * 
 * Migrated from the original SVG-based architecture generation system.
 * This module contains functions for generating various types of buildings,
 * structures, and architectural elements using Paper.js rendering.
 * 
 * Functions included:
 * - arch01: Simple buildings with traditional roofs
 * - arch02: Multi-story structures with customizable styles
 * - arch03: Pagoda-style buildings with multiple levels
 * - arch04: Complex architectural forms with transparent elements
 * - boat01: Fishing boats with human figures
 * - transmissionTower01: Modern transmission tower structures
 * 
 * Dependencies: Paper.js, paper-renderer.js, stroke-renderer.js, utils.js, polytools.js, figures.js
 */

var Arch = new function() {
    
    // Helper function to flip coordinates along an axis
    var flip = function(ptlist, axis) {
        axis = axis == undefined ? 0 : axis;
        for (var i = 0; i < ptlist.length; i++) {
            if (ptlist[i].length > 0) {
                if (typeof ptlist[i][0] == "object") {
                    for (var j = 0; j < ptlist[i].length; j++) {
                        ptlist[i][j][0] = axis - (ptlist[i][j][0] - axis);
                    }
                } else {
                    ptlist[i][0] = axis - (ptlist[i][0] - axis);
                }
            }
        }
        return ptlist;
    };

    // Helper function to create traditional hut structures using Paper.js
    var hut = function(xoff, yoff, args) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 40;
        var wid = args.wid != undefined ? args.wid : 180;
        var tex = args.tex != undefined ? args.tex : 300;

        var reso = [10, 10];
        var ptlist = [];

        // Generate hut surface points
        for (var i = 0; i < reso[0]; i++) {
            ptlist.push([]);
            var heir = hei + hei * 0.2 * Math.random();
            for (var j = 0; j < reso[1]; j++) {
                var nx = wid * (i / (reso[0] - 1) - 0.5) * Math.pow(j / (reso[1] - 1), 0.7);
                var ny = heir * (j / (reso[1] - 1));
                ptlist[ptlist.length - 1].push([nx, ny]);
            }
        }

        var group = PaperRenderer.createGroup();

        // Create main hut body
        var bodyPoints = ptlist[0]
            .slice(0, -1)
            .concat(ptlist[ptlist.length - 1].slice(0, -1).reverse());
        var body = PaperRenderer.createPolygon(bodyPoints, {
            xof: xoff,
            yof: yoff,
            fil: "white",
            str: "none"
        });
        group.addChild(body);

        // Create front edge
        var frontEdge = StrokeRenderer.createVariableStroke(ptlist[0], {
            xof: xoff,
            yof: yoff,
            col: "rgba(100,100,100,0.3)",
            wid: 2,
            context: 'architecture'
        });
        group.addChild(frontEdge);

        // Create back edge
        var backEdge = StrokeRenderer.createVariableStroke(ptlist[ptlist.length - 1], {
            xof: xoff,
            yof: yoff,
            col: "rgba(100,100,100,0.3)",
            wid: 2,
            context: 'architecture'
        });
        group.addChild(backEdge);

        // Create surface texture
        var texture = PaperRenderer.createTexture(ptlist, {
            xof: xoff,
            yof: yoff,
            tex: tex,
            wid: 1,
            len: 0.25,
            col: function(x) {
                return "rgba(120,120,120," + (0.3 + Math.random() * 0.3).toFixed(3) + ")";
            },
            dis: function() {
                return wtrand(a => a * a);
            },
            noi: function(x) {
                return 5;
            }
        });
        group.addChild(texture);

        return group;
    };

    // Helper function to create box structures using Paper.js
    var box = function(xoff, yoff, args) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 20;
        var wid = args.wid != undefined ? args.wid : 120;
        var rot = args.rot != undefined ? args.rot : 0.7;
        var per = args.per != undefined ? args.per : 4;
        var tra = args.tra != undefined ? args.tra : true;
        var bot = args.bot != undefined ? args.bot : true;
        var wei = args.wei != undefined ? args.wei : 3;
        var dec = args.dec != undefined ? args.dec : function(a) { return []; };

        var mid = -wid * 0.5 + wid * rot;
        var bmid = -wid * 0.5 + wid * (1 - rot);
        var ptlist = [];
        
        // Generate box structure lines
        ptlist.push(div([[-wid * 0.5, -hei], [-wid * 0.5, 0]], 5));
        ptlist.push(div([[wid * 0.5, -hei], [wid * 0.5, 0]], 5));
        if (bot) {
            ptlist.push(div([[-wid * 0.5, 0], [mid, per]], 5));
            ptlist.push(div([[wid * 0.5, 0], [mid, per]], 5));
        }
        ptlist.push(div([[mid, -hei], [mid, per]], 5));
        if (tra) {
            if (bot) {
                ptlist.push(div([[-wid * 0.5, 0], [bmid, -per]], 5));
                ptlist.push(div([[wid * 0.5, 0], [bmid, -per]], 5));
            }
            ptlist.push(div([[bmid, -hei], [bmid, -per]], 5));
        }

        var surf = (rot < 0.5) * 2 - 1;
        ptlist = ptlist.concat(
            dec({
                pul: [surf * wid * 0.5, -hei],
                pur: [mid, -hei + per],
                pdl: [surf * wid * 0.5, 0],
                pdr: [mid, per],
            })
        );

        var group = PaperRenderer.createGroup();

        // Create box face if not transparent
        if (!tra) {
            var polist = [
                [-wid * 0.5, -hei],
                [wid * 0.5, -hei],
                [wid * 0.5, 0],
                [mid, per],
                [-wid * 0.5, 0],
            ];
            var face = PaperRenderer.createPolygon(polist, {
                xof: xoff,
                yof: yoff,
                str: "none",
                fil: "white"
            });
            group.addChild(face);
        }

        // Create box structure lines
        for (var i = 0; i < ptlist.length; i++) {
            var line = StrokeRenderer.createVariableStroke(ptlist[i], {
                xof: xoff,
                yof: yoff,
                col: "rgba(100,100,100,0.4)",
                noi: 1,
                wid: wei,
                fun: function(x) {
                    return 1;
                },
                context: 'architecture'
            });
            group.addChild(line);
        }
        
        return group;
    };

    // Helper function for decorative elements
    var deco = function(style, args) {
        var args = args != undefined ? args : {};
        var pul = args.pul != undefined ? args.pul : [0, 0];
        var pur = args.pur != undefined ? args.pur : [0, 100];
        var pdl = args.pdl != undefined ? args.pdl : [100, 0];
        var pdr = args.pdr != undefined ? args.pdr : [100, 100];
        var hsp = args.hsp != undefined ? args.hsp : [1, 3];
        var vsp = args.vsp != undefined ? args.vsp : [1, 2];

        var plist = [];
        var dl = div([pul, pdl], vsp[1]);
        var dr = div([pur, pdr], vsp[1]);
        var du = div([pul, pur], hsp[1]);
        var dd = div([pdl, pdr], hsp[1]);

        if (style == 1) {
            //-| |-
            var mlu = du[hsp[0]];
            var mru = du[du.length - 1 - hsp[0]];
            var mld = dd[hsp[0]];
            var mrd = dd[du.length - 1 - hsp[0]];

            for (var i = vsp[0]; i < dl.length - vsp[0]; i += vsp[0]) {
                var mml = div([mlu, mld], vsp[1])[i];
                var mmr = div([mru, mrd], vsp[1])[i];
                var ml = dl[i];
                var mr = dr[i];
                plist.push(div([mml, ml], 5));
                plist.push(div([mmr, mr], 5));
            }
            plist.push(div([mlu, mld], 5));
            plist.push(div([mru, mrd], 5));
        } else if (style == 2) {
            //||||
            for (var i = hsp[0]; i < du.length - hsp[0]; i += hsp[0]) {
                var mu = du[i];
                var md = dd[i];
                plist.push(div([mu, md], 5));
            }
        } else if (style == 3) {
            //|##|
            var mlu = du[hsp[0]];
            var mru = du[du.length - 1 - hsp[0]];
            var mld = dd[hsp[0]];
            var mrd = dd[du.length - 1 - hsp[0]];

            for (var i = vsp[0]; i < dl.length - vsp[0]; i += vsp[0]) {
                var mml = div([mlu, mld], vsp[1])[i];
                var mmr = div([mru, mrd], vsp[1])[i];
                var mmu = div([mlu, mru], vsp[1])[i];
                var mmd = div([mld, mrd], vsp[1])[i];

                var ml = dl[i];
                var mr = dr[i];
                plist.push(div([mml, mmr], 5));
                plist.push(div([mmu, mmd], 5));
            }
            plist.push(div([mlu, mld], 5));
            plist.push(div([mru, mrd], 5));
        }
        return plist;
    }; 
   // Helper function for railings using Paper.js
    var rail = function(xoff, yoff, seed, args) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 20;
        var wid = args.wid != undefined ? args.wid : 180;
        var rot = args.rot != undefined ? args.rot : 0.7;
        var per = args.per != undefined ? args.per : 4;
        var seg = args.seg != undefined ? args.seg : 4;
        var wei = args.wei != undefined ? args.wei : 1;
        var tra = args.tra != undefined ? args.tra : true;
        var fro = args.fro != undefined ? args.fro : true;

        seed = seed != undefined ? seed : 0;

        var mid = -wid * 0.5 + wid * rot;
        var bmid = -wid * 0.5 + wid * (1 - rot);
        var ptlist = [];

        // Generate railing structure
        if (fro) {
            ptlist.push(div([[-wid * 0.5, 0], [mid, per]], seg));
            ptlist.push(div([[mid, per], [wid * 0.5, 0]], seg));
        }
        if (tra) {
            ptlist.push(div([[-wid * 0.5, 0], [bmid, -per]], seg));
            ptlist.push(div([[bmid, -per], [wid * 0.5, 0]], seg));
        }
        if (fro) {
            ptlist.push(div([[-wid * 0.5, -hei], [mid, -hei + per]], seg));
            ptlist.push(div([[mid, -hei + per], [wid * 0.5, -hei]], seg));
        }
        if (tra) {
            ptlist.push(div([[-wid * 0.5, -hei], [bmid, -hei - per]], seg));
            ptlist.push(div([[bmid, -hei - per], [wid * 0.5, -hei]], seg));
        }
        
        // Create opening in transparent section
        if (tra) {
            var open = Math.floor(Math.random() * ptlist.length);
            ptlist[open] = ptlist[open].slice(0, -1);
            ptlist[(open + ptlist.length) % ptlist.length] = ptlist[
                (open + ptlist.length) % ptlist.length
            ].slice(0, -1);
        }

        var group = PaperRenderer.createGroup();

        // Add noise variation and create vertical connections
        for (var i = 0; i < ptlist.length / 2; i++) {
            for (var j = 0; j < ptlist[i].length; j++) {
                ptlist[i][j][1] += (Noise.noise(i, j * 0.5, seed) - 0.5) * hei;
                ptlist[(ptlist.length / 2 + i) % ptlist.length][
                    j % ptlist[(ptlist.length / 2 + i) % ptlist.length].length
                ][1] += (Noise.noise(i + 0.5, j * 0.5, seed) - 0.5) * hei;
                
                var ln = div(
                    [
                        ptlist[i][j],
                        ptlist[(ptlist.length / 2 + i) % ptlist.length][
                            j % ptlist[(ptlist.length / 2 + i) % ptlist.length].length
                        ],
                    ],
                    2
                );
                ln[0][0] += (Math.random() - 0.5) * hei * 0.5;
                
                var connection = PaperRenderer.createPath(ln, {
                    xof: xoff,
                    yof: yoff,
                    fil: "none",
                    str: "rgba(100,100,100,0.5)",
                    wid: 2
                });
                group.addChild(connection);
            }
        }

        // Create main railing lines
        for (var i = 0; i < ptlist.length; i++) {
            var railLine = StrokeRenderer.createVariableStroke(ptlist[i], {
                xof: xoff,
                yof: yoff,
                col: "rgba(100,100,100,0.5)",
                noi: 0.5,
                wid: wei,
                fun: function(x) {
                    return 1;
                },
                context: 'architecture'
            });
            group.addChild(railLine);
        }
        
        return group;
    };

    // Helper function for traditional roofs using Paper.js
    var roof = function(xoff, yoff, args) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 20;
        var wid = args.wid != undefined ? args.wid : 120;
        var rot = args.rot != undefined ? args.rot : 0.7;
        var per = args.per != undefined ? args.per : 4;
        var cor = args.cor != undefined ? args.cor : 5;
        var wei = args.wei != undefined ? args.wei : 3;
        var pla = args.pla != undefined ? args.pla : [0, ""];

        var opf = function(ptlist) {
            if (rot < 0.5) {
                return flip(ptlist);
            } else {
                return ptlist;
            }
        };
        var rrot = rot < 0.5 ? 1 - rot : rot;

        var mid = -wid * 0.5 + wid * rrot;
        var bmid = -wid * 0.5 + wid * (1 - rrot);
        var quat = (mid + wid * 0.5) * 0.5 - mid;

        var ptlist = [];
        ptlist.push(
            div(
                opf([
                    [-wid * 0.5 + quat, -hei - per / 2],
                    [-wid * 0.5 + quat * 0.5, -hei / 2 - per / 4],
                    [-wid * 0.5 - cor, 0],
                ]),
                5
            )
        );
        ptlist.push(
            div(
                opf([
                    [mid + quat, -hei],
                    [(mid + quat + wid * 0.5) / 2, -hei / 2],
                    [wid * 0.5 + cor, 0],
                ]),
                5
            )
        );
        ptlist.push(
            div(
                opf([
                    [mid + quat, -hei],
                    [mid + quat / 2, -hei / 2 + per / 2],
                    [mid + cor, per],
                ]),
                5
            )
        );

        ptlist.push(div(opf([[-wid * 0.5 - cor, 0], [mid + cor, per]]), 5));
        ptlist.push(div(opf([[wid * 0.5 + cor, 0], [mid + cor, per]]), 5));
        ptlist.push(
            div(opf([[-wid * 0.5 + quat, -hei - per / 2], [mid + quat, -hei]]), 5)
        );

        var group = PaperRenderer.createGroup();

        // Create roof face
        var polist = opf([
            [-wid * 0.5, 0],
            [-wid * 0.5 + quat, -hei - per / 2],
            [mid + quat, -hei],
            [wid * 0.5, 0],
            [mid, per],
        ]);
        var roofFace = PaperRenderer.createPolygon(polist, {
            xof: xoff,
            yof: yoff,
            str: "none",
            fil: "white"
        });
        group.addChild(roofFace);

        // Create roof structure lines
        for (var i = 0; i < ptlist.length; i++) {
            var roofLine = StrokeRenderer.createVariableStroke(ptlist[i], {
                xof: xoff,
                yof: yoff,
                col: "rgba(100,100,100,0.4)",
                noi: 1,
                wid: wei,
                fun: function(x) {
                    return 1;
                },
                context: 'architecture'
            });
            group.addChild(roofLine);
        }

        // Add text plaque if specified
        if (pla[0] == 1) {
            var pp = opf([
                [mid + quat / 2, -hei / 2 + per / 2],
                [-wid * 0.5 + quat * 0.5, -hei / 2 - per / 4],
            ]);
            if (pp[0][0] > pp[1][0]) {
                pp = [pp[1], pp[0]];
            }
            var mp = PolyTools.midPt(pp);
            var a = Math.atan2(pp[1][1] - pp[0][1], pp[1][0] - pp[0][0]);
            var adeg = (a * 180) / Math.PI;
            
            // Create text using Paper.js PointText
            var text = new paper.PointText({
                point: [mp[0] + xoff, mp[1] + yoff],
                content: pla[1],
                fillColor: 'rgba(100,100,100,0.9)',
                fontSize: hei * 0.6,
                fontFamily: 'Verdana',
                justification: 'center'
            });
            text.rotate(adeg);
            group.addChild(text);
        }
        
        return group;
    };

    // Helper function for pagoda-style roofs using Paper.js
    var pagroof = function(xoff, yoff, args) {
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 20;
        var wid = args.wid != undefined ? args.wid : 120;
        var rot = args.rot != undefined ? args.rot : 0.7;
        var per = args.per != undefined ? args.per : 4;
        var cor = args.cor != undefined ? args.cor : 10;
        var sid = args.sid != undefined ? args.sid : 4;
        var wei = args.wei != undefined ? args.wei : 3;

        var ptlist = [];
        var polist = [[0, -hei]];
        var group = PaperRenderer.createGroup();
        
        // Generate pagoda roof structure
        for (var i = 0; i < sid; i++) {
            var fx = wid * ((i * 1.0) / (sid - 1) - 0.5);
            var fy = per * (1 - Math.abs((i * 1.0) / (sid - 1) - 0.5) * 2);
            var fxx = (wid + cor) * ((i * 1.0) / (sid - 1) - 0.5);
            if (i > 0) {
                ptlist.push([ptlist[ptlist.length - 1][2], [fxx, fy]]);
            }
            ptlist.push([[0, -hei], [fx * 0.5, (-hei + fy) * 0.5], [fxx, fy]]);
            polist.push([fxx, fy]);
        }

        // Create pagoda roof face
        var roofFace = PaperRenderer.createPolygon(polist, {
            xof: xoff,
            yof: yoff,
            str: "none",
            fil: "white"
        });
        group.addChild(roofFace);
        
        // Create pagoda roof structure lines
        for (var i = 0; i < ptlist.length; i++) {
            var roofLine = StrokeRenderer.createVariableStroke(div(ptlist[i], 5), {
                xof: xoff,
                yof: yoff,
                col: "rgba(100,100,100,0.4)",
                noi: 1,
                wid: wei,
                fun: function(x) {
                    return 1;
                },
                context: 'architecture'
            });
            group.addChild(roofLine);
        }

        return group;
    }; 
   /**
     * Generate simple buildings with traditional roofs and optional human figures
     * @param {number} xoff - X offset position
     * @param {number} yoff - Y offset position  
     * @param {number} seed - Random seed for deterministic generation
     * @param {Object} args - Configuration options
     * @param {number} args.hei - Building height (default: 70)
     * @param {number} args.wid - Building width (default: 180)
     * @param {number} args.rot - Rotation factor (default: 0.7)
     * @param {number} args.per - Perspective factor (default: 5)
     * @returns {paper.Group} Paper.js Group containing the building
     */
    this.arch01 = function(xoff, yoff, seed, args) {
        // Check if buildings are enabled via element toggles
        var toggles = typeof getElementToggles === 'function' ? getElementToggles() : 
                     (typeof ELEMENT_TOGGLES !== 'undefined' ? ELEMENT_TOGGLES : {buildings: true});
        if (!toggles.buildings) {
            return PaperRenderer.createGroup(); // Return empty group if buildings are disabled
        }
        
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 70;
        var wid = args.wid != undefined ? args.wid : 180;
        var rot = args.rot != undefined ? args.rot : 0.7;
        var per = args.per != undefined ? args.per : 5;

        seed = seed != undefined ? seed : 0;

        var p = 0.4 + Math.random() * 0.2;
        var h0 = hei * p;
        var h1 = hei * (1 - p);

        var group = PaperRenderer.createGroup();
        
        // Create hut structure
        var hutStructure = hut(xoff, yoff - hei, { hei: h0, wid: wid });
        group.addChild(hutStructure);
        
        // Create box structure
        var boxStructure = box(xoff, yoff, {
            hei: h1,
            wid: (wid * 2) / 3,
            per: per,
            bot: false,
        });
        group.addChild(boxStructure);

        // Create back railing
        var backRail = rail(xoff, yoff, seed, {
            tra: true,
            fro: false,
            hei: 10,
            wid: wid,
            per: per * 2,
            seg: (3 + Math.random() * 3) | 0,
        });
        group.addChild(backRail);

        // Add human figures if enabled
        if (typeof Man !== 'undefined') {
            var mcnt = randChoice([0, 1, 1, 2]);
            if (mcnt == 1) {
                var figure1 = Man.man(xoff + normRand(-wid / 3, wid / 3), yoff, {
                    fli: randChoice([true, false]),
                    sca: 0.42,
                });
                if (figure1 && figure1.addChild) {
                    group.addChild(figure1);
                }
            } else if (mcnt == 2) {
                var figure2 = Man.man(xoff + normRand(-wid / 4, -wid / 5), yoff, {
                    fli: false,
                    sca: 0.42,
                });
                var figure3 = Man.man(xoff + normRand(wid / 5, wid / 4), yoff, {
                    fli: true,
                    sca: 0.42,
                });
                if (figure2 && figure2.addChild) group.addChild(figure2);
                if (figure3 && figure3.addChild) group.addChild(figure3);
            }
        }
        
        // Create front railing
        var frontRail = rail(xoff, yoff, seed, {
            tra: false,
            fro: true,
            hei: 10,
            wid: wid,
            per: per * 2,
            seg: (3 + Math.random() * 3) | 0,
        });
        group.addChild(frontRail);

        return group;
    };

    /**
     * Generate multi-story structures with customizable styles and railings
     * @param {number} xoff - X offset position
     * @param {number} yoff - Y offset position
     * @param {number} seed - Random seed for deterministic generation
     * @param {Object} args - Configuration options
     * @param {number} args.hei - Floor height (default: 10)
     * @param {number} args.wid - Building width (default: 50)
     * @param {number} args.rot - Rotation factor (default: 0.3)
     * @param {number} args.per - Perspective factor (default: 5)
     * @param {number} args.sto - Number of stories (default: 3)
     * @param {number} args.sty - Decoration style (default: 1)
     * @param {boolean} args.rai - Include railings (default: false)
     * @returns {paper.Group} Paper.js Group containing the building
     */
    this.arch02 = function(xoff, yoff, seed, args) {
        // Check if buildings are enabled via element toggles
        var toggles = typeof getElementToggles === 'function' ? getElementToggles() : 
                     (typeof ELEMENT_TOGGLES !== 'undefined' ? ELEMENT_TOGGLES : {buildings: true});
        if (!toggles.buildings) {
            return PaperRenderer.createGroup(); // Return empty group if buildings are disabled
        }
        
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 10;
        var wid = args.wid != undefined ? args.wid : 50;
        var rot = args.rot != undefined ? args.rot : 0.3;
        var per = args.per != undefined ? args.per : 5;
        var sto = args.sto != undefined ? args.sto : 3;
        var sty = args.sty != undefined ? args.sty : 1;
        var rai = args.rai != undefined ? args.rai : false;

        seed = seed != undefined ? seed : 0;
        var group = PaperRenderer.createGroup();

        var hoff = 0;
        for (var i = 0; i < sto; i++) {
            // Create box for each story
            var storyBox = box(xoff, yoff - hoff, {
                tra: false,
                hei: hei,
                wid: wid * Math.pow(0.85, i),
                rot: rot,
                wei: 1.5,
                per: per,
                dec: function(a) {
                    return deco(
                        sty,
                        Object.assign({}, a, {
                            hsp: [[], [1, 5], [1, 5], [1, 4]][sty],
                            vsp: [[], [1, 2], [1, 2], [1, 3]][sty],
                        })
                    );
                },
            });
            group.addChild(storyBox);
            
            // Add railing if requested
            if (rai) {
                var storyRail = rail(xoff, yoff - hoff, i * 0.2, {
                    wid: wid * Math.pow(0.85, i) * 1.1,
                    hei: hei / 2,
                    per: per,
                    rot: rot,
                    wei: 0.5,
                    tra: false,
                });
                group.addChild(storyRail);
            }
            
            // Add roof
            var pla = undefined;
            if (sto == 1 && Math.random() < 1 / 3) {
                pla = [1, "Pizza Hut"];
            }
            var storyRoof = roof(xoff, yoff - hoff - hei, {
                hei: hei,
                wid: wid * Math.pow(0.9, i),
                rot: rot,
                wei: 1.5,
                per: per,
                pla: pla,
            });
            group.addChild(storyRoof);

            hoff += hei * 1.5;
        }
        return group;
    };

    /**
     * Generate pagoda-style buildings with multiple levels and traditional roofs
     * @param {number} xoff - X offset position
     * @param {number} yoff - Y offset position
     * @param {number} seed - Random seed for deterministic generation
     * @param {Object} args - Configuration options
     * @param {number} args.hei - Floor height (default: 10)
     * @param {number} args.wid - Building width (default: 50)
     * @param {number} args.rot - Rotation factor (default: 0.7)
     * @param {number} args.per - Perspective factor (default: 5)
     * @param {number} args.sto - Number of stories (default: 7)
     * @returns {paper.Group} Paper.js Group containing the pagoda
     */
    this.arch03 = function(xoff, yoff, seed, args) {
        // Check if buildings are enabled via element toggles
        var toggles = typeof getElementToggles === 'function' ? getElementToggles() : 
                     (typeof ELEMENT_TOGGLES !== 'undefined' ? ELEMENT_TOGGLES : {buildings: true});
        if (!toggles.buildings) {
            return PaperRenderer.createGroup(); // Return empty group if buildings are disabled
        }
        
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 10;
        var wid = args.wid != undefined ? args.wid : 50;
        var rot = args.rot != undefined ? args.rot : 0.7;
        var per = args.per != undefined ? args.per : 5;
        var sto = args.sto != undefined ? args.sto : 7;

        seed = seed != undefined ? seed : 0;
        var group = PaperRenderer.createGroup();

        var hoff = 0;
        for (var i = 0; i < sto; i++) {
            // Create box for each story
            var storyBox = box(xoff, yoff - hoff, {
                tra: false,
                hei: hei,
                wid: wid * Math.pow(0.85, i),
                rot: rot,
                wei: 1.5,
                per: per / 2,
                dec: function(a) {
                    return deco(1, Object.assign({}, a, { hsp: [1, 4], vsp: [1, 2] }));
                },
            });
            group.addChild(storyBox);
            
            // Add railing
            var storyRail = rail(xoff, yoff - hoff, i * 0.2, {
                seg: 5,
                wid: wid * Math.pow(0.85, i) * 1.1,
                hei: hei / 2,
                per: per / 2,
                rot: rot,
                wei: 0.5,
                tra: false,
            });
            group.addChild(storyRail);
            
            // Add pagoda roof
            var storyRoof = pagroof(xoff, yoff - hoff - hei, {
                hei: hei * 1.5,
                wid: wid * Math.pow(0.9, i),
                rot: rot,
                wei: 1.5,
                per: per,
            });
            group.addChild(storyRoof);
            
            hoff += hei * 1.5;
        }
        return group;
    };

    /**
     * Generate complex architectural forms with transparent elements
     * @param {number} xoff - X offset position
     * @param {number} yoff - Y offset position
     * @param {number} seed - Random seed for deterministic generation
     * @param {Object} args - Configuration options
     * @param {number} args.hei - Floor height (default: 15)
     * @param {number} args.wid - Building width (default: 30)
     * @param {number} args.rot - Rotation factor (default: 0.7)
     * @param {number} args.per - Perspective factor (default: 5)
     * @param {number} args.sto - Number of stories (default: 2)
     * @returns {paper.Group} Paper.js Group containing the complex structure
     */
    this.arch04 = function(xoff, yoff, seed, args) {
        // Check if buildings are enabled via element toggles
        var toggles = typeof getElementToggles === 'function' ? getElementToggles() : 
                     (typeof ELEMENT_TOGGLES !== 'undefined' ? ELEMENT_TOGGLES : {buildings: true});
        if (!toggles.buildings) {
            return PaperRenderer.createGroup(); // Return empty group if buildings are disabled
        }
        
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 15;
        var wid = args.wid != undefined ? args.wid : 30;
        var rot = args.rot != undefined ? args.rot : 0.7;
        var per = args.per != undefined ? args.per : 5;
        var sto = args.sto != undefined ? args.sto : 2;

        seed = seed != undefined ? seed : 0;
        var group = PaperRenderer.createGroup();

        var hoff = 0;
        for (var i = 0; i < sto; i++) {
            // Create transparent box for each story
            var storyBox = box(xoff, yoff - hoff, {
                tra: true,
                hei: hei,
                wid: wid * Math.pow(0.85, i),
                rot: rot,
                wei: 1.5,
                per: per / 2,
                dec: function(a) {
                    return [];
                },
            });
            group.addChild(storyBox);
            
            // Add transparent railing
            var storyRail = rail(xoff, yoff - hoff, i * 0.2, {
                seg: 3,
                wid: wid * Math.pow(0.85, i) * 1.2,
                hei: hei / 3,
                per: per / 2,
                rot: rot,
                wei: 0.5,
                tra: true,
            });
            group.addChild(storyRail);
            
            // Add pagoda roof
            var storyRoof = pagroof(xoff, yoff - hoff - hei, {
                hei: hei * 1,
                wid: wid * Math.pow(0.9, i),
                rot: rot,
                wei: 1.5,
                per: per,
            });
            group.addChild(storyRoof);
            
            hoff += hei * 1.2;
        }
        return group;
    };    /**

     * Generate fishing boats with human figures
     * 
     * Creates traditional fishing boats with human figures using Paper.js rendering.
     * Automatically applies broken stroke effects when enabled via UI toggle, creating
     * authentic Chinese painting aesthetics where boat outlines appear hand-painted.
     * 
     * @param {number} xoff - X offset position
     * @param {number} yoff - Y offset position
     * @param {number} seed - Random seed for deterministic generation
     * @param {Object} args - Configuration options
     * @param {number} args.len - Boat length (default: 120)
     * @param {number} args.sca - Scale factor (default: 1)
     * @param {boolean} args.fli - Flip horizontally (default: false)
     * @returns {paper.Group} Paper.js Group containing the boat with figure (supports broken strokes)
     */
    this.boat01 = function(xoff, yoff, seed, args) {
        // Check if boats are enabled via element toggles
        var toggles = typeof getElementToggles === 'function' ? getElementToggles() : 
                     (typeof ELEMENT_TOGGLES !== 'undefined' ? ELEMENT_TOGGLES : {boats: true});
        if (!toggles.boats) {
            return PaperRenderer.createGroup(); // Return empty group if boats are disabled
        }
        
        var args = args != undefined ? args : {};
        var len = args.len != undefined ? args.len : 120;
        var sca = args.sca != undefined ? args.sca : 1;
        var fli = args.fli != undefined ? args.fli : false;
        
        var group = PaperRenderer.createGroup();
        var dir = fli ? -1 : 1;
        
        // Add human figure if Man module is available
        if (typeof Man !== 'undefined') {
            var figure = Man.man(xoff + 20 * sca * dir, yoff, {
                ite: Man.stick01,
                hat: Man.hat02,
                sca: 0.5 * sca,
                fli: !fli,
                len: [0, 30, 20, 30, 10, 30, 30, 30, 30],
            });
            if (figure && figure.addChild) {
                group.addChild(figure);
            }
        }

        // Generate boat hull points
        var plist1 = [];
        var plist2 = [];
        var fun1 = function(x) {
            return Math.pow(Math.sin(x * Math.PI), 0.5) * 7 * sca;
        };
        var fun2 = function(x) {
            return Math.pow(Math.sin(x * Math.PI), 0.5) * 10 * sca;
        };
        
        for (var i = 0; i < len * sca; i += 5 * sca) {
            plist1.push([i * dir, fun1(i / len)]);
            plist2.push([i * dir, fun2(i / len)]);
        }
        
        // Combine hull points to form boat shape
        var plist = plist1.concat(plist2.reverse());
        
        // Create boat hull body
        var boatHull = PaperRenderer.createPolygon(plist, {
            xof: xoff,
            yof: yoff,
            fil: "white"
        });
        group.addChild(boatHull);
        
        // Create boat hull outline with variable stroke
        var hullPoints = plist.map(function(v) {
            return [xoff + v[0], yoff + v[1]];
        });
        var boatOutline = StrokeRenderer.createVariableStroke(hullPoints, {
            wid: 1,
            fun: function(x) {
                return Math.sin(x * Math.PI * 2);
            },
            col: "rgba(100,100,100,0.4)",
            context: 'boats'
        });
        group.addChild(boatOutline);

        return group;
    };

    /**
     * Generate modern transmission tower structures
     * @param {number} xoff - X offset position
     * @param {number} yoff - Y offset position
     * @param {number} seed - Random seed for deterministic generation
     * @param {Object} args - Configuration options
     * @param {number} args.hei - Tower height (default: 100)
     * @param {number} args.wid - Tower width (default: 20)
     * @returns {paper.Group} Paper.js Group containing the transmission tower
     */
    this.transmissionTower01 = function(xoff, yoff, seed, args) {
        // Check if buildings are enabled via element toggles (transmission towers are considered buildings)
        var toggles = typeof getElementToggles === 'function' ? getElementToggles() : 
                     (typeof ELEMENT_TOGGLES !== 'undefined' ? ELEMENT_TOGGLES : {buildings: true});
        if (!toggles.buildings) {
            return PaperRenderer.createGroup(); // Return empty group if buildings are disabled
        }
        
        var args = args != undefined ? args : {};
        var hei = args.hei != undefined ? args.hei : 100;
        var wid = args.wid != undefined ? args.wid : 20;

        var group = PaperRenderer.createGroup();
        
        var quickstroke = function(pl) {
            return StrokeRenderer.createVariableStroke(pl, {
                xof: xoff,
                yof: yoff,
                wid: 1,
                fun: function(x) { return 0.5; },
                col: "rgba(100,100,100,0.4)",
                context: 'architecture'
            });
        };

        // Define tower structure points
        var p00 = [-wid * 0.05, -hei];
        var p01 = [wid * 0.05, -hei];
        var p10 = [-wid * 0.1, -hei * 0.9];
        var p11 = [wid * 0.1, -hei * 0.9];
        var p20 = [-wid * 0.2, -hei * 0.5];
        var p21 = [wid * 0.2, -hei * 0.5];
        var p30 = [-wid * 0.5, 0];
        var p31 = [wid * 0.5, 0];

        // Create horizontal braces
        var bch = [[0.7, -0.85], [1, -0.675], [0.7, -0.5]];
        for (var i = 0; i < bch.length; i++) {
            // Horizontal brace lines
            var hBrace = quickstroke([
                [-bch[i][0] * wid, bch[i][1] * hei],
                [bch[i][0] * wid, bch[i][1] * hei],
            ]);
            group.addChild(hBrace);
            
            // Left diagonal brace
            var leftDiag = quickstroke([
                [-bch[i][0] * wid, bch[i][1] * hei],
                [0, (bch[i][1] - 0.05) * hei],
            ]);
            group.addChild(leftDiag);
            
            // Right diagonal brace
            var rightDiag = quickstroke([
                [bch[i][0] * wid, bch[i][1] * hei],
                [0, (bch[i][1] - 0.05) * hei],
            ]);
            group.addChild(rightDiag);

            // Vertical extensions
            var leftVert = quickstroke([
                [-bch[i][0] * wid, bch[i][1] * hei],
                [-bch[i][0] * wid, (bch[i][1] + 0.1) * hei],
            ]);
            group.addChild(leftVert);
            
            var rightVert = quickstroke([
                [bch[i][0] * wid, bch[i][1] * hei],
                [bch[i][0] * wid, (bch[i][1] + 0.1) * hei],
            ]);
            group.addChild(rightVert);
        }

        // Create cross braces
        var l10 = div([p00, p10, p20, p30], 5);
        var l11 = div([p01, p11, p21, p31], 5);

        for (var i = 0; i < l10.length - 1; i++) {
            var crossBrace1 = quickstroke([l10[i], l11[i + 1]]);
            group.addChild(crossBrace1);
            
            var crossBrace2 = quickstroke([l11[i], l10[i + 1]]);
            group.addChild(crossBrace2);
        }

        // Create main tower structure
        var topBeam = quickstroke([p00, p01]);
        group.addChild(topBeam);
        
        var midBeam1 = quickstroke([p10, p11]);
        group.addChild(midBeam1);
        
        var midBeam2 = quickstroke([p20, p21]);
        group.addChild(midBeam2);
        
        var leftLeg = quickstroke([p00, p10, p20, p30]);
        group.addChild(leftLeg);
        
        var rightLeg = quickstroke([p01, p11, p21, p31]);
        group.addChild(rightLeg);

        return group;
    };

}();