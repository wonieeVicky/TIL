import * as THREE from "three";
import { Material } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: OrbitControls

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
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 움직임을 부드럽게 만들어준다. 하위 draw에 controls.update()를 호출해줘야 한다.
  // controls.enableZoom = false;
  // controls.maxDistance = 10;
  // controls.minDistance = 2;
  // controls.minPolarAngle = Math.PI / 4; // 45도까지만 마우스로 돌려볼 수 있도록 고정
  // controls.minPolarAngle = THREE.MathUtils.degToRad(45); // Math.PI / 4와 같음
  // controls.maxPolarAngle = THREE.MathUtils.degToRad(135);
  // controls.target.set(2, 2, 2); // 회전 중심 타겟을 2,2,2로 옮김
  controls.autoRotate = true; // 자동 회전 옵션
  controls.autoRotateSpeed = 20; // 회전 속도 설정

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
    controls.update();

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
