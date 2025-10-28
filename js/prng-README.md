# PRNG Module

## Overview

The PRNG (Pseudo Random Number Generator) module provides deterministic random number generation for reproducible landscape generation. This is the foundation module that ensures the same seed will always produce identical landscapes.

## Key Features

- **Deterministic Generation**: Same seed always produces same sequence
- **High Quality Distribution**: Uses quadratic congruential generator
- **Math.random Override**: Replaces JavaScript's built-in random function
- **Seed Management**: Easy initialization with custom or time-based seeds

## API

### Prng.seed(x)
Initialize the PRNG with a seed value.
- `x` (number, optional): Seed value. Uses current time if undefined.

### Prng.next()
Generate the next random number in the sequence.
- Returns: Random number between 0 and 1

### Prng.hash(x)
Convert arbitrary input to numeric seed.
- `x` (any): Input value to hash
- Returns: Numeric hash value

### Prng.test(f)
Test the distribution quality of the PRNG.
- `f` (function, optional): Function to test
- Returns: Array showing distribution across deciles

### Math.random()
Overridden to use deterministic PRNG.
- Returns: Random number between 0 and 1

### Math.seed(x)
Initialize the global PRNG seed.
- `x` (number): Seed value

## Usage Example

```javascript
// Set a specific seed for reproducible results
Math.seed(12345);

// Generate random numbers (will be same sequence every time)
var x = Math.random(); // 0.234...
var y = Math.random(); // 0.567...

// Test distribution quality
var distribution = Prng.test();
console.log(distribution); // [1000234, 999876, ...]
```

## Dependencies

None - this is the foundation module.

## Used By

- noise.js (for noise generation)
- All other modules (through Math.random override)