# Solar System Vortex

An interactive 3D visualization of the solar system showing planets orbiting the sun as it moves through space, creating beautiful helical vortex trails.

![Solar System Vortex](screenshot.png)

## Features

### Photorealistic Rendering
- **NASA 2K textures** on all planets, moons, and the sun (Solar System Scope, CC BY 4.0)
- **Earth**: Bump map topography, specular oceans, cloud layer, city lights nightmap
- **Fresnel shader atmospheres** on Earth, Venus, Mars, and all gas giants
- **ACES filmic tone mapping** with multi-layer starfield
- **Saturn's rings** with 5-band structure and Cassini division
- **1,500 asteroid belt** particles between Mars and Jupiter

### Earth Dive
Fly into low Earth orbit with smooth camera transitions:
- Click **Dive to Earth** or press **E**
- Camera transitions through: diving -> orbiting -> returning
- HUD overlay with altitude display (km and Earth radii)
- Press again to smoothly return to your previous view

### Follow Camera
Track any celestial body with the Follow dropdown:
- Sun (default), Mercury, Venus, Earth, Moon, Mars, Jupiter, Saturn, Uranus, Neptune
- All camera modes (free, cinematic, orbital, side, chase) work with any follow target
- "None" for fully free camera

### Interactive Controls
- **Sun Speed** - How fast the sun moves through space (ultra-fine 0.001 step)
- **Orbital Speed** - Planetary orbital speeds (ultra-fine 0.001 step)
- **Trail Length** - Trail history (100-2000 points)
- **Trail Opacity** - Trail visibility (0.2-1.0)
- **Time Speed** - Simulation speed (1-100 days/sec)
- **5 Camera Modes** - Free, Cinematic, Orbital, Side View, Chase

### Planetary Events
- Real-time **conjunction** and **opposition** tracking
- Precise dates and angular separation measurements
- Top 8 upcoming events displayed

### Science Panel
- Click any planet label for NASA data (radius, mass, gravity, temperature, atmosphere)
- True Scale mode shows real relative planet sizes
- Accuracy notes panel explains what's real vs. scaled

## Quick Start

Serve via a local web server (required for texture loading):

```bash
python -m http.server 8000
```

Then open `http://localhost:8000/solar_vortex.html`

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| **Space** | Pause / Resume |
| **R** | Reset camera view |
| **E** | Dive to Earth / Return |
| **Drag** | Rotate camera |
| **Scroll** | Zoom in/out |
| **Shift+Drag** | Pan camera |

## Tech Stack

- **Three.js** r128 - 3D rendering with custom GLSL shaders
- **Vanilla JS** - Zero dependencies beyond Three.js
- **NASA textures** - Solar System Scope 2K (CC BY 4.0)

## File Structure

```
solar-system/
├── solar_vortex.html       # Main visualization (standalone)
├── textures/               # NASA 2K textures (16 files, ~8MB)
├── e2e-visual-test.js      # Playwright E2E test suite
├── verify-rewrite.js       # Verification test suite
├── vortex_embed.html       # Full-page wrapper
├── vortex_card.html        # Card-style component
├── SolarVortex.jsx         # React component
└── screenshot.png          # Hero screenshot
```

## Scientific Accuracy

**Accurate:** Orbital periods, relative speeds, conjunction/opposition calculations, Saturn ring structure, NASA textures, vortex motion concept (solar system moves ~220 km/s through galaxy)

**Scaled for visualization:** Planet sizes, distances, circular orbits (real are elliptical), coplanar orbits (real have inclinations), vortex helix ratio

## Credits

- [Three.js](https://threejs.org/) - 3D graphics library
- [Solar System Scope](https://www.solarsystemscope.com/textures/) - NASA planetary textures (CC BY 4.0)
- Orbital data from NASA/JPL

## License

MIT
