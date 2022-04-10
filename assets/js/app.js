import * as THREE from 'three';

import Stats from './stats.module.js';

import { ColladaLoader } from './ColladaLoader.js';

let container, stats, clock;
let camera, scene, renderer, model;

init();
animate();

function init() {

  container = document.getElementById('container');

  // Camera initialization
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 2000);
  camera.position.set(17, 5, 5);
  camera.lookAt(0, 1, 0);

  // Loader for image
  const textureLoader = new THREE.TextureLoader();

  // Scene initialization with fog and background image
  scene = new THREE.Scene();
  {
    const color = 0xFFFFFF;
    const density = 0.03;
    scene.fog = new THREE.FogExp2(color, density);
    scene.background = textureLoader.load('./assets/img/foret.jpg');
  }

  clock = new THREE.Clock();

  // loading manager
  const loadingManager = new THREE.LoadingManager(function () {

    scene.add(model);

  });

  // Load collada model
  const loader = new ColladaLoader(loadingManager);
  loader.load('./assets/models/model.dae', function (collada) {

    model = collada.scene;

  });

  // Add light to the scene
  const ambientLight = new THREE.AmbientLight(0xcccccc, 0.4);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
  directionalLight.position.set(1, 1, 0).normalize();
  scene.add(directionalLight);

  // Render option
  renderer = new THREE.WebGLRenderer();
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  // Show fps counter
  stats = new Stats();
  container.appendChild(stats.dom);


  // Recalculate width and height en window resize
  window.addEventListener('resize', onWindowResize);

}

function onWindowResize() {

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);

}

function animate() {

  requestAnimationFrame(animate);

  render();
  stats.update();

}

function render() {

  const delta = clock.getDelta();

  if (model !== undefined) {

    model.rotation.z += delta * 0.5;

  }

  renderer.render(scene, camera);

}