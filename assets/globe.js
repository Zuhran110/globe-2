// Globe.js - Interactive 3D Globe with Winner Locations
class WinnerGlobe {
    constructor() {
        this.globe = null;
        this.winnersData = [];
        this.isAutoRotating = false;
        this.animationSpeed = 0.5;
        this.currentIndex = 0;
        
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

    getSampleData() {
        return [
            {
                "name": "John Doe",
                "city": "Dallas",
                "state": "TX",
                "lat": 32.7767,
                "lng": -96.7970,
                "year": 2023,
                "prize": "$50,000",
                "category": "Innovation"
            },
            {
                "name": "Jane Smith",
                "city": "Denver",
                "state": "CO",
                "lat": 39.7392,
                "lng": -104.9903,
                "year": 2023,
                "prize": "$25,000",
                "category": "Community Impact"
            }
        ];
    }

    initGlobe() {
        Promise.all([
            fetch('https://raw.githubusercontent.com/vasturiano/react-globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson').then(res => res.json()),
            fetch('https://raw.githubusercontent.com/PublicaMundi/MappingAPI/master/data/geojson/us-states.json').then(res => res.json())
        ]).then(([countries, states]) => {
            const globeContainer = document.getElementById('globeViz');

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
                .pointRadius(1.5)
                .pointLabel(d => this.getPointLabel(d))
                .onPointClick(this.onPointClick.bind(this))
                .onPointHover(this.onPointHover.bind(this))
                .enablePointerInteraction(true);

            // Set initial view to center on US
            this.globe.pointOfView({
                lat: 39.8283,
                lng: -98.5795,
                altitude: 2.0
            });
        }).catch(err => console.error('Error loading geographic data:', err));
    }

    getPointColor(winner) {
        // Change point color to blue similar to Google Maps indication
        return '#4285F4';
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
        case 'Escape':
            document.getElementById('resetView').click();
            break;
    }
});

// Export for potential use in other scripts
window.WinnerGlobe = WinnerGlobe;