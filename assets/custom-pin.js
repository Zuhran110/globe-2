// Custom 3D Map Pin Model for Globe.gl
class CustomMapPin {
    constructor() {
        this.pinGeometry = null;
        this.pinMaterial = null;
        this.pinMesh = null;
        this.createPinGeometry();
    }

    createPinGeometry() {
        // Create a custom pin shape using Three.js geometry
        const group = new THREE.Group();

        // Pin head (sphere)
        const headGeometry = new THREE.SphereGeometry(0.02, 8, 6);
        const headMaterial = new THREE.MeshPhongMaterial({ 
            color: '#4285F4',
            shininess: 100,
            specular: 0x444444
        });
        const head = new THREE.Mesh(headGeometry, headMaterial);
        head.position.y = 0.04;
        group.add(head);

        // Pin body (cylinder)
        const bodyGeometry = new THREE.CylinderGeometry(0.005, 0.008, 0.06, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: '#4285F4',
            shininess: 100,
            specular: 0x444444
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.01;
        group.add(body);

        // Pin tip (cone)
        const tipGeometry = new THREE.ConeGeometry(0.008, 0.03, 8);
        const tipMaterial = new THREE.MeshPhongMaterial({ 
            color: '#3367D6',
            shininess: 100,
            specular: 0x444444
        });
        const tip = new THREE.Mesh(tipGeometry, tipMaterial);
        tip.position.y = -0.02;
        tip.rotation.x = Math.PI; // Flip the cone
        group.add(tip);

        // Add a subtle shadow/glow effect
        const glowGeometry = new THREE.SphereGeometry(0.025, 8, 6);
        const glowMaterial = new THREE.MeshBasicMaterial({ 
            color: '#5B9BF8',
            transparent: true,
            opacity: 0.3
        });
        const glow = new THREE.Mesh(glowGeometry, glowMaterial);
        glow.position.y = 0.04;
        group.add(glow);

        // Add a small highlight on the head
        const highlightGeometry = new THREE.SphereGeometry(0.008, 8, 6);
        const highlightMaterial = new THREE.MeshBasicMaterial({ 
            color: '#FFFFFF',
            transparent: true,
            opacity: 0.6
        });
        const highlight = new THREE.Mesh(highlightGeometry, highlightMaterial);
        highlight.position.set(0.01, 0.05, 0.01);
        group.add(highlight);

        // Rotate the entire pin to point downward
        group.rotation.x = Math.PI;

        this.pinMesh = group;
    }

    // Method to create a pin instance with custom color
    createPin(color = '#4285F4', scale = 1.0) {
        const pinClone = this.pinMesh.clone();
        
        // Apply custom color to all parts except highlight
        pinClone.children.forEach(child => {
            if (child.material && child.material.color && child.material.color.getHexString() !== 'ffffff') {
                child.material = child.material.clone();
                child.material.color.setHex(color.replace('#', '0x'));
            }
        });

        // Apply scale
        pinClone.scale.set(scale, scale, scale);

        return pinClone;
    }

    // Method to create an animated pin with pulsing effect
    createAnimatedPin(color = '#4285F4', scale = 1.0) {
        const pin = this.createPin(color, scale);
        
        // Add animation properties
        pin.userData = {
            originalScale: scale,
            animationSpeed: 0.02,
            pulseDirection: 1
        };

        return pin;
    }

    // Update animation for pulsing pins
    updateAnimation(pin, time) {
        if (pin.userData && pin.userData.originalScale) {
            const pulse = Math.sin(time * pin.userData.animationSpeed) * 0.1 + 1;
            const newScale = pin.userData.originalScale * pulse;
            pin.scale.set(newScale, newScale, newScale);
        }
    }

    // Create a pin with different styles
    createPinStyle(style = 'default', color = '#4285F4') {
        console.log('Creating pin style:', style, 'with color:', color);
        const group = new THREE.Group();

        let pin;
        switch(style) {
            case 'star':
                pin = this.createStarPin(color);
                break;
            case 'flag':
                pin = this.createFlagPin(color);
                break;
            case 'trophy':
                pin = this.createTrophyPin(color);
                break;
            default:
                pin = this.createPin(color);
                break;
        }
        
        console.log('Pin created in factory:', pin);
        return pin;
    }

    createStarPin(color) {
        const group = new THREE.Group();

        // Create star shape using custom geometry
        const starGeometry = new THREE.BufferGeometry();
        const starVertices = [];
        const starIndices = [];

        // Create a 5-pointed star
        for (let i = 0; i < 5; i++) {
            const angle = (i * 2 * Math.PI) / 5;
            const outerRadius = 0.03;
            const innerRadius = 0.015;
            
            // Outer point
            starVertices.push(
                Math.cos(angle) * outerRadius,
                Math.sin(angle) * outerRadius,
                0
            );
            
            // Inner point
            const innerAngle = angle + Math.PI / 5;
            starVertices.push(
                Math.cos(innerAngle) * innerRadius,
                Math.sin(innerAngle) * innerRadius,
                0
            );
        }

        // Create faces
        for (let i = 0; i < 10; i += 2) {
            const next = (i + 2) % 10;
            starIndices.push(i, next, (i + 1) % 10);
            starIndices.push(next, (next + 1) % 10, (i + 1) % 10);
        }

        starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(starVertices, 3));
        starGeometry.setIndex(starIndices);
        starGeometry.computeVertexNormals();

        const starMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            shininess: 100,
            specular: 0x444444
        });
        const star = new THREE.Mesh(starGeometry, starMaterial);
        star.position.y = 0.04;
        group.add(star);

        // Add pin body
        const bodyGeometry = new THREE.CylinderGeometry(0.005, 0.008, 0.06, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            shininess: 100,
            specular: 0x444444
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.01;
        group.add(body);

        group.rotation.x = Math.PI;
        return group;
    }

    createFlagPin(color) {
        const group = new THREE.Group();

        // Pin body
        const bodyGeometry = new THREE.CylinderGeometry(0.005, 0.008, 0.08, 8);
        const bodyMaterial = new THREE.MeshPhongMaterial({ 
            color: '#CCCCCC',
            shininess: 100
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.position.y = 0.02;
        group.add(body);

        // Flag
        const flagGeometry = new THREE.PlaneGeometry(0.04, 0.025);
        const flagMaterial = new THREE.MeshPhongMaterial({ 
            color: color,
            side: THREE.DoubleSide
        });
        const flag = new THREE.Mesh(flagGeometry, flagMaterial);
        flag.position.set(0.02, 0.06, 0);
        group.add(flag);

        group.rotation.x = Math.PI;
        return group;
    }

    createTrophyPin(color) {
        const group = new THREE.Group();

        // Trophy cup
        const cupGeometry = new THREE.CylinderGeometry(0.02, 0.015, 0.04, 8);
        const cupMaterial = new THREE.MeshPhongMaterial({ 
            color: '#FFD700',
            shininess: 200,
            specular: 0x666666
        });
        const cup = new THREE.Mesh(cupGeometry, cupMaterial);
        cup.position.y = 0.04;
        group.add(cup);

        // Trophy handles
        const handleGeometry = new THREE.TorusGeometry(0.015, 0.003, 8, 16);
        const handleMaterial = new THREE.MeshPhongMaterial({ 
            color: '#FFD700',
            shininess: 200
        });
        
        const leftHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        leftHandle.position.set(-0.015, 0.04, 0);
        leftHandle.rotation.z = Math.PI / 2;
        group.add(leftHandle);

        const rightHandle = new THREE.Mesh(handleGeometry, handleMaterial);
        rightHandle.position.set(0.015, 0.04, 0);
        rightHandle.rotation.z = Math.PI / 2;
        group.add(rightHandle);

        // Trophy base
        const baseGeometry = new THREE.CylinderGeometry(0.008, 0.01, 0.02, 8);
        const baseMaterial = new THREE.MeshPhongMaterial({ 
            color: '#FFD700',
            shininess: 200
        });
        const base = new THREE.Mesh(baseGeometry, baseMaterial);
        base.position.y = 0.01;
        group.add(base);

        group.rotation.x = Math.PI;
        return group;
    }
}

// Export for use in other scripts
window.CustomMapPin = CustomMapPin; 