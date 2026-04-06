// Earth Lab - earthjs (README example) + Three.js geological layers

let earthjsGlobe;
let threeScene, threeCamera, threeRenderer, geologicalGroup;
let geologicalLayers = [];

// Interaction state
let isExploded = false;
let isDragging = false;
let dragThreshold = 5;
let startX = 0, startY = 0;

// Initialize everything
function init() {
    // First: Create earthjs globe using exact README example pattern
    createEarthJSGlobe();
    
    // Second: Add Three.js geological layers behind it
    createGeologicalLayers();
    
    // Third: Setup click interactions on the earthjs globe
    setupInteractions();
    
    // Fourth: Start render loop for Three.js
    animate();
}

function createEarthJSGlobe() {
    // Calculate responsive globe size
    const minDim = Math.min(window.innerWidth, window.innerHeight);
    const globeSize = Math.min(600, minDim * 0.8); // Cap at 600px for performance
    
    // Use the exact earthjs README example pattern
    const g = earthjs({
        width: globeSize,
        height: globeSize
    })
    .register(earthjs.plugins.graticuleSvg())
    .register(earthjs.plugins.autorotatePlugin(10))
    .register(earthjs.plugins.worldSvg('https://unpkg.com/world-atlas/world/110m.json'))
    .svg('#earth');
    
    g.ready(function() {
        g.create();
        earthjsGlobe = g; // Store reference
    });
}

function createGeologicalLayers() {
    // Create Three.js scene for geological layers
    threeScene = new THREE.Scene();
    
    const aspect = window.innerWidth / window.innerHeight;
    threeCamera = new THREE.PerspectiveCamera(50, aspect, 0.1, 2000);
    threeCamera.position.z = 800;
    
    threeRenderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true
    });
    threeRenderer.setSize(window.innerWidth, window.innerHeight);
    threeRenderer.setClearColor(0xffffff, 0);
    threeRenderer.domElement.id = 'geological-canvas';
    document.body.appendChild(threeRenderer.domElement);
    
    // Geological layers group
    geologicalGroup = new THREE.Group();
    threeScene.add(geologicalGroup);
    
    // Create geological spheres (scaled to match earthjs globe)
    const minDim = Math.min(window.innerWidth, window.innerHeight);
    const baseRadius = minDim * 0.2; // Scale to match earthjs globe
    
    const layerData = [
        { name: 'inner_core', radius: baseRadius * 0.2, color: 0xffff99, opacity: 0.7, explodedDistance: 0 },
        { name: 'outer_core', radius: baseRadius * 0.35, color: 0xffcc00, opacity: 0.6, explodedDistance: baseRadius * 0.8 },
        { name: 'mantle', radius: baseRadius * 0.85, color: 0xff4500, opacity: 0.5, explodedDistance: baseRadius * 1.5 },
        { name: 'crust', radius: baseRadius * 1.0, color: 0x8b7355, opacity: 0.4, explodedDistance: baseRadius * 2.2 }
    ];
    
    layerData.forEach((layerInfo) => {
        const geometry = new THREE.SphereGeometry(layerInfo.radius, 32, 32);
        const material = new THREE.MeshLambertMaterial({
            color: layerInfo.color,
            transparent: true,
            opacity: layerInfo.opacity,
            side: THREE.DoubleSide
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.name = layerInfo.name;
        sphere.userData.explodedDistance = layerInfo.explodedDistance;
        sphere.userData.originalPosition = new THREE.Vector3(0, 0, 0);
        
        geologicalLayers.push(sphere);
        geologicalGroup.add(sphere);
    });
    
    // Add lighting for Three.js
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    threeScene.add(ambientLight);
    
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
    directionalLight.position.set(-1, 1, 1);
    threeScene.add(directionalLight);
}

function setupInteractions() {
    const earthSvg = document.getElementById('earth');
    
    // Mouse events
    earthSvg.addEventListener('mousedown', onPointerStart, false);
    earthSvg.addEventListener('mousemove', onPointerMove, false);
    earthSvg.addEventListener('mouseup', onPointerEnd, false);
    earthSvg.addEventListener('mouseleave', onPointerEnd, false);
    
    // Touch events
    earthSvg.addEventListener('touchstart', onPointerStart, false);
    earthSvg.addEventListener('touchmove', onPointerMove, false);
    earthSvg.addEventListener('touchend', onPointerEnd, false);
    
    // Window resize
    window.addEventListener('resize', onWindowResize, false);
    
    // Prevent context menu
    earthSvg.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
}

function onPointerStart(event) {
    isDragging = false;
    
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);
    
    startX = clientX;
    startY = clientY;
}

function onPointerMove(event) {
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);
    
    const totalDeltaX = Math.abs(clientX - startX);
    const totalDeltaY = Math.abs(clientY - startY);
    
    if (totalDeltaX > dragThreshold || totalDeltaY > dragThreshold) {
        isDragging = true;
    }
}

function onPointerEnd(event) {
    if (!isDragging) {
        // Single tap/click - toggle exploded view
        toggleExplodedView();
    }
}

function toggleExplodedView() {
    isExploded = !isExploded;
    
    geologicalLayers.forEach((layer) => {
        const targetPosition = isExploded 
            ? new THREE.Vector3(0, 0, layer.userData.explodedDistance)
            : layer.userData.originalPosition.clone();
        
        animateLayerTo(layer, targetPosition);
    });
}

function animateLayerTo(layer, targetPosition) {
    const startPosition = layer.position.clone();
    const duration = 1000;
    const startTime = Date.now();
    
    function animate() {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        
        layer.position.lerpVectors(startPosition, targetPosition, easedProgress);
        
        if (progress < 1) {
            requestAnimationFrame(animate);
        }
    }
    
    animate();
}

function onWindowResize() {
    // Resize Three.js
    const aspect = window.innerWidth / window.innerHeight;
    threeCamera.aspect = aspect;
    threeCamera.updateProjectionMatrix();
    threeRenderer.setSize(window.innerWidth, window.innerHeight);
    
    // Resize earthjs globe
    if (earthjsGlobe) {
        const minDim = Math.min(window.innerWidth, window.innerHeight);
        const globeSize = Math.min(600, minDim * 0.8);
        earthjsGlobe.width(globeSize).height(globeSize).refresh();
    }
}

function animate() {
    requestAnimationFrame(animate);
    
    // Render Three.js geological layers
    if (threeRenderer && threeScene && threeCamera) {
        threeRenderer.render(threeScene, threeCamera);
    }
}

// Start when page loads
window.addEventListener('load', init);

// Handle orientation changes on mobile
window.addEventListener('orientationchange', () => {
    setTimeout(onWindowResize, 100);
});