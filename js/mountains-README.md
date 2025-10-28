# Mountains Module

## Overview

The Mountains module generates various types of mountains, rocks, and terrain features for the Shan Shui landscape system. It creates the primary landscape elements including main mountains with vegetation, flat-topped mountains, distant mountain silhouettes, and individual rocks.

## Key Features

- **Multiple Mountain Types**: Main mountains, flat mountains, distant mountains, rocks
- **Integrated Vegetation**: Automatic tree and plant placement on terrain
- **Architectural Elements**: Buildings and structures integrated into landscapes
- **Procedural Texturing**: Surface details and material variation
- **Layered Rendering**: Proper depth sorting for realistic appearance

## API

### Mountain Generation Functions

#### Mount.mountain(xoff, yoff, seed, args)
Generate main mountain with vegetation and architectural elements.
- `xoff`, `yoff` (number): Position coordinates
- `seed` (number): Random seed for generation
- `args` (Object, optional): Configuration options
  - `hei` (number): Height (default: 100 + random * 400)
  - `wid` (number): Width (default: 400 + random * 200)
  - `tex` (number): Texture density (default: 200)
  - `veg` (boolean): Include vegetation (default: true)
  - `ret` (number): Return mode (default: 0)
  - `col` (string): Color override

#### Mount.flatMount(xoff, yoff, seed, args)
Generate flat-topped mountain with decorative elements.
- `xoff`, `yoff` (number): Position coordinates
- `seed` (number): Random seed for generation
- `args` (Object, optional): Configuration options
  - `hei` (number): Height (default: 40 + random * 400)
  - `wid` (number): Width (default: 400 + random * 200)
  - `tex` (number): Texture density (default: 80)
  - `cho` (number): Chop factor for flat top (default: 0.5)
  - `ret` (number): Return mode (default: 0)

#### Mount.distMount(xoff, yoff, seed, args)
Generate distant mountain silhouettes.
- `xoff`, `yoff` (number): Position coordinates
- `seed` (number): Random seed for generation
- `args` (Object, optional): Configuration options
  - `hei` (number): Height (default: 300)
  - `len` (number): Length (default: 2000)
  - `seg` (number): Segments (default: 5)

#### Mount.rock(xoff, yoff, seed, args)
Generate individual rocks and boulders.
- `xoff`, `yoff` (number): Position coordinates
- `seed` (number): Random seed for generation
- `args` (Object, optional): Configuration options
  - `hei` (number): Height (default: 80)
  - `wid` (number): Width (default: 100)
  - `tex` (number): Texture density (default: 40)
  - `sha` (number): Shadow width (default: 10)
  - `ret` (number): Return mode (default: 0)

### Utility Functions

#### Mount.flatDec(xoff, yoff, grbd)
Generate decorative elements for flat mountains.
- `xoff`, `yoff` (number): Position coordinates
- `grbd` (Object): Boundary object with xmin, xmax, ymin, ymax

## Usage Examples

```javascript
// Generate a main mountain with vegetation
var mainMountain = Mount.mountain(500, 400, 12345, {
  hei: 300,
  wid: 600,
  veg: true,
  tex: 250
});

// Create a flat-topped mountain
var flatMountain = Mount.flatMount(1000, 400, 67890, {
  hei: 150,
  wid: 500,
  cho: 0.6
});

// Generate distant mountain range
var distantRange = Mount.distMount(0, 300, 11111, {
  hei: 200,
  len: 1500,
  seg: 8
});

// Place individual rocks
var boulder = Mount.rock(300, 450, 22222, {
  hei: 60,
  wid: 80,
  sha: 15
});
```

## Mountain Features

### Main Mountains (Mount.mountain)
- **Vegetation Layers**: Rim, top, middle, and bottom vegetation zones
- **Architecture Integration**: Buildings, pagodas, transmission towers
- **Rock Placement**: Natural boulder distribution
- **Texture Variation**: Procedural surface details

### Flat Mountains (Mount.flatMount)
- **Plateau Surfaces**: Flat-topped mountain profiles
- **Decorative Elements**: Trees, rocks, and occasional buildings
- **Edge Details**: Natural cliff and slope generation
- **Style Variations**: Multiple decoration patterns

### Distant Mountains (Mount.distMount)
- **Atmospheric Perspective**: Lighter colors for distance effect
- **Simplified Geometry**: Optimized for background elements
- **Triangulated Rendering**: Efficient polygon generation
- **Seamless Tiling**: Continuous mountain ranges

### Rocks (Mount.rock)
- **Natural Shapes**: Organic boulder profiles
- **Surface Texturing**: Detailed rock surface patterns
- **Shadow Effects**: Optional shadow rendering
- **Size Variation**: Configurable dimensions

## Vegetation Integration

The mountain module automatically places vegetation using sophisticated rules:

1. **Growth Rules**: Determine where vegetation can grow based on terrain
2. **Proof Rules**: Validate placement to avoid overcrowding
3. **Species Selection**: Choose appropriate tree types for location
4. **Density Control**: Manage vegetation density for realistic appearance

## Dependencies

- prng.js, noise.js, polytools.js, utils.js, rendering.js (core functionality)
- trees.js (vegetation generation)
- architecture.js (building placement)
- figures.js (human figures on structures)

## Used By

- main.js (landscape chunk generation)
- Integrated with all other generator modules for complete scenes