# PolyTools Module

## Overview

The PolyTools module provides geometric operations for polygon manipulation and triangulation. It contains essential geometric functions used throughout the system for processing complex shapes and converting them into renderable triangles.

## Key Features

- **Midpoint Calculation**: Compute centroids of multiple points
- **Polygon Triangulation**: Break complex polygons into triangles
- **Ear Clipping Algorithm**: Efficient triangulation with quality optimization
- **Convex/Concave Support**: Handles both convex and concave polygons

## API

### PolyTools.midPt(points)
Calculate the midpoint (centroid) of multiple points.
- `points` (Array|...Array): Either array of points or multiple point arguments
- Returns: Midpoint coordinates [x, y]

### PolyTools.triangulate(plist, args)
Triangulate a polygon into smaller triangles.
- `plist` (Array): Array of points defining the polygon
- `args` (Object, optional): Triangulation options
  - `area` (number): Maximum area for resulting triangles (default: 100)
  - `convex` (boolean): Whether to assume convex polygon (default: false)
  - `optimize` (boolean): Whether to optimize triangle quality (default: true)
- Returns: Array of triangles, each triangle is an array of 3 points

## Usage Examples

```javascript
// Calculate midpoint of multiple points
var center = PolyTools.midPt([0,0], [10,0], [5,10]);
// Result: [5, 3.33]

// Or pass as array
var points = [[0,0], [10,0], [10,10], [0,10]];
var center = PolyTools.midPt(points);

// Triangulate a complex polygon
var polygon = [[0,0], [10,0], [15,5], [10,10], [0,10]];
var triangles = PolyTools.triangulate(polygon, {
  area: 50,        // Smaller triangles
  optimize: true   // Better quality triangles
});

// Each triangle is an array of 3 points
triangles.forEach(function(triangle) {
  console.log('Triangle:', triangle); // [[x1,y1], [x2,y2], [x3,y3]]
});
```

## Triangulation Algorithm

The module uses an ear clipping algorithm with the following features:

1. **Ear Detection**: Identifies valid triangulation cuts
2. **Quality Optimization**: Prefers triangles with better aspect ratios
3. **Area Control**: Subdivides large triangles to meet size constraints
4. **Convex Optimization**: Faster processing for convex polygons

## Dependencies

- prng.js (for random choices in optimization)

## Used By

- rendering.js (texture generation, complex shape rendering)
- trees.js (leaf shape triangulation)
- mountains.js (terrain surface triangulation)
- architecture.js (building surface processing)
- figures.js (character shape processing)