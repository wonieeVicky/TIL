import * as THREE from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

// ----- 주제: FirstPersonControls

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

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // Controls
  const controls = new FirstPersonControls(camera, renderer.domElement);
  // controls.movementSpeed = 10; // 키보드 입력 시 카메라 이동 속도
  // controls.activeLook = false; // 주변을 둘러볼 수 있는지 유무. false면 각도 변경이 불가. 움직일 수만 있다.
  // controls.lookSpeed = 0.05; // 카메라 이동 속도
  controls.autoForward = true; // 자동 앞으로 이동

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  let mesh;
  let material;
  for (let i = 0; i < 20; i++) {
    material = new THREE.MeshStandardMaterial({
      color: `rgb(${50 + Math.floor(Math.random() * 205)}, ${50 + Math.floor(Math.random() * 205)}, ${
        50 + Math.floor(Math.random() * 205)
      })`,
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 4;
    mesh.position.y = (Math.random() - 0.5) * 4;
    mesh.position.z = (Math.random() - 0.5) * 4;
    scene.add(mesh);
  }

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();
    controls.update(delta);

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
