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

### 물리가 적용되는 객체 만들기

`connonWorld.gravity.set` 에 이어서 코드를 작성한다.

`src/ex01.js`

```jsx
export default function example() {
  // Renderer, Scene, Camera, Light ..

  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -10, 0);

  const floorShape = new CANNON.Plane(); // 바닥을 만들기 위한 모양
  const floorBody = new CANNON.Body({
    // 무게를 가지는 바닥 - 물리엔진이 적용된 실체(유리컴)
    mass: 0, // 무게 설정
    position: new CANNON.Vec3(0, 0, 0), // 바닥의 위치
    shape: floorShape // 바닥의 모양
  });
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5); // 바닥의 회전(축의 방향(x축으로 설정), 각도(90도))
  cannonWorld.addBody(floorBody); // 바닥을 월드에 추가

  const boxShape = new CANNON.Box(new CANNON.Vec3(0.25, 2.5, 0.25)); // 박스의 모양
  const boxBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 10, 0),
    shape: boxShape
  });
  cannonWorld.addBody(boxBody); // 박스를 월드에 추가

  // Mesh ..
}
```

아래 메쉬를 만들엇던 방법되로 물리엔진도 바닥과, 박스를 별도로 만들어야 함. floorShape, boxShape이라는 모양을 우선 만든 뒤 floorBody, boxBody에 연결해주고, 설정을 마친 설정들을 최종적으로 cannonWorld에 추가해주면 된다.

그런데 이대로는 전혀 변화가 없음. delta 함수에서 동작을 해줘야 함!

```jsx
export default function example() {
  // Renderer, Scene, Camera, Light, Cannon, Mesh ..

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120;

    cannonWorld.step(cannonStepTime, delta, 3); // 물리 엔진을 계산(시간, 델타, 반복 횟수)
    boxMesh.position.copy(boxBody.position); // 박스의 위치를 박스 메쉬에 적용
    boxMesh.quaternion.copy(boxBody.quaternion); // 박스의 회전을 박스 메쉬에 적용

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }
}
```

`cannonStepTime`의 경우 동작할 시간을 결정함 (시간, 델타, 반복 횟수) 보통 주사율이 60인 화면일 경우를 default value로 설정한 뒤, 120인 경우(고사양 해상도를 지원) 1/120으로 지원하도록 설정한다.

다음으로 해당 값을 `cannonWorld.step` 으로 연결 후 boxMesh에 boxBody를 position과 quaternion값에 연결해주면 y축이 10인 상태에서 발생한 추락을 처리하는 물리엔진을 확인할 수 있다.

(Mesh가 넘어지는 상황을 보고 싶어서 box를 긴 형태로 만들었음)

![](../../img/230423-1.gif)
