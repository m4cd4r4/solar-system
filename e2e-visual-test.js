/**
 * Comprehensive E2E Visual Test for Solar System Vortex
 * Tests every control, setting, speed, toggle, and camera mode
 * Takes screenshots at each state for visual review
 */

const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const URL = 'http://localhost:8000/solar_vortex.html';
const SCREENSHOT_DIR = path.join(__dirname, 'test-screenshots');

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
  fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

let testNum = 0;
async function screenshot(page, name) {
  testNum++;
  const filename = `${String(testNum).padStart(2, '0')}-${name}.png`;
  await page.screenshot({ path: path.join(SCREENSHOT_DIR, filename), fullPage: false });
  console.log(`  [Screenshot ${testNum}] ${filename}`);
}

async function setSlider(page, selector, value) {
  await page.evaluate(({ sel, val }) => {
    const el = document.querySelector(sel);
    el.value = val;
    el.dispatchEvent(new Event('input', { bubbles: true }));
  }, { sel: selector, val: value });
}

async function setCheckbox(page, selector, checked) {
  await page.evaluate(({ sel, chk }) => {
    const el = document.querySelector(sel);
    if (el.checked !== chk) {
      el.checked = chk;
      el.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }, { sel: selector, chk: checked });
}

async function setSelect(page, selector, value) {
  await page.selectOption(selector, value);
}

async function waitForAnimation(page, ms = 2000) {
  await page.waitForTimeout(ms);
}

(async () => {
  console.log('=== Solar System Vortex - Full E2E Visual Test ===\n');

  const browser = await chromium.launch({
    headless: false,
    args: ['--window-size=1920,1080']
  });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 }
  });
  const page = await context.newPage();

  // ============================================================
  // 1. INITIAL LOAD
  // ============================================================
  console.log('--- 1. Initial Load ---');
  await page.goto(URL);
  // Wait for loading overlay to disappear
  await page.waitForSelector('#loading-overlay.hidden', { timeout: 30000 }).catch(() => {
    console.log('  Warning: Loading overlay did not get hidden class, continuing...');
  });
  await waitForAnimation(page, 3000);
  await screenshot(page, 'initial-load-default');

  // Check that key elements exist
  const controlsVisible = await page.isVisible('#controls');
  const statsVisible = await page.isVisible('#stats');
  const eventsVisible = await page.isVisible('#events');
  console.log(`  Controls panel visible: ${controlsVisible}`);
  console.log(`  Stats panel visible: ${statsVisible}`);
  console.log(`  Events panel visible: ${eventsVisible}`);

  // ============================================================
  // 2. SUN SPEED TESTS
  // ============================================================
  console.log('\n--- 2. Sun Speed Tests ---');

  // Min speed
  await setSlider(page, '#sun-speed', '0');
  await waitForAnimation(page, 1500);
  await screenshot(page, 'sun-speed-0');
  const sunSpeedVal0 = await page.textContent('#sun-speed-val');
  console.log(`  Sun speed 0: display = ${sunSpeedVal0}`);

  // Very low (0.1 = 0.01 effective due to quadratic)
  await setSlider(page, '#sun-speed', '0.1');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'sun-speed-0.1');
  const sunSpeedVal01 = await page.textContent('#sun-speed-val');
  console.log(`  Sun speed 0.1: display = ${sunSpeedVal01}`);

  // Medium (1.0)
  await setSlider(page, '#sun-speed', '1');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'sun-speed-1.0');

  // High (3.0)
  await setSlider(page, '#sun-speed', '3');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'sun-speed-3.0');

  // Max (5.0)
  await setSlider(page, '#sun-speed', '5');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'sun-speed-5.0-max');
  const sunSpeedVal5 = await page.textContent('#sun-speed-val');
  console.log(`  Sun speed 5.0: display = ${sunSpeedVal5}`);

  // Reset to 1.0
  await setSlider(page, '#sun-speed', '1');

  // ============================================================
  // 3. ORBITAL SPEED TESTS
  // ============================================================
  console.log('\n--- 3. Orbital Speed Tests ---');

  await setSlider(page, '#orbit-speed', '0');
  await waitForAnimation(page, 1500);
  await screenshot(page, 'orbit-speed-0-frozen');

  await setSlider(page, '#orbit-speed', '0.1');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'orbit-speed-0.1');
  const orbitVal01 = await page.textContent('#orbit-speed-val');
  console.log(`  Orbit speed 0.1: display = ${orbitVal01}`);

  await setSlider(page, '#orbit-speed', '1');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'orbit-speed-1.0');

  await setSlider(page, '#orbit-speed', '2');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'orbit-speed-2.0');

  await setSlider(page, '#orbit-speed', '3');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'orbit-speed-3.0-max');
  const orbitVal3 = await page.textContent('#orbit-speed-val');
  console.log(`  Orbit speed 3.0: display = ${orbitVal3}`);

  // Reset
  await setSlider(page, '#orbit-speed', '1');

  // ============================================================
  // 4. TRAIL LENGTH TESTS
  // ============================================================
  console.log('\n--- 4. Trail Length Tests ---');

  await setSlider(page, '#trail-length', '100');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'trail-length-100-min');

  await setSlider(page, '#trail-length', '500');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'trail-length-500');

  await setSlider(page, '#trail-length', '1000');
  await waitForAnimation(page, 3000);
  await screenshot(page, 'trail-length-1000');

  await setSlider(page, '#trail-length', '2000');
  await waitForAnimation(page, 4000);
  await screenshot(page, 'trail-length-2000-max');

  // Reset
  await setSlider(page, '#trail-length', '500');

  // ============================================================
  // 5. TRAIL OPACITY TESTS
  // ============================================================
  console.log('\n--- 5. Trail Opacity Tests ---');

  await setSlider(page, '#trail-opacity', '0.1');
  await waitForAnimation(page, 1500);
  await screenshot(page, 'trail-opacity-0.1-faint');

  await setSlider(page, '#trail-opacity', '0.5');
  await waitForAnimation(page, 1500);
  await screenshot(page, 'trail-opacity-0.5');

  await setSlider(page, '#trail-opacity', '1.0');
  await waitForAnimation(page, 1500);
  await screenshot(page, 'trail-opacity-1.0-full');

  // Reset
  await setSlider(page, '#trail-opacity', '0.6');

  // ============================================================
  // 6. TIME SPEED TESTS
  // ============================================================
  console.log('\n--- 6. Time Speed Tests ---');

  await setSlider(page, '#time-speed', '1');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'time-speed-1-slow');
  const dateAt1 = await page.textContent('#stat-date');
  console.log(`  Time speed 1: date = ${dateAt1}`);

  await setSlider(page, '#time-speed', '50');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'time-speed-50');

  await setSlider(page, '#time-speed', '100');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'time-speed-100-max');
  const dateAt100 = await page.textContent('#stat-date');
  console.log(`  Time speed 100: date = ${dateAt100}`);

  // Reset
  await setSlider(page, '#time-speed', '10');

  // ============================================================
  // 7. TOGGLE TESTS
  // ============================================================
  console.log('\n--- 7. Toggle Tests ---');

  // Labels OFF
  await setCheckbox(page, '#show-labels', false);
  await waitForAnimation(page, 1000);
  await screenshot(page, 'labels-off');

  // Labels ON
  await setCheckbox(page, '#show-labels', true);
  await waitForAnimation(page, 1000);
  await screenshot(page, 'labels-on');

  // Moons OFF
  await setCheckbox(page, '#show-moons', false);
  await waitForAnimation(page, 1500);
  await screenshot(page, 'moons-off');

  // Moons ON
  await setCheckbox(page, '#show-moons', true);
  await waitForAnimation(page, 1500);
  await screenshot(page, 'moons-on');

  // Grid OFF
  await setCheckbox(page, '#show-grid', false);
  await waitForAnimation(page, 1000);
  await screenshot(page, 'grid-off');

  // Grid ON
  await setCheckbox(page, '#show-grid', true);
  await waitForAnimation(page, 1000);
  await screenshot(page, 'grid-on');

  // Auto-follow OFF (camera stays in place as sun moves)
  await setCheckbox(page, '#auto-follow', false);
  await waitForAnimation(page, 3000);
  await screenshot(page, 'auto-follow-off');

  // Auto-follow ON
  await setCheckbox(page, '#auto-follow', true);
  await waitForAnimation(page, 1500);
  await screenshot(page, 'auto-follow-on');

  // Corona particles ON
  await setCheckbox(page, '#show-particles', true);
  await waitForAnimation(page, 2000);
  await screenshot(page, 'corona-particles-on');

  // Corona particles OFF
  await setCheckbox(page, '#show-particles', false);
  await waitForAnimation(page, 1000);
  await screenshot(page, 'corona-particles-off');

  // ============================================================
  // 8. CAMERA MODE TESTS
  // ============================================================
  console.log('\n--- 8. Camera Mode Tests ---');

  // Free (default)
  await setSelect(page, '#camera-mode', 'free');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'camera-free');

  // Cinematic
  await setSelect(page, '#camera-mode', 'cinematic');
  await waitForAnimation(page, 4000);
  await screenshot(page, 'camera-cinematic');

  // Orbital (top-down)
  await setSelect(page, '#camera-mode', 'orbital');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'camera-orbital-topdown');

  // Side view
  await setSelect(page, '#camera-mode', 'side');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'camera-side-vortex');

  // Chase cam
  await setSelect(page, '#camera-mode', 'chase');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'camera-chase');

  // Reset to free
  await setSelect(page, '#camera-mode', 'free');
  await waitForAnimation(page, 1000);

  // ============================================================
  // 9. ZOOM TESTS
  // ============================================================
  console.log('\n--- 9. Zoom Tests ---');

  // Zoom in close (simulate scroll)
  for (let i = 0; i < 30; i++) {
    await page.mouse.wheel(0, -100);
    await page.waitForTimeout(50);
  }
  await waitForAnimation(page, 1000);
  await screenshot(page, 'zoom-close');
  const zoomClose = await page.textContent('#stat-zoom');
  console.log(`  Zoom close: ${zoomClose}`);

  // Zoom out far
  for (let i = 0; i < 60; i++) {
    await page.mouse.wheel(0, 100);
    await page.waitForTimeout(50);
  }
  await waitForAnimation(page, 1000);
  await screenshot(page, 'zoom-far');
  const zoomFar = await page.textContent('#stat-zoom');
  console.log(`  Zoom far: ${zoomFar}`);

  // Reset view
  await page.click('#reset-view');
  await waitForAnimation(page, 1000);
  await screenshot(page, 'zoom-reset');

  // ============================================================
  // 10. PAUSE / RESUME
  // ============================================================
  console.log('\n--- 10. Pause/Resume ---');

  await page.click('#toggle-pause');
  await waitForAnimation(page, 1500);
  await screenshot(page, 'paused');
  const pauseBtnText = await page.textContent('#toggle-pause');
  console.log(`  Pause button text: "${pauseBtnText}"`);

  await page.click('#toggle-pause');
  await waitForAnimation(page, 1500);
  await screenshot(page, 'resumed');

  // ============================================================
  // 11. SCIENCE PANEL
  // ============================================================
  console.log('\n--- 11. Science Panel ---');

  // Click "Planet Info" button
  await page.click('#toggle-science');
  await waitForAnimation(page, 500);
  await screenshot(page, 'science-panel-sun-info');

  // Close it
  await page.click('#close-science');
  await waitForAnimation(page, 500);

  // Click "Accuracy" button
  await page.click('#toggle-accuracy');
  await waitForAnimation(page, 500);
  await screenshot(page, 'accuracy-panel');

  // Close it
  await page.click('#toggle-accuracy');

  // ============================================================
  // 12. TRUE SCALE
  // ============================================================
  console.log('\n--- 12. True Scale ---');

  await page.click('#toggle-scale');
  await waitForAnimation(page, 2000);
  await screenshot(page, 'true-scale-on');

  // Reset back
  await page.click('#toggle-scale');
  await waitForAnimation(page, 1500);
  await screenshot(page, 'true-scale-off');

  // ============================================================
  // 13. COMBINED VISUAL TESTS (best looking combos)
  // ============================================================
  console.log('\n--- 13. Visual Combo Tests ---');

  // Dramatic vortex: side view, long trails, high opacity, slow speed
  await setSelect(page, '#camera-mode', 'side');
  await setSlider(page, '#trail-length', '1500');
  await setSlider(page, '#trail-opacity', '0.9');
  await setSlider(page, '#sun-speed', '0.5');
  await setSlider(page, '#orbit-speed', '1.5');
  await setSlider(page, '#time-speed', '20');
  await waitForAnimation(page, 5000);
  await screenshot(page, 'combo-dramatic-vortex');

  // Clean minimal: no grid, no labels, short trails
  await setSelect(page, '#camera-mode', 'free');
  await page.click('#reset-view');
  await setCheckbox(page, '#show-labels', false);
  await setCheckbox(page, '#show-grid', false);
  await setSlider(page, '#trail-length', '200');
  await setSlider(page, '#trail-opacity', '0.4');
  await setSlider(page, '#sun-speed', '0.7');
  await waitForAnimation(page, 3000);
  await screenshot(page, 'combo-minimal-clean');

  // Full featured: everything on, corona, medium trails
  await setCheckbox(page, '#show-labels', true);
  await setCheckbox(page, '#show-grid', true);
  await setCheckbox(page, '#show-particles', true);
  await setSlider(page, '#trail-length', '800');
  await setSlider(page, '#trail-opacity', '0.7');
  await setSlider(page, '#sun-speed', '1');
  await setSlider(page, '#orbit-speed', '1');
  await setSlider(page, '#time-speed', '15');
  await waitForAnimation(page, 4000);
  await screenshot(page, 'combo-full-featured');

  // Cinematic beauty: cinematic cam, long trails, high opacity
  await setSelect(page, '#camera-mode', 'cinematic');
  await setSlider(page, '#trail-length', '1200');
  await setSlider(page, '#trail-opacity', '0.8');
  await setCheckbox(page, '#show-particles', true);
  await waitForAnimation(page, 6000);
  await screenshot(page, 'combo-cinematic-beauty');

  // Top-down map view
  await setSelect(page, '#camera-mode', 'orbital');
  await setSlider(page, '#trail-length', '1000');
  await setCheckbox(page, '#show-labels', true);
  await setCheckbox(page, '#show-particles', false);
  await waitForAnimation(page, 3000);
  await screenshot(page, 'combo-topdown-map');

  // Chase cam speed run
  await setSelect(page, '#camera-mode', 'chase');
  await setSlider(page, '#sun-speed', '2');
  await setSlider(page, '#orbit-speed', '2');
  await setSlider(page, '#trail-length', '600');
  await waitForAnimation(page, 4000);
  await screenshot(page, 'combo-chase-fast');

  // ============================================================
  // 14. DEFAULT CANDIDATE TESTS (finding best initial state)
  // ============================================================
  console.log('\n--- 14. Default Candidates ---');

  // Candidate A: Slightly elevated angle, medium speed
  await setSelect(page, '#camera-mode', 'free');
  await page.click('#reset-view');
  await setSlider(page, '#sun-speed', '0.5');
  await setSlider(page, '#orbit-speed', '0.7');
  await setSlider(page, '#trail-length', '700');
  await setSlider(page, '#trail-opacity', '0.7');
  await setSlider(page, '#time-speed', '15');
  await setCheckbox(page, '#show-labels', true);
  await setCheckbox(page, '#show-moons', true);
  await setCheckbox(page, '#show-grid', true);
  await setCheckbox(page, '#auto-follow', true);
  await setCheckbox(page, '#show-particles', false);
  // Set camera to a nice angle via evaluate
  await page.evaluate(() => {
    cameraRotation = { x: 0.4, y: 0.6 };
    cameraDistance = 150;
    updateCameraPosition();
  });
  await waitForAnimation(page, 4000);
  await screenshot(page, 'default-candidate-A');

  // Candidate B: More overhead, slower, longer trails
  await page.evaluate(() => {
    cameraRotation = { x: 0.7, y: 0.5 };
    cameraDistance = 180;
    updateCameraPosition();
  });
  await setSlider(page, '#sun-speed', '0.3');
  await setSlider(page, '#orbit-speed', '0.5');
  await setSlider(page, '#trail-length', '1000');
  await setSlider(page, '#trail-opacity', '0.65');
  await setSlider(page, '#time-speed', '20');
  await waitForAnimation(page, 5000);
  await screenshot(page, 'default-candidate-B');

  // Candidate C: Lower angle to see vortex helix more
  await page.evaluate(() => {
    cameraRotation = { x: 0.25, y: 0.9 };
    cameraDistance = 160;
    updateCameraPosition();
  });
  await setSlider(page, '#sun-speed', '0.4');
  await setSlider(page, '#orbit-speed', '0.6');
  await setSlider(page, '#trail-length', '800');
  await setSlider(page, '#trail-opacity', '0.7');
  await setSlider(page, '#time-speed', '15');
  await waitForAnimation(page, 5000);
  await screenshot(page, 'default-candidate-C');

  // Candidate D: Wide view showing full system
  await page.evaluate(() => {
    cameraRotation = { x: 0.5, y: 0.7 };
    cameraDistance = 250;
    updateCameraPosition();
  });
  await setSlider(page, '#sun-speed', '0.35');
  await setSlider(page, '#orbit-speed', '0.55');
  await setSlider(page, '#trail-length', '900');
  await setSlider(page, '#trail-opacity', '0.65');
  await setSlider(page, '#time-speed', '18');
  await waitForAnimation(page, 5000);
  await screenshot(page, 'default-candidate-D');

  // ============================================================
  // 15. UI/PANEL OVERLAP CHECK
  // ============================================================
  console.log('\n--- 15. Panel Overlap Check ---');

  // Open science + accuracy panels at same time
  await page.click('#toggle-science');
  await waitForAnimation(page, 500);
  await page.click('#toggle-accuracy');
  await waitForAnimation(page, 500);
  await screenshot(page, 'panel-overlap-check');

  // Close everything
  await page.click('#close-science');
  await page.click('#toggle-accuracy');

  // ============================================================
  // SUMMARY
  // ============================================================
  console.log(`\n=== Test Complete: ${testNum} screenshots taken ===`);
  console.log(`Screenshots saved to: ${SCREENSHOT_DIR}`);

  // Generate a summary of findings
  const stats = await page.evaluate(() => {
    return {
      date: document.getElementById('stat-date').textContent,
      distance: document.getElementById('stat-distance').textContent,
      zoom: document.getElementById('stat-zoom').textContent,
      planets: document.querySelectorAll('.planet-label').length,
      canvasWidth: document.querySelector('canvas')?.width,
      canvasHeight: document.querySelector('canvas')?.height
    };
  });
  console.log('\nFinal state:', JSON.stringify(stats, null, 2));

  await browser.close();
})();
