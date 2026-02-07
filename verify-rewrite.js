/**
 * Final E2E Verification - Solar System Vortex Rewrite
 * Tests: default view, Earth dive, Fresnel atmospheres, loading, controls
 */
const { chromium } = require('playwright');
const path = require('path');
const fs = require('fs');

const URL = 'http://localhost:8000/solar_vortex.html';
const SCREENSHOT_DIR = path.join(__dirname, 'verify-screenshots');

async function run() {
    if (!fs.existsSync(SCREENSHOT_DIR)) fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
    const page = await context.newPage();

    const results = [];
    let testNum = 0;

    async function screenshot(name, delay = 0) {
        if (delay) await page.waitForTimeout(delay);
        testNum++;
        const filename = `${String(testNum).padStart(2, '0')}-${name}.png`;
        await page.screenshot({ path: path.join(SCREENSHOT_DIR, filename) });
        console.log(`  [${testNum}] ${filename}`);
        return filename;
    }

    async function test(name, fn) {
        try {
            const result = await fn();
            results.push({ name, status: 'PASS', detail: result || '' });
            console.log(`✓ ${name}`);
        } catch (err) {
            results.push({ name, status: 'FAIL', detail: err.message });
            console.log(`✗ ${name}: ${err.message}`);
        }
    }

    console.log('=== Solar Vortex Rewrite Verification ===\n');

    // ─── Test 1: Loading overlay appears ───
    await test('Loading overlay visible on start', async () => {
        await page.goto(URL, { waitUntil: 'domcontentloaded' });
        const overlay = await page.$('#loading-overlay');
        const visible = await overlay.evaluate(el => !el.classList.contains('hidden'));
        if (!visible) throw new Error('Loading overlay not visible');
        await screenshot('loading-overlay', 200);
        return 'Loading overlay with progress bar shown';
    });

    // ─── Test 2: Loading completes ───
    await test('Loading completes and overlay hides', async () => {
        await page.waitForFunction(() => {
            const el = document.getElementById('loading-overlay');
            return el && el.classList.contains('hidden');
        }, { timeout: 30000 });
        await screenshot('loaded', 1000);
        return 'Loading overlay hidden after textures loaded';
    });

    // ─── Test 3: Default view angle ───
    await test('Default camera angle is correct (0.3, 0.7)', async () => {
        const cam = await page.evaluate(() => ({
            rotation: { ...cameraRotation },
            distance: cameraDistance,
            mode: cameraMode
        }));
        if (Math.abs(cam.rotation.x - 0.3) > 0.01) throw new Error(`rotation.x: ${cam.rotation.x}`);
        if (Math.abs(cam.rotation.y - 0.7) > 0.01) throw new Error(`rotation.y: ${cam.rotation.y}`);
        if (cam.distance !== 160) throw new Error(`distance: ${cam.distance}`);
        if (cam.mode !== 'free') throw new Error(`mode: ${cam.mode}`);
        return `rotation: ${JSON.stringify(cam.rotation)}, dist: ${cam.distance}`;
    });

    // ─── Test 4: Default speed settings ───
    await test('Default speeds are correct (sun=0.09, orbit=0.36)', async () => {
        const state = await page.evaluate(() => ({
            sunSpeed: currentSunSpeed,
            orbitSpeed: orbitSpeedMultiplier,
            trailOpacity,
            daysPerSecond,
            showGrid,
            showParticles
        }));
        if (Math.abs(state.sunSpeed - 0.09) > 0.01) throw new Error(`sunSpeed: ${state.sunSpeed}`);
        if (Math.abs(state.orbitSpeed - 0.36) > 0.01) throw new Error(`orbitSpeed: ${state.orbitSpeed}`);
        if (state.trailOpacity !== 0.7) throw new Error(`trailOpacity: ${state.trailOpacity}`);
        if (state.daysPerSecond !== 15) throw new Error(`daysPerSecond: ${state.daysPerSecond}`);
        if (state.showGrid !== false) throw new Error('Grid should be OFF');
        if (state.showParticles !== false) throw new Error('Corona should be OFF');
        return `sun=${state.sunSpeed}, orbit=${state.orbitSpeed}, trails=${state.trailOpacity}`;
    });

    // ─── Test 5: Grid is OFF by default ───
    await test('Grid checkbox is unchecked by default', async () => {
        const checked = await page.$eval('#show-grid', el => el.checked);
        if (checked) throw new Error('Grid checkbox should be unchecked');
        return 'Grid OFF by default';
    });

    // ─── Test 6: Planets exist and have positions ───
    await test('All 8 planets are in scene', async () => {
        const count = await page.evaluate(() => planets.length);
        if (count !== 8) throw new Error(`Expected 8 planets, got ${count}`);
        const names = await page.evaluate(() => planets.map(p => p.name));
        return `Planets: ${names.join(', ')}`;
    });

    // ─── Test 7: Atmosphere meshes exist ───
    await test('Atmosphere meshes created for Earth, Venus, Mars, gas giants', async () => {
        const atmos = await page.evaluate(() => ({
            earth: !!planets.find(p => p.name === 'Earth').atmosphereMesh,
            venus: !!planets.find(p => p.name === 'Venus').venusAtmo,
            mars: !!planets.find(p => p.name === 'Mars').marsAtmo,
            jupiter: !!planets.find(p => p.name === 'Jupiter').gasGiantAtmo,
            saturn: !!planets.find(p => p.name === 'Saturn').gasGiantAtmo,
            uranus: !!planets.find(p => p.name === 'Uranus').gasGiantAtmo,
            neptune: !!planets.find(p => p.name === 'Neptune').gasGiantAtmo,
        }));
        const missing = Object.entries(atmos).filter(([,v]) => !v).map(([k]) => k);
        if (missing.length) throw new Error(`Missing atmospheres: ${missing.join(', ')}`);
        return 'All atmosphere meshes present';
    });

    // ─── Test 8: Earth has cloud layer ───
    await test('Earth has cloud mesh', async () => {
        const hasClouds = await page.evaluate(() => !!planets.find(p => p.name === 'Earth').cloudsMesh);
        if (!hasClouds) throw new Error('No cloud mesh on Earth');
        return 'Earth clouds present';
    });

    // ─── Test 9: Trail system using Map ───
    await test('Trail system uses Map for cleanup', async () => {
        const isMap = await page.evaluate(() => trailLines instanceof Map);
        if (!isMap) throw new Error('trailLines is not a Map');
        // Wait for some trails to form
        await page.waitForTimeout(2000);
        const trailCount = await page.evaluate(() => trailLines.size);
        if (trailCount < 1) throw new Error('No trail lines after 2s');
        return `Trail lines: ${trailCount}`;
    });

    // ─── Test 10: ACES tone mapping ───
    await test('Renderer uses ACES filmic tone mapping', async () => {
        const toneMapping = await page.evaluate(() => renderer.toneMapping);
        // THREE.ACESFilmicToneMapping = 4
        if (toneMapping !== 4) throw new Error(`Tone mapping: ${toneMapping} (expected 4)`);
        return 'ACES filmic active';
    });

    // ─── Test 11: Screenshot the default view ───
    await test('Default view screenshot (after 3s of animation)', async () => {
        await screenshot('default-view-3s', 3000);
        return 'Default view captured';
    });

    // ─── Test 12: Earth Dive button exists ───
    await test('Earth Dive button visible', async () => {
        const btn = await page.$('#earth-dive-btn');
        if (!btn) throw new Error('Earth dive button not found');
        const text = await btn.textContent();
        if (text !== 'Dive to Earth') throw new Error(`Button text: ${text}`);
        return 'Button text: "Dive to Earth"';
    });

    // ─── Test 13: Start Earth Dive ───
    await test('Earth Dive starts correctly', async () => {
        await page.click('#earth-dive-btn');
        await page.waitForTimeout(200);
        const state = await page.evaluate(() => ({
            diveState,
            mode: cameraMode,
            btnText: document.getElementById('earth-dive-btn').textContent,
            hudVisible: document.getElementById('dive-hud').classList.contains('visible'),
            altVisible: document.getElementById('dive-altitude').classList.contains('visible')
        }));
        if (state.diveState !== 'diving') throw new Error(`diveState: ${state.diveState}`);
        if (state.mode !== 'dive') throw new Error(`cameraMode: ${state.mode}`);
        if (state.btnText !== 'Exit Orbit') throw new Error(`btn text: ${state.btnText}`);
        if (!state.hudVisible) throw new Error('HUD not visible');
        if (!state.altVisible) throw new Error('Altitude not visible');
        await screenshot('dive-start', 500);
        return `State: ${state.diveState}, HUD visible, altitude visible`;
    });

    // ─── Test 14: Dive progresses to orbiting ───
    await test('Dive transitions to orbiting state', async () => {
        // Wait up to 10s for dive to complete
        await page.waitForFunction(() => diveState === 'orbiting', { timeout: 10000 });
        await screenshot('dive-orbiting', 1000);
        const alt = await page.$eval('#dive-altitude', el => el.textContent);
        return `Orbiting Earth. Altitude display: ${alt}`;
    });

    // ─── Test 15: Screenshot while orbiting ───
    await test('Close-up Earth orbit screenshot', async () => {
        await screenshot('earth-orbit-closeup', 2000);
        return 'Earth orbit captured';
    });

    // ─── Test 16: Return from dive ───
    await test('Return from Earth dive', async () => {
        await page.click('#earth-dive-btn');
        await page.waitForTimeout(200);
        const state = await page.evaluate(() => diveState);
        if (state !== 'returning') throw new Error(`Expected returning, got: ${state}`);
        await screenshot('dive-returning', 1000);
        // Wait for return complete
        await page.waitForFunction(() => diveState === 'none', { timeout: 10000 });
        await screenshot('dive-returned', 500);
        const btn = await page.$eval('#earth-dive-btn', el => el.textContent);
        if (btn !== 'Dive to Earth') throw new Error(`Button text after return: ${btn}`);
        return 'Successfully returned from Earth orbit';
    });

    // ─── Test 17: Camera restored after dive ───
    await test('Camera state restored after dive return', async () => {
        const cam = await page.evaluate(() => ({
            rotation: { ...cameraRotation },
            distance: cameraDistance,
            mode: cameraMode
        }));
        if (cam.mode !== 'free') throw new Error(`Mode after return: ${cam.mode}`);
        if (Math.abs(cam.distance - 160) > 5) throw new Error(`Distance after return: ${cam.distance}`);
        return `Mode: ${cam.mode}, Distance: ${cam.distance}`;
    });

    // ─── Test 18: Keyboard shortcut E triggers dive ───
    await test('Keyboard shortcut E triggers Earth dive', async () => {
        await page.keyboard.press('e');
        await page.waitForTimeout(300);
        const state = await page.evaluate(() => diveState);
        if (state !== 'diving') throw new Error(`diveState after E: ${state}`);
        // Return immediately
        await page.keyboard.press('e');
        await page.waitForFunction(() => diveState === 'returning' || diveState === 'none', { timeout: 5000 });
        // Wait for full return
        await page.waitForFunction(() => diveState === 'none', { timeout: 15000 });
        return 'E key triggers dive, second E returns';
    });

    // ─── Test 19: Space pauses ───
    await test('Space key pauses/resumes', async () => {
        await page.keyboard.press('Space');
        const paused = await page.evaluate(() => isPaused);
        if (!paused) throw new Error('Space did not pause');
        await page.keyboard.press('Space');
        const resumed = await page.evaluate(() => isPaused);
        if (resumed) throw new Error('Space did not resume');
        return 'Space toggles pause correctly';
    });

    // ─── Test 20: Toggle grid ON ───
    await test('Grid toggle works', async () => {
        await page.click('#show-grid');
        await page.waitForTimeout(500);
        const visible = await page.evaluate(() => referenceGrid.visible);
        if (!visible) throw new Error('Grid not visible after toggle');
        await screenshot('grid-on', 300);
        // Toggle off again
        await page.click('#show-grid');
        return 'Grid toggles ON/OFF';
    });

    // ─── Test 21: Camera modes ───
    await test('All 5 camera modes work', async () => {
        const modes = ['cinematic', 'orbital', 'side', 'chase', 'free'];
        for (const mode of modes) {
            await page.selectOption('#camera-mode', mode);
            await page.waitForTimeout(800);
            await screenshot(`camera-${mode}`, 200);
        }
        return `Tested modes: ${modes.join(', ')}`;
    });

    // ─── Test 22: Science panel ───
    await test('Science panel opens and closes', async () => {
        await page.click('#toggle-science');
        await page.waitForTimeout(300);
        const visible = await page.evaluate(() => document.getElementById('science-panel').style.display !== 'none');
        if (!visible) throw new Error('Science panel did not open');
        await screenshot('science-panel', 200);
        await page.click('#close-science');
        await page.waitForTimeout(200);
        const hidden = await page.evaluate(() => document.getElementById('science-panel').style.display === 'none');
        if (!hidden) throw new Error('Science panel did not close');
        return 'Science panel opens/closes';
    });

    // ─── Test 23: Planet label click opens info ───
    await test('Clicking planet label opens science panel', async () => {
        // Find Earth label and click it
        const labels = await page.$$('.planet-label');
        let earthLabel = null;
        for (const l of labels) {
            const text = await l.textContent();
            if (text === 'Earth') { earthLabel = l; break; }
        }
        if (!earthLabel) throw new Error('Earth label not found');
        await earthLabel.click();
        await page.waitForTimeout(300);
        const title = await page.$eval('#science-panel-title', el => el.textContent);
        if (title !== 'Earth') throw new Error(`Panel title: ${title}`);
        await screenshot('earth-info', 200);
        await page.click('#close-science');
        return 'Earth label click shows science panel with correct data';
    });

    // ─── Test 24: True scale ───
    await test('True scale toggle works', async () => {
        await page.click('#toggle-scale');
        await page.waitForTimeout(500);
        const trueScale = await page.evaluate(() => trueScaleMode);
        if (!trueScale) throw new Error('True scale not activated');
        await screenshot('true-scale', 500);
        // Jupiter should be huge
        const jupiterGeo = await page.evaluate(() => {
            const j = planets.find(p => p.name === 'Jupiter');
            return j.mesh.geometry.parameters.radius;
        });
        if (jupiterGeo < 20) throw new Error(`Jupiter radius in true scale: ${jupiterGeo} (should be ~27)`);
        // Toggle back
        await page.click('#toggle-scale');
        return `True scale: Jupiter radius = ${jupiterGeo.toFixed(1)}`;
    });

    // ─── Test 25: Speed controls - sun speed ───
    await test('Sun speed slider works with quadratic curve', async () => {
        await page.fill('#sun-speed', '2.0');
        await page.dispatchEvent('#sun-speed', 'input');
        const val = await page.evaluate(() => currentSunSpeed);
        if (Math.abs(val - 4.0) > 0.01) throw new Error(`Sun speed at slider 2.0: ${val} (expected 4.0)`);
        // Reset
        await page.fill('#sun-speed', '0.3');
        await page.dispatchEvent('#sun-speed', 'input');
        return `Quadratic: slider 2.0 → speed 4.0`;
    });

    // ─── Test 26: Accuracy panel ───
    await test('Accuracy panel toggles', async () => {
        await page.click('#toggle-accuracy');
        await page.waitForTimeout(200);
        const visible = await page.evaluate(() => document.getElementById('accuracy-panel').style.display !== 'none');
        if (!visible) throw new Error('Accuracy panel did not open');
        await screenshot('accuracy-panel', 200);
        await page.click('#toggle-accuracy');
        return 'Accuracy panel toggles on/off';
    });

    // ─── Test 27: Recording functionality ───
    await test('Video recording buttons exist', async () => {
        const startBtn = await page.$('#export-video-start');
        const stopBtn = await page.$('#export-video-stop');
        if (!startBtn || !stopBtn) throw new Error('Recording buttons not found');
        return 'Recording UI present';
    });

    // ─── Test 28: Trail opacity slider ───
    await test('Trail opacity slider', async () => {
        await page.fill('#trail-opacity', '0.5');
        await page.dispatchEvent('#trail-opacity', 'input');
        const val = await page.evaluate(() => trailOpacity);
        if (Math.abs(val - 0.5) > 0.01) throw new Error(`Trail opacity: ${val}`);
        await page.fill('#trail-opacity', '0.7');
        await page.dispatchEvent('#trail-opacity', 'input');
        return 'Trail opacity adjusts correctly';
    });

    // ─── Test 29: Final beauty screenshot ───
    await test('Final beauty screenshot (10s animation)', async () => {
        // Reset to good defaults
        await page.click('#reset-view');
        await page.waitForTimeout(10000);
        await screenshot('final-beauty', 500);
        return 'Final beauty shot captured after 10s of trails';
    });

    // ─── Summary ───
    console.log('\n=== VERIFICATION RESULTS ===');
    const passed = results.filter(r => r.status === 'PASS').length;
    const failed = results.filter(r => r.status === 'FAIL').length;
    console.log(`\nTotal: ${results.length} | Passed: ${passed} | Failed: ${failed}`);

    if (failed > 0) {
        console.log('\nFailed tests:');
        results.filter(r => r.status === 'FAIL').forEach(r => {
            console.log(`  ✗ ${r.name}: ${r.detail}`);
        });
    }

    console.log(`\nScreenshots saved to: ${SCREENSHOT_DIR}`);
    console.log(`Total screenshots: ${testNum}`);

    await browser.close();
    return { passed, failed, total: results.length };
}

run().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
