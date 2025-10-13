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

const canvas = document.getElementById('profile3D');

const scene = new Scene();

const camera = new PerspectiveCamera(75, canvas.clientWidth / canvas.clientHeight, 0.1, 1000);
camera.position.z = 2.5;

const renderer = new WebGLRenderer({
    canvas: canvas,
    antialias: true,
    alpha: true
});
renderer.setClearColor(0x000000, 0);
renderer.setSize(canvas.clientWidth, canvas.clientHeight);

const ambientLight = new AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);

const directionalLight = new DirectionalLight(0xffffff, 1.5);
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

let profileModel;
const loader = new GLTFLoader();

loader.load(
    '3d.glb',
    function (gltf) {
        profileModel = gltf.scene;

        const box = new Box3().setFromObject(profileModel);
        const size = new Vector3();
        box.getSize(size);

        const maxDimension = Math.max(size.x, size.y, size.z);

        const desiredSize = 2.0;
        const scale = desiredSize / maxDimension;

        profileModel.scale.set(scale, scale, scale);

        scene.add(profileModel);
    },
    undefined,
    function (error) {
        console.error('An error occurred while loading the 3D model:', error);
    }
);

function animate() {
    requestAnimationFrame(animate);

    if (profileModel) {
        profileModel.rotation.y += 0.005; 
        profileModel.rotation.x += 0.002;
    }

    renderer.render(scene, camera);
}

function onWindowResize() {
    camera.aspect = canvas.clientWidth / canvas.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
}

window.addEventListener('resize', onWindowResize, false);
animate();

let menuBtn = document.getElementById('menu-btn');
let navigation = document.querySelector('.navigation');

menuBtn.addEventListener('click', function () {
    navigation.classList.toggle('active');
});

const animateOnScroll = () => {
    const hiddenElements = document.querySelectorAll('.hidden-element');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show-element');
            } else {
                entry.target.classList.remove('show-element');
            }
        });
    }, {
        threshold: 0.5 
    });

    hiddenElements.forEach((el) => observer.observe(el));
};

animateOnScroll();
