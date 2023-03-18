import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from "dat.gui";

// ----- 주제: Light와 Shadow

export default function example() {
  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.shadowMap.enabled = true; // 1. 그림자를 사용할 수 있도록 설정
  // renderer.shadowMap.type = THREE.PCFShadowMap; // 기본값
  // renderer.shadowMap.type = THREE.BasicShadowMap; // antialiasing이 사라진 거친 느낌
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 좀 더 부드럽고 자연스러운 느낌

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

  // DirectionalLight 추가 - 태양광과 같은 느낌(전체적으로 뿌려짐)
  const light = new THREE.DirectionalLight("red", 0.5);
  light.position.y = 3;
  scene.add(light);

  const lightHelper = new THREE.DirectionalLightHelper(light);
  scene.add(lightHelper);

  // 2. 그림자 설정
  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  // light.shadow.radius = 15; // 그림자 블러 처리

  light.shadow.camera.near = 1;
  light.shadow.camera.far = 5;

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Geometry
  const planeGeometry = new THREE.PlaneGeometry(10, 10);
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const sphereGeometry = new THREE.SphereGeometry(0.7, 16, 16);

  // Material
  const material1 = new THREE.MeshStandardMaterial({ color: "white" });
  const material2 = new THREE.MeshStandardMaterial({ color: "royalblue" });
  const material3 = new THREE.MeshStandardMaterial({ color: "gold" });

  // Mesh
  const plane = new THREE.Mesh(planeGeometry, material1);
  const box = new THREE.Mesh(boxGeometry, material2);
  const sphere = new THREE.Mesh(sphereGeometry, material3);

  plane.rotation.x = Math.PI * -0.5; // 눞혀주기
  box.position.set(1, 1, 0);
  sphere.position.set(-1, 1, 0);

  // 3. 그림자를 받을 수 있도록 설정
  plane.receiveShadow = true;
  box.castShadow = true;
  box.receiveShadow = true;
  sphere.castShadow = true;
  sphere.receiveShadow = true;

  scene.add(plane, box, sphere);

  // AxesHelper
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  // Dat GUI
  const gui = new dat.GUI();
  gui.add(light.position, "x", -5, 5).name("light X");
  gui.add(light.position, "y", -5, 5).name("light Y");
  gui.add(light.position, "z", 2, 10).name("light Z");

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    // const delta = clock.getDelta(); // 프레임마다 시간을 가져옴
    const time = clock.getElapsedTime(); // 시작후 경과된 시간을 가져옴(계속 증가하는 값)

    // 삼각함수 사용 원리
    // sin: 0 ~ 1 ~ 0 ~ -1 ~ 0 : a = 1일 때 b의 값을 의미(y)
    // cos: 1 ~ 0 ~ -1 ~ 0 ~ 1 : a = 1일 때 c의 값을 의미(x)

    // light.position.x = Math.cos(time) * 3;
    // light.position.z = Math.sin(time) * 3;

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
