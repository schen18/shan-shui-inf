# Rendering Module

## Overview

The Rendering module provides SVG generation functions for creating visual elements in the Shan Shui system. It handles the conversion of geometric data into SVG markup for display in the browser.

## Key Features

- **SVG Generation**: Create polygons, strokes, and complex shapes
- **Variable Width Strokes**: Dynamic line width with noise variation
- **Broken Stroke Effects**: Traditional Chinese painting aesthetics with brush lifting simulation
- **Organic Shapes**: Blob generation with natural-looking curves
- **Surface Textures**: Procedural texture pattern generation
- **Customizable Styling**: Flexible color, width, and effect options
- **Global Style Control**: Automatic broken stroke detection from UI settings

## API

### Core Rendering Functions

#### poly(plist, args)
Generate SVG polygon from point list.
- `plist` (Array): Array of points [x, y]
- `args` (Object, optional): Rendering options
  - `xof`, `yof` (number): X/Y offset (default: 0)
  - `fil` (string): Fill color (default: "rgba(0,0,0,0)")
  - `str` (string): Stroke color (default: same as fill)
  - `wid` (number): Stroke width (default: 0)
- Returns: SVG polyline element string

#### stroke(ptlist, args)
Generate SVG stroke with variable width and noise.

Automatically detects global broken stroke setting from UI checkbox. When enabled, creates traditional Chinese painting effects by splitting strokes into segments with natural gaps, simulating brush lifting from paper.

- `ptlist` (Array): Array of points defining the path
- `args` (Object, optional): Stroke options
  - `xof`, `yof` (number): X/Y offset (default: 0)
  - `wid` (number): Base width (default: 2)
  - `col` (string): Color (default: "rgba(200,200,200,0.9)")
  - `noi` (number): Noise factor (default: 0.5)
  - `out` (number): Outline width (default: 1)
  - `fun` (Function): Width function (default: sine wave)
  - `broken` (boolean): Enable broken stroke effect (default: auto-detect from UI)
  - `breakProb` (number): Probability of breaks (default: 0.2)
  - `minSegLen` (number): Minimum segment length (default: 4)
  - `maxSegLen` (number): Maximum segment length (default: 15)
- Returns: SVG polygon representing the stroke (continuous or broken)

### Shape Generation

#### blob(x, y, args)
Generate organic blob shape.
- `x`, `y` (number): Center coordinates
- `args` (Object, optional): Blob options
  - `len` (number): Length (default: 20)
  - `wid` (number): Width (default: 5)
  - `ang` (number): Rotation angle (default: 0)
  - `col` (string): Color (default: "rgba(200,200,200,0.9)")
  - `noi` (number): Noise factor (default: 0.5)
  - `ret` (number): Return mode: 0=SVG, 1=points (default: 0)
  - `fun` (Function): Shape function
- Returns: SVG polygon string or point array

#### texture(ptlist, args)
Generate surface texture pattern.

Creates natural surface textures using multiple stroke lines. Automatically applies broken stroke effects when enabled via UI toggle, creating traditional painting aesthetics for mountain surfaces and terrain details.

- `ptlist` (Array): 2D array of points defining surface
- `args` (Object, optional): Texture options
  - `xof`, `yof` (number): X/Y offset (default: 0)
  - `tex` (number): Number of texture lines (default: 400)
  - `wid` (number): Line width (default: 1.5)
  - `len` (number): Line length factor (default: 0.2)
  - `sha` (number): Shadow width (default: 0)
  - `ret` (number): Return mode: 0=SVG, 1=points (default: 0)
  - `broken` (boolean): Enable broken stroke effect (default: auto-detect from UI)
  - `noi`, `col`, `dis` (Function): Noise, color, and distribution functions
- Returns: SVG texture string or texture point arrays

## Broken Stroke Effects

### Overview
The broken stroke feature simulates traditional Chinese painting techniques where the brush is lifted from paper, creating natural interruptions in lines. This effect is automatically applied when enabled via the global UI checkbox.

### How It Works
1. **Global Detection**: Functions automatically check for the `BROKEN_STROKES` checkbox
2. **Path Segmentation**: Long paths are split into random-length segments
3. **Gap Creation**: Natural gaps are inserted between segments
4. **Recursive Prevention**: Prevents infinite loops during segment rendering

### Affected Elements
- **Mountains**: Terrain outlines and surface textures
- **Water**: Wave patterns and ripple effects  
- **Boats**: Hull outlines and structural details
- **Architecture**: Building edges and decorative elements

### Configuration
Broken stroke behavior can be controlled via parameters:
- `breakProb`: Probability of creating gaps (0.0-1.0)
- `minSegLen`: Minimum points per segment
- `maxSegLen`: Maximum points per segment

### Traditional Aesthetics
When enabled, creates authentic Chinese landscape painting effects:
- Natural brush lifting simulation
- Organic, hand-painted appearance
- Consistent style across all elements
- Maintains visual harmony with traditional techniques

## Usage Examples

```javascript
// Create a simple polygon
var points = [[0,0], [100,0], [100,100], [0,100]];
var square = poly(points, {
  fil: "rgba(255,0,0,0.5)",
  str: "black",
  wid: 2
});

// Create a variable-width stroke (automatically uses broken strokes if UI enabled)
var path = [[0,50], [50,25], [100,75], [150,50]];
var brush = stroke(path, {
  wid: 10,
  col: "rgba(0,0,255,0.7)",
  noi: 0.8,
  fun: function(x) { return Math.sin(x * Math.PI); }
});

// Explicitly enable broken strokes for a specific stroke
var brokenBrush = stroke(path, {
  wid: 8,
  col: "rgba(100,100,100,0.8)",
  broken: true,
  breakProb: 0.3,
  minSegLen: 3,
  maxSegLen: 10
});

// Generate an organic blob
var leaf = blob(50, 50, {
  len: 40,
  wid: 20,
  ang: Math.PI / 4,
  col: "rgba(0,128,0,0.8)",
  noi: 0.6
});

// Create surface texture
var surface = [
  [[0,0], [50,0], [100,0]],
  [[0,25], [50,20], [100,25]],
  [[0,50], [50,45], [100,50]]
];
var textured = texture(surface, {
  tex: 100,
  wid: 1,
  col: function(x) { return "rgba(100,100,100," + (0.2 + x * 0.3) + ")"; }
});
```

## Rendering Pipeline

1. **Geometric Processing**: Convert mathematical data to point arrays
2. **Noise Application**: Add natural variation using Perlin noise
3. **SVG Generation**: Create SVG markup with proper styling
4. **Optimization**: Minimize redundant elements and optimize performance

## Dependencies

- utils.js (mathematical operations, interpolation)
- noise.js (natural variation in shapes and textures)
- polytools.js (geometric operations)

## Used By

- trees.js (tree shapes, bark textures, leaf generation)
- mountains.js (terrain surfaces, rock textures)
- architecture.js (building elements, structural details)
- figures.js (character outlines, clothing)
- water.js (water surface effects)