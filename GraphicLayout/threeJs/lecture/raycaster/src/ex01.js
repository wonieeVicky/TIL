import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ----- 주제: 특정 방향의 광선(Ray)에 맞은 Mesh 판별하기

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
  const lineMaterial = new THREE.LineBasicMaterial({ color: "yellow" });
  // 임의로 포인트를 설정해서 그것을 이어서 만드는 geometry
  const points = []; // 점들을 모아둘 배열
  points.push(new THREE.Vector3(0, 0, 100)); // 시작점(x, y, z)
  points.push(new THREE.Vector3(0, 0, -100)); // 끝점(x, y, z)
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const guide = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(guide);

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

  const meshes = [boxMesh, torusMesh]; // ray에 맞을 mesh들을 모아둘 배열
  const raycaster = new THREE.Raycaster(); // 광선 생성

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    // const delta = clock.getDelta();
    const time = clock.getElapsedTime(); // 시간
    boxMesh.position.y = Math.sin(time) * 2;
    torusMesh.position.y = Math.cos(time) * 2;
    boxMesh.material.color.set("plum");
    torusMesh.material.color.set("lime");

    const origin = new THREE.Vector3(0, 0, 100); // 광선의 시작점
    // const direction = new THREE.Vector3(0, 0, -1); // 광선의 방향 - 정규화된 방향 -1을 적용
    const direction = new THREE.Vector3(0, 0, -100);
    direction.normalize(); // -100을 normalize처리, 1로 계산
    raycaster.set(origin, direction); // 광선 생성

    const intersects = raycaster.intersectObjects(meshes); // 광선과 교차하는 객체들을 반환
    intersects.forEach((intersect) => {
      console.log(intersect.object.name);
      intersect.object.material.color.set("red");
    }); // box

    console.log(raycaster.intersectObjects(meshes)); // 배열 내 객체들의 광선과의 교차점을 반환

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
