// --- THREE.JS SETUP ---
const canvas = document.getElementById('bg-canvas');
const scene = new THREE.Scene();

// Camera setup - STATIC CAMERA (No rotation)
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set(0, 0, 35); // Fixed position, looking straight on
camera.lookAt(0, 0, 0);

// Renderer setup
const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

// --- THE BRAILLE GRID ---
const geometry = new THREE.SphereGeometry(0.25, 16, 16); // Slightly smaller, refined dots
const material = new THREE.MeshStandardMaterial({ 
    color: 0x2a4d69, // Royal Navy Blue
    roughness: 0.8, // More matte (less shiny)
    metalness: 0.1
});

const particles = [];
const rows = 40; // More rows for a denser wall
const cols = 70;
const spacing = 1.8;

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
            phase: Math.random() * Math.PI * 2 // Random starting phase for organic movement
        };

        scene.add(mesh);
        particles.push(mesh);
    }
}

// --- LIGHTING ---
// Soft, non-glaring lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.3);
scene.add(ambientLight);

const dirLight = new THREE.DirectionalLight(0x4a90e2, 0.8);
dirLight.position.set(10, 10, 20);
scene.add(dirLight);

// --- RESIZE HANDLER ---
window.addEventListener('resize', () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});

// --- MOUSE INTERACTION ---
// We track mouse just for a "ripple" effect, not camera movement
let mouseX = -1000;
let mouseY = -1000;

document.addEventListener('mousemove', (event) => {
    // Convert mouse to 3D coordinates roughly
    mouseX = (event.clientX / window.innerWidth) * 2 - 1;
    mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
    
    // Scale to match grid roughly
    mouseX *= 50; 
    mouseY *= 30;
});

// --- ANIMATION LOOP ---
const clock = new THREE.Clock();

function animate() {
    requestAnimationFrame(animate);
    const time = clock.getElapsedTime();

    particles.forEach((p) => {
        // 1. BASE WAVE: A gentle, ocean-like ripple across the whole wall
        // We use sine waves based on X and Y position
        const waveZ = Math.sin(p.userData.x * 0.2 + time * 1.5) * Math.cos(p.userData.y * 0.2 + time * 1.2) * 0.5;

        // 2. BRAILLE "POP" EFFECT
        // If the dot is near the mouse, it rises up (like a refreshable display)
        const dist = Math.sqrt(Math.pow(p.userData.x - mouseX, 2) + Math.pow(p.userData.y - mouseY, 2));
        let hoverZ = 0;
        
        if (dist < 6) {
            // Create a sharp "plateau" rise, like a mechanical pin
            hoverZ = (6 - dist) * 0.8;
        }

        // Apply position
        p.position.z = waveZ + hoverZ;
    });

    renderer.render(scene, camera);
}

animate();

// --- GSAP SCROLL ---
// Keep the scroll animations for the HTML elements
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
