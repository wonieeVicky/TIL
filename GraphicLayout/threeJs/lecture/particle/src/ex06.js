import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { ImagePanel } from "./ImagePanel";
import gsap from "gsap";

// ----- 주제: 형태가 바뀌는 이미지 패널

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
  controls.enableDamping = true;

  // Mesh
  const planeGeometry = new THREE.PlaneGeometry(0.3, 0.3);

  // textureLoader
  const textureLoader = new THREE.TextureLoader();

  // Points
  const sphereGeometry = new THREE.SphereGeometry(1, 8, 8);
  const spherePositionArray = sphereGeometry.attributes.position.array; // planeMesh의 position 정보
  const randomPositionArray = []; // random position 정보
  for (let i = 0; i < spherePositionArray.length; i++) {
    randomPositionArray.push((Math.random() - 0.5) * 10);
  }

  // 여러 개의 Plane Mesh 생성
  const imagePanels = [];
  let imagePanel;
  for (let i = 0; i < spherePositionArray.length; i += 3) {
    imagePanel = new ImagePanel({
      textureLoader,
      scene,
      geometry: planeGeometry,
      imageSrc: `/images/0${Math.ceil(Math.random() * 5)}.jpg`,
      x: spherePositionArray[i],
      y: spherePositionArray[i + 1],
      z: spherePositionArray[i + 2]
    });

    imagePanels.push(imagePanel); // imagePanel 인스턴스가 모인다.
  }

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    controls.update();

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  function setShape(e) {
    let array;
    const { type } = e.target.dataset;
    switch (type) {
      case "random":
        array = randomPositionArray;
        break;
      case "sphere":
        array = spherePositionArray;
        break;
    }

    for (let i = 0; i < imagePanels.length; i++) {
      // gasp.to(대상, {속성, 속성값, 속성, 속성값, ...}, 옵션(지속시간, delay, ease 등))
      gsap.to(imagePanels[i].mesh.position, {
        duration: 2,
        x: array[i * 3],
        y: array[i * 3 + 1],
        z: array[i * 3 + 2]
      });

      // 회전
      if (type === "random") {
        gsap.to(imagePanels[i].mesh.rotation, {
          duration: 2,
          x: 0,
          y: 0,
          z: 0
        });
      } else if (type === "sphere") {
        gsap.to(imagePanels[i].mesh.rotation, {
          duration: 2,
          x: imagePanels[i].sphereRotationX,
          y: imagePanels[i].sphereRotationY,
          z: imagePanels[i].sphereRotationZ
        });
      }
    }
  }

  // 버튼 추가
  const btnWrapper = document.createElement("div"); // addEventListener를 위한 div
  btnWrapper.classList.add("btns");

  const randomBtn = document.createElement("button");
  randomBtn.dataset.type = "random";
  randomBtn.innerText = "Random";
  randomBtn.style.cssText = "position: absolute; left: 20px; top: 20px; ";
  btnWrapper.append(randomBtn);

  const sphereBtn = document.createElement("button");
  sphereBtn.dataset.type = "sphere";
  sphereBtn.innerText = "Sphere";
  sphereBtn.style.cssText = "position: absolute; left: 20px; top: 50px; ";
  btnWrapper.append(sphereBtn);

  document.body.append(btnWrapper);

  // 이벤트
  btnWrapper.addEventListener("click", setShape);
  window.addEventListener("resize", setSize);

  draw();
}
