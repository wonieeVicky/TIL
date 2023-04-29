import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import { PreventDragClick } from "./PreventDragClick";
import { MySphere } from "./MySphere";

// ----- 주제: Performance(성능 좋게 하기)

export default function example() {
  // Renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  // Scene
  const scene = new THREE.Scene();

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.y = 4.5;
  camera.position.z = 15;
  scene.add(camera);

  // Light
  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -10, 0); // 중력을 세팅(x, y, z축 설정)

  // Contact Material
  const defaultMaterial = new CANNON.Material("default");
  const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.5, // 마찰력,
    restitution: 0.3 // 반발력
  }); // 부딪힐 재질을 두 개 넣음 + 상세 설정 추가
  cannonWorld.defaultContactMaterial = defaultContactMaterial;

  const floorShape = new CANNON.Plane(); // 바닥을 만들기 위한 모양
  const floorBody = new CANNON.Body({
    // 무게를 가지는 바닥 - 물리엔진이 적용된 실체(유리컴)
    mass: 0, // 무게 설정
    position: new CANNON.Vec3(0, 0, 0), // 바닥의 위치
    shape: floorShape, // 바닥의 모양
    material: defaultMaterial
  });
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5); // 바닥의 회전(축의 방향(x축으로 설정), 각도(90도))
  cannonWorld.addBody(floorBody); // 바닥을 월드에 추가

  const sphereShape = new CANNON.Sphere(0.5); // 구의 반지름을 넣음
  const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 10, 0),
    shape: sphereShape,
    material: defaultMaterial
  });
  cannonWorld.addBody(sphereBody); // 박스를 월드에 추가

  // Mesh
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: "slategray" })
  );
  floorMesh.rotation.x = -Math.PI * 0.5; // 앞면이 위로 향하기 위해 음수 처리
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  const spheres = [];
  const sphereGeometry = new THREE.SphereGeometry(0.5); // 반지름 입력
  const sphereMaterial = new THREE.MeshStandardMaterial({
    color: "seagreen"
  });
  // const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  // sphereMesh.position.y = 0.5;
  // sphereMesh.castShadow = true;
  // scene.add(sphereMesh);

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120;

    cannonWorld.step(cannonStepTime, delta, 3); // 물리 엔진을 계산(시간, 델타, 반복 횟수)

    spheres.forEach((item) => {
      item.mesh.position.copy(item.cannonBody.position);
      item.mesh.quaternion.copy(item.cannonBody.quaternion);
    });

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
  window.addEventListener("click", () => {
    spheres.push(
      new MySphere({
        scene,
        cannonWorld,
        geometry: sphereGeometry,
        material: sphereMaterial,
        x: (Math.random() - 0.5) * 2,
        y: Math.random() * 5 + 2,
        z: (Math.random() - 0.5) * 2,
        scale: Math.random() + 0.2
      })
    );
  });

  const preventDragClick = new PreventDragClick(canvas);

  draw();
}
