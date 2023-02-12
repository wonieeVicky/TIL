## Three.js 개발 편의 도구

이번에는 three.js 개발 시 도움을 받을 수 있는 유틸리티 도구에 대해 살펴봄

### 축, 그리드 헬퍼

`src/ex01.js`

```jsx
import * as THREE from "three";

// ----- 주제: AxesHelper(축), GridHelper(그리드)

export default function example() {
  // ..

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = 1; // 축을 잘 보기 위해 카메라 위치 수정
  camera.position.y = 1; // 축을 잘 보기 위해 카메라 위치 수정
  camera.position.z = 5; // 축을 잘 보기 위해 카메라 위치 수정
  scene.add(camera);

  // 은은한 조명 추가
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  // AxesHelper - 축 헬퍼 scene에 추가
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: "seagreen",
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.position.x = 2; // 위치 조정
  mesh.position.z = 2; // 위치 조정
  scene.add(mesh);

  // ..
}
```

위와 같이 은은한 조명을 추가하여 사물이 잘보이도록 처리한 다음 `THREE.AxesHelper`를 3 크기로 부여하면 x, y, z 축을 볼 수 있는 축 헬퍼 ui를 확인할 수 있다.

![](../../img/230212-1.png)

다음 그리드 헬퍼도 넣어보자

```jsx
import * as THREE from "three";

// ----- 주제: AxesHelper(축), GridHelper(그리드)

export default function example() {
  // ..
  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = 1; // 위치 수정 - 위에서 바라보도록
  camera.position.y = 3; // 위치 수정 - 위에서 바라보도록
  camera.position.z = 0; // 위치 수정 - 위에서 바라보도록
  scene.add(camera);

  // ..
  // AxesHelper
  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  const gridHelper = new THREE.GridHelper(5);
  scene.add(gridHelper);

  // Mesh..
  camera.lookAt(mesh.position); // 카메라가 위에서 바라보도록 수정

  // ..
}
```

![](../../img/230212-2.png)
