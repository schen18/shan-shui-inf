# Trees Module

## Overview

The Trees module contains all tree generation algorithms for the Shan Shui landscape generator. It provides eight different tree types with various visual characteristics and styles, from simple line trees to complex fractal structures.

## Key Features

- **Eight Tree Types**: Diverse visual styles for different landscape needs
- **Procedural Generation**: Each tree is unique while maintaining style consistency
- **Configurable Parameters**: Height, width, color, and style options
- **Natural Variation**: Uses noise and randomization for organic appearance
- **Modular Design**: Helper functions for branches, twigs, and bark effects

## API

### Tree Generation Functions

#### Tree.tree01(x, y, args)
Simple line trees with leaves - dual trunk lines and scattered leaf blobs.
- `x`, `y` (number): Position coordinates
- `args` (Object, optional): Configuration options
  - `hei` (number): Height of tree (default: 50)
  - `wid` (number): Width of trunk (default: 3)
  - `col` (string): Color in rgba format (default: "rgba(100,100,100,0.5)")
  - `noi` (number): Noise factor (default: 0.5)

#### Tree.tree02(x, y, args)
Clustered blob trees - composed of multiple organic blob shapes.
- `x`, `y` (number): Position coordinates
- `args` (Object, optional): Configuration options
  - `hei` (number): Height of tree (default: 16)
  - `wid` (number): Width of tree (default: 8)
  - `clu` (number): Number of clusters (default: 5)
  - `col` (string): Color in rgba format
  - `noi` (number): Noise factor

#### Tree.tree03(x, y, args)
Bent trees with detailed foliage - curved trunks and detailed leaf placement.
- `x`, `y` (number): Position coordinates
- `args` (Object, optional): Configuration options
  - `hei` (number): Height of tree (default: 50)
  - `wid` (number): Width of trunk (default: 5)
  - `ben` (Function): Bending function (default: returns 0)
  - `col` (string): Color in rgba format
  - `noi` (number): Noise factor

#### Tree.tree04(x, y, args)
Complex branching trees with bark - detailed trees with branching structure and bark texture.
- `x`, `y` (number): Position coordinates
- `args` (Object, optional): Configuration options
  - `hei` (number): Height of tree (default: 300)
  - `wid` (number): Width of trunk (default: 6)
  - `col` (string): Color in rgba format
  - `noi` (number): Noise factor

#### Tree.tree05(x, y, args)
Drooping branch trees - trees with drooping branches and sparse foliage.

#### Tree.tree06(x, y, args)
Fractal trees - trees with recursive fractal branching patterns.

#### Tree.tree07(x, y, args)
Triangulated trees - trees using triangulation for geometric, faceted appearance.

#### Tree.tree08(x, y, args)
Minimalist line trees - simple, elegant trees with minimal branching and clean lines.

## Usage Examples

```javascript
// Create a simple line tree
var simpleTree = Tree.tree01(100, 200, {
  hei: 80,
  wid: 4,
  col: "rgba(139,69,19,0.8)"
});

// Generate a cluster of blob trees
var blobTree = Tree.tree02(200, 200, {
  hei: 25,
  wid: 12,
  clu: 7,
  col: "rgba(34,139,34,0.7)"
});

// Create a bent tree with custom bending
var bentTree = Tree.tree03(300, 200, {
  hei: 120,
  ben: function(x) { return Math.sin(x * Math.PI) * 0.3; },
  col: "rgba(160,82,45,0.6)"
});

// Generate a complex tree with full detail
var complexTree = Tree.tree04(400, 200, {
  hei: 250,
  wid: 8,
  col: "rgba(101,67,33,0.8)"
});
```

## Tree Characteristics

| Tree Type | Style | Complexity | Best Use Case |
|-----------|-------|------------|---------------|
| tree01 | Simple lines + leaves | Low | Background vegetation |
| tree02 | Organic blobs | Low | Stylized forests |
| tree03 | Bent with foliage | Medium | Foreground trees |
| tree04 | Detailed branching | High | Hero trees |
| tree05 | Drooping branches | High | Willow-like trees |
| tree06 | Fractal | High | Mathematical forests |
| tree07 | Triangulated | Medium | Geometric style |
| tree08 | Minimalist | Low | Clean, modern look |

## Helper Functions

The module includes several internal helper functions:

- **branch()**: Generates basic branching structure
- **twig()**: Creates small branch details and leaves
- **barkify()**: Adds bark texture to tree trunks

## Dependencies

- rendering.js (SVG generation, shape creation)
- utils.js (mathematical operations, random functions)
- noise.js (natural variation)
- prng.js (deterministic randomization)

## Used By

- mountains.js (vegetation on terrain)
- main.js (landscape element generation)