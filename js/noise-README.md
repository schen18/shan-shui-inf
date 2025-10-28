# Noise Module

## Overview

The Noise module provides Perlin noise implementation for natural-looking procedural generation. Perlin noise is essential for creating organic, natural-looking variations in terrain, vegetation placement, and surface textures.

## Key Features

- **3D Perlin Noise**: Supports 1D, 2D, and 3D noise generation
- **Configurable Parameters**: Adjustable octaves and amplitude falloff
- **Deterministic**: Uses seeded random generation for reproducible results
- **Optimized**: Efficient implementation suitable for real-time generation

## API

### Noise.noise(x, y, z)
Generate 3D Perlin noise value.
- `x` (number): X coordinate
- `y` (number, optional): Y coordinate (default: 0)
- `z` (number, optional): Z coordinate (default: 0)
- Returns: Noise value between 0 and 1

### Noise.noiseDetail(lod, falloff)
Configure noise generation parameters.
- `lod` (number): Level of detail (number of octaves)
- `falloff` (number): Amplitude falloff for each octave

### Noise.noiseSeed(seed)
Initialize noise generator with specific seed.
- `seed` (number): Seed value for deterministic noise

## Usage Examples

```javascript
// Generate terrain height variation
var height = Noise.noise(x * 0.01, y * 0.01) * 100;

// Create texture variation with higher frequency
var texture = Noise.noise(x * 0.1, y * 0.1, time * 0.01);

// Configure noise detail
Noise.noiseDetail(4, 0.5); // 4 octaves, 0.5 falloff

// Set deterministic seed
Noise.noiseSeed(12345);
```

## Common Use Cases

- **Terrain Generation**: Height maps and surface variation
- **Vegetation Placement**: Natural distribution of trees and plants
- **Water Effects**: Wave patterns and surface ripples
- **Texture Details**: Surface roughness and material variation
- **Animation**: Smooth parameter changes over time

## Dependencies

- prng.js (for deterministic random number generation)

## Used By

- utils.js (loopNoise function)
- trees.js (branch variation, leaf placement)
- mountains.js (terrain height, texture)
- architecture.js (surface details)
- water.js (wave patterns)
- rendering.js (texture generation)