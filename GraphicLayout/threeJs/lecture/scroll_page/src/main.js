import * as THREE from "three";

// ----- 주제: 스크롤에 따라 움직이는 3D 페이지

// Renderer
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

// Scene
const scene = new THREE.Scene();
// scene.background = new THREE.Color("white"); // background Scene 추가

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.y = 1.5;
camera.position.z = 4;
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight("white", 0.5);
scene.add(ambientLight);

// spot Light 추가
const spotLight = new THREE.SpotLight("white", 0.7);
spotLight.position.set(0, 150, 100);
spotLight.castShadow = true; // 그림자 효과
spotLight.shadow.mapSize.width = 1024; // 그림자의 Quality
spotLight.shadow.mapSize.height = 1024; // 그림자의 Quality
spotLight.shadow.camera.near = 1; // 그림자를 찍을 카메라의 Near
spotLight.shadow.camera.far = 200; // 그림자를 찍을 카메라의 Far
scene.add(spotLight);

// Mesh
const floorMesh = new THREE.Mesh(new THREE.PlaneGeometry(100, 100), new THREE.MeshStandardMaterial({ color: "white" }));
floorMesh.rotation.x = -Math.PI / 2;
scene.add(floorMesh);

// 그리기
const clock = new THREE.Clock();

function draw() {
  const delta = clock.getDelta();

  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

// 이벤트
window.addEventListener("resize", setSize);

draw();
