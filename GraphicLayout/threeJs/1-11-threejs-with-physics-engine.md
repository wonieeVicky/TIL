## 물리엔진 만들기

### 개요

이번 시간에는 three.js에서 물리엔진을 사용해본다.
시작부터 물리엔진은 어렵다. 따라서 잘만들어둔 라이브러리를 사용함.
이번 시간에는 가장 사용이 쉬운 cannon.js로 만들어본다.

Mesh(three.js) + Body(cannon.js)의 조합으로 물리엔진을 구현한다.
Body는 눈에 보이지 않은 상태로 적용되어 구현된다. Mesh 자체는 중력이나 떨어지는 등의 액션을 구현할 수 없다.
이런 것들은 cannon.js가 구현해 줌. 이걸 구현하기 위해서는 Body의 위치를 Mesh가 따라가도록 해줘야 한다.
한 쌍이 되어 움직인다고 보면 됨

### 물리엔진 월드 생성

cannon.js 문서는 [여기](http://schteppe.github.io/cannon.js/docs/)를 참조. 일단 설치를 해준다.

```bash
> npm i cannon-es
```

그러면 아래와 같이 접근할 수 있음

`physics/src/ex01.js`

```jsx
import * as CANNON from "cannon-es";
```

먼저 중력을 적용해주기 위해 Controls에 아래와 같은 코드를 추가해본다.

```jsx
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";

// ----- 주제: cannon.js 기본 세팅

export default function example() {
  // Renderer, Scene, Camera, Light ..

  // Controls
  const constols = new OrbitControls(camera, renderer.domElement);

  const connonWorld = new CANNON.World();
  connonWorld.gravity.set(0, -10, 0); // 중력을 세팅(x, y, z축 설정) - 아직 아무런 변화가 없다.

  // Mesh, etc...
}
```

위와 같이 중력을 `grayity.set`으로 구현함. 물론 화면상 변화는 없다. 중력이 세팅되었을 뿐 아무런 이벤트가 없기 때문. 다음으로는 중력에 의해 부딪힐 바닥을 만들어보겠다.

먼저 바닥으로 사용할 Mesh를 아래에 추가해준다.

```jsx
export default function example() {
  // Renderer, Scene, Camera, Light ..

  // ..
  connonWorld.gravity.set(0, -10, 0);

  // Mesh
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: "slategray" })
  );

  scene.add(floorMesh);

  // ..
}
```

![](../../img/230421-1.png)

그럼 요래 노출.. 바닥이니까 아래로 가게 조정해준다.

```jsx
export default function example() {
  // Renderer, Scene, Camera, Light ..
  // ..
  connonWorld.gravity.set(0, -10, 0);

  // Mesh
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: "slategray" })
  );

  floorMesh.rotation.x = -Math.PI * 0.5; // 앞면이 위로 향하기 위해 음수 처리
  scene.add(floorMesh);

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: "seagreen" });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);

  boxMesh.position.y = 0.5; // boxMesh 위치를 0.5만큼 올려주면 모두 보임
  scene.add(boxMesh);

  // ..
}
```

위와 같이 floorMesh와 boxMesh 모두 값을 수정해주면 아래와 같이 노출됨

![](../../img/230421-2.png)

이제 cannon 바닥도 설정해줘야한다.
