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

### 재질에 따른 마찰력과 반발력

cannon.js에서도 재질을 설정할 수 있다. 이를 Contact Material라고 함
재질은 왜 필요할까? 어떤 물체에 힘이 가해졌을 때 재질에 따라서 마찰력이나 반발력 등이 모두 다르기 때문임

더 리얼한 효과를 나타내기 위해서는 상세한 재질을 설정하는 것이 도움이 될 수 있음
이번에는 위의 박스 형태가 아닌 공을 통통 튀게 만들어보겠다.

`src/ex02.js`

```jsx
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";

// ----- 주제: Contact Material

export default function example() {
  // Renderer, Scene, Camera, Light ..

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Cannon
  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -10, 0); // 중력 세팅

  const floorShape = new CANNON.Plane(); // 바닥용 모양
  const floorBody = new CANNON.Body({
    // 무게를 가지는 바닥 - 물리엔진이 적용된 실체
    mass: 0, // 무게 설정
    position: new CANNON.Vec3(0, 0, 0), // 바닥의 위치
    shape: floorShape // 바닥의 모양
  });
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5); // 바닥의 회전
  cannonWorld.addBody(floorBody); // 바닥 월드 추가

  const sphereShape = new CANNON.Sphere(0.5); // 구의 반지름을 넣음
  const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 10, 0),
    shape: sphereShape
  });
  cannonWorld.addBody(sphereBody); // 박스를 월드에 추가

  // Mesh
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: "slategray" })
  );
  floorMesh.rotation.x = -Math.PI * 0.5;
  scene.add(floorMesh);

  const sphereGeometry = new THREE.SphereGeometry(0.5); // 반지름 입력
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: "seagreen" });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.y = 0.5;
  scene.add(sphereMesh);

  // 그리기
  const clock = new THREE.Clock();
  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120;

    cannonWorld.step(cannonStepTime, delta, 3); // 물리 엔진을 계산(시간, 델타, 반복 횟수)
    sphereMesh.position.copy(sphereBody.position); // 구의 위치를 구 메쉬에 적용
    sphereMesh.quaternion.copy(sphereBody.quaternion); // 구의 회전을 구 메쉬에 적용

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  //..
}
```

일단 기본적인 구 형태로 코드 작성..

![](../../img/230425-1.gif)

그런데 자세히 보니 구가 살짝 떠있는 느낌이다. 그림자가 없어서 그런 듯.. 그림자를 넣어준다.

```jsx
export default function example() {
  // Renderer ...
  renderer.shadowMap.enabled = true; // shadowMap 추가
  renderer.shadowMap.type = THREE.PCFSoftShadowMap; // shadowMap 추가

  // Light..
  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  directionalLight.castShadow = true; // castShadow 추가
  scene.add(directionalLight);

  // Scene, Camera, Controls, Cannon, Mesh ..
  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({ color: "slategray" })
  );
  floorMesh.rotation.x = -Math.PI * 0.5;
  floorMesh.receiveShadow = true; // receiveShadow 추가
  scene.add(floorMesh);

  const sphereGeometry = new THREE.SphereGeometry(0.5);
  const sphereMaterial = new THREE.MeshStandardMaterial({ color: "seagreen" });
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.y = 0.5;
  sphereMesh.castShadow = true; //caseShadow 추가
  scene.add(sphereMesh);

  //..
}
```

위와 같이 renderer, directionalLight, floorMesh, sphereMesh 등에 그림자 속성을 추가함

![](../../img/230425-2.gif)

그림자가 짜잔 만들어졌다. 자세히 보면 떨어질 때 충격에 의해 살짝 튀기는데.. 이제 이걸 앞서 얘기한 contactMaterial을 사용해서 변경해본다.

```jsx
export default function example() {
  // Renderer, Light, Scene, Camera, Controls,

  // Cannon
  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -10, 0);

  // Contact Material
  const defaultMaterial = new CANNON.Material("default");
  const rubberMaterial = new CANNON.Material("rubber");
  const ironMaterial = new CANNON.Material("iron");
  const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.5, // 마찰력,
    restitution: 0.5 // 반발력
  }); // 부딪힐 재질을 두 개 넣음 + 상세 설정 추가
  cannonWorld.defaultContactMaterial = defaultContactMaterial; // 재질 설정 적용

  // floorShape, floorBody ..
  // ..
}
```

위와 같이 재질을 설정해서 넣는다. `CANNON.ContactMaterial`에는 각각 부딪힐 재질을 2개 설정하고, 이에 대한 상세 옵션을 세 번째 전달인자에 설정하면 됨

![](../../img/230425-3.gif)

이건 재질에 따라 액션이 다 달라진다. 만약 바닥은 defaultMaterial, 공은 고무공(rubberMatrial)이라면?

```jsx
export default function example() {
  // ..
  cannonWorld.defaultContactMaterial = defaultContactMaterial;

  // 추가
  const rubberDefaultContactMaterial = new CANNON.ContactMaterial(
    rubberMaterial, // 튀기는 공은 rubberMaterial
    defaultMaterial, // 바닥은 defaultMaterial
    {
      friction: 0.5,
      restitution: 0.7
    }
  );
  cannonWorld.addContactMaterial(rubberDefaultContactMaterial); // rubber 재질 추가

  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, 0, 0),
    shape: floorShape,
    material: defaultMaterial // 바닥 재질 설정
  });
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5); // 바닥의 회전(축의 방향(x축으로 설정), 각도(90도))
  cannonWorld.addBody(floorBody);

  const sphereShape = new CANNON.Sphere(0.5);
  const sphereBody = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 10, 0),
    shape: sphereShape,
    material: rubberMaterial // 공 재질 설정
  });
  cannonWorld.addBody(sphereBody);

  // ..
}
```

위와 같이 `rubberDefaultContactMaterial`이라는 ContactMaterial 생성 후 이를 addContactMaterial에 추가, floorBody, sphereBody에 material로 각 재질 반영해주면 진짜 고무공이 튀는 효과를 주게된다.

![](../../img/230425-4.gif)

위와 같은 방식으로 ironMaterial을 설정하면 철 재질의 사물이 default floor에 부딪히는 효과를 줄 수 있게됨
필요에 따라 적절한 material을 설정하여 사용하도록 하자!

### 힘(Force)

힘은 물체의 위치에 영향을 주는 외부적 힘을 의미한다. 우선 기존 코드를 좀 다듬는다.
기존 테스트하던 rubberMaterial, ironMaterial 삭제 후 defaultMaterial 로 적용

이제 아무데나 클릭을 하면 바람이 불도록 해본다.

`src/ex03.js`

```jsx
export default function example() {
  // ..

  // Contact Material
  const defaultMaterial = new CANNON.Material("default");
  const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.5, // 마찰력,
    restitution: 0.3 // 반발력
  }); // 부딪힐 재질을 두 개 넣음 + 상세 설정 추가
  cannonWorld.defaultContactMaterial = defaultContactMaterial;

  // ..

  // 이벤트
  window.addEventListener("click", () => {
    sphereBody.applyForce(new CANNON.Vec3(-100, 0, 0), sphereBody.position);
  });
}
```

![](../../img/230427-1.gif)

원을 클릭하면 힘의 방향 왼쪽으로 흘러가버림! 근데 끝도 없이 흘러가버린다.
여기에 laycaster 에서 배웠던 드래그 시 이벤트가 발생하던 현상을 여기서도 동일하게 제거해본다.

```jsx
// ..
import { PreventDragClick } from "./PreventDragClick";

export default function example() {
  // ..

  // 이벤트
  window.addEventListener("click", () => {
    if (preventDragClick.mouseMoved) return;
    sphereBody.applyForce(new CANNON.Vec3(-100, 0, 0), sphereBody.position);
  });

  const preventDragClick = new PreventDragClick(canvas);
}
```

위와 같이 해주면 드래그 시 이벤트 발생 노

또, 여러번 클릭 시 speed에 가속도가 붙는데, 이도 수정해준다.

```jsx
export default function example() {
  // ..

  // 이벤트
  window.addEventListener("click", () => {
    if (preventDragClick.mouseMoved) return;

    // Speed 초기화
    sphereBody.velocity.x = 0;
    sphereBody.velocity.y = 0;
    sphereBody.velocity.z = 0;
    sphereBody.angularVelocity.x = 0;
    sphereBody.angularVelocity.y = 0;
    sphereBody.angularVelocity.z = 0;

    sphereBody.applyForce(new CANNON.Vec3(-100, 0, 0), sphereBody.position);
  });

  const preventDragClick = new PreventDragClick(canvas);
}
```

다음으로는 멈추게는 어떻게하면 될까? draw 함수에서 위 velocity를 점차 0으로 변경시켜 주면됨

```jsx
export default function example() {
  // ..

  function draw() {
    // ..

    // 속도 감소
    sphereBody.velocity.x *= 0.98;
    sphereBody.velocity.y *= 0.98;
    sphereBody.velocity.z *= 0.98;
    sphereBody.angularVelocity.x *= 0.98;
    sphereBody.angularVelocity.y *= 0.98;
    sphereBody.angularVelocity.z *= 0.98;

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  draw();

  // ..
}
```

0.98 곱해준다면 점차 값은 0에 수렴할 것이므로 자연스러운 정지가 완성됨

![](../../img/230427-2.gif)

이런 이벤트는 바람이 분다거나 와력에 의한 부드러운 움직임을 표현할 때 많이 사용함!

### 랜덤 위치에 공 생성하기

뷰를 이루는 구성과 효과가 많아지면서 그만큼 부하가 늘어난다. 그래서 가능하다면 성능을 좋게 만들 수 있는 방법들을 적용하면서 작업하는게 좋다. 예시를 위해 클릭 할 때마다 공이 생기는 ui를 구현해본다.

기존의 sphereMesh 구현 코드와 그와 관련된 draw 함수 내 코드 그리고 클릭 시 이벤트 코드를 모두 삭제해준다. 또한, 구를 생성하는 로직은 별도의 클래스 문법으로 작성한 뒤 import 하는 방식을 사용한다.

`src/ex04.js`

```jsx
// ..
import { MySphere } from "./MySphere";

// ----- 주제: Performance(성능 좋게 하기)

export default function example() {
  // Renderer, Scene, Camera, Light, Controls ..
  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -10, 0);

  // Contact Material
  // CANNON defaultMaterial, floorShape, sphereShape...

  // Mesh
  // floorMesh, sphereGeometry, sphereMaterial, sphereMesh...

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    let cannonStepTime = 1 / 60;
    if (delta < 0.01) cannonStepTime = 1 / 120;
    cannonWorld.step(cannonStepTime, delta, 3);

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  window.addEventListener("click", () => {
    // 여기서부터 시작..
    new MySphere({
      scene,
      geometry: sphereGeometry,
      material: sphereMaterial,
      x: (Math.random() - 0.5) * 2,
      y: Math.random() * 5 + 2,
      z: (Math.random() - 0.5) * 2,
      scale: Math.random() + 0.2
    });
  });

  // ..
}
```

기본 포맷은 위와 같고, click 이벤트부터 MySphere 클래스의 인스턴스가 생성되도록 작업을 시작해주자

`src/MySphere.js`

```jsx
import { Mesh } from "three";

export class MySphere {
  constructor(info) {
    this.scene = info.scene;
    this.geometry = info.geometry;
    this.material = info.material;
    this.x = info.x;
    this.y = info.y;
    this.z = info.z;
    this.scale = info.scale;

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.scale.set(this.scale, this.scale, this.scale);
    this.mesh.castShadow = true;
    // position 설정은 cannon body에서 설정하면 mesh가 따라가므로 무의미함
    // 그러나 클릭 시 mesh가 제대로 생성되는지 확인을 위해 일단 넣음
    this.mesh.position.set(this.x, this.y, this.z);
    this.scene.add(this.mesh);
  }
}
```

위와 같이 코드를 작성하면, 아래처럼 원하는대로 구가 클릭했을 때마다 하나씩 생성된다.

![](../../img/230428-1.gif)
