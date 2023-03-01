import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: flatShading

export default function example() {
  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // Scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color("white");

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.set(1, 0, 2);
  scene.add(ambientLight, directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement); // camera lookat으로 물체를 바라보므로 정중앙에 사물이 위치함

  // Mesh
  const geometry = new THREE.SphereGeometry(1, 16, 16);
  // MeshPhongMaterial 하이라이트, 반사광 표현 가능한 재질 - shininess로 조절
  const material1 = new THREE.MeshPhongMaterial({
    color: "orangered",
    shininess: 800,
    flatShading: true,
  });
  // MeshStandardMaterial 하이라이트, 반사광 표현 가능한 재질 - roughness로 조절
  const material2 = new THREE.MeshStandardMaterial({
    color: "orangered",
    roughness: 0.2,
    metalness: 0.3,
    flatShading: true,
  });

  const mesh1 = new THREE.Mesh(geometry, material1);
  const mesh2 = new THREE.Mesh(geometry, material2);
  mesh1.position.x = -1.5;
  mesh2.position.x = 1.5;
  scene.add(mesh1, mesh2);

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
}
