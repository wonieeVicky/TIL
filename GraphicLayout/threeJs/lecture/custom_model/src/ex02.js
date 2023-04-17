import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// ----- 주제: glb 파일 불러오기

export default function example() {
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

  // gltf loader
  const gltfLoader = new GLTFLoader();
  let mixer;
  gltfLoader.load("/models/ilbuni.glb", (gltf) => {
    const character = gltf.scene.children[0];
    scene.add(character);

    // console.log(gltf.animations); // 2개의 애니메이션을 가지고 있음
    mixer = new THREE.AnimationMixer(character);
    const actions = [];
    actions[0] = mixer.clipAction(gltf.animations[0]); // default animation
    actions[1] = mixer.clipAction(gltf.animations[1]); // jump animation

    // 애니메이션 실행
    actions[0].repetitions = 2; // 반복 횟수 (default Infinity)
    actions[0].clampWhenFinished = true; // 애니메이션이 끝나면 멈춤
    actions[0].play();
  });

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    // Mixer.update - 외부 리소스가 로드가 된 후 생성되도록 처리
    mixer?.update(delta);

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
