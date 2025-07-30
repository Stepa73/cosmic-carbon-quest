# 🌌 Cosmic Carbon Quest

A space-themed idle game where you explore the galaxy, scan for carbon deposits, and build your mining empire.

## ✨ Features

### 🎮 Gameplay
- **Galaxy Exploration**: Scan sectors to discover carbon deposits
- **Mining Operations**: Launch rockets to mine marked sectors
- **Market Trading**: Buy and sell carbon at fluctuating prices
- **Technology Upgrades**: Improve your telescope and rocket fleet

### 🎨 Visual Enhancements
- **Carbon Background Images**: Real carbon texture from [Tighten's game assets](https://game.tighten.com/storage/assets/carbon.jpg) with dynamic opacity based on carbon density
- **Responsive Tiles**: Bigger, touch-friendly tiles that scale across all devices
- **Cosmic Animations**: Particle effects, glowing elements, and smooth transitions
- **Space Theme**: Deep space gradients, nebula backgrounds, and cosmic color palette

### 🚀 Technical Features
- **React + TypeScript**: Modern, type-safe development
- **Tailwind CSS**: Utility-first styling with custom space theme
- **Vite**: Fast development and build tooling
- **Shadcn/ui**: Beautiful, accessible UI components

## 🎯 Carbon Density Visualization

The game now uses a real carbon texture image that appears on tiles with carbon deposits:

- **Low Carbon (0-25%)**: Subtle carbon background with light cyan overlay
- **Medium Carbon (25-50%)**: More visible carbon texture with medium overlay
- **High Carbon (50-75%)**: Prominent carbon background with strong overlay
- **Very High Carbon (75%+)**: Intense carbon texture with bright cyan overlay

The opacity and overlay intensity are dynamically calculated based on the carbon density percentage.

## 🛠️ Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## 🎨 Customization

The space theme uses HSL color variables for easy customization:

```css
:root {
  --space-void: 240 15% 5%;
  --space-deep: 250 20% 8%;
  --space-nebula: 260 25% 12%;
  --carbon-glow: 180 100% 70%;
  --scanner-beam: 200 80% 60%;
  --rocket-flame: 25 95% 65%;
  --energy-core: 280 90% 75%;
}
```

## 📱 Responsive Design

The game is fully responsive with:
- **Mobile-first design**: Optimized for touch interactions
- **Flexible grid system**: Adapts to different screen sizes
- **Scalable tiles**: From 2.5rem on mobile to 4rem on large screens
- **Touch-friendly**: Larger interactive elements for mobile devices

## 🌟 Animations

Enhanced with cosmic animations:
- `animate-cosmic-float`: Floating particle effects
- `glow-cosmic/carbon/energy`: Enhanced glow effects
- `animate-carbon-sparkle`: Sparkling carbon particles
- `animate-scan-beam`: Scanning beam animation
- `tile-hover`: Smooth hover effects with lift and glow

## 📄 License

This project is open source and available under the MIT License.
