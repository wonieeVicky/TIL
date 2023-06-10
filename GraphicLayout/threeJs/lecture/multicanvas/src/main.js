import * as THREE from "three";
import { CreateScene } from "./CreateScene";

// ----- 주제: 여러개의 캔버스 사용하기

// Renderer
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

const scene1 = new CreateScene({
  renderer,
  bgColor: "pink",
  placeholder: ".canvas-placeholder.a"
});

// 그리기
const clock = new THREE.Clock();

function draw() {
  const delta = clock.getDelta();
  renderer.setAnimationLoop(draw);
}

function setSize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
}

// 이벤트
window.addEventListener("resize", setSize);

draw();
