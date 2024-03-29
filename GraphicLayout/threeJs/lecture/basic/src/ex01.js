﻿import * as THREE from "three";

// --- 주제: 기본 장면

export default function example() {
  // 동적으로 캔버스 조립하기
  // const renderer = new THREE.WebGLRenderer();
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement); // renderer.domElement는 캔버스를 의미

  // html에서 캔버스 가져와서 사용하기
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  // scene 생성
  const scene = new THREE.Scene();
  // camera 생성 - 원근 카메라 PerspectiveCamera(시야각fov, 종횡비aspect, near, far)
  // const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

  // camera 생성 - 직교 카메라 OrthographicCamera(left, right, top, bottom, near, far)
  const camera = new THREE.OrthographicCamera(
    -(window.innerWidth / window.innerHeight), // left
    window.innerWidth / window.innerHeight, // right
    1, // top
    -1, // bottom
    0.1, // near
    1000
  );

  // camera 위치 설정
  camera.position.x = 1;
  camera.position.y = 2;
  camera.position.z = 5;

  // 카메라가 바라보는 위치 설정 - 큐브 원점을 바라보도록 설정
  camera.lookAt(0, 0, 0);

  // 카메라 zoom 설정
  camera.zoom = 0.1;

  // 카메라 설정 업데이트
  camera.updateProjectionMatrix();

  // 무대에 올리기
  scene.add(camera);

  // Mesh 설정 - Geometry + Material
  const geometry = new THREE.BoxGeometry(1, 1, 1); // 1*1*1 정육면체 생성
  const material = new THREE.MeshBasicMaterial({
    // color: 0x00ff00,
    // color: "#00ff00",
    color: "green",
  }); // 재질에 대한 여러 속성을 객체에 설정함. 녹색

  // Mesh 생성
  const mesh = new THREE.Mesh(geometry, material);
  // 무대에 올리기
  scene.add(mesh);
  // 그리기
  renderer.render(scene, camera);
}
