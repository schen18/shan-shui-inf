# Display Module

## Overview

The Display module contains all UI control functions, viewport management, and user interaction handlers for the Shan Shui application. It manages the user interface, handles scrolling, controls element visibility, and provides download functionality.

## Key Features

- **Viewport Management**: Smooth scrolling and view updates
- **UI Controls**: Button styling, element toggling, text switching
- **Auto-scroll System**: Automated landscape exploration with direction control
- **Element Toggles**: Show/hide different landscape elements
- **Download Functionality**: Export SVG landscapes as files
- **Responsive Interface**: Adaptive UI elements and controls

## API

### Scrolling Functions

#### xcroll(v)
Horizontal scrolling function.
- `v` (number): The scroll amount

#### autoxcroll(v)
Auto-scroll functionality with smooth animation and direction control.
- `v` (number): The total scroll amount per cycle

#### toggleScrollDirection()
Toggle autoscroll direction between left and right.

### Element Control Functions

#### getElementToggles()
Get current state of element toggle controls.
- Returns: Object containing the state of each element toggle

#### regenerateLandscape()
Regenerate landscape with current element toggle settings.

#### toggleVisible(id)
Toggle element visibility.
- `id` (string): Element ID to toggle

#### toggleText(id, a, b)
Toggle text content between two values.
- `id` (string): Element ID
- `a`, `b` (string): Text options to toggle between

### UI Styling Functions

#### rstyle(id, b)
Apply styling to navigation buttons.
- `id` (string): Element ID
- `b` (boolean): Hover state

### Rendering Functions

#### present()
Main rendering loop for smooth scrolling.

#### viewupdate()
Update the SVG viewport.

#### update()
Main update function for rendering landscape chunks.

### Utility Functions

#### reloadWSeed(s)
Reload page with new seed.
- `s` (string): New seed value

#### download(filename, text)
Download SVG content as file.
- `filename` (string): Name of the file to download
- `text` (string): SVG content to download

## Usage Examples

```javascript
// Scroll the landscape
xcroll(100); // Scroll right by 100 units
xcroll(-50); // Scroll left by 50 units

// Start auto-scrolling
document.getElementById("AUTO_SCROLL").checked = true;
autoxcroll(20); // Auto-scroll with 20 unit steps

// Toggle landscape elements
regenerateLandscape(); // Regenerate with current toggles

// Control UI elements
toggleVisible("settings-panel");
toggleText("scroll-button", "Start", "Stop");

// Download current landscape
var svgContent = document.getElementById("SVG").outerHTML;
download("landscape.svg", svgContent);

// Reload with new seed
reloadWSeed("new-seed-12345");
```

## Auto-scroll System

### Direction Control
- **Left/Right Toggle**: Radio button controls for direction
- **Smooth Animation**: Small incremental steps for fluid motion
- **Continuous Operation**: Automatic cycling with configurable pauses
- **User Control**: Can be started/stopped via checkbox

### Animation Parameters
- **Step Size**: 2 units per step for ultra-smooth animation
- **Step Interval**: 30ms between steps
- **Cycle Pause**: 800ms between complete cycles
- **Direction**: Configurable via radio buttons

## Element Toggle System

### Supported Elements
- **Mountains**: Main terrain features
- **Trees**: All vegetation types
- **Buildings**: Architectural elements
- **Boats**: Watercraft with figures
- **Water**: Water surface effects

### Toggle Implementation
- **Real-time Updates**: Immediate landscape regeneration
- **State Persistence**: Maintains toggle states during navigation
- **Function Wrapping**: Intercepts generator functions to respect toggles
- **Performance Optimization**: Efficient regeneration system

## UI Control System

### Button Styling
- **Hover Effects**: Visual feedback for interactive elements
- **Consistent Appearance**: Unified styling across all controls
- **Accessibility**: Clear visual states and transitions

### Element Management
- **Visibility Control**: Show/hide UI panels and controls
- **Text Switching**: Dynamic button and label text updates
- **State Management**: Maintains UI state across interactions

## Viewport Management

### SVG Rendering
- **Dynamic ViewBox**: Adjusts to current scroll position
- **Zoom Control**: Configurable zoom level (1.142x default)
- **Smooth Updates**: Efficient viewport updates during scrolling

### Performance Optimization
- **Selective Rendering**: Only renders visible landscape chunks
- **Efficient Updates**: Minimizes DOM manipulation
- **Memory Management**: Proper cleanup of unused elements

## Download System

### SVG Export
- **Complete Landscapes**: Export entire visible landscape
- **File Generation**: Creates downloadable SVG files
- **Browser Compatibility**: Works across modern browsers
- **Filename Control**: Customizable output filenames

## Dependencies

- main.js (landscape data and chunk management)
- All generator modules (for element toggle functionality)

## Used By

- shanshui.html (main application interface)
- User interaction handlers throughout the application

## Event Handling

The module handles various user interactions:
- **Mouse Events**: Hover effects and click handlers
- **Scroll Events**: Viewport updates during navigation
- **Form Controls**: Checkbox and radio button changes
- **Button Clicks**: UI control activation