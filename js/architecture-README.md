# Architecture Module

## Overview

The Architecture module generates architectural elements and structures for the Shan Shui landscape system. It provides functions for creating various types of buildings, boats, and modern structures that integrate seamlessly into the generated landscapes.

## Key Features

- **Traditional Buildings**: Various architectural styles from simple huts to complex pagodas
- **Modern Structures**: Transmission towers and contemporary elements
- **Watercraft**: Fishing boats with human figures
- **Modular Design**: Reusable components for roofs, walls, and decorative elements
- **Perspective Rendering**: 3D-like appearance with proper depth and shading

## API

### Building Generation Functions

#### Arch.arch01(xoff, yoff, seed, args)
Generate simple buildings with traditional roofs and optional human figures.
- `xoff`, `yoff` (number): Position coordinates
- `seed` (number): Random seed for deterministic generation
- `args` (Object, optional): Configuration options
  - `hei` (number): Building height (default: 70)
  - `wid` (number): Building width (default: 180)
  - `rot` (number): Rotation factor (default: 0.7)
  - `per` (number): Perspective factor (default: 5)

#### Arch.arch02(xoff, yoff, seed, args)
Generate multi-story structures with customizable styles and railings.
- `xoff`, `yoff` (number): Position coordinates
- `seed` (number): Random seed for deterministic generation
- `args` (Object, optional): Configuration options
  - `hei` (number): Floor height (default: 10)
  - `wid` (number): Building width (default: 50)
  - `rot` (number): Rotation factor (default: 0.3)
  - `per` (number): Perspective factor (default: 5)
  - `sto` (number): Number of stories (default: 3)
  - `sty` (number): Decoration style (default: 1)
  - `rai` (boolean): Include railings (default: false)

#### Arch.arch03(xoff, yoff, seed, args)
Generate pagoda-style buildings with multiple levels and traditional roofs.
- `xoff`, `yoff` (number): Position coordinates
- `seed` (number): Random seed for deterministic generation
- `args` (Object, optional): Configuration options
  - `hei` (number): Floor height (default: 10)
  - `wid` (number): Building width (default: 50)
  - `rot` (number): Rotation factor (default: 0.7)
  - `per` (number): Perspective factor (default: 5)
  - `sto` (number): Number of stories (default: 7)

#### Arch.arch04(xoff, yoff, seed, args)
Generate complex architectural forms with transparent elements.
- `xoff`, `yoff` (number): Position coordinates
- `seed` (number): Random seed for deterministic generation
- `args` (Object, optional): Configuration options
  - `hei` (number): Floor height (default: 15)
  - `wid` (number): Building width (default: 30)
  - `rot` (number): Rotation factor (default: 0.7)
  - `per` (number): Perspective factor (default: 5)
  - `sto` (number): Number of stories (default: 2)

### Watercraft and Structures

#### Arch.boat01(xoff, yoff, seed, args)
Generate fishing boats with human figures.

Creates traditional fishing boats with stroke-based rendering that automatically supports broken stroke effects when enabled via the global UI toggle, simulating traditional Chinese painting techniques.

- `xoff`, `yoff` (number): Position coordinates
- `seed` (number): Random seed for deterministic generation
- `args` (Object, optional): Configuration options
  - `len` (number): Boat length (default: 120)
  - `sca` (number): Scale factor (default: 1)
  - `fli` (boolean): Flip horizontally (default: false)

#### Arch.transmissionTower01(xoff, yoff, seed, args)
Generate modern transmission tower structures.
- `xoff`, `yoff` (number): Position coordinates
- `seed` (number): Random seed for deterministic generation
- `args` (Object, optional): Configuration options
  - `hei` (number): Tower height (default: 100)
  - `wid` (number): Tower width (default: 20)

## Usage Examples

```javascript
// Create a simple traditional building
var house = Arch.arch01(200, 300, 12345, {
  hei: 80,
  wid: 200,
  rot: 0.6
});

// Generate a multi-story building
var apartment = Arch.arch02(400, 300, 67890, {
  hei: 15,
  wid: 60,
  sto: 5,
  sty: 2,
  rai: true
});

// Create a pagoda
var pagoda = Arch.arch03(600, 300, 11111, {
  hei: 12,
  wid: 45,
  sto: 9
});

// Place a fishing boat
var boat = Arch.boat01(100, 400, 22222, {
  len: 150,
  sca: 1.2,
  fli: true
});

// Add a transmission tower
var tower = Arch.transmissionTower01(800, 200, 33333, {
  hei: 120,
  wid: 25
});
```

## Architectural Styles

### Traditional Buildings (arch01)
- **Curved Roofs**: Traditional Chinese architectural elements
- **Human Integration**: Automatic figure placement
- **Railings**: Decorative balcony elements
- **Natural Materials**: Earth-tone color schemes

### Multi-Story Buildings (arch02)
- **Modular Construction**: Stackable floor elements
- **Decoration Styles**: Multiple ornamental patterns
- **Perspective Depth**: 3D appearance with proper shading
- **Configurable Stories**: Variable building heights

### Pagodas (arch03)
- **Traditional Design**: Multi-tiered roof structures
- **Diminishing Scale**: Each level smaller than the last
- **Ornate Details**: Decorative railings and trim
- **Cultural Authenticity**: Traditional proportions and styling

### Complex Structures (arch04)
- **Transparent Elements**: See-through architectural features
- **Modern Styling**: Contemporary design elements
- **Geometric Forms**: Clean, angular construction

## Helper Functions

The module includes several internal helper functions:

- **hut()**: Creates traditional hut structures
- **box()**: Generates basic building boxes with perspective
- **roof()**: Creates various roof styles
- **pagroof()**: Specialized pagoda roof generation
- **rail()**: Decorative railing elements
- **deco()**: Ornamental decoration patterns
- **flip()**: Coordinate transformation utilities

## Dependencies

- utils.js, rendering.js, polytools.js (core functionality)
- figures.js (human figures for boats and buildings)

## Used By

- mountains.js (building placement on terrain)
- main.js (architectural element generation in landscapes)