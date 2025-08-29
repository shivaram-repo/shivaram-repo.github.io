import {
    Scene,
    PerspectiveCamera,
    WebGLRenderer,
    AmbientLight,
    DirectionalLight,
    Box3,
    Vector3
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

// Get the canvas element
const canvas = document.getElementById('profile3D');

// 1. Scene Setup
const scene = new Scene();

// Camera
const camera = new PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.z = 2.5;

// Renderer
const renderer = new WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setClearColor(0x000000, 0);
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

// 2. Lights
const ambientLight = new AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

// 3. Model Loading
let profileModel;
const loader = new GLTFLoader();

// Load the 3D model from a public URL
// Replace with the path to your own .glb file
loader.load(
    '3d.glb',
    function (gltf) {
        profileModel = gltf.scene;

        // Calculate the bounding box of the model
        const box = new Box3().setFromObject(profileModel);
        const size = new Vector3();
        box.getSize(size);

        // Find the maximum dimension of the bounding box
        const maxDimension = Math.max(size.x, size.y, size.z);

        // Set the desired size for the model (e.g., 2.0 units)
        const desiredSize = 2.0;
        const scale = desiredSize / maxDimension;

        // Apply the scale to the model
        profileModel.scale.set(scale, scale, scale);

        scene.add(profileModel);
    },
    undefined,
    function (error) {
        console.error('An error occurred while loading the 3D model:', error);
    }
);

// 4. Animation Loop
function animate() {
    requestAnimationFrame(animate);

    if (profileModel) {
        profileModel.rotation.y += 0.005; // Slow rotation
        profileModel.rotation.x += 0.002;
    }

    renderer.render(scene, camera);
}

// 5. Handle Window Resize
function onWindowResize() {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

window.addEventListener('resize', onWindowResize, false);
animate();

// 6. Navigation Toggle for Mobile (Updated based on new HTML structure)
let menuBtn = document.getElementById('menu-btn');
let navigation = document.querySelector('.navigation');

menuBtn.addEventListener('click', function () {
    navigation.classList.toggle('active');
});

// 7. Add Scroll Animation
const animateOnScroll = () => {
    const hiddenElements = document.querySelectorAll('.hidden-element');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-element');
            } else {
                // Optional: Remove class to reset animation on scroll out
                entry.target.classList.remove('show-element');
            }
        });
    }, {
        threshold: 0.5 // Trigger when 50% of the element is visible
    });

    hiddenElements.forEach((el) => observer.observe(el));
};

// Call the function to start observing
animateOnScroll();