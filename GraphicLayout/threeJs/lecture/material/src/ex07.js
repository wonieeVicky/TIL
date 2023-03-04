import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: 로딩 매니저(여러개의 테스쳐 이미지를 로드할 때 사용)

export default function example() {
  // 텍스쳐 이미지 로드
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onStart = () => {
    console.log("로드 시작");
  };
  loadingManager.onProgress = (img) => {
    console.log(img + " 로드");
  };
  loadingManager.onLoad = () => {
    console.log("로드 완료");
  };
  loadingManager.onError = () => {
    console.log("로드 실패");
  };

  const textureLoader = new THREE.TextureLoader(loadingManager);
  const baseColorTex = textureLoader.load("/textures/brick/Brick_Wall_019_basecolor.jpg");
  const ambientTex = textureLoader.load("/textures/brick/Brick_Wall_019_ambientOcclusion.jpg");
  const normalTex = textureLoader.load("/textures/brick/Brick_Wall_019_normal.jpg");
  const roughnessTex = textureLoader.load("/textures/brick/Brick_Wall_019_roughness.jpg");
  const heightTex = textureLoader.load("/textures/brick/Brick_Wall_019_height.png");

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
  directionalLight.position.set(1, 1, 2);
  scene.add(ambientLight, directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement); // camera lookat으로 물체를 바라보므로 정중앙에 사물이 위치함

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material1 = new THREE.MeshStandardMaterial({ map: ambientTex });
  const material2 = new THREE.MeshStandardMaterial({ map: roughnessTex });

  const mesh1 = new THREE.Mesh(geometry, material1);
  const mesh2 = new THREE.Mesh(geometry, material2);
  mesh1.position.x = -1;
  mesh2.position.x = 1;
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
