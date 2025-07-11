# 3D Interactive Globe - Previous Winners

A beautiful 3D interactive globe that displays winner locations across the United States with animations and detailed information panels.

## 🌟 Features

- **3D Interactive Globe**: Powered by Globe.gl and Three.js
- **Winner Locations**: Pins showing winner locations across the US
- **Hover Details**: Interactive tooltips with winner information
- **Auto-Rotate**: Automatic globe rotation with toggle control
- **Pin Animation**: Animated tour through all winner locations
- **Responsive Design**: Works on desktop and mobile devices
- **Modern UI**: Beautiful glass-morphism design with animations
- **Keyboard Shortcuts**: Quick access to features via keyboard
- **Statistics Panel**: Live stats showing total winners and states

## 🚀 Quick Start

1. **Open the Application**
   ```bash
   # Simply open index.html in your web browser
   # Or serve it with a local server for best results
   ```

2. **For Development Server** (recommended)
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx http-server
   
   # Using PHP
   php -S localhost:8000
   ```

3. **Access the Application**
   - Open your browser and go to `http://localhost:8000`
   - The globe will automatically load and display all winner locations

## 🎮 How to Use

### Interactive Controls
- **Mouse**: 
  - Click and drag to rotate the globe
  - Scroll to zoom in/out
  - Click on pins to view winner details
- **Keyboard Shortcuts**:
  - `R` - Toggle auto-rotate
  - `A` - Start pin animation tour
  - `Escape` - Reset view to US

### Control Buttons
- **Toggle Auto-Rotate**: Automatically rotates the globe
- **Animate Pins**: Takes you on a tour of all winner locations
- **Reset View**: Returns to the default US-centered view

## 📁 Project Structure

```
globe-2/
├── index.html              # Main HTML file
├── assets/
│   ├── winners.json        # Winner data with coordinates
│   ├── style.css          # Styling and animations
│   └── globe.js           # Globe functionality and interactions
└── README.md              # This file
```

## 🏆 Winner Data Format

The `assets/winners.json` file contains winner information in the following format:

```json
[
  {
    "name": "John Doe",
    "city": "Dallas",
    "state": "TX",
    "lat": 32.7767,
    "lng": -96.7970,
    "year": 2023,
    "prize": "$50,000",
    "category": "Innovation"
  }
]
```

### Required Fields
- `name`: Winner's full name
- `city`: Winner's city
- `state`: Winner's state (2-letter code)
- `lat`: Latitude coordinate
- `lng`: Longitude coordinate
- `year`: Year of winning
- `prize`: Prize amount
- `category`: Award category

## 🎨 Categories and Colors

Winners are color-coded by category:
- **Innovation**: Red (#FF6B6B)
- **Excellence**: Teal (#4ECDC4)
- **Leadership**: Blue (#45B7D1)
- **Community Impact**: Green (#96CEB4)

## 🔧 Customization

### Adding New Winners
1. Edit `assets/winners.json`
2. Add new winner objects with required fields
3. Use [LatLong.net](https://www.latlong.net/) to get coordinates
4. Refresh the page to see changes

### Styling Changes
- Modify `assets/style.css` for visual customization
- Update colors, fonts, and layout as needed
- CSS variables are used for easy theme changes

### Functionality Updates
- Edit `assets/globe.js` to add new features
- Modify animations, interactions, or data processing
- Add new control buttons or keyboard shortcuts

## 📱 Responsive Design

The globe automatically adjusts for different screen sizes:
- **Desktop**: Full-featured experience with all controls
- **Tablet**: Optimized layout with touch-friendly controls
- **Mobile**: Compact design with essential features

## 🌐 Integration with Shopify

To integrate with Shopify themes:

1. **Upload Assets**:
   - Upload `winners.json` to your theme's assets folder
   - Upload `style.css` and `globe.js` to assets folder

2. **Create Section**:
   ```liquid
   <!-- sections/winners-globe.liquid -->
   <div id="globeViz" style="width: 100%; height: 600px;"></div>
   
   {{ 'style.css' | asset_url | stylesheet_tag }}
   <script src="https://unpkg.com/three"></script>
   <script src="https://unpkg.com/globe.gl"></script>
   {{ 'globe.js' | asset_url | script_tag }}
   ```

3. **Add to Template**:
   ```liquid
   <!-- templates/page.winners.liquid -->
   {% section 'winners-globe' %}
   ```

## 🛠️ Technical Details

### Dependencies
- **Three.js**: 3D graphics library
- **Globe.gl**: Globe visualization built on Three.js
- **Modern Browser**: Requires WebGL support

### Performance
- Optimized for 50+ winner locations
- Efficient rendering with LOD (Level of Detail)
- Smooth 60fps animations on modern devices

### Browser Support
- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support
- Mobile browsers: Optimized experience

## 🐛 Troubleshooting

### Common Issues

1. **Globe Not Loading**
   - Check browser console for errors
   - Ensure internet connection for CDN resources
   - Verify JSON file is valid

2. **Slow Performance**
   - Reduce number of winners in JSON
   - Disable auto-rotate on mobile
   - Check WebGL support in browser

3. **Missing Winner Data**
   - Verify JSON syntax is correct
   - Check lat/lng coordinates are valid
   - Ensure all required fields are present

### Debug Mode
Add `?debug=true` to URL for additional console logging.

## 📄 License

This project is free to use and modify for personal and commercial purposes.

## 🤝 Contributing

Feel free to submit issues, feature requests, or pull requests to improve the globe experience.

---

**Enjoy exploring the interactive globe of winners!** 🌍✨ 