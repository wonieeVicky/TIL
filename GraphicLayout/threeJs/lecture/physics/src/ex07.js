import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";
import { PreventDragClick } from "./PreventDragClick";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { Domino } from "./Domino";

// ----- 주제: 도미노

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
  camera.position.x = 13;
  camera.position.y = 5.5;
  camera.position.z = 10;
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

  // Loader
  const gltfLoader = new GLTFLoader();

  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -10, 0);

  // 성능을 위한 세팅
  // cannonWorld.allowSleep = true; // 물리엔진이 휴면 상태로 들어갈 수 있도록 허용
  cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld); // 물리엔진의 충돌을 계산하는 방법을 SAP로 설정

  // Contact Material
  const defaultMaterial = new CANNON.Material("default");
  const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.5, // 마찰력,
    restitution: 0.3 // 반발력
  });
  cannonWorld.defaultContactMaterial = defaultContactMaterial;

  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, 0, 0),
    shape: floorShape,
    material: defaultMaterial
  });
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
  cannonWorld.addBody(floorBody);

  const sphereShape = new CANNON.Sphere(0.5);
  const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 10, 0),
    shape: sphereShape,
    material: defaultMaterial
  });
  cannonWorld.addBody(sphereBody);

  // Mesh
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({ color: "slategray" })
  );
  floorMesh.rotation.x = -Math.PI * 0.5;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  // 도미노 생성
  const dominoes = [];
  let domino;
  for (let i = -3; i < 17; i++) {
    domino = new Domino({
      scene,
      cannonWorld,
      gltfLoader,
      y: 2,
      z: -i * 0.8
    });
    dominoes.push(domino);
  }

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120;

    cannonWorld.step(cannonStepTime, delta, 3);

    dominoes.forEach((domino) => {
      if (domino.cannonBody) {
        domino.modelMesh.position.copy(domino.cannonBody.position);
        domino.modelMesh.quaternion.copy(domino.cannonBody.quaternion);
      }
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
  window.addEventListener("click", () => {});

  const preventDragClick = new PreventDragClick(canvas);

  draw();
}
