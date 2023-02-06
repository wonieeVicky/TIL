import * as THREE from "three";

// --- 주제: 브라우저 창 사이즈 변경에 대응하기

export default function example() {
  // renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1); // 렌더링 품질을 높이기 위해 픽셀 밀도를 설정함

  // scene
  const scene = new THREE.Scene();
  // camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 6;
  scene.add(camera);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshBasicMaterial({ color: "green" });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // 그리기
  renderer.render(scene, camera);

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
}
