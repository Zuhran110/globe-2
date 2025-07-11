// Globe.js - Interactive 3D Globe with Winner Locations
class WinnerGlobe {
    constructor() {
        this.globe = null;
        this.winnersData = [];
        this.isAutoRotating = false;
        this.animationSpeed = 0.5;
        this.currentIndex = 0;
        this.pinFactory = null;
        this.animationId = null;
        this.startTime = Date.now();
        
        this.init();
    }

    async init() {
        try {
            // Show loading
            this.showLoading();
            
            // Load winner data
            await this.loadWinnerData();
            
            // Initialize globe
            this.initGlobe();
            
            // Setup event listeners
            this.setupEventListeners();
            
            // Update stats
            this.updateStats();
            
            // Hide loading
            this.hideLoading();
            
        } catch (error) {
            console.error('Error initializing globe:', error);
            this.showError('Failed to load winner data. Please try again.');
        }
    }

    showLoading() {
        const globeContainer = document.getElementById('globeViz');
        globeContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                Loading winner data...
            </div>
        `;
    }

    hideLoading() {
        // The globe will replace the loading content
    }

    showError(message) {
        const globeContainer = document.getElementById('globeViz');
        globeContainer.innerHTML = `
            <div class="loading">
                <p style="color: #ff6b6b;">${message}</p>
            </div>
        `;
    }

    async loadWinnerData() {
        try {
            const response = await fetch('assets/winners.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            this.winnersData = await response.json();
        } catch (error) {
            console.error('Error loading winner data:', error);
            // Fallback to sample data if JSON fails to load
            this.winnersData = this.getSampleData();
        }
    }

    initGlobe() {
        Promise.all([
            fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson').then(res => res.json()),
            fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json').then(res => res.json())
        ]).then(([countries, states]) => {
            const globeContainer = document.getElementById('globeViz');

            // Initialize custom pin factory
            this.pinFactory = new CustomMapPin();
            console.log('Custom pin factory initialized:', this.pinFactory);
            
            // Create custom objects data with 3D pins
            const customObjectsData = this.winnersData.filter(d => d.state).map(winner => {
                const customPin = this.createCustomPin(winner);
                console.log('Created pin for', winner.name, ':', customPin);
                return {
                    ...winner,
                    customObject: customPin
                };
            });

            console.log('Custom objects data:', customObjectsData);

            // Try custom objects first, fallback to points if needed
            try {
                this.globe = Globe()
                    (globeContainer)
                    .backgroundColor('#FFFFFF')
                    .globeMaterial(new THREE.MeshPhongMaterial({ color: '#F5F5F5' }))
                    .polygonsData([...countries.features, ...states.features])
                    .polygonCapColor(feat => feat.properties.hasOwnProperty('name') ? 'rgba(0, 0, 0, 0)' : '#B41F27')
                    .polygonSideColor(() => '#000000')
                    .polygonAltitude(feat => feat.properties.hasOwnProperty('name') ? 0.006 : 0.005)
                    .objectsData(customObjectsData)
                    .objectLat(d => d.lat)
                    .objectLng(d => d.lng)
                    .objectAltitude(0.03)
                    .objectLabel(d => this.getPointLabel(d))
                    .onObjectClick(this.onPointClick.bind(this))
                    .onObjectHover(this.onPointHover.bind(this))
                    .enablePointerInteraction(true);
                
                console.log('Using custom objects for pins');
            } catch (error) {
                console.log('Custom objects failed, falling back to points:', error);
                
                // Fallback to points with custom colors
                this.globe = Globe()
                    (globeContainer)
                    .backgroundColor('#FFFFFF')
                    .globeMaterial(new THREE.MeshPhongMaterial({ color: '#F5F5F5' }))
                    .polygonsData([...countries.features, ...states.features])
                    .polygonCapColor(feat => feat.properties.hasOwnProperty('name') ? 'rgba(0, 0, 0, 0)' : '#B41F27')
                    .polygonSideColor(() => '#000000')
                    .polygonAltitude(feat => feat.properties.hasOwnProperty('name') ? 0.006 : 0.005)
                    .pointsData(this.winnersData.filter(d => d.state))
                    .pointLat(d => d.lat)
                    .pointLng(d => d.lng)
                    .pointColor(d => this.getPointColor(d))
                    .pointAltitude(0.03)
                    .pointRadius(3.0) // Make points larger and more visible
                    .pointLabel(d => this.getPointLabel(d))
                    .onPointClick(this.onPointClick.bind(this))
                    .onPointHover(this.onPointHover.bind(this))
                    .enablePointerInteraction(true);
            }

            // Set initial view to center on US
            this.globe.pointOfView({
                lat: 39.8283,
                lng: -98.5795,
                altitude: 2.0
            });

            // Start pin animation loop
            this.startPinAnimation();
        }).catch(err => console.error('Error loading geographic data:', err));
    }

    createCustomPin(winner) {
        // Create different pin styles based on winner data
        let pinStyle = 'default';
        let pinColor = '#4285F4';
        
        // You can customize pin style based on winner properties
        if (winner.category) {
            switch(winner.category.toLowerCase()) {
                case 'innovation':
                    pinStyle = 'star';
                    pinColor = '#4CAF50';
                    break;
                case 'community impact':
                    pinStyle = 'flag';
                    pinColor = '#2196F3';
                    break;
                case 'leadership':
                    pinStyle = 'trophy';
                    pinColor = '#FFD700';
                    break;
                case 'excellence':
                    pinStyle = 'star';
                    pinColor = '#9C27B0';
                    break;
                default:
                    pinStyle = 'default';
                    pinColor = '#4285F4';
            }
        }
        
        console.log('Creating pin with style:', pinStyle, 'color:', pinColor, 'for winner:', winner.name);
        
        // Create the pin with custom style and color
        const pin = this.pinFactory.createPinStyle(pinStyle, pinColor);
        console.log('Pin created:', pin);
        
        return pin;
    }

    getPointColor(winner) {
        // Return different colors based on category
        if (winner.category) {
            switch(winner.category.toLowerCase()) {
                case 'innovation':
                    return '#4CAF50'; // Green
                case 'community impact':
                    return '#2196F3'; // Blue
                case 'leadership':
                    return '#FFD700'; // Gold
                case 'excellence':
                    return '#9C27B0'; // Purple
                default:
                    return '#4285F4'; // Default blue
            }
        }
        return '#4285F4'; // Default blue
    }

    getPointLabel(winner) {
        return `
            <div style="background: rgba(0,0,0,0.8); padding: 10px; border-radius: 5px; color: white; font-size: 12px; max-width: 200px;">
                <strong>${winner.name}</strong><br/>
                ${winner.city}, ${winner.state}<br/>
                ${winner.year} - ${winner.prize}<br/>
                Category: ${winner.category}
            </div>
        `;
    }

    onPointClick(point) {
        if (point) {
            this.showWinnerDetails(point);
            // Animate to point
            this.globe.pointOfView({
                lat: point.lat,
                lng: point.lng,
                altitude: 1.5
            }, 1000);
        }
    }

    onPointHover(point) {
        if (point) {
            this.showWinnerDetails(point);
        } else {
            this.clearWinnerDetails();
        }
    }

    showWinnerDetails(winner) {
        const panel = document.getElementById('selectedWinner');
        panel.innerHTML = `
            <div class="winner-details">
                <div class="winner-detail">
                    <strong>Name:</strong> ${winner.name}
                </div>
                <div class="winner-detail">
                    <strong>Location:</strong> ${winner.city}, ${winner.state}
                </div>
                <div class="winner-detail">
                    <strong>Year:</strong> ${winner.year}
                </div>
                <div class="winner-detail">
                    <strong>Prize:</strong> ${winner.prize}
                </div>
                <div class="winner-detail">
                    <strong>Category:</strong> ${winner.category}
                </div>
            </div>
        `;
    }

    clearWinnerDetails() {
        const panel = document.getElementById('selectedWinner');
        panel.innerHTML = '<p>Hover over a pin to see winner details</p>';
    }

    startPinAnimation() {
        if (!this.globe || !this.pinFactory) return;
        
        const animate = () => {
            const time = (Date.now() - this.startTime) * 0.001;
            
            // Get all objects from the globe
            const objects = this.globe.objectsData();
            if (objects) {
                objects.forEach(obj => {
                    if (obj.customObject && obj.customObject.userData) {
                        this.pinFactory.updateAnimation(obj.customObject, time);
                    }
                });
            }
            
            this.animationId = requestAnimationFrame(animate);
        };
        
        animate();
    }

    stopPinAnimation() {
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    setupEventListeners() {
        // Auto-rotate toggle
        document.getElementById('autoRotate').addEventListener('click', () => {
            this.toggleAutoRotate();
        });

        // Animate pins
        document.getElementById('animatePins').addEventListener('click', () => {
            this.animatePins();
        });

        // Reset view
        document.getElementById('resetView').addEventListener('click', () => {
            this.resetView();
        });

        // Change pin style
        document.getElementById('changePinStyle').addEventListener('click', () => {
            this.changePinStyle();
        });
    }

    toggleAutoRotate() {
        this.isAutoRotating = !this.isAutoRotating;
        const button = document.getElementById('autoRotate');
        
        if (this.isAutoRotating) {
            button.textContent = 'Stop Auto-Rotate';
            button.style.background = 'rgba(255, 107, 107, 0.3)';
            this.startAutoRotate();
        } else {
            button.textContent = 'Start Auto-Rotate';
            button.style.background = 'rgba(255, 255, 255, 0.2)';
            this.stopAutoRotate();
        }
    }

    startAutoRotate() {
        if (!this.globe) return;
        
        this.globe.controls().autoRotate = true;
        this.globe.controls().autoRotateSpeed = this.animationSpeed;
    }

    stopAutoRotate() {
        if (!this.globe) return;
        
        this.globe.controls().autoRotate = false;
    }

    animatePins() {
        let index = 0;
        const animateNext = () => {
            if (index < this.winnersData.length) {
                const winner = this.winnersData[index];
                
                // Animate to winner location
                this.globe.pointOfView({
                    lat: winner.lat,
                    lng: winner.lng,
                    altitude: 1.2
                }, 1000);

                // Show winner details
                this.showWinnerDetails(winner);
                
                index++;
                setTimeout(animateNext, 2000);
            } else {
                // Reset view after animation
                setTimeout(() => {
                    this.resetView();
                }, 1000);
            }
        };
        
        animateNext();
    }

    resetView() {
        if (!this.globe) return;
        
        // Reset to US view
        this.globe.pointOfView({
            lat: 39.8283,
            lng: -98.5795,
            altitude: 2
        }, 1000);
        
        // Clear winner details
        this.clearWinnerDetails();
    }

    // Cleanup method to stop animations
    cleanup() {
        this.stopPinAnimation();
        this.stopAutoRotate();
    }

    changePinStyle() {
        if (!this.globe || !this.pinFactory) return;
        
        // Cycle through different pin styles
        const styles = ['default', 'star', 'flag', 'trophy'];
        const colors = ['#4285F4', '#4CAF50', '#2196F3', '#FFD700', '#9C27B0'];
        
        // Get current objects and update them
        const objects = this.globe.objectsData();
        if (objects) {
            objects.forEach((obj, index) => {
                const styleIndex = Math.floor(Math.random() * styles.length);
                const colorIndex = Math.floor(Math.random() * colors.length);
                const newPin = this.pinFactory.createPinStyle(styles[styleIndex], colors[colorIndex]);
                obj.customObject = newPin;
            });
            
            // Refresh the globe to show new pins
            this.globe.objectsData(objects);
        }
    }

    updateStats() {
        // Update total winners
        document.getElementById('totalWinners').textContent = this.winnersData.length;
        
        // Update total states
        const uniqueStates = [...new Set(this.winnersData.map(w => w.state))];
        document.getElementById('totalStates').textContent = uniqueStates.length;
    }
}

// Initialize the globe when the page loads
function initializeGlobe() {
    // Check if required libraries are available
    if (typeof Globe === 'undefined') {
        console.error('Globe.gl library not loaded');
        document.getElementById('globeViz').innerHTML = `
            <div class="loading">
                <p style="color: #ff6b6b;">3D Globe library failed to load. Please check your internet connection.</p>
                <button onclick="location.reload()" style="margin-top: 10px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">Retry</button>
            </div>
        `;
        return;
    }
    
    try {
        new WinnerGlobe();
    } catch (error) {
        console.error('Error creating WinnerGlobe:', error);
        document.getElementById('globeViz').innerHTML = `
            <div class="loading">
                <p style="color: #ff6b6b;">Failed to initialize the globe. Please refresh the page.</p>
                <button onclick="location.reload()" style="margin-top: 10px; padding: 10px 20px; background: #667eea; color: white; border: none; border-radius: 5px; cursor: pointer;">Retry</button>
            </div>
        `;
    }
}

// Multiple ways to ensure initialization
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeGlobe);
} else {
    // DOM is already ready
    initializeGlobe();
}

// Add resize handler for responsive design
window.addEventListener('resize', () => {
    // The globe will automatically handle resizing
});

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    switch(e.key) {
        case 'r':
        case 'R':
            document.getElementById('autoRotate').click();
            break;
        case 'a':
        case 'A':
            document.getElementById('animatePins').click();
            break;
        case 'p':
        case 'P':
            document.getElementById('changePinStyle').click();
            break;
        case 'Escape':
            document.getElementById('resetView').click();
            break;
    }
});

// Export for potential use in other scripts
window.WinnerGlobe = WinnerGlobe;