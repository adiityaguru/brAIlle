// --- THREE.JS SETUP ---
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();

// Camera setup
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;
camera.position.y = -10; // Slight tilt

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// --- THE BRAILLE GRID ---
const geometry = new THREE.SphereGeometry(0.3, 16, 16); // Small dots
const material = new THREE.MeshStandardMaterial({ 
    color: 0x2a4d69, // Royal Navy Blue
    roughness: 0.6,
    metalness: 0.1
});

const particles = [];
const rows = 30;
const cols = 50;
const spacing = 3;

// Create grid of dots
for (let x = 0; x < cols; x++) {
    for (let y = 0; y < rows; y++) {
        const mesh = new THREE.Mesh(geometry, material);
        
        // Center the grid
        mesh.position.x = (x - cols / 2) * spacing;
        mesh.position.y = (y - rows / 2) * spacing;
        mesh.position.z = 0;
        
        // Store initial position for animation reference
        mesh.userData = {
            initialZ: 0,
            initialX: mesh.position.x,
            initialY: mesh.position.y
        };

        scene.add(mesh);
        particles.push(mesh);
    }
}

// --- LIGHTING ---
// A moody directional light to create shadows on the dots
const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

const pointLight = new THREE.PointLight(0x4a90e2, 1, 100);
pointLight.position.set(0, 0, 20);
scene.add(pointLight);

// --- MOUSE INTERACTION ---
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

// Track mouse relative to window center
document.addEventListener('mousemove', (event) => {
    mouseX = (event.clientX - window.innerWidth / 2) * 0.1;
    mouseY = -(event.clientY - window.innerHeight / 2) * 0.1;
});

// Handle window resize
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- ANIMATION LOOP ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    
    const time = clock.getElapsedTime();

    // Smooth mouse movement
    targetX += (mouseX - targetX) * 0.05;
    targetY += (mouseY - targetY) * 0.05;

    // Move camera slightly based on mouse for parallax
    camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
    camera.position.y += (mouseY * 0.5 - camera.position.y) * 0.05;
    camera.lookAt(0, 0, 0);

    // Animate particles
    particles.forEach((p, i) => {
        // 1. Gentle wave motion
        const waveZ = Math.sin(p.position.x * 0.1 + time) * Math.cos(p.position.y * 0.1 + time) * 0.5;
        
        // 2. Mouse reaction (Tactile effect)
        // Calculate distance from this dot to the mouse projection
        const dist = Math.sqrt(
            Math.pow(p.position.x - targetX * 2, 2) + 
            Math.pow(p.position.y - targetY * 2, 2)
        );
        
        // If mouse is close, raise the dot (Z-axis)
        let mouseZ = 0;
        if (dist < 15) {
            mouseZ = (15 - dist) * 0.8; // The closer, the higher
        }

        p.position.z = waveZ + mouseZ;
    });

    renderer.render(scene, camera);
}

animate();

// --- GSAP SCROLL ANIMATIONS ---
// Registers ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const fadeElements = document.querySelectorAll('.fade-in');

fadeElements.forEach((el) => {
    gsap.fromTo(el, 
        { opacity: 0, y: 50 },
        { 
            opacity: 1, 
            y: 0, 
            duration: 1, 
            scrollTrigger: {
                trigger: el,
                start: "top 80%", // Start animation when element is 80% down the viewport
                toggleActions: "play none none reverse"
            }
        }
    );
});
