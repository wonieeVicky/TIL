## Geometry(모양)

Geometry에 대해 더 자세히 살펴본다. 점, 선, 면으로 이루어진 모양을 의미함

### 여러가지 Geometry 살펴보기

여태 큐브(박스) 형태의 박스만 작업해봤는데, 다양한 모양으로 구현할 수 있다.
다 살펴볼 필요는 없고, 기본적으로 어떤 것들을 쓰는지 위주로 알아본다.

먼저 모양을 여러 각도에서 확인하기 위해 카메라 컨트롤을 코드에 추가해본다.

`geometry/src/ex01.js`

```jsx
import * as THREE from "three";
// 별도 import 필요
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: Geometry 기본

export default function example() {
  // ..
  // Controls - 카메라 컨트롤 추가
  const controls = new OrbitControls(camera, renderer.domElement);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({ color: "hotpink" });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

위와 같이 OrbitControls 를 Import해서 적용해주면 마우스 휠에 반응하며 여러각도에서 모형을 확인할 수 있게된다. like this..

![](../../img/230217-1.gif)

내부 구조를 자세히 보고싶다면 MeshStandardMaterial 속성에 wireframe 옵션을 활성화해준다.

```jsx
export default function example() {
  // ..
  const controls = new OrbitControls(camera, renderer.domElement);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  // wireframe 속성 추가
  const material = new THREE.MeshStandardMaterial({ color: "hotpink", wireframe: true });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

![](../../img/230217-2.gif)

위 프레임을 바탕으로 스타일을 줄수도 있겠다. 활용할 수 있음. 우선 wireframe 속성을 꺼준다.

마우스를 계속 확대해서 박스 안으로 카메라가 들어오면 아무것도 보이지 않는 검정색 배경만 보인다. 기본적으로 three.js는 앞면만 보이고, 뒷면이 보이지 않도록 설정되어 있기 때문
때문에, 안을 보려면 설정을 조금 바꿔줘야 한다. 이것도 MeshStandardMaterial 설정으로 할 수 있다.

```jsx
export default function example() {
  // ..
  const controls = new OrbitControls(camera, renderer.domElement);

  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const material = new THREE.MeshStandardMaterial({
    color: "hotpink",
    side: THREE.DoubleSide, // side 속성 추가
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
ㅇ;
```

![](../../img/230217-3.gif)

이외에도 여러 속성이 있다.
아래처럼 geometry에 segment를 x, y, z 16씩 추가해주면 아래처럼 16개 segment를 가진 큐브가 생성된다.

```jsx
export default function example() {
  // ..
  const controls = new OrbitControls(camera, renderer.domElement);

  const geometry = new THREE.BoxGeometry(1, 1, 1, 16, 16, 16); // segment 추가
  const material = new THREE.MeshStandardMaterial({ color: "hotpink", wireframe: true });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // ..
}
```

![](../../img/230217-1.png)

segment는 wireframe 속성을 off 하면 보이지 않음. 그런데 이걸 왜 쓸까? segment를 만든다는 것은 점들을 다양하게 추가한다는 것이다. 이러한 점의 좌표를 바꾸면 멋있는 것들을 많이 만들 수 있다.

[문서](https://threejs.org/docs/index.html?q=geometry#api/en/geometries/BoxGeometry)를 보고 확인해보자. CircleGeometry(원 모양), ConeGeometry (콘 모양), CylinderGeometry(원기둥 모양) 등 다양한 기본 모양들이 존재한다. 모두 다 익히려고 하지 말고 이런게 있구나 확인 위주로 이해하자
