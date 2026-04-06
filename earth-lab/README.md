# earth-lab.ai Landing Page

A minimal, interactive 3D Earth visualization showcasing geological layers.

## Features

- **Minimal Design**: White background, monospace typography
- **Interactive 3D Earth**: Click and drag to rotate, auto-rotation when idle
- **Geological Layers**: Accurate representation of inner core, outer core, mantle, and crust
- **Responsive**: Works on desktop, tablet, and mobile devices
- **Semi-transparent**: Earth model sits behind text without obscuring readability

## Technical Stack

- **Three.js**: WebGL-based 3D rendering
- **Vanilla JS**: No additional frameworks
- **CSS Grid/Flexbox**: Responsive layout
- **Mobile-first**: Touch controls and adaptive sizing

## Geological Layer Details

1. **Inner Core** (20% radius): Solid iron-nickel, bright yellow
2. **Outer Core** (35% radius): Liquid iron-nickel, orange-gold  
3. **Mantle** (85% radius): Hot rock, red-orange
4. **Crust** (100% radius): Surface layer, brown

## Usage

Simply open `index.html` in a web browser or serve via HTTP server:

```bash
python3 -m http.server 8080
```

Visit `http://localhost:8080` to view the page.

## Deployment

Ready for deployment to johnspace.xyz/earth-lab/