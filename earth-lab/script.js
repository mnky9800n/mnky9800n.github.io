// Earth Lab 3D Interactive Earth
let scene, camera, renderer, earthGroup;
let isUserInteracting = false;
let autoRotationEnabled = true;
let autoRotationTimeout;

// Mouse/touch interaction variables
let mouseX = 0, mouseY = 0;
let targetRotationX = 0, targetRotationY = 0;
let rotationX = 0, rotationY = 0;

// Initialize the scene
function init() {
    // Create container
    const container = document.getElementById('earth-container');
    
    // Scene setup
    scene = new THREE.Scene();
    
    // Camera setup - responsive FOV
    const aspect = window.innerWidth / window.innerHeight;
    camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 4;
    
    // Renderer setup
    renderer = new THREE.WebGLRenderer({ 
        antialias: true, 
        alpha: true,
        canvas: document.createElement('canvas')
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0xffffff, 0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    
    // Add canvas to container
    renderer.domElement.id = 'earth-canvas';
    container.appendChild(renderer.domElement);
    
    // Create Earth group to hold all layers
    earthGroup = new THREE.Group();
    scene.add(earthGroup);
    
    // Create geological layers
    createEarthLayers();
    
    // Add lighting
    setupLighting();
    
    // Event listeners
    setupEventListeners();
    
    // Start animation loop
    animate();
}

function createEarthLayers() {
    // Earth radius scale
    const baseRadius = 1;
    
    // Geological layer data (radius ratios)
    const layers = [
        { name: 'inner_core', radius: 0.2, color: 0xffff99, opacity: 0.7 },
        { name: 'outer_core', radius: 0.35, color: 0xffcc00, opacity: 0.6 },
        { name: 'mantle', radius: 0.85, color: 0xff4500, opacity: 0.5 },
        { name: 'crust', radius: 1.0, color: 0x8b7355, opacity: 0.4 }
    ];
    
    layers.forEach((layer, index) => {
        const geometry = new THREE.SphereGeometry(baseRadius * layer.radius, 32, 32);
        const material = new THREE.MeshLambertMaterial({
            color: layer.color,
            transparent: true,
            opacity: layer.opacity,
            side: THREE.DoubleSide
        });
        
        const sphere = new THREE.Mesh(geometry, material);
        sphere.name = layer.name;
        earthGroup.add(sphere);
    });
}

function setupLighting() {
    // Ambient light for overall illumination
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);
    
    // Directional light for depth
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(-1, 1, 1);
    directionalLight.castShadow = true;
    scene.add(directionalLight);
}

function setupEventListeners() {
    const canvas = renderer.domElement;
    
    // Mouse events
    canvas.addEventListener('mousedown', onPointerStart, false);
    canvas.addEventListener('mousemove', onPointerMove, false);
    canvas.addEventListener('mouseup', onPointerEnd, false);
    canvas.addEventListener('mouseleave', onPointerEnd, false);
    
    // Touch events
    canvas.addEventListener('touchstart', onPointerStart, false);
    canvas.addEventListener('touchmove', onPointerMove, false);
    canvas.addEventListener('touchend', onPointerEnd, false);
    
    // Window resize
    window.addEventListener('resize', onWindowResize, false);
    
    // Prevent context menu
    canvas.addEventListener('contextmenu', function(e) {
        e.preventDefault();
    });
}

function onPointerStart(event) {
    isUserInteracting = true;
    autoRotationEnabled = false;
    
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);
    
    mouseX = clientX;
    mouseY = clientY;
    
    // Clear auto-rotation timeout
    if (autoRotationTimeout) {
        clearTimeout(autoRotationTimeout);
    }
}

function onPointerMove(event) {
    if (!isUserInteracting) return;
    
    event.preventDefault();
    
    const clientX = event.clientX || (event.touches && event.touches[0].clientX);
    const clientY = event.clientY || (event.touches && event.touches[0].clientY);
    
    const deltaX = clientX - mouseX;
    const deltaY = clientY - mouseY;
    
    // Update rotation based on mouse movement
    targetRotationY += deltaX * 0.01;
    targetRotationX += deltaY * 0.01;
    
    // Clamp vertical rotation
    targetRotationX = Math.max(-Math.PI / 2, Math.min(Math.PI / 2, targetRotationX));
    
    mouseX = clientX;
    mouseY = clientY;
}

function onPointerEnd(event) {
    isUserInteracting = false;
    
    // Resume auto-rotation after delay
    autoRotationTimeout = setTimeout(() => {
        autoRotationEnabled = true;
    }, 2000);
}

function onWindowResize() {
    const aspect = window.innerWidth / window.innerHeight;
    camera.aspect = aspect;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
    requestAnimationFrame(animate);
    
    // Smooth rotation interpolation
    rotationX += (targetRotationX - rotationX) * 0.1;
    rotationY += (targetRotationY - rotationY) * 0.1;
    
    // Auto-rotation when not interacting
    if (autoRotationEnabled && !isUserInteracting) {
        targetRotationY += 0.005; // Slow auto-rotation
    }
    
    // Apply rotations to earth group
    earthGroup.rotation.x = rotationX;
    earthGroup.rotation.y = rotationY;
    
    renderer.render(scene, camera);
}

// Start everything when page loads
window.addEventListener('load', init);

// Handle orientation changes on mobile
window.addEventListener('orientationchange', () => {
    setTimeout(onWindowResize, 100);
});