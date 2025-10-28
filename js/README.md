# Shan Shui JavaScript Modules

This directory contains the modular JavaScript implementation of the Shan Shui generative art system. The modules are organized into logical layers based on functionality and dependencies.

## Module Architecture

### Core Utilities Layer (Foundation)
- **prng.js** - Pseudo-random number generation
- **noise.js** - Perlin noise implementation  
- **polytools.js** - Geometric operations
- **utils.js** - Mathematical utilities
- **rendering.js** - SVG generation functions

### Procedural Generators Layer
- **trees.js** - Tree and vegetation generation
- **mountains.js** - Terrain and mountain generation
- **architecture.js** - Buildings and structures
- **figures.js** - Human characters and accessories
- **water.js** - Water effects and surfaces

### Application Layer
- **display.js** - UI controls and viewport management
- **main.js** - Application logic and chunk management

## Dependency Hierarchy

The modules follow a strict dependency hierarchy to ensure proper loading order:

1. **Foundation**: prng.js → noise.js → polytools.js → utils.js
2. **Rendering**: rendering.js (depends on utils.js, polytools.js)
3. **Generators**: All generator modules depend on rendering layer
4. **Application**: display.js and main.js depend on all other modules

## Usage

Load modules in the correct order in your HTML file:

```html
<!-- Core utilities -->
<script src="js/prng.js"></script>
<script src="js/noise.js"></script>
<script src="js/polytools.js"></script>
<script src="js/utils.js"></script>

<!-- Rendering layer -->
<script src="js/rendering.js"></script>

<!-- Generators -->
<script src="js/trees.js"></script>
<script src="js/mountains.js"></script>
<script src="js/architecture.js"></script>
<script src="js/figures.js"></script>
<script src="js/water.js"></script>

<!-- Application -->
<script src="js/display.js"></script>
<script src="js/main.js"></script>
```

## Module Documentation

Each module contains detailed JSDoc comments explaining:
- Purpose and functionality
- Public API functions
- Parameter descriptions and types
- Usage examples
- Dependencies

See individual module files for complete API documentation.