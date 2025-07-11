// Fallback 2D Map Implementation
class FallbackMap {
    constructor() {
        this.winnersData = [];
        this.init();
    }

    async init() {
        try {
            this.showLoading();
            await this.loadWinnerData();
            this.initMap();
            this.setupEventListeners();
            this.updateStats();
        } catch (error) {
            console.error('Error initializing fallback map:', error);
            this.showError('Failed to load winner data. Please try again.');
        }
    }

    showLoading() {
        const mapContainer = document.getElementById('globeViz');
        mapContainer.innerHTML = `
            <div class="loading">
                <div class="spinner"></div>
                Loading winner data...
            </div>
        `;
    }

    showError(message) {
        const mapContainer = document.getElementById('globeViz');
        mapContainer.innerHTML = `
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

    initMap() {
        const mapContainer = document.getElementById('globeViz');
        mapContainer.innerHTML = `
            <div style="position: relative; width: 100%; height: 600px; background: linear-gradient(135deg, #1e3c72 0%, #2a5298 100%); border-radius: 10px; overflow: hidden;">
                <div style="position: absolute; top: 20px; left: 20px; color: white; font-size: 18px; font-weight: bold;">
                    📍 Winner Locations (2D View)
                </div>
                <div style="position: absolute; top: 50px; left: 20px; color: rgba(255,255,255,0.8); font-size: 14px;">
                    3D globe unavailable - showing simplified view
                </div>
                <div id="winnersList" style="position: absolute; top: 100px; left: 20px; right: 20px; bottom: 20px; overflow-y: auto;">
                    ${this.generateWinnersList()}
                </div>
            </div>
        `;
    }

    generateWinnersList() {
        return this.winnersData.map((winner, index) => `
            <div class="winner-card" style="background: rgba(255,255,255,0.1); margin: 10px 0; padding: 15px; border-radius: 8px; cursor: pointer; transition: all 0.3s ease; border-left: 4px solid ${this.getColorForCategory(winner.category)};" 
                 onclick="window.fallbackMap.selectWinner(${index})"
                 onmouseover="this.style.background='rgba(255,255,255,0.2)'"
                 onmouseout="this.style.background='rgba(255,255,255,0.1)'">
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <div>
                        <h3 style="color: white; margin: 0 0 5px 0; font-size: 16px;">${winner.name}</h3>
                        <p style="color: rgba(255,255,255,0.8); margin: 0; font-size: 14px;">
                            📍 ${winner.city}, ${winner.state}
                        </p>
                    </div>
                    <div style="text-align: right;">
                        <div style="color: #4CAF50; font-weight: bold; font-size: 16px;">${winner.prize}</div>
                        <div style="color: rgba(255,255,255,0.6); font-size: 12px;">${winner.year}</div>
                    </div>
                </div>
                <div style="margin-top: 8px; padding: 4px 8px; background: rgba(255,255,255,0.1); border-radius: 4px; display: inline-block;">
                    <span style="color: white; font-size: 12px;">${winner.category}</span>
                </div>
            </div>
        `).join('');
    }

    getColorForCategory(category) {
        const colorMap = {
            'Innovation': '#FF6B6B',
            'Excellence': '#4ECDC4',
            'Leadership': '#45B7D1',
            'Community Impact': '#96CEB4'
        };
        return colorMap[category] || '#FFA07A';
    }

    selectWinner(index) {
        const winner = this.winnersData[index];
        this.showWinnerDetails(winner);
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

    setupEventListeners() {
        // Disable 3D-specific controls since we're in fallback mode
        const controls = document.querySelectorAll('.control-btn');
        controls.forEach(btn => {
            btn.style.opacity = '0.5';
            btn.style.cursor = 'not-allowed';
            btn.disabled = true;
        });

        // Add a note about fallback mode
        const controlsContainer = document.querySelector('.controls');
        controlsContainer.innerHTML = `
            <div style="color: rgba(255,255,255,0.8); text-align: center; padding: 10px;">
                <p>📱 Simplified 2D view - 3D globe unavailable</p>
                <p style="font-size: 12px; margin-top: 5px;">Click on winner cards above to see details</p>
            </div>
        `;
    }

    updateStats() {
        document.getElementById('totalWinners').textContent = this.winnersData.length;
        const uniqueStates = [...new Set(this.winnersData.map(w => w.state))];
        document.getElementById('totalStates').textContent = uniqueStates.length;
    }
}

// Export for use
window.FallbackMap = FallbackMap; 