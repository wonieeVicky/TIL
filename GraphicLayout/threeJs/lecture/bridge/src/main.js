import * as THREE from "three";
import * as CANNON from "cannon-es";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { cm1, cm2 } from "./common";
import { Pillar } from "./Pillar";
import { Floor } from "./Floor";
import { Bar } from "./Bar";
import { SideLight } from "./SideLight";
import { Glass } from "./Glass";
import { Player } from "./Player";

// ----- 주제: The Bridge 게임 만들기
// Renderer
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap; // 그림자를 부드럽게 보이게 함

// scene
cm1.scene.background = new THREE.Color(cm2.backgroundColor);

// Camera
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.x = -4;
camera.position.y = 19;
camera.position.z = 14;
cm1.scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight(cm2.lightColor, 0.8);
cm1.scene.add(ambientLight);

const spotLightDistance = 50;
const spotLight1 = new THREE.SpotLight(cm2.lightColor, 1);
spotLight1.castShadow = true;
spotLight1.shadow.mapSize.width = 2048;
spotLight1.shadow.mapSize.height = 2048;
const spotLight2 = spotLight1.clone(); // spotLight1을 복제
const spotLight3 = spotLight1.clone(); // spotLight1을 복제
const spotLight4 = spotLight1.clone(); // spotLight1을 복제

spotLight1.position.set(-spotLightDistance, spotLightDistance, spotLightDistance);
spotLight2.position.set(spotLightDistance, spotLightDistance, spotLightDistance);
spotLight3.position.set(-spotLightDistance, spotLightDistance, -spotLightDistance);
spotLight4.position.set(spotLightDistance, spotLightDistance, -spotLightDistance);

cm1.scene.add(spotLight1, spotLight2, spotLight3, spotLight4);

// Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;

// 물리 엔진 CANNON
cm1.world.gravity.set(0, -10, 0); // 중력 설정
const defaultContackMaterial = new CANNON.ContactMaterial(cm1.defaultMaterial, cm1.defaultMaterial, {
  friction: 0.3, // 마찰
  restitution: 0.3 // 반발
});
const glassDefaultContackMaterial = new CANNON.ContactMaterial(cm1.glassMaterial, cm1.defaultMaterial, {
  friction: 1, // 마찰
  restitution: 0 // 반발 - 튕기지 않도록
});
const playerGlassContackMaterial = new CANNON.ContactMaterial(cm1.playerMaterial, cm1.glassMaterial, {
  friction: 1, // 마찰
  restitution: 0 // 반발 - 튕기지 않도록
});
cm1.world.defaultContactMaterial = defaultContackMaterial;
cm1.world.addContactMaterial(glassDefaultContackMaterial);
cm1.world.addContactMaterial(playerGlassContackMaterial);

// 물체 만들기
const glassUnitSize = 1.2; // 유리칸 크기
const numberOfGlass = 10; // 유리판 개수
const objects = [];

// 기둥
const pillar1 = new Pillar({
  name: "pillar",
  x: 0,
  y: 5.5, // pillar의 높이가 10이라서 절반으로 조정
  z: -glassUnitSize * 12 - glassUnitSize / 2 // 1.2는 다리의 유리칸 하나의 사이즈, 12는 다리의 유리칸 개수, 0.6은 다리의 유리칸 사이의 간격
});
const pillar2 = new Pillar({
  name: "pillar",
  x: 0,
  y: 5.5,
  z: glassUnitSize * 12 + glassUnitSize / 2 // 1.2는 다리의 유리칸 하나의 사이즈, 12는 다리의 유리칸 개수, 0.6은 다리의 유리칸 사이의 간격
});
objects.push(pillar1, pillar2);

// 바닥
const floor = new Floor({ name: "floor" });

// 바
const bar1 = new Bar({ name: "bar", x: -1.6, y: 10.3, z: 0 });
const bar2 = new Bar({ name: "bar", x: -0.4, y: 10.3, z: 0 });
const bar3 = new Bar({ name: "bar", x: 0.4, y: 10.3, z: 0 });
const bar4 = new Bar({ name: "bar", x: 1.6, y: 10.3, z: 0 });

// 사이드 라이트
for (let i = 0; i < 49; i++) {
  new SideLight({ name: "sideLight", container: bar1.mesh, z: i * 0.5 - glassUnitSize * 10 });
}
for (let i = 0; i < 49; i++) {
  new SideLight({ name: "sideLight", container: bar4.mesh, z: i * 0.5 - glassUnitSize * 10 });
}

// 유리판
let glassTypeNumber = 0;
let glassTypes = [];
for (let i = 0; i < numberOfGlass; i++) {
  glassTypeNumber = Math.round(Math.random());
  switch (glassTypeNumber) {
    case 0:
      glassTypes = ["normal", "strong"];
      break;
    case 1:
      glassTypes = ["strong", "normal"];
      break;
  }

  const glass1 = new Glass({
    name: `glass-${glassTypes[0]}`,
    x: -1,
    y: 10.3,
    z: i * glassUnitSize * 2 - glassUnitSize * 9,
    type: glassTypes[0],
    cannonMaterial: cm1.glassMaterial
  });
  const glass2 = new Glass({
    name: `glass-${glassTypes[1]}`,
    x: 1,
    y: 10.3,
    z: i * glassUnitSize * 2 - glassUnitSize * 9,
    type: glassTypes[1],
    cannonMaterial: cm1.glassMaterial
  });

  objects.push(glass1, glass2);
}

// 플레이어
const player = new Player({
  name: "player",
  x: 0,
  y: 10.9,
  z: 13,
  rotationY: Math.PI,
  cannonMaterial: cm1.playerMaterial,
  mass: 30
});
objects.push(player);

// Raycaster
const raycaster = new THREE.Raycaster();
const mouse = new THREE.Vector2(); // 마우스 좌표를 저장할 벡터

function checkIntersects() {
  raycaster.setFromCamera(mouse, camera);

  const intersects = raycaster.intersectObjects(cm1.scene.children, true);
  for (const item of intersects) {
    checkClickedObject(item.object.name);
    break; // 처음 맞는 mesh만 처리
  }
}

function checkClickedObject(objectName) {
  if (objectName.indexOf("glass") >= 0) {
    // 유리판을 클릭했을 때
    const glass = cm1.scene.getObjectByName(objectName);
    glass.break();
  }
}

// 그리기
const clock = new THREE.Clock();

function draw() {
  const delta = clock.getDelta();

  cm1.mixer?.update(delta); // cm1.mixer가 있으면 update를 실행

  cm1.world.step(1 / 60, delta, 3); // 1/60초마다 물리엔진을 업데이트
  objects.forEach((item) => {
    if (item.cannonBody) {
      item.mesh.position.copy(item.cannonBody.position); // mesh의 위치를 cannonBody의 위치와 동기화
      item.mesh.quaternion.copy(item.cannonBody.quaternion); // mesh의 회전값을 cannonBody의 회전값과 동기화

      if (item.modelMesh) {
        item.modelMesh.position.copy(item.cannonBody.position); // modelMesh 위치를 cannonBody의 위치와 동기화
        item.modelMesh.quaternion.copy(item.cannonBody.quaternion); // modelMesh 회전값을 cannonBody의 회전값과 동기화

        if (item.name === "player") {
          item.modelMesh.position.y += 0.2;
        }
      }
    }
  });

  controls.update();

  renderer.render(cm1.scene, camera);
  renderer.setAnimationLoop(draw);
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(cm1.scene, camera);
}

// 이벤트
window.addEventListener("resize", setSize);
canvas.addEventListener("click", (e) => {
  mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
  mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);
  checkIntersects();
});

draw();
