# Main Module

## Overview

The Main module contains the core application logic, memory management, landscape planning, chunk rendering, and coordinate system management for the Shan Shui system. It orchestrates the entire landscape generation process and manages the infinite scrolling system.

## Key Features

- **Memory Management**: Global state management for application data
- **Chunk System**: Efficient infinite scrolling with landscape chunks
- **Landscape Planning**: Intelligent placement of terrain and elements
- **Element Toggles**: Runtime control of landscape element visibility
- **Coordinate System**: Manages positioning and viewport calculations
- **Performance Optimization**: Efficient rendering and memory usage

## API

### Global Objects

#### MEM
Global memory object containing application state.
- `canv` (string): Current canvas SVG content
- `chunks` (Array): Array of rendered landscape chunks
- `xmin`, `xmax` (number): Current loaded range boundaries
- `cwid` (number): Chunk width (default: 512)
- `cursx` (number): Current X position
- `windx`, `windy` (number): Window dimensions
- `planmtx` (Array): Planning matrix for element placement

#### ELEMENT_TOGGLES
Global element toggle states.
- `mountains`, `trees`, `buildings`, `boats`, `water` (boolean): Element visibility flags

### Core Functions

#### parseArgs(key2f)
Parse URL parameters and execute corresponding functions.
- `key2f` (Object): Object mapping parameter names to functions

#### calcViewBox()
Calculate SVG viewBox for current viewport.
- Returns: ViewBox string for SVG

#### needupdate()
Check if landscape needs to be updated.
- Returns: Boolean indicating if update is needed

### Landscape Generation

#### mountplanner(xmin, xmax)
Plan mountain and landscape element placement.
- `xmin`, `xmax` (number): X coordinate range for planning
- Returns: Array of planned landscape elements

#### chunkloader(xmin, xmax)
Load landscape chunks for the specified range.
- `xmin`, `xmax` (number): X coordinate range to load

#### chunkrender(xmin, xmax)
Render landscape chunks for the specified range.
- `xmin`, `xmax` (number): X coordinate range to render

### Element Toggle System

#### initElementToggles()
Initialize all element toggle wrappers.

#### initArchitectureToggles()
Initialize architecture function wrappers.

#### initTreeToggles()
Initialize tree function wrappers.

#### generateMountainWithToggles(x, y, seed, toggles)
Generate mountain with element toggles applied.
- `x`, `y` (number): Position coordinates
- `seed` (number): Random seed
- `toggles` (Object): Element toggle states
- Returns: SVG markup for mountain

## Usage Examples

```javascript
// Initialize the application
parseArgs({
  seed: function(s) { Math.seed(parseInt(s)); },
  debug: function(d) { console.log("Debug mode:", d); }
});

// Plan landscape elements for a range
var elements = mountplanner(0, 1000);
console.log("Planned elements:", elements);

// Load and render chunks
chunkloader(0, 1500);
chunkrender(0, 1500);

// Control element visibility
ELEMENT_TOGGLES.trees = false;
ELEMENT_TOGGLES.buildings = true;
initElementToggles(); // Apply changes

// Generate mountain with specific toggles
var mountain = generateMountainWithToggles(500, 400, 12345, {
  mountains: true,
  trees: false,
  buildings: true,
  boats: false,
  water: true
});
```

## Chunk System

### Infinite Scrolling
The chunk system enables infinite landscape generation:

1. **Chunk Loading**: Automatically loads new chunks as user scrolls
2. **Memory Management**: Maintains reasonable memory usage
3. **Seamless Generation**: Continuous landscape without visible boundaries
4. **Performance Optimization**: Only renders visible chunks

### Chunk Structure
Each chunk contains:
- `tag` (string): Element type ("mount", "flatmount", "distmount", "boat", etc.)
- `x`, `y` (number): Position coordinates
- `canv` (string): Generated SVG content

### Chunk Management
- **Dynamic Loading**: Loads chunks ahead of viewport
- **Depth Sorting**: Maintains proper rendering order
- **Cleanup**: Removes off-screen chunks to manage memory
- **Caching**: Reuses generated content when possible

## Landscape Planning

### Element Placement Algorithm
The planning system uses sophisticated algorithms:

1. **Noise-based Placement**: Uses Perlin noise for natural distribution
2. **Local Maxima Detection**: Finds optimal mountain placement locations
3. **Conflict Resolution**: Prevents overlapping elements
4. **Density Control**: Manages element density for realistic appearance

### Planning Matrix
The planning matrix tracks:
- **Mountain Density**: Number of mountains in each region
- **Terrain Occupation**: Which areas are already occupied
- **Element Spacing**: Minimum distances between elements

### Element Types
- **Mountains**: Main terrain features with vegetation
- **Flat Mountains**: Plateau-style terrain
- **Distant Mountains**: Background silhouettes
- **Boats**: Watercraft with human figures
- **Architectural Elements**: Buildings and structures

## Element Toggle System

### Function Wrapping
The toggle system works by wrapping original functions:

```javascript
// Original function is preserved
OriginalArch.arch01 = Arch.arch01;

// Wrapper checks toggle state
Arch.arch01 = function(x, y, seed, args) {
  if (!ELEMENT_TOGGLES.buildings) {
    return ''; // Return empty if disabled
  }
  return OriginalArch.arch01(x, y, seed, args);
};
```

### Runtime Control
- **Dynamic Updates**: Changes take effect immediately
- **Regeneration**: Triggers landscape regeneration when toggles change
- **State Persistence**: Maintains toggle states during navigation
- **Performance**: Minimal overhead when elements are enabled

## Performance Optimization

### Memory Management
- **Chunk Limits**: Maintains reasonable number of loaded chunks
- **Content Cleanup**: Removes unused SVG content
- **Efficient Data Structures**: Optimized for frequent access

### Rendering Optimization
- **Selective Rendering**: Only processes visible elements
- **Batch Operations**: Groups similar operations for efficiency
- **Minimal DOM Updates**: Reduces browser reflow/repaint

### Generation Efficiency
- **Noise Caching**: Reuses noise calculations where possible
- **Deterministic Generation**: Consistent results for same inputs
- **Parallel Processing**: Independent chunk generation

## Dependencies

- All core modules (prng.js, noise.js, utils.js, etc.)
- All generator modules (trees.js, mountains.js, architecture.js, etc.)
- display.js (for UI integration)

## Used By

- display.js (viewport updates and UI controls)
- shanshui.html (main application initialization)

## Global Scope Integration

The module exposes key functions to global scope for compatibility:
- `self.chunkloader` - Chunk loading function
- `self.chunkrender` - Chunk rendering function

## Event Integration

The module integrates with browser events:
- **Mouse Tracking**: Monitors mouse position for interactive features
- **URL Parameters**: Processes query string parameters
- **Window Events**: Responds to resize and navigation events