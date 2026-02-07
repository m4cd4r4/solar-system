# Solar System Vortex - Quick Reference

## 🚀 Quick Start
```bash
# Just open in browser
open solar_vortex.html

# OR serve locally
python -m http.server 8000
# Then visit: http://localhost:8000/solar_vortex.html
```

## 🎮 Controls Cheat Sheet

### Mouse/Trackpad
| Action | Result |
|--------|--------|
| Drag | Rotate camera |
| Scroll | Zoom in/out |
| Shift + Drag | Pan camera |

### UI Controls
| Control | Range | Purpose |
|---------|-------|---------|
| Sun Speed | 0-5x | How fast sun moves through space |
| Orbital Speed | 0-3x | Planet rotation speed multiplier |
| Trail Length | 100-2000 | Points in vortex trails |
| Trail Opacity | 0.1-1.0 | Trail visibility |
| Time Speed | 1-100 days/sec | Simulation time rate |

### Toggles
- ☑️ Show Planet Labels
- ☑️ Show Moons
- ☑️ Show Reference Grid
- ☑️ Auto-Follow Sun
- ☐ Sun Corona Particles

### Buttons
- **Pause** - Stop/resume simulation
- **Reset View** - Return to default camera

## 📊 Statistics Panel

| Stat | Description |
|------|-------------|
| Distance | AU traveled by sun |
| Sim Time | Seconds elapsed |
| Date | Current simulation date |
| Planets | Always 8 |
| Moons | Always 16 |
| Camera | Distance from center |

## 🌍 Planetary Events

Shows top 8 upcoming:
- **Conjunctions** 🔗 - Planets align (same side of sun)
- **Oppositions** ↔️ - Planets opposite (different sides)

Each event shows:
- Planet pair
- Type of event
- Date of occurrence
- Days until event
- Current angular separation

## 🌌 Celestial Bodies

### Planets
1. Mercury - Gray, fast
2. Venus - Yellow-orange
3. Earth - Blue (with clouds)
4. Mars - Red
5. Jupiter - Brown-orange, largest
6. Saturn - Pale yellow
7. Uranus - Cyan
8. Neptune - Deep blue

### Moons (16 total)
- **Earth**: Moon
- **Mars**: Phobos, Deimos
- **Jupiter**: Io, Europa, Ganymede, Callisto
- **Saturn**: Titan, Rhea, Iapetus
- **Uranus**: Titania, Oberon
- **Neptune**: Triton

## 🎯 Embedding Options

### iFrame (Simplest)
```html
<iframe src="solar_vortex.html" 
        style="width:100%; height:800px">
</iframe>
```

### React (Most Flexible)
```jsx
import SolarVortex from './SolarVortex';
<SolarVortex height="800px" />
```

### Files to Use
- `solar_vortex.html` - Standalone
- `vortex_embed.html` - With header
- `vortex_card.html` - With info cards
- `SolarVortex.jsx` - React component

## ⚡ Performance Tips

**For smooth 60 FPS:**
- Reduce trail length to 500 or less
- Turn off corona particles
- Close other browser tabs
- Use modern browser (Chrome, Firefox, Safari)

**For dramatic visuals:**
- Increase trail length to 1500+
- Enable corona particles
- Increase trail opacity to 0.8+
- Slow down time speed to 5-10 days/sec

## 🔧 Customization

### Change Starting Date
Line ~XXX in `solar_vortex.html`:
```javascript
const startDate = new Date('2026-02-04T00:00:00');
```

### Change Planet Colors
Find `planetsData` array:
```javascript
{ name: 'Earth', color: 0x4a90e2, ... }
```

### Change Sun Speed
Default value:
```javascript
const sunSpeed = 0.5; // units per frame
```

## 🐛 Troubleshooting

| Problem | Solution |
|---------|----------|
| Black screen | Check WebGL support |
| Poor performance | Lower trail length |
| Events not showing | Wait ~1 second for calculation |
| Labels not visible | Check "Show Planet Labels" |
| Can't see planets | Zoom out (scroll) |

## 📱 Mobile Support

Works on mobile! Controls:
- **One finger** - Rotate
- **Two fingers** - Zoom
- **Two fingers drag** - Pan

## 🎨 Color Codes

```
Sun:     #FDB813 (golden)
Mercury: #8C7853 (gray-brown)
Venus:   #FFC649 (yellow)
Earth:   #4A90E2 (blue)
Mars:    #E27B58 (red-orange)
Jupiter: #C88B3A (brown-orange)
Saturn:  #FAD5A5 (pale gold)
Uranus:  #4FD0E7 (cyan)
Neptune: #4166F5 (deep blue)
```

## 📐 Technical Specs

- **Engine**: Three.js r128
- **Renderer**: WebGL
- **Geometry**: Sphere (32-64 segments)
- **Materials**: MeshStandardMaterial
- **Lighting**: Ambient + Point light
- **Stars**: 10,000 particles
- **Target FPS**: 60

## 💡 Pro Tips

1. **Best View**: Set time speed to 20-30 days/sec for smooth motion
2. **Screenshots**: Use browser's native screenshot tool
3. **Presentations**: Enable auto-follow and set predictable speeds
4. **Education**: Slow time to 1-5 days/sec to show real motion
5. **Art**: Max out trail length and opacity for beautiful patterns

---

**Need more help?** See `README.md` or `GIT_SETUP.md`
