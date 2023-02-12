import * as THREE from "three";
import gsap from "gsap";

// --- 주제: 라이브러리를 이용한 애니메이션

export default function example() {
  // renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  // scene
  const scene = new THREE.Scene();
  // Fog
  scene.fog = new THREE.Fog("black", 3, 8); // fog(color, near, far)

  // camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 1;
  camera.position.z = 5;
  scene.add(camera);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.x = 1;
  light.position.y = 3;
  light.position.z = 5;
  scene.add(light);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: "red" });

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  let oldTime = Date.now();
  // 그리기
  function draw() {
    const newTime = Date.now();
    const deltaTime = newTime - oldTime;
    oldTime = newTime;

    renderer.render(scene, camera);
    // window.requestAnimationFrame(draw);
    renderer.setAnimationLoop(draw);
  }

  // gsap: duration 재생시간, y, x: y, x축으로 2만큼 이동
  gsap.to(mesh.position, { y: 2, x: 3, duration: 1, delay: 1 });

  // resize 시 변화하는 것들을 새로 설정해준다.
  function setSize() {
    // camera
    camera.aspect = window.innerWidth / window.innerHeight;
    // updateProjectionMatrix 카메라 투영에 관련된 값에 변화가 있을 때는 실행해야 함
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // Event
  window.addEventListener("resize", setSize);

  draw();
}
