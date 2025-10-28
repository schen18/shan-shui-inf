# Utils Module

## Overview

The Utils module provides mathematical utilities and helper functions used throughout the Shan Shui system. It contains essential mathematical operations, interpolation functions, and utility functions for data processing.

## Key Features

- **Mathematical Operations**: Distance, mapping, interpolation
- **Random Utilities**: Gaussian distribution, weighted random, choice functions
- **Curve Generation**: Bezier curves and smooth interpolation
- **Data Processing**: NaN handling, array operations

## API

### Basic Math Functions

#### distance(p0, p1)
Calculate Euclidean distance between two points.
- `p0`, `p1` (Array): Points as [x, y]
- Returns: Distance between points

#### mapval(value, istart, istop, ostart, ostop)
Map a value from one range to another.
- `value` (number): Value to map
- `istart`, `istop` (number): Input range
- `ostart`, `ostop` (number): Output range
- Returns: Mapped value

### Random Functions

#### normRand(m, M)
Generate random number in specified range.
- `m`, `M` (number): Min and max values
- Returns: Random number between m and M

#### randChoice(arr)
Choose random element from array.
- `arr` (Array): Array to choose from
- Returns: Random element

#### randGaussian()
Generate Gaussian-distributed random number.
- Returns: Gaussian random value between -1 and 1

#### wtrand(func)
Generate weighted random number using rejection sampling.
- `func` (Function): Weight function
- Returns: Weighted random value

### Curve and Interpolation

#### bezmh(P, w)
Generate smooth Bezier curve through control points.
- `P` (Array): Array of control points
- `w` (number, optional): Weight parameter (default: 1)
- Returns: Array of points forming the curve

#### div(plist, reso)
Interpolate points along a path with specified resolution.
- `plist` (Array): Array of points to interpolate
- `reso` (number): Resolution (points per segment)
- Returns: Interpolated point array

### Utility Functions

#### unNan(plist)
Replace NaN and undefined values with fallback values.
- `plist` (any): Value or array to clean
- Returns: Cleaned value or array

#### loopNoise(nslist)
Adjust noise list to create seamless loops.
- `nslist` (Array): Array of noise values to adjust

## Usage Examples

```javascript
// Calculate distance between points
var dist = distance([0, 0], [3, 4]); // Result: 5

// Map value from one range to another
var mapped = mapval(0.5, 0, 1, 100, 200); // Result: 150

// Generate random values
var randomInRange = normRand(10, 20);
var gaussianRandom = randGaussian();
var randomElement = randChoice(['a', 'b', 'c']);

// Create smooth curves
var controlPoints = [[0,0], [50,100], [100,0]];
var curve = bezmh(controlPoints, 1.5);

// Interpolate between points
var path = [[0,0], [100,50], [200,0]];
var smoothPath = div(path, 10); // 10 points per segment

// Clean data
var cleanData = unNan([1, NaN, 3, undefined, 5]); // [1, 0, 3, 0, 5]
```

## Dependencies

- prng.js (for random number generation)
- noise.js (for loopNoise function)
- polytools.js (for midPt function in bezmh)

## Used By

- rendering.js (mathematical operations, curve generation)
- trees.js (random placement, curve generation)
- mountains.js (terrain calculations, interpolation)
- architecture.js (geometric calculations)
- figures.js (curve generation for character shapes)
- water.js (wave calculations)