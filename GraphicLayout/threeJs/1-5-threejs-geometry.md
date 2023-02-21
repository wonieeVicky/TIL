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

### Geometry 형태 조작하기 1

지난 시간에 알아본 segment를 통해 만들어진 정점(vertex)를 이용해 다양하게 Geometry 형태를 조작해본다.
이번에는 [SphereGeometry](https://threejs.org/docs/index.html?q=SphereGeometry#api/en/geometries/SphereGeometry)를 이용해서 만들어본다.

`src/ex02.js`

```jsx
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: Geometry 정점(Vertex) position 이용하기

export default function example() {
  // ..
  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Mesh
  const geometry = new THREE.SphereGeometry(5, 64, 64); // 원모양 구 생성
  const material = new THREE.MeshStandardMaterial({
    color: "orangered",
    side: THREE.DoubleSide,
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  console.log(geometry.attributes.position.array);

  // ..
}
```

우선 64개의 segment를 가진 원형 구를 만들었다.

![](../../img/230218-1.png)

위 geometry를 console로 찍어보면 attribute 내용이 나오는데 그 안에 position 속성을 이용해서 애니메이션을 주려고 한다. position의 값은 Float32Array로 담겨있음. 위 값이 이미지에서 `geometry.attributes.position.array` 값을 콘솔로 찍으면 아래와 같음

![](../../img/230218-2.png)

총 12,675개의 배열 값으로 존재. 위 값은 3개 묶음이 [x, y, z] 라는 점 하나의 값을 이룬다.

이제 배열을 이용해 각 점의 좌표를 변경하여 모양을 변경해본다.

`src/ex02.js`

```jsx
export default function example() {
  // ..
  const controls = new OrbitControls(camera, renderer.domElement);

  // Mesh
  const geometry = new THREE.SphereGeometry(5, 64, 64); // 원모양 구 생성
  const material = new THREE.MeshStandardMaterial({
    color: "orangered",
    side: THREE.DoubleSide,
    flatShading: true,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  // console.log(geometry.attributes.position.array);
  const positionArray = geometry.attributes.position.array;

  // loop 한번 돌 때마다 정점(vertex) 한 개의 x, y, z 좌표를 랜덤 조정
  for (let i = 0; i < positionArray.length; i += 3) {
    // 값들이 [ x, y, z, x, y, z, ... ]이므로 3의 배수로 처리 후 i, i+1, i+2로 값 변경
    // 음, 양이 조화롭도록 0.5를 빼준다. 0이면 -0.5, 1이면 0.5
    positionArray[i] = positionArray[i] + (Math.random() - 0.5) * 0.2; // x축
    positionArray[i + 1] = positionArray[i + 1] + (Math.random() - 0.5) * 0.2; // y축
    positionArray[i + 2] = positionArray[i + 2] + (Math.random() - 0.5) * 0.2; // z축
  }
  // ..
}
```

위 코드에서 `Math.random()`만 넣어주면 구의 변형이 우측으로만 쏠리게 된다.
Math.random은 0~1 사이의 값이므로.. x축이 무조건 양수로 커짐. 이를 방지하기 위해 0.5를 빼준다.
그러면 값의 변화가 양 쪽으로 평균을 이루게 됨. `0.2`를 곱한 것은 변화의 폭을 조정하기 위함.

![](../../img/230219-1.png)

애니메이션은 draw 함수 안에서 갱신해준다. 이 때 값 변경을 기존 코드 그대로 구현하면 안됨
값이 계속 변경되어야 하므로.. 삼각 함수(sine graph)를 이용한다. (cosine으로 사용해도 됨)
삼각 함수는 y 값에 따라 지속적으로 값이 같은 폭으로 변경됨..

![](https://s3-us-west-2.amazonaws.com/secure.notion-static.com/4d753c59-cef3-4e96-b968-e72ba1e8b814/Untitled.png)

`src/ex02.js`

```jsx
export default function example() {
  // ..
  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime() * 3;

    for (let i = 0; i < positionArray.length; i += 3) {
      positionArray[i] += Math.sin(time) * 0.002; // 삼각함수(Math.sin)를 이용
    }
    geometry.attributes.position.needsUpdate = true; // update를 해줘야 geometry 변경이 있다.

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  draw();
}
```

위와 같이 x 축에 삼각함수를 이용해서 값을 변경해주면, 미세하게 값이 좌우로 움직이는 구를 확인할 수 있다.

![](../../img/230219-1.gif)

이는 즉, 미리 세팅된 값이 있어야 한다는 의미임. 이는 초기 변환을 주는 positionArray 세팅 시 함께 해준다.

그런데 내가 원하는 것은 좌우의 움직임이 아닌 구를 이루는 점(vertex)에 대한 변화이다.
x에 대한 랜덤값을 어떻게 적용하는게 좋을까? 우선 math.random 값이 매번 draw 함수에서 갱신되는 것은 옳지 않다. 각각의 점들에 적용되는 값은 고정된 상태에서 일괄적으로 움직이는 것이 좋을 것 같다.

```jsx
export default function example() {
  // ..

  const positionArray = geometry.attributes.position.array;
  const randomArray = []; // randomArray 생성
  for (let i = 0; i < positionArray.length; i += 3) {
    positionArray[i] += (Math.random() - 0.5) * 0.2;
    positionArray[i + 1] += (Math.random() - 0.5) * 0.2;
    positionArray[i + 2] += (Math.random() - 0.5) * 0.2;

    randomArray[i] = (Math.random() - 0.5) * 0.2; // x축에 랜덤값 저장
    randomArray[i + 1] = (Math.random() - 0.5) * 0.2; // y축에 랜덤값 저장
    randomArray[i + 2] = (Math.random() - 0.5) * 0.2; // z축에 랜덤값 저장
  }

  // console.log(positionArray.length, randomArray.length); // 12675, 12675

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime() * 3;

    for (let i = 0; i < positionArray.length; i += 3) {
      // 삼각함수 적용 시 time값에 randomArray에 담은 랜덤 값을 넣어준다.
      positionArray[i] += Math.sin(time + randomArray[i] * 100) * 0.0015;
      positionArray[i + 1] += Math.sin(time + randomArray[i + 1] * 100) * 0.0015;
      positionArray[i + 2] += Math.sin(time + randomArray[i + 2] * 100) * 0.0015;
    }
    geometry.attributes.position.needsUpdate = true;

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  // ..
}
```

![눈이 아파서 seagreen으로 색상 변경함 ㅎ..](../../img/230220-1.gif)

위와 같이 randomArray에 넣은 랜덤 값을 time 적용 시 넣어주면 위와 같은 애니메이션이 구현된다.
증감 폭은 기호에 맞게 곱해주는 값을 조절해준다.
