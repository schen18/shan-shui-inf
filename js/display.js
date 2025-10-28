/**
 * Display.js - UI Controls and Rendering Functions
 * 
 * This module contains all UI control functions, viewport management,
 * and user interaction handlers for the Shan Shui application.
 */

// Global variables for UI state
var lastScrollX = 0;
var pFrame = 0;

/**
 * Horizontal scrolling function
 * @param {number} v - The scroll amount
 */
function xcroll(v) {
  MEM.cursx += v;
  if (needupdate()) {
    update();
  } else {
    viewupdate();
  }
}

/**
 * Auto-scroll functionality with smooth animation and direction control
 * @param {number} v - The total scroll amount per cycle
 */
function autoxcroll(v) {
  if (document.getElementById("AUTO_SCROLL").checked) {
    // Get direction from radio buttons
    var directionElement = document.querySelector('input[name="scroll_direction"]:checked');
    var scrollDirection = directionElement ? directionElement.value : 'right';
    
    // Use smaller, more frequent steps for smoother animation
    var smoothStep = 2; // Even smaller increment for ultra-smooth animation
    var totalSteps = Math.abs(v) / smoothStep;
    var direction = scrollDirection === 'left' ? -1 : 1;
    var currentStep = 0;
    
    function doSmoothStep() {
      if (currentStep < totalSteps && document.getElementById("AUTO_SCROLL").checked) {
        xcroll(smoothStep * direction);
        currentStep++;
        setTimeout(doSmoothStep, 30); // Faster intervals (30ms) for smoother animation
      } else if (document.getElementById("AUTO_SCROLL").checked) {
        // Start next cycle after a shorter pause for more continuous movement
        setTimeout(function() {
          autoxcroll(v);
        }, 800); // Shorter pause between cycles for more fluid experience
      }
    }
    
    doSmoothStep();
  }
}

/**
 * Toggle autoscroll direction
 */
function toggleScrollDirection() {
  var leftRadio = document.getElementById("SCROLL_LEFT");
  var rightRadio = document.getElementById("SCROLL_RIGHT");
  
  if (leftRadio && rightRadio) {
    if (leftRadio.checked) {
      rightRadio.checked = true;
    } else {
      leftRadio.checked = true;
    }
  }
}

/**
 * Get element toggle states
 * @returns {Object} Object containing the state of each element toggle
 */
function getElementToggles() {
  return {
    trees: document.getElementById("ENABLE_TREES") ? document.getElementById("ENABLE_TREES").checked : true,
    buildings: document.getElementById("ENABLE_BUILDINGS") ? document.getElementById("ENABLE_BUILDINGS").checked : true,
    boats: document.getElementById("ENABLE_BOATS") ? document.getElementById("ENABLE_BOATS").checked : true,
    water: document.getElementById("ENABLE_WATER") ? document.getElementById("ENABLE_WATER").checked : true
  };
}

/**
 * Regenerate landscape with current element toggles
 */
function regenerateLandscape() {
  console.log("Regenerating landscape with element toggles...");
  
  // Update global toggles
  if (typeof ELEMENT_TOGGLES !== 'undefined') {
    var toggles = getElementToggles();
    ELEMENT_TOGGLES.trees = toggles.trees;
    ELEMENT_TOGGLES.buildings = toggles.buildings;
    ELEMENT_TOGGLES.boats = toggles.boats;
    ELEMENT_TOGGLES.water = toggles.water;
  }
  
  // Clear existing chunks to force regeneration
  MEM.chunks = [];
  MEM.xmin = 0;
  MEM.xmax = 0;
  
  // Regenerate the current view
  update();
  
  console.log("Landscape regenerated with new element settings");
}

/**
 * Apply styling to navigation buttons
 * @param {string} id - Element ID
 * @param {boolean} b - Hover state
 */
function rstyle(id, b) {
  var a = b ? 0.1 : 0.0;
  document
    .getElementById(id)
    .setAttribute(
      "style",
      "\
    width: 40px;\
    display: flex;\
    align-items: center;\
    justify-content: center;\
    cursor: pointer;\
    border: 1px solid rgba(0,0,0,0.4);\
    color: rgba(0,0,0,0.4);\
    background-color: rgba(0,0,0," +
        a +
        ");\
    user-select: none;\
  "
    );
}

/**
 * Toggle element visibility
 * @param {string} id - Element ID
 */
function toggleVisible(id) {
  var v = document.getElementById(id).style.display == "none";
  document.getElementById(id).style.display = v ? "block" : "none";
}

/**
 * Toggle text content between two values
 * @param {string} id - Element ID
 * @param {string} a - First text option
 * @param {string} b - Second text option
 */
function toggleText(id, a, b) {
  var v = document.getElementById(id).innerHTML;
  document.getElementById(id).innerHTML = v == "" || v == b ? a : b;
}

/**
 * Main rendering loop for smooth scrolling
 */
function present() {
  var currScrollX = window.scrollX;
  var step = 1;
  document.body.scrollTo(Math.max(0, pFrame - 10), window.scrollY);

  pFrame += step;

  if (pFrame < 20 || Math.abs(lastScrollX - currScrollX) < step * 2) {
    lastScrollX = currScrollX;
    setTimeout(present, 1);
  }
}

/**
 * Update the SVG viewport
 */
function viewupdate() {
  try {
    document.getElementById("SVG").setAttribute("viewBox", calcViewBox());
  } catch (e) {
    console.log("not possible");
  }
}

/**
 * Main update function for rendering landscape chunks
 */
function update() {
  self.chunkloader(MEM.cursx, MEM.cursx + MEM.windx);
  self.chunkrender(MEM.cursx, MEM.cursx + MEM.windx);

  document.getElementById("BG").innerHTML =
    "<svg id='SVG' xmlns='http://www.w3.org/2000/svg' width='" +
    MEM.windx +
    "' height='" +
    MEM.windy +
    "' style='mix-blend-mode:multiply;'" +
    "viewBox = '" +
    calcViewBox() +
    "'" +
    "><g id='G' transform='translate(" +
    0 +
    ",0)'>" +
    MEM.canv +
    "</g></svg>";
}

/**
 * Reload page with new seed
 * @param {string} s - New seed value (generates random seed if empty)
 */
function reloadWSeed(s) {
  var u = window.location.href.split("?")[0];
  // If no seed provided, generate a random one
  if (s === "" || s === undefined || s === null) {
    s = "" + new Date().getTime();
  }
  window.location.href = u + "?seed=" + s;
}

/**
 * Download SVG content as file
 * @param {string} filename - Name of the file to download
 * @param {string} text - SVG content to download
 */
function download(filename, text) {
  var element = document.createElement("a");
  element.setAttribute(
    "href",
    "data:text/plain;charset=utf-8," + encodeURIComponent(text),
  );
  element.setAttribute("download", filename);
  element.style.display = "none";
  document.body.appendChild(element);
  element.click();
  document.body.removeChild(element);
}