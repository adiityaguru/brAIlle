// --- THREE.JS SETUP ---
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();

// Camera setup - STATIC
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 35);
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// --- THE BRAILLE GRID (UPDATED SETTINGS) ---
// Increased size significantly (0.25 -> 0.8)
const geometry = new THREE.SphereGeometry(0.8, 32, 32); 

// Changed color to dark slate grey (#1a202c) - subtle against the black background
const material = new THREE.MeshStandardMaterial({ 
    color: 0x1a202c, 
    roughness: 0.9, // Very matte
    metalness: 0.1
});

const particles = [];

// Decreased density (Fewer dots, more space)
const rows = 14;  
const cols = 24;
const spacing = 4.5; // Increased spacing

// Create grid
for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
        const mesh = new THREE.Mesh(geometry, material);
        
        // Center the grid
        mesh.position.x = (x - cols / 2) * spacing;
        mesh.position.y = (y - rows / 2) * spacing;
        mesh.position.z = 0;
        
        // Store initial position
        mesh.userData = {
            x: mesh.position.x,
            y: mesh.position.y,
            phase: Math.random() * Math.PI * 2 
        };

        scene.add(mesh);
        particles.push(mesh);
    }
}

// --- LIGHTING (DIMMED FOR SUBTLETY) ---
// Reduced intensity so they don't shine too bright
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1); 
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0x4a90e2, 0.5); // Low intensity blue tint
dirLight.position.set(10, 10, 20);
scene.add(dirLight);

// --- RESIZE HANDLER ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- MOUSE INTERACTION ---
let mouseX = -1000;
let mouseY = -1000;

document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Scale input to match the wider grid
    mouseX *= 60; 
    mouseY *= 35;
});

// --- ANIMATION LOOP ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    particles.forEach((p) => {
        // 1. BACKGROUND WAVE (Slower, more elegant)
        const waveZ = Math.sin(p.userData.x * 0.15 + time * 0.8) * Math.cos(p.userData.y * 0.15 + time * 0.6) * 0.8;

        // 2. MOUSE REACTION (Tactile Pop)
        // Distance check needs to be larger because dots are further apart
        const dist = Math.sqrt(Math.pow(p.userData.x - mouseX, 2) + Math.pow(p.userData.y - mouseY, 2));
        let hoverZ = 0;
        
        if (dist < 8) {
            // Smooth rise
            hoverZ = (8 - dist) * 0.6;
        }

        p.position.z = waveZ + hoverZ;
    });

    renderer.render(scene, camera);
}

animate();

// --- GSAP SCROLL ANIMATIONS ---
gsap.registerPlugin(ScrollTrigger);
const fadeElements = document.querySelectorAll('.fade-in');
fadeElements.forEach((el) => {
    gsap.fromTo(el, 
        { opacity: 0, y: 30 },
        { 
            opacity: 1, 
            y: 0, 
            duration: 0.8, 
            scrollTrigger: { trigger: el, start: "top 85%" }
        }
    );
});
