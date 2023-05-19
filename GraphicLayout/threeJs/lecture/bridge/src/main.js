import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { cm1, cm2 } from "./common";

// ----- 주제: The Bridge 게임 만들기

// Renderer
const renderer = new THREE.WebGLRenderer({
  canvas: cm1.canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// scene
cm1.scene.background = new THREE.Color(cm2.backgroundColor);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 1.5;
camera.position.z = 4;
cm1.scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight("white", 0.5);
cm1.scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight("white", 1);
directionalLight.position.x = 1;
directionalLight.position.z = 2;
cm1.scene.add(directionalLight);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// Mesh
const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshStandardMaterial({
  color: "seagreen"
});
const mesh = new THREE.Mesh(geometry, material);
cm1.scene.add(mesh);

// 그리기
const clock = new THREE.Clock();

function draw() {
  const delta = clock.getDelta();

  controls.update();

  renderer.render(cm1.scene, camera);
  renderer.setAnimationLoop(draw);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(cm1.scene, camera);
}

// 이벤트
window.addEventListener("resize", setSize);

draw();
