﻿## Controls(카메라 컨트롤)

### OrbitControls

이번에는 카메라 컨트롤에 대해 알아본다. 기존에 OrbitControls를 써봤었음. 다시 살펴보자
기본 OrbitControls는 아래와 같이 구현할 수 있다.

`controls/src/ex01.js`

```jsx
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: OrbitControls

export default function example() {
  // Renderer, Scene, Camera, Light...

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Mesh, draw..
}
```

위와 같이 넣어주고 화면을 실행시키믄 마우스 움직임에 따라 박스를 이리저리 움직여볼 수 있다.

![](../../img/230222-1.gif)

여러개의 mesh를 추가해보자.

`src/ex01.js`

```jsx
export default function example() {
  // Renderer, Scene, Camera, Light...

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1); // geometry는 하나 기준으로
  let mesh;
  let material;
  for (let i = 0; i < 20; i++) {
    material = new THREE.MeshStandardMaterial({
      color: `rgb(
				${50 + Math.floor(Math.random() * 205)}, 
				${50 + Math.floor(Math.random() * 205)}, 
				${50 + Math.floor(Math.random() * 205)}
			)`,
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 4;
    mesh.position.y = (Math.random() - 0.5) * 4;
    mesh.position.z = (Math.random() - 0.5) * 4;
    scene.add(mesh);
  }

  // ..
}
```

위 코드는 아래와 같은 같은 사이즈의 mesh를 랜덤한 색과 위치에 배치한다.

![](../../img/230222-2.gif)

이제 카메라 옵션을 조금 수정해본다.

```jsx
export default function example() {
  // Renderer, Scene, Camera, Light...

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true; // 움직임을 부드럽게 만들어준다. 그냥 쓰면 안된다.

  // ..
  function draw() {
    const delta = clock.getDelta();

    controls.update(); // controls 매번 update해줘야 enableDamping 속성 활성화

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }
  // ..
}
```

위와 같이 enableDamping 속성을 활성화해준 뒤 draw 함수에서 update 해주면 움직임이 부드럽고, 비교적 자연스러워진 것을 확인할 수 있음. 각 컨트롤 속성마다 사용방법이 다르니 문서보면서 작업하면 됨

![](../../img/230222-3.gif)

```jsx
export default function example() {
  // Renderer, Scene, Camera, Light...

  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;

  controls.enableZoom = false; // 줌 안되게, 마우스로 회전만 가능

  controls.maxDistance = 10; // 10 이하로는 줌 아웃이 안된다. 최대 거리(maxDistance) 설정 가능
  controls.minDistance = 2; // 2 이상으로는 줌 인이 안된다. 최소 거리(minDistance) 설정 가능

  // controls.minPolarAngle = Math.PI / 4; // 45도까지만 마우스로 돌려볼 수 있도록 고정
  controls.minPolarAngle = THREE.MathUtils.degToRad(45); // Math.PI / 4와 같음
  controls.maxPolarAngle = THREE.MathUtils.degToRad(135);

  controls.target.set(2, 2, 2); // 회전 중심 타겟을 2,2,2로 옮김

  controls.autoRotate = true; // 자동 회전 옵션
  controls.autoRotateSpeed = 20; // 회전 속도 설정
  // ..
}
```

enableZoom은 줌 이용 여부를 설정하는 옵션, maxDistance, minDistance는 줌 인/아웃 시 최대/최소 거리를 설정하는 옵션이다. minPolarAngle, maxPolarAngle은 마우스 회전 시 최대/최소 각도를 설정하는 옵션이다. target은 회전 중심 타겟을 x, y, z 좌표 기준으로 옮기는 설정이며, autoRotate, autoRotateSpeed는 자동 회전 및 속도를 설정하는 옵션임

![autoRotate, autoRotateSpeed 적용](../../img/230222-4.gif)

이처럼 다양한 옵션이 있음. 문서를 보고 필요한 옵션을 적절히 활용하자!

### TrackballControls

이번에는 TrackballControls를 해본다. OrbitControls와 비슷한데 회전 방향이 세로도 가능하다는 점이다.

`src/ex02.js`

```jsx
import * as THREE from "three";
import { TrackballControls } from "three/examples/jsm/controls/TrackballControls";

// ----- 주제: TrackballControls

export default function example() {
  // Renderer, Scene, Camera, Light...

  // Controls
  // 기본적으로 enableDamping 효과는 적용되어 있다.
  const controls = new TrackballControls(camera, renderer.domElement);
  controls.maxDistance = 20; // 줌 아웃 최대
  controls.minDistance = 5; // 줌 인 최대
  controls.target.set(3, 3, 3); // draw에서 update를 해줘야 한다.

  function draw() {
    const delta = clock.getDelta();
    controls.update(); // update 꼭 해준다.

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  // ..
}
```

위와 같이 TrackballControls을 적용하면 위로도 360도 회전이 가능한 구조가 됨.

![](../../img/230223-1.gif)

주로 쓰이는 옵션도 같이 체크해주자

### FlyControls

FlyControls는 키보드 자판키에 따라 움직이는 카메라 옵션이다.

`src/ex03.js`

```jsx
import * as THREE from "three";
import { FlyControls } from "three/examples/jsm/controls/FlyControls";

// ----- 주제: FlyControls

export default function example() {
  // Renderer, Scene, Camera, Light...

  // Controls
  const controls = new FlyControls(camera, renderer.domElement);
  controls.rollSpeed = 0.5; // 카메라 이동 속도
  controls.movementSpeed = 3; // 키보드 입력 시 카메라 이동 속도
  controls.dragToLook = true; // 드래그로만 카메라가 이동

  // ..

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();
    controls.update(delta); // FlyControls는 update 시 delta 값을 넣어줘야 한다.

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  // ..
}
```

W(앞), A(왼쪽), S(뒤), D(오른쪽), R(위로), F(아래로), 마우스 왼쪽 앞으로, 오른쪽 클릭하면 뒤로 이동하는 이벤트가 기본적으로 적용된 메서드임. rollSpeed, movementSpeed, dragToLook 등의 옵션이 있으므로 적절한 것을 찾아서 구현한다.

### FirstPersonControls

FirstPersonControls 앞서 구현한 FlyControls 대체 구현 메서드이다. 즉 비슷함
기능을 추가하거나 살짝 바꾼 느낌임

`src/ex04.js`

```jsx
import * as THREE from "three";
import { FirstPersonControls } from "three/examples/jsm/controls/FirstPersonControls";

// ----- 주제: FirstPersonControls

export default function example() {
  // Renderer, Scene, Camera, Light...

  // Controls
  const controls = new FirstPersonControls(camera, renderer.domElement);
  controls.movementSpeed = 10; // 키보드 입력 시 카메라 이동 속도
  controls.activeLook = false; // 주변을 둘러볼 수 있는지 유무. false면 각도 변경이 불가. 움직일 수만 있다.
  controls.lookSpeed = 0.05; // 카메라 이동 속도
  controls.autoForward = true; // 자동 앞으로 이동

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();
    controls.update(delta); // FirstPersonControls도 update 시 delta 값을 넣어줘야 함

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  // ..
}
```

이 밖에도 다양한 속성이 있으니 문서로 확인

### PointerLockControls

PointerLockControls는 유저액션을 정의하는 메서드임. 그냥 메서드만 적용하면 아무 움직임이 없다.

`src/ex05.js`

```jsx
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";

// ----- 주제: PointerLockControls

export default function example() {
  // Renderer, Scene, Camera, Light...

  // Controls
  const controls = new PointerLockControls(camera, renderer.domElement);
  console.log(controls.domElement); // <canvas id="three-canvas" data-engine="three.js r149" width="2506" height="2608" style="width: 1253px; height: 1304px;"></canvas>
  console.log(controls.domElement === renderer.domElement); // true

  controls.domElement.addEventListener("click", () => {
    controls.lock(); // pointer lock api 활용함
  });

  controls.addEventListener("lock", () => {
    console.log("lock"); // pointer lock api 실행 시
  });
  controls.addEventListener("unlock", () => {
    console.log("unlock"); // pointer lock api 중단 시
  });

  // ..
}
```

PointerLockControls는 domElement에 유저 액션을 추가하여 사용하는데, 우선 controls.domElement는 canvas를 의미하며, 이는 renderer.domElement와 같은 아이를 바라보고 있음

여기에 클릭 이벤트를 넣어서 `controls.lock()` 메서드를 실행해주는데 이때 실행되는 것은 [pointer lock api](https://developer.mozilla.org/en-US/docs/Web/API/Pointer_Lock_API)로 자바스크립트에서 제공되는 메서드를 쉽게 구현할 수 있게된다.

![](../../img/230224-1.gif)

esc 키를 누르면 빠져나올 수 있으며, 진입 시 이벤트를 `lock`으로, 중단 시 이벤트를 `unlock`으로 체크해서 원하는 이벤트를 수행하도록 할 수 있다.

### DragControls

기존에 살펴봤던 메서드와 달리 DragControls은 사용법이 조금 다르다.
어떤 mesh에 DragControls를 적용할 것인지를 결정해야 함.

`src/ex06.js`

```jsx
import * as THREE from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls";

// ----- 주제: DragControls

export default function example() {
  // Renderer, Scene, Camera, Light...

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const meshes = [];
  let mesh;
  let material;
  for (let i = 0; i < 20; i++) {
    material = new THREE.MeshStandardMaterial({
      color: `rgb(${50 + Math.floor(Math.random() * 205)}, ${50 + Math.floor(Math.random() * 205)}, ${
        50 + Math.floor(Math.random() * 205)
      })`,
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 4;
    mesh.position.y = (Math.random() - 0.5) * 4;
    mesh.position.z = (Math.random() - 0.5) * 4;
    scene.add(mesh);
    meshes.push(mesh); // meshes라는 배열에 mesh들을 담는다.
  }

  // Controls - DragControls에 meshes 저장
  const controls = new DragControls(meshes, camera, renderer.domElement);

  // ..
}
```

위와 같이 meshes를 배열로 담아서 DragControls에 적용하면, 생성된 20개의 mesh 들에 드래그 속성이 생김

![](../../img/230226-1.gif)

자동적으로 잘 생김. 이걸 직접 구현해야한다면 무지 까다로울 것이다..
만약 웹사이트에서 구동되어야 할 때, 콘텐츠 하나하나가 담긴 박스가 될 수도 있는데, 현재 어떤 박스가 드래그가 되는지 알 필요가 있다. 이때 dragStart라는 이벤트 리스너를 통해 알 수 있다.

```jsx
import * as THREE from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls";

// ----- 주제: DragControls

export default function example() {
  // Renderer, Scene, Camera, Light...

  // Mesh
  const geometry = new THREE.BoxGeometry(1, 1, 1);
  const meshes = [];
  let mesh;
  let material;
  for (let i = 0; i < 20; i++) {
    material = new THREE.MeshStandardMaterial({
      color: `rgb(${50 + Math.floor(Math.random() * 205)}, ${50 + Math.floor(Math.random() * 205)}, ${
        50 + Math.floor(Math.random() * 205)
      })`,
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = (Math.random() - 0.5) * 4;
    mesh.position.y = (Math.random() - 0.5) * 4;
    mesh.position.z = (Math.random() - 0.5) * 4;
    mesh.name = `box-${i}`; // mesh에 name 추가
    scene.add(mesh);
    meshes.push(mesh);
  }

  const controls = new DragControls(meshes, camera, renderer.domElement);

  controls.addEventListener("dragstart", (e) => {
    console.log(e); //
    console.log(e.object.name);
  });

  // ..
}
```

mesh.name에 각 아이템별 이름을 부여한다고 했을 때, dragstart 이벤트로 e.object.name에 내용이 담기는 것을 확인할 수 있음. 이렇게 된다면 각 이벤트마다 적절한 이벤트를 다양하게 줄 수 있게 된다.

![](../../img/230226-1.png)

### 마인크래프트 스타일 컨트롤

좀 전에 배웟던 PointerLockControls에 이동기능을 추가해보자. 마인크래프트와 같은 움직임을 구현할 수 잇음
PointerLockControls의 moveForward, moveRight 메서드를 활용함.

가장 먼저 키 컨트롤을 담당할 클래스를 만드는 것부터 시작해보자.

`src/KeyController.js`

```jsx
export class KeyController {
  constructor() {
    // 생성자
    this.keys = [];

    window.addEventListener("keydown", (e) => {
      console.log(e.code + " 누름");
      this.keys[e.code] = true; // 키보드 누르면 true - 예를 들어 w키를 누르면 this.keys["KeyW"] = true;
    });

    window.addEventListener("keyup", (e) => {
      console.log(e.code + " 뗌");
      delete this.keys[e.code]; // 키보드 뗄 때 this.keys["KeyW"] 삭제
    });
  }
}
```

위와 같이 keydown, keyup 이벤트를 각각 만들어서 키를 누를 때 해당값을 keys에 저장 및 해지하는 코드임
이를 ex07.js 파일에서 아래와 같이 적용한다.

`src/ex07.js`

```jsx
import * as THREE from "three";
import { PointerLockControls } from "three/examples/jsm/controls/PointerLockControls";
import { KeyController } from "./KeyController";

// ----- 주제: 마인크래프트 스타일 컨트롤

export default function example() {
  // Renderer, Scene, Camera, Light...

  const controls = new PointerLockControls(camera, renderer.domElement);

  controls.domElement.addEventListener("click", () => {
    controls.lock(); // pointer lock api 활용함
  });
  controls.addEventListener("lock", () => {
    console.log("lock"); // pointer lock api 실행 시
  });
  controls.addEventListener("unlock", () => {
    console.log("unlock"); // pointer lock api 중단 시
  });

  // 키보드 컨트롤 인스턴스 생성!
  const keyController = new KeyController();

  // 실제 컨트롤 액션 추가
  function walk() {
    // 눌렀을 때 this.keys[e.code] = true; 이므로 moveForward 실행됨
    if (keyController.keys["KeyW"] || keyController.keys["ArrowUp"]) {
      controls.moveForward(0.02);
    }
    if (keyController.keys["KeyS"] || keyController.keys["ArrowDown"]) {
      controls.moveForward(-0.02);
    }
    if (keyController.keys["KeyA"] || keyController.keys["ArrowLeft"]) {
      controls.moveRight(-0.02);
    }
    if (keyController.keys["KeyD"] || keyController.keys["ArrowRight"]) {
      controls.moveRight(0.02);
    }
  }

  // ..

  // 그리기
  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    walk(); // walk는 계~속 실행되고 있다.

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  // ..
}
```

위와 같이 KeyController 인스턴스를 생성 후 walk 함수에 가둬서 액션을 부여하는데
기본 w, a, s, d 이벤트와 더불어 방향키 키보드에도 동일한 이벤트를 부여하면 키보드를 통한 애니메이션 구현이 가능해진다.

![](../../img/230227-1.gif)
