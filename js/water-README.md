# Water Module

## Overview

The Water module generates water surface effects with waves and ripples for landscape scenes in the Shan Shui system. It creates natural-looking water surfaces that integrate seamlessly with the terrain and other landscape elements.

## Key Features

- **Wave Generation**: Natural wave patterns using sine functions and noise
- **Cluster System**: Multiple wave clusters for complex water surfaces
- **Configurable Parameters**: Height, length, and cluster count options
- **Noise Integration**: Perlin noise for natural wave variation
- **Broken Stroke Support**: Automatic traditional Chinese painting aesthetics
- **Lightweight Rendering**: Efficient stroke-based water representation

## API

### Main Function

#### water(xoff, yoff, seed, args)
Generate water surface effects with waves and ripples.

Automatically applies broken stroke effects when enabled via the global UI toggle, creating traditional Chinese painting aesthetics where brush strokes appear naturally interrupted.

- `xoff`, `yoff` (number): Position coordinates
- `seed` (number): Random seed for deterministic generation
- `args` (Object, optional): Configuration options
  - `hei` (number): Wave height (default: 2)
  - `len` (number): Water surface length (default: 800)
  - `clu` (number): Number of wave clusters (default: 10)

## Usage Examples

```javascript
// Create basic water surface
var waterSurface = water(100, 400, 12345, {
  hei: 3,
  len: 1000,
  clu: 12
});

// Generate calm water with small waves
var calmWater = water(500, 450, 67890, {
  hei: 1,
  len: 600,
  clu: 8
});

// Create choppy water with larger waves
var choppyWater = water(200, 380, 11111, {
  hei: 5,
  len: 1200,
  clu: 15
});

// Integrate with landscape positioning
var lakeWater = water(mountainX, mountainY + 50, terrainSeed, {
  hei: 2.5,
  len: mountainWidth,
  clu: 10
});
```

## Water Generation Process

### Wave Cluster System
1. **Cluster Placement**: Random positioning of wave groups
2. **Length Variation**: Each cluster has variable length
3. **Height Offset**: Clusters positioned at different depths
4. **Wave Function**: Sine wave generation with noise modulation

### Wave Characteristics
- **Frequency**: Controlled by sine wave period (0.2 factor)
- **Amplitude**: Scaled by height parameter and noise
- **Phase**: Random offset for each cluster
- **Noise Modulation**: Perlin noise adds natural variation

### Rendering Style
- **Stroke-based**: Uses variable-width strokes for wave lines
- **Broken Stroke Effects**: Automatic traditional painting aesthetics when enabled
- **Transparency**: Alpha blending for layered water effects
- **Color Variation**: Random opacity for depth perception
- **Minimal Geometry**: Efficient point-based representation

## Integration with Landscape

### Terrain Integration
Water surfaces are typically placed:
- At the base of mountains
- In valley areas between terrain features
- As foreground elements in landscape compositions
- Integrated with boat placement systems

### Depth Layering
Water elements are rendered with appropriate depth sorting:
- Background water (distant lakes)
- Mid-ground water (rivers and streams)
- Foreground water (immediate water features)

### Color Coordination
Water colors complement the overall landscape palette:
- Grayscale tones matching mountain and terrain colors
- Transparency effects for natural blending
- Consistent with the monochromatic Shan Shui aesthetic

## Performance Considerations

### Efficient Generation
- **Point-based**: Minimal geometry for fast rendering
- **Cluster System**: Reduces redundant calculations
- **Stroke Rendering**: Leverages efficient SVG stroke elements
- **Noise Optimization**: Balanced detail vs. performance

### Memory Usage
- **Lightweight Data**: Simple point arrays
- **No Complex Geometry**: Avoids heavy polygon operations
- **Streaming Generation**: Can be generated on-demand

## Dependencies

- noise.js (wave variation and natural patterns)
- rendering.js (stroke generation for wave lines)
- prng.js (deterministic randomization)

## Used By

- mountains.js (water placement near terrain features)
- main.js (water element generation in landscape chunks)

## Artistic Style

The water generation maintains consistency with Shan Shui aesthetics:
- **Minimalist Approach**: Simple, elegant wave representation
- **Natural Variation**: Organic patterns through noise integration
- **Traditional Techniques**: Broken stroke effects simulate brush lifting from paper
- **Cultural Authenticity**: Appropriate for traditional Chinese landscape art
- **Atmospheric Perspective**: Subtle rendering that doesn't overpower other elements
- **Unified Aesthetics**: Consistent stroke style with mountains and other elements