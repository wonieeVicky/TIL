import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { PreventDragClick } from "./PreventDragClick";

// ----- 주제: 클릭한 Mesh 선택하기

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
  camera.position.x = 5;
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
  const constrols = new OrbitControls(camera, renderer.domElement);

  // Mesh
  //

  // ray에 맞을 mesh 추가
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshBasicMaterial({ color: "plum" });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.name = "box";

  const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
  const torusMaterial = new THREE.MeshBasicMaterial({ color: "lime" });
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  torusMesh.name = "torus";

  scene.add(boxMesh, torusMesh);

  const meshes = [boxMesh, torusMesh];
  const raycaster = new THREE.Raycaster(); // 광선 생성
  const mouse = new THREE.Vector2(); // 마우스 좌표 - 어디를 찍었는지 알기 위해(초기값: x:0, y:0)
  // console.log(mouse);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime(); // 시간
    // boxMesh.position.y = Math.sin(time) * 2;
    // torusMesh.position.y = Math.cos(time) * 2;
    // boxMesh.material.color.set("plum");
    // torusMesh.material.color.set("lime");

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function checkIntersects() {
    if (preventDragClick.mouseMoved) return; // mouseMoved가 true면 함수 종료

    raycaster.setFromCamera(mouse, camera); // origin이 카메라 시점(위치)으로 설정한 뒤 광선의 시작점과 방향 설정
    const intersects = raycaster.intersectObjects(meshes); // 광선과 충돌한 mesh들을 배열로 반환

    if (intersects[0]) {
      console.log(intersects[0]?.object.name);
      intersects[0].object.material.color.set("red");
    }
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  // 이벤트
  window.addEventListener("resize", setSize);
  window.addEventListener("click", (e) => {
    // console.log(e.clientX, e.clientY); // 화면에서 찍은 x, y 좌표
    // 2차원 좌표를 3차원 좌표로 정규화
    mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1; // -1 ~ 1
    mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1); // -1 ~ 1
    // console.log(mouse); // (-1 ~ 1, -1 ~ 1)
    checkIntersects();
  });

  const preventDragClick = new PreventDragClick(canvas);

  draw();
}
