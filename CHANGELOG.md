# Changelog

All notable changes to the Solar System Vortex project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Planned
- Camera view modes (cinematic, orbital, multi-plane)
- Photo-realistic planet textures (CORS-friendly sources)
- Saturn's rings
- Asteroid belt
- Export screenshots/video

## [1.0.0] - 2026-02-07

### Added
- Initial release of Solar System Vortex visualization
- 8 planets with accurate orbital periods
- 16 moons orbiting their parent planets
- Interactive speed controls (sun speed, orbital speed, time speed)
- Trail system with configurable length and opacity
- Real-time planetary event tracking (conjunctions & oppositions)
- Date/time simulation system
- Enhanced 3D graphics with MeshStandardMaterial
- Multi-layered sun glow effect
- Earth cloud layer with independent rotation
- Reference grid showing motion through space
- 10,000 star background with color variation
- Planet and moon labels with visibility toggle
- Auto-follow camera mode
- Optional sun corona particle effects (2,000 particles)
- Statistics panel (distance, time, date, camera)
- Planetary events panel with top 8 upcoming events
- Mouse controls (rotate, zoom, pan)
- Pause/resume functionality
- Multiple embedding options:
  - Standalone HTML
  - Full-page wrapper
  - Card component
  - React component
- Comprehensive documentation (README, setup guide)
- Loading screen with progress indicator

### Technical Details
- Built with Three.js r128
- Self-contained (no external dependencies)
- 60 FPS performance
- Responsive design
- Mobile-friendly controls
- WebGL-based rendering
- No CORS issues (all assets inline)

### Files
- `solar_vortex.html` - Main visualization
- `vortex_embed.html` - Full-page wrapper
- `vortex_card.html` - Card component
- `SolarVortex.jsx` - React component
- `README.md` - Documentation
- `.gitignore` - Git ignore rules
- `GIT_SETUP.md` - Repository setup guide
- `CHANGELOG.md` - This file

---

## Version History Format

### [Version] - YYYY-MM-DD

#### Added
- New features

#### Changed
- Changes to existing functionality

#### Deprecated
- Soon-to-be removed features

#### Removed
- Removed features

#### Fixed
- Bug fixes

#### Security
- Security updates

---

[Unreleased]: https://github.com/YOUR_USERNAME/solar-system/compare/v1.0.0...HEAD
[1.0.0]: https://github.com/YOUR_USERNAME/solar-system/releases/tag/v1.0.0
