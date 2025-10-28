# Figures Module

## Overview

The Figures module contains functions for generating human figures and their accessories in the Shan Shui generative art system. It provides the main man function for creating human figures, as well as various accessories like hats and walking sticks.

## Key Features

- **Human Figure Generation**: Complete human characters with customizable proportions
- **Accessory System**: Hats, walking sticks, and other items
- **Pose Variation**: Configurable joint angles and limb lengths
- **Style Consistency**: Maintains artistic coherence with landscape elements
- **Modular Design**: Separate functions for different accessories

## API

### Main Figure Function

#### Man.man(xoff, yoff, args)
Generate a human figure with customizable accessories and proportions.
- `xoff`, `yoff` (number): Position coordinates for the figure
- `args` (Object, optional): Configuration options
  - `sca` (number): Scale factor for the figure (default: 0.5)
  - `hat` (Function): Hat function to use (default: Man.hat01)
  - `ite` (Function): Item/tool function to use (default: empty function)
  - `fli` (boolean): Whether to flip the figure horizontally (default: true)
  - `ang` (Array): Array of joint angles for figure pose
  - `len` (Array): Array of limb lengths

### Accessory Functions

#### Man.hat01(p0, p1, args)
Generate a traditional hat accessory.
- `p0` (Array): Base point of the hat [x, y]
- `p1` (Array): Top point of the hat [x, y]
- `args` (Object, optional): Configuration options
  - `fli` (boolean): Whether to flip the hat horizontally

#### Man.hat02(p0, p1, args)
Generate an alternative hat style.
- `p0` (Array): Base point of the hat [x, y]
- `p1` (Array): Top point of the hat [x, y]
- `args` (Object, optional): Configuration options
  - `fli` (boolean): Whether to flip the hat horizontally

#### Man.stick01(p0, p1, args)
Generate a walking stick or tool accessory.
- `p0` (Array): Base point of the stick [x, y]
- `p1` (Array): Top point of the stick [x, y]
- `args` (Object, optional): Configuration options
  - `fli` (boolean): Whether to flip the stick horizontally

## Usage Examples

```javascript
// Create a basic human figure
var person = Man.man(200, 300, {
  sca: 0.6,
  fli: false
});

// Generate figure with traditional hat
var hatPerson = Man.man(300, 300, {
  sca: 0.5,
  hat: Man.hat01,
  fli: true
});

// Create figure with walking stick
var traveler = Man.man(400, 300, {
  sca: 0.7,
  hat: Man.hat02,
  ite: Man.stick01,
  fli: false
});

// Custom pose with specific angles and lengths
var customFigure = Man.man(500, 300, {
  sca: 0.8,
  ang: [0, -Math.PI/2, 0.2, Math.PI/3, Math.PI/2, Math.PI/2, -Math.PI/3, -Math.PI/2, -Math.PI/4],
  len: [0, 35, 25, 35, 35, 35, 35, 35, 35],
  hat: Man.hat01,
  ite: Man.stick01
});
```

## Figure Anatomy

The human figure is constructed using a hierarchical joint system:

### Joint Structure
- **0**: Root/pelvis
- **1**: Torso
- **2**: Head
- **3**: Left upper arm
- **4**: Left forearm
- **5**: Right upper arm
- **6**: Right forearm
- **7**: Left thigh
- **8**: Left shin

### Default Proportions
The default limb lengths (scaled by `sca` parameter):
- Torso: 30 units
- Head: 20 units
- Arms: 30 units each segment
- Legs: 30 units each segment

### Pose Configuration
Joint angles can be customized to create different poses:
- Standing upright (default)
- Walking poses
- Working positions
- Sitting or crouching

## Accessory System

### Hat Styles
- **hat01**: Traditional conical hat with flowing elements
- **hat02**: Wide-brimmed hat suitable for travelers

### Tools and Items
- **stick01**: Walking stick or tool with natural curve variation

### Custom Accessories
The accessory system is extensible - new accessories can be created following the same pattern:
```javascript
function customAccessory(p0, p1, args) {
  // Generate SVG for custom accessory
  return svgString;
}
```

## Helper Functions

The module includes internal helper functions:

- **expand()**: Creates parallel curves for figure outlines
- **tranpoly()**: Transforms polygons relative to reference points
- **flipper()**: Mirrors point lists horizontally

## Dependencies

- utils.js (mathematical operations, distance calculations)
- rendering.js (SVG generation, shape creation)
- noise.js (natural variation in accessories)

## Used By

- architecture.js (human figures on boats and buildings)
- mountains.js (figures placed in landscape scenes)

## Artistic Style

The figure generation maintains consistency with the overall Shan Shui aesthetic:
- **Simplified Forms**: Clean, minimalist representation
- **Natural Variation**: Subtle randomization for organic feel
- **Cultural Context**: Appropriate for traditional Chinese landscape art
- **Scale Integration**: Proper proportions relative to landscape elements