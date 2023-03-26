## Raycaster (클릭 감지)

### Raycaster의 동작 원리

레이캐스터에서 레이는 x-ray 즉 광선을 의미한다. 카메라에서 쏜 광선을 쏘면(클릭) 그 광선에 따라 맞은 mesh가 반응되도록 구현할 수 있다. 이따 맞은 mesh를 캐스팅해서 효과를 적용할 수 있음. 따라서 레이캐스터임

### 준비 - Line으로 선 만들고 mesh 배치하기

먼저 특정 방향으로 쏘아지는 광선(Line)을 만들고 이에 맞은 Mesh를 판별하는 것을 해보겠다.
먼저 시각적으로(geometry) 광선을 눈에 보이게 그려본다.

`raycaster/src/ex01.js`

```jsx
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";

// ----- 주제: Line으로 선 만들고 mesh 배치하기

export default function example() {
  // Renderer, Scene..

  // Camera
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.x = 5; // 1. 광선이 옆을 바라보고 시작하도록 위치를 수정
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  // Light..

  // Controls : 2. 마우스로 확인을 위해 추가
  const constrols = new OrbitControls(camera, renderer.domElement);

  // Mesh
  // 3. ray 구현
  const lineMaterial = new THREE.LineBasicMaterial({ color: "yellow" });
  const points = []; // 점들을 모아둘 배열
  points.push(new THREE.Vector3(0, 0, 100)); // 시작점(x, y, z)
  points.push(new THREE.Vector3(0, 0, -100)); // 끝점(x, y, z)
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const guide = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(guide); // add

  // 4. ray에 맞을 mesh 구현
  // box mesh
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshBasicMaterial({ color: "plum" });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  // torus mesh
  const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
  const torusMaterial = new THREE.MeshBasicMaterial({ color: "lime" });
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  scene.add(boxMesh, torusMesh); // add

  // ..
}
```

위 순서대로 광선과 이 광선을 맞을 mesh를 추가해주면 아래와 같이 노출된다.
![](../../img/230323-1.png)

이제 이 boxMesh와 torusMesh를 배열에 넣고 광선에 맞은 Mesh를 판별해본다.

### 특정 광선을 지나는 메쉬 체크하기

이제 광선을 맞는 것을 구현해본다.

`src/ex01.js`

```jsx
// ----- 주제: 특정 방향의 광선(Ray)에 맞은 Mesh 판별하기

export default function example() {
  // Renderer, Scene, Camera, Light, Controls...

  // Mesh
  const lineMaterial = new THREE.LineBasicMaterial({ color: "yellow" });
  const points = [];
  points.push(new THREE.Vector3(0, 0, 100));
  points.push(new THREE.Vector3(0, 0, -100));
  const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
  const guide = new THREE.Line(lineGeometry, lineMaterial);
  scene.add(guide);

  // ray에 맞을 mesh 추가
  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshBasicMaterial({ color: "plum" });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.name = "box"; // 식별을 위한 name property 추가

  const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
  const torusMaterial = new THREE.MeshBasicMaterial({ color: "lime" });
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  torusMesh.name = "torus"; // 식별을 위한 name property 추가

  scene.add(boxMesh, torusMesh);

  const meshes = [boxMesh, torusMesh];
  const raycaster = new THREE.Raycaster(); // 광선 생성

  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime(); // 시간
    boxMesh.position.y = Math.sin(time) * 2;
    torusMesh.position.y = Math.cos(time) * 2;
    boxMesh.material.color.set("plum");
    torusMesh.material.color.set("lime");

    const origin = new THREE.Vector3(0, 0, 100); // 광선의 시작점
    const direction = new THREE.Vector3(0, 0, -1); // 광선의 방향: 정규화된 방향 -1을 적용
    // const direction = new THREE.Vector3(0, 0, -100);
    direction.normalize(); // -100을 normalize처리, 1로 계산
    raycaster.set(origin, direction); // 광선 생성

    const intersects = raycaster.intersectObjects(meshes); // 광선과 교차하는 객체들을 반환
    intersects.forEach((intersect) => {
      console.log(intersect.object.name); // 광선과 교체하는 name 속성을 반환
      intersect.object.material.color.set("red"); // 광선과 교체하면 red 컬러로 변경
    });

    console.log(raycaster.intersectObjects(meshes)); // 배열 내 객체들의 광선과의 교차점을 반환

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  // ..
  draw();
}
```

위 `boxMesh`, `torusMesh`에 식별을 위한 `name` 속성을 추가해 준 뒤 Raycaster라는 광선을 생성하여 시작점과 방향을 정해준다. 이때 광선의 방향을 -100을 넣지 않고 -1을 넣는데 이는 정규화된 방향을 의미하므로 -100이 아닌 -1을 넣음. 이후 raycaster.intersectObjects 로 광선과 교차하는 객체를 반환하도록 구현해주면 아래와 같이 디버그 컨솔에 원하는 값들과 교차점을 확인할 수 있다.

![](../../img/230326-1.png)

위 코드로 나오는 결과물은 아래와 같음

![](../../img/230326-1.gif)
